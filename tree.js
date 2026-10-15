/**
 * Family tree renderer + expand/collapse.
 * Reads window.FAMILY_DATA from family-data.js (classic script, works via file://).
 */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  // Default expansion: only the direct line from the root down to data.focusId (陳清水) is open;
  // siblings on that line show but stay collapsed. Inside the focus person's own subtree,
  // branches open while their generation is < FOCUS_EXPAND_GEN (same as v4 before: 第18世, so 清水 himself stays collapsed).
  var FOCUS_EXPAND_GEN = 21; // 清水 (第20世) open one level: his children show, theirs stay collapsed
  var FOCUS_PATH = {}, FOCUS_SUB = {};
  // "depth" below is the actual 世 number: root = data.rootGeneration (8), 公孔月 = 14.
  var scale = 1;
  var uid = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val == null || val === false) return;
        if (key === "className") node.className = val;
        else if (key === "text") node.textContent = val;
        else if (key === "html") node.innerHTML = val;
        else if (key.indexOf("on") === 0 && typeof val === "function") {
          node.addEventListener(key.slice(2).toLowerCase(), val);
        } else {
          node.setAttribute(key, val === true ? "" : String(val));
        }
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function getInitials(name) {
    if (!name) return "?";
    var cjk = name.match(/[\u3400-\u9fff]/g);
    if (cjk && cjk.length) {
      // Prefer given name (last 1–2 CJK chars) so siblings don't share a surname glyph
      if (cjk.length >= 3) return cjk.slice(-2).join("");
      return cjk.join("");
    }
    var parts = name
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .split(/[\s-]+/)
      .filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    return parts.filter(Boolean).join(" • ");
  }

  function personClass(person) {
    var cls = ["person", person.role === "spouse" ? "spouse" : "bloodline"];
    if (person.gender === "female") cls.push("female");
    else cls.push("male");
    return cls.join(" ");
  }

  function dashedRing() {
    // Drawn over the avatar's (transparent) 3px border, so the white padding
    // gap between ring and photo matches the solid-border avatars.
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "avatar-ring");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("aria-hidden", "true");
    var c = document.createElementNS(SVG_NS, "circle");
    c.setAttribute("cx", "50");
    c.setAttribute("cy", "50");
    c.setAttribute("r", "48.44");
    c.setAttribute("fill", "none");
    c.setAttribute("stroke", "currentColor");
    c.setAttribute("stroke-width", "3.125"); // 2.5px at 80px avatar
    c.setAttribute("stroke-linecap", "round");
    c.setAttribute("stroke-dasharray", "8 10");
    svg.appendChild(c);
    return svg;
  }

  // Theme C uses pre-engraved banknote-style avatars (avatars/engraved/, made by make_engraved.py).
  // Spouses (either gender) use the flat gray-tint set in avatars/engraved/gray/.
  function avatarDir(person) {
    if (!document.body.classList.contains("theme-c")) return "avatars/";
    return person && person.role === "spouse" ? "avatars/engraved/gray/" : "avatars/engraved/";
  }

  function genericAvatar(person) {
    return avatarDir(person) + (person.gender === "female" ? "default-female.jpg" : "default-male.jpg");
  }

  function parseYMD(v) {
    var m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/.exec(String(v || ""));
    return m ? { y: +m[1], m: +(m[2] || 1), d: +(m[3] || 1) } : null;
  }

  // Age today (from birthDate). deathDate is stored data only and is deliberately
  // NOT used anywhere in rendering (no dates, ranges, ages at death, or age-at-death avatars).
  function ageOf(person) {
    var b = parseYMD(person.birthDate);
    if (!b) return null;
    var t = new Date(), e = { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
    var age = e.y - b.y;
    if (e.m < b.m || (e.m === b.m && e.d < b.d)) age--;
    return age < 0 ? null : age;
  }

  function ageGroup(age) {
    if (age === null) return null;
    if (age < 1) return "baby";
    if (age < 5) return "1-5";
    if (age < 10) return "5-10";
    if (age >= 90) return "90-100";
    var lo = Math.floor(age / 10) * 10;
    return lo + "-" + (lo + 10);
  }

  // First 6 generations (第14世–第19世, root = level 1), spouses included:
  // anyone without a birthDate gets the oldest (90-100) avatar.
  var ROOT_GEN = 14; // set from data.rootGeneration at render time
  var ELDER_GEN = 20; // 第19世 and earlier
  var QINGSHUI_LEVEL_DEPTH = 20; // 第20世
  var QINGSHUI_BUCKET = "90-100";

  // Derived at runtime from the data: { depth: bucket } for levels 8–10 (depths 7–9).
  var QINGSHUI_ID = "qingshui", AGED_DEPTHS = [21, 22, 23]; // 第21–23世
  var LINE_BUCKETS = {}, QINGSHUI_LINE = {};
  var BUCKET_ORDER = ["baby", "1-5", "5-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"];

  function computeLineBuckets(people, rootId) {
    var qsDepth = null;
    (function find(id, d) {
      var p = people[id]; if (!p || qsDepth !== null) return;
      if (id === QINGSHUI_ID) { qsDepth = d; return; }
      (p.childrenIds || []).forEach(function (c) { find(c, d + 1); });
    })(rootId, ROOT_GEN);
    if (qsDepth === null) return;
    var byDepth = {};
    (function walk(id, d) {
      var p = people[id]; if (!p) return;
      [p, p.spouseId && people[p.spouseId]].forEach(function (x) {
        if (!x) return;
        QINGSHUI_LINE[x.id] = true;
        var g = ageGroup(ageOf(x));
        if (g) (byDepth[d] = byDepth[d] || []).push(BUCKET_ORDER.indexOf(g));
      });
      (p.childrenIds || []).forEach(function (c) { walk(c, d + 1); });
    })(QINGSHUI_ID, qsDepth);
    AGED_DEPTHS.forEach(function (d) {
      var a = (byDepth[d] || []).filter(function (i) { return i >= 0; }).sort(function (x, y) { return x - y; });
      if (a.length) LINE_BUCKETS[d] = BUCKET_ORDER[a[Math.floor((a.length - 1) / 2)]];
    });
  }

  function defaultAvatar(person, depth) {
    var g = ageGroup(ageOf(person)) || person.avatarAge || null;
    if (!g && !person.birthDate && depth != null && depth < ELDER_GEN) g = "90-100";
    // 第20世 (level 7, 陳清水's generation): undated people get 清水's own bucket (b. 1926 → "90-100").
    if (!g && !person.birthDate && depth === QINGSHUI_LEVEL_DEPTH) g = QINGSHUI_BUCKET;
    // 第21–23世 outside 清水's line: undated people borrow the median bucket of 清水's line at that level.
    if (!g && !person.birthDate && depth != null && LINE_BUCKETS[depth] && !QINGSHUI_LINE[person.id]) g = LINE_BUCKETS[depth];
    if (!g) return genericAvatar(person);
    return avatarDir(person) + (person.gender === "female" ? "female" : "male") + "-" + g + ".jpg";
  }

  // Full-width brackets carry ~0.6em of blank on the outer side and the name fonts have no
  // 'halt'/'chws' (LXGW subset has no GPOS), so wrap them in spans that pull the blank in (styles.css).
  function bracketText(node, text) {
    String(text).split(/([（）])/).forEach(function (part) {
      if (!part) return;
      if (part === "（" || part === "）") node.appendChild(el("span", { className: part === "（" ? "br-open" : "br-close", text: part }));
      else node.appendChild(document.createTextNode(part));
    });
    return node;
  }

  function displayName(person) {
    return [person.name, person.englishName].filter(Boolean).join(" ");
  }

  function renderPerson(person, depth) {
    // .avatar = outline stroke + white padding gap; .avatar-photo = photo/initials
    var avatar = el("div", { className: "avatar", "aria-hidden": "true" });
    var photo = el("div", { className: "avatar-photo" });
    var initialsSource = person.name || person.englishName;
    if (person.photoUrl) {
      var img = el("img", { src: person.photoUrl, alt: "" });
      img.addEventListener("error", function () {
        img.src = defaultAvatar(person, depth);
        scheduleLines();
      });
      img.addEventListener("load", scheduleLines);
      photo.appendChild(img);
    } else {
      photo.appendChild((function () {
        var img = el("img", { src: defaultAvatar(person, depth), alt: "", className: "default-avatar" });
        img.onerror = function () { img.onerror = null; img.src = genericAvatar(person); };
        return img;
      })());
    }
    avatar.appendChild(photo);
    if (person.role === "spouse") {
      avatar.appendChild(dashedRing());
    }

    // Exactly 3 lines: name, English name (optional), birthday. No death date.
    var birth = formatDate(person.birthDate);
    var label = el("div", { className: "person-label" }, [
      // surnameOnly: husband known by surname only → "湯（名未詳）" (same pattern as 窓擔（抱）)
      bracketText(el("p", { className: "person-name" + (person.surnameOnly ? " surname-only" : "") }), (person.name || person.englishName || "") + (person.surnameOnly ? "（名未詳）" : "")),
      person.englishName && person.name
        ? bracketText(el("p", { className: "person-english" }), person.englishName)
        : null,
      birth ? el("p", { className: "person-dates", text: birth }) : null,
    ]);

    return el(
      "article",
      {
        className: personClass(person),
        "data-id": person.id,
        "aria-label": displayName(person) + (birth ? ", born " + birth : ""),
      },
      [avatar, label]
    );
  }

  function coupleOrder(person, spouse) {
    if (!spouse) return [person];
    if (person.gender === "male" && spouse.gender !== "male") return [person, spouse];
    if (spouse.gender === "male" && person.gender !== "male") return [spouse, person];
    return [person, spouse];
  }

  function getChildren(person, spouse, people) {
    var seen = {};
    var ids = [];
    function add(list) {
      (list || []).forEach(function (id) {
        if (!seen[id] && people[id]) {
          seen[id] = true;
          ids.push(id);
        }
      });
    }
    add(person.childrenIds);
    if (spouse) add(spouse.childrenIds);
    return ids.map(function (id) {
      return people[id];
    });
  }

  function makeLineLayer(className) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "line-layer " + className);
    svg.setAttribute("aria-hidden", "true");
    return svg;
  }

  /*
   * Branch DOM:
   *   .branch
   *     svg.line-layer.branch-lines   couple link + bloodline parent → toggle
   *     .couple                       bloodline member (+ spouse)
   *     .toggle-row > button          +/− sits on the bloodline parent's line
   *     .subtree > .subtree-inner
   *         svg.line-layer.subtree-lines   toggle → sibling rail → each child
   *         .children-inner > .child-slot > .branch …
   * Lines are measured from the DOM and drawn in SVG so they always start at
   * the bloodline member's avatar, never at the couple midpoint or spouse.
   */
  function computeFocus(people, rootId, focusId) {
    if (!focusId || !people[focusId]) { // no focus: open everything down to FOCUS_EXPAND_GEN
      (function all(id) { var p = people[id]; if (!p) return; FOCUS_SUB[id] = true; (p.childrenIds || []).forEach(all); })(rootId);
      return;
    }
    (function find(id, path) {
      var p = people[id]; if (!p) return false;
      if (id === focusId) { path.forEach(function (a) { FOCUS_PATH[a] = true; }); return true; }
      path.push(id);
      var hit = (p.childrenIds || []).some(function (c) { return find(c, path); });
      path.pop();
      return hit;
    })(rootId, []);
    (function sub(id) { var p = people[id]; if (!p) return; FOCUS_SUB[id] = true; (p.childrenIds || []).forEach(sub); })(focusId);
  }

  function renderBranch(person, people, depth) {
    var branch = el("div", { className: "branch" });
    branch.appendChild(makeLineLayer("branch-lines"));

    var spouse = person.spouseId ? people[person.spouseId] : null;
    var wives = [spouse].concat((person.otherSpouseIds || []).map(function (id) { return people[id]; })).filter(Boolean);
    var multi = wives.length > 1;
    var pair = multi ? [person].concat(wives) : coupleOrder(person, spouse);
    var couple = el("div", {
      className: "couple" + (spouse ? "" : " couple-single"),
    });
    pair.forEach(function (p, i) {
      if (i > 0) couple.appendChild(el("div", { className: "couple-gap", "aria-hidden": "true" }));
      var card = renderPerson(p, depth);
      card.setAttribute("data-depth", depth);
      if (p === person) card.classList.add("is-anchor"); // the bloodline member
      if (multi && p !== person) {
        var wi = wives.indexOf(p);
        card.classList.add("multi-spouse", "spouse-n" + (wi + 1));
        if (wi > 0) card.classList.add("is-extra-spouse");
        var lab = card.querySelector(".person-label");
        lab.insertBefore(el("p", { className: "spouse-tag", text: "妻" + "一二三四"[wi] }), lab.firstChild);
      }
      couple.appendChild(card);
    });
    if (spouse) {
    }
    branch.appendChild(couple);

    var children = getChildren(person, spouse, people);
    if (multi) { // group children by mother, in wife order; unknown mother last
      var order = function (c) { var k = wives.map(function (w) { return w.id; }).indexOf(c.motherId); return k < 0 ? 99 : k; };
      children = children.map(function (c, i) { return [order(c), i, c]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }).map(function (x) { return x[2]; });
    }
    if (!children.length) return branch;

    couple.classList.add("has-children");
    branch.classList.add("has-children");

    var subtreeId = "subtree-" + person.id + "-" + ++uid;
    var expanded = !!FOCUS_PATH[person.id] || (!!FOCUS_SUB[person.id] && depth < FOCUS_EXPAND_GEN);
    var label = displayName(person);

    var toggle = el("button", {
      className: "branch-toggle",
      type: "button",
      "aria-expanded": expanded ? "true" : "false",
      "aria-controls": subtreeId,
      "data-name": label,
      "aria-label": (expanded ? "收合" : "展開") + label + "的子孫",
      title: (expanded ? "收合" : "展開") + label + "的子孫",
    });
    toggle.appendChild(el("span", { className: "toggle-icon", "aria-hidden": "true" }));

    var subtree = el("div", {
      className: "subtree" + (expanded ? "" : " is-collapsed"),
      id: subtreeId,
    });
    var inner = el("div", { className: "subtree-inner" });
    inner.appendChild(makeLineLayer("subtree-lines"));
    var childrenInner = el("div", { className: "children-inner" });

    var prevM = null;
    children.forEach(function (child) {
      var slot = el("div", { className: "child-slot" }, [renderBranch(child, people, depth + 1)]);
      if (multi) {
        var m = people[child.motherId], wi = m ? wives.indexOf(m) : -1;
        slot.classList.add("mother-n" + (wi + 1));
        slot.setAttribute("data-mother", Math.max(wi, 0)); // unknown mother → first wife's group
        if (prevM !== null && child.motherId !== prevM) slot.classList.add("mgroup-start");
        prevM = child.motherId;
      }
      childrenInner.appendChild(slot);
    });

    inner.appendChild(childrenInner);
    subtree.appendChild(inner);

    if (!expanded) branch.classList.add("is-collapsed");

    var toggleRow = el("div", { className: "toggle-row" }, [toggle]);
    if (multi) { // one +/- per wife; each controls only that wife's children
      var wifeToggles = [toggle];
      toggle.setAttribute("data-mgroup", "0");
      wives.slice(1).forEach(function (w, j) {
        var t2 = toggle.cloneNode(true);
        t2.removeAttribute("id");
        t2.setAttribute("data-mgroup", String(j + 1));
        toggleRow.appendChild(t2);
        wifeToggles.push(t2);
      });
      var wifeKids = wives.map(function (w, k) { return children.filter(function (c) { var m = people[c.motherId], wi = m ? wives.indexOf(m) : -1; return Math.max(wi, 0) === k; }).length; });
      branch.setAttribute("data-empty-wives", wifeKids.map(function (n, k) { return n ? "" : k; }).filter(function (x) { return x !== ""; }).join(","));
      wifeToggles.forEach(function (tg, k) {
        if (!wifeKids[k]) tg.classList.add("wife-empty"); // childless wife: no drop line, no toggle
        var nm = label + "・妻" + "一二三四"[k] + wives[k].name;
        tg.setAttribute("data-name", nm);
        tg.setAttribute("aria-label", (expanded ? "收合" : "展開") + nm + "的子孫");
        tg.setAttribute("title", (expanded ? "收合" : "展開") + nm + "的子孫");
        if (!expanded) setGroupHidden(childrenInner, k, true);
        if (k > 0) tg.addEventListener("click", function () {
          var next = tg.getAttribute("aria-expanded") !== "true";
          var card = branch.querySelector(":scope > .couple > .person") || tg;
          var r0 = card.getBoundingClientRect();
          setExpanded(tg, subtree, branch, next);
          anchorView(card, r0);
        });
      });
    }
    branch.appendChild(toggleRow);
    branch.appendChild(subtree);

    toggle.addEventListener("click", function () {
      var next = toggle.getAttribute("aria-expanded") !== "true";
      var card = branch.querySelector(":scope > .couple > .person") || toggle;
      var r0 = card.getBoundingClientRect(); // screen position BEFORE the re-flow
      setExpanded(toggle, subtree, branch, next);
      anchorView(card, r0);
    });

    return branch;
  }

  function setGroupHidden(childrenInner, k, hidden) {
    childrenInner.querySelectorAll(":scope > .child-slot").forEach(function (s) {
      if (+(s.getAttribute("data-mother") || 0) === k) s.classList.toggle("mg-hidden", hidden);
    });
  }

  function setExpanded(toggle, subtree, branch, expanded) {
    var wifeToggle = toggle.hasAttribute("data-mgroup");
    var name = toggle.getAttribute("data-name") || "";
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      (expanded ? "收合" : "展開") + name + "的子孫"
    );
    toggle.setAttribute("title", (expanded ? "收合" : "展開") + name + "的子孫");
    if (wifeToggle) {
      setGroupHidden(subtree.querySelector(".children-inner"), +toggle.getAttribute("data-mgroup"), !expanded);
      // the shared subtree stays open while any wife's group is open
      expanded = Array.prototype.some.call(toggle.parentNode.querySelectorAll(":scope > .branch-toggle"), function (b) {
        return b.getAttribute("aria-expanded") === "true";
      });
    }
    subtree.classList.toggle("is-collapsed", !expanded);
    branch.classList.toggle("is-collapsed", !expanded);
    balance();
    if (window.__fitWidth) window.__fitWidth();
    animateLines();
  }

  // Keep the clicked person's card at the same screen position while the layout re-flows
  // (single toggles only; expand-all / collapse-all are not anchored).
  var anchorRun = 0, initCentering = true;
  function anchorView(card, r0) {
    initCentering = false; // the first toggle ends the initial 陳清水 re-centering
    var x0 = r0.left, y0 = r0.top;
    var run = ++anchorRun, until = performance.now() + 900, done = false;
    // Collapsing can shrink the page below the current scroll position, so the browser would clamp
    // the scroll and the card would jump. Reserve enough page size to keep the anchor reachable;
    // the reserve is dropped again by expand-all / collapse-all.
    var body = document.body;
    function fix() {
      var r = card.getBoundingClientRect(), dx = r.left - x0, dy = r.top - y0;
      var needW = Math.ceil(window.scrollX + dx + window.innerWidth), needH = Math.ceil(window.scrollY + dy + window.innerHeight);
      if (needW > document.documentElement.scrollWidth) body.style.minWidth = needW + "px";
      if (needH > document.documentElement.scrollHeight) body.style.minHeight = needH + "px";
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) window.scrollBy({ left: dx, top: dy, behavior: "instant" }); // bypass html{scroll-behavior:smooth}
    }
    fix(); // layout has already been recomputed synchronously by setExpanded (balance/zoom)
    function step() {
      if (run !== anchorRun) return;
      fix();
      if (!done && performance.now() < until) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    var sub = card.closest(".branch");
    function end(e) {
      if (run !== anchorRun) return;
      if (e && e.type === "transitionend" && !(e.target === sub || sub.contains(e.target))) return;
      fix();
    }
    document.addEventListener("transitionend", end, true);
    setTimeout(function () { end(); document.removeEventListener("transitionend", end, true); done = true; }, 1000);
  }

  function setAll(expanded) {
    document.body.style.minWidth = ""; document.body.style.minHeight = "";
    document.querySelectorAll(".branch-toggle").forEach(function (btn) {
      var subtree = document.getElementById(btn.getAttribute("aria-controls"));
      var branch = btn.closest(".branch");
      setExpanded(btn, subtree, branch, expanded);
    });
  }

  /* ---------- Connector lines ---------- */

  function directChild(parent, selector) {
    for (var i = 0; i < parent.children.length; i++) {
      if (parent.children[i].matches(selector)) return parent.children[i];
    }
    return null;
  }

  function anchorAvatar(branch) {
    var couple = directChild(branch, ".couple");
    var card = couple && directChild(couple, ".is-anchor");
    return card ? card.querySelector(".avatar") : null;
  }

  // Viewport x where the drop to children starts: midpoint of the spouse
  // line for couples, the bloodline avatar's center for singles.
  function dropClientX(branch) {
    var couple = directChild(branch, ".couple");
    var cards = couple ? couple.querySelectorAll(":scope > .person") : [];
    if (cards.length >= 2) {
      var l = cards[0].querySelector(".avatar").getBoundingClientRect();
      var r = cards[1].querySelector(".avatar").getBoundingClientRect();
      return (l.right + r.left) / 2;
    }
    var a = anchorAvatar(branch).getBoundingClientRect();
    return (a.left + a.right) / 2;
  }

  // Client x of each wife's drop: midpoint between her avatar and the card before her.
  function wifeDropXs(branch) {
    var couple = directChild(branch, ".couple");
    var cards = couple ? couple.querySelectorAll(":scope > .person") : [];
    var out = [];
    for (var i = 1; i < cards.length; i++) {
      var l = cards[i - 1].querySelector(".avatar").getBoundingClientRect(), r = cards[i].querySelector(".avatar").getBoundingClientRect();
      out.push((l.right + r.left) / 2);
    }
    return cards.length > 2 ? out : [];
  }

  function setLines(svg, segments) {
    var d = segments
      .map(function (s) {
        return "M" + s[0].toFixed(1) + " " + s[1].toFixed(1) + "L" + s[2].toFixed(1) + " " + s[3].toFixed(1);
      })
      .join("");
    var path = svg.firstChild;
    if (!path) {
      path = document.createElementNS(SVG_NS, "path");
      svg.appendChild(path);
    }
    path.setAttribute("d", d);
  }

  // Generation rail (theme C): fixed left strip, one label per *visible* generation row.
  var CN_DIG = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  function genCN(n) { return n < 10 ? CN_DIG[n] : n < 20 ? "十" + CN_DIG[n - 10] : n === 20 ? "二十" : n < 30 ? "廿" + CN_DIG[n - 20] : n === 30 ? "三十" : String(n); }
  var railRAF = 0;
  function scheduleRail() {
    if (railRAF) return;
    railRAF = requestAnimationFrame(function () { railRAF = 0; drawGenRail(); });
  }
  function drawGenRail() {
    var tree = $("tree");
    var rail = document.querySelector(".gen-rail");
    if (!tree || !document.body.classList.contains("theme-c")) { if (rail) rail.remove(); return; }
    if (!rail) { rail = el("div", { className: "gen-rail", "aria-hidden": "true" }); document.body.appendChild(rail); }
    var hdr = document.querySelector(".site-header");
    var top = hdr ? hdr.offsetHeight : 0; // same value syncBar() writes to --bar-h
    rail.style.top = top + "px";
    var rows = {};
    tree.querySelectorAll(".person[data-depth] .avatar").forEach(function (a) {
      if (a.closest(".subtree.is-collapsed")) return;
      var d = +a.closest(".person").getAttribute("data-depth"), r = a.getBoundingClientRect();
      var cy = r.top + r.height / 2 - top;
      if (cy < 0) return; // row has scrolled up under the header
      if (!(d in rows) || cy < rows[d]) rows[d] = cy;
    });
    var ds = {};
    Object.keys(rows).forEach(function (k) { ds[k] = 1; });
    rail.querySelectorAll(".gen-r").forEach(function (x) { ds[x.getAttribute("data-d")] = 1; });
    Object.keys(ds).forEach(function (d) {
      var lab = rail.querySelector('.gen-r[data-d="' + d + '"]');
      if (!lab) {
        if (!(d in rows)) return;
        lab = el("div", { className: "gen-r" });
        lab.setAttribute("data-d", d);
        lab.innerHTML = '<span class="gen-l">' + genCN(+d) + '<span class="gen-shi">世</span></span>';
        lab.style.top = rows[d] + "px";
        rail.appendChild(lab);
        void lab.offsetWidth; // let the fade-in run
      }
      if (d in rows) { lab.style.top = rows[d] + "px"; lab.classList.add("on"); }
      else lab.classList.remove("on");
    });
  }
  window.addEventListener("scroll", scheduleRail, { passive: true });
  window.addEventListener("resize", scheduleRail);
  document.addEventListener("transitionend", function (e) { if (!e.target.closest || !e.target.closest(".gen-rail")) scheduleRail(); }, true);

  // Theme B: 第N世 labels in a left margin column + thin rules between generations.
  function drawGenLabels() {
    var tree = $("tree");
    if (!tree || !document.body.classList.contains("theme-b") || !tree.firstChild) return;
    var layer = tree.querySelector(".gen-labels");
    if (!layer) { layer = el("div", { className: "gen-labels", "aria-hidden": "true" }); tree.appendChild(layer); }
    var tr = tree.getBoundingClientRect();
    var k = tree.offsetWidth ? tr.width / tree.offsetWidth : 1;
    var tops = {};
    tree.querySelectorAll(".person[data-depth]").forEach(function (c) {
      if (c.closest(".subtree.is-collapsed")) return;
      var d = +c.getAttribute("data-depth"), t = (c.getBoundingClientRect().top - tr.top) / k;
      if (!(d in tops) || t < tops[d]) tops[d] = t;
    });
    var html = "";
    Object.keys(tops).sort(function (a, b) { return a - b; }).forEach(function (d) {
      var t = tops[d];
      if (+d > ROOT_GEN) html += '<div class="gen-rule" style="top:' + (t - 22) + 'px"></div>';
      html += '<div class="gen-label" style="top:' + t + 'px">第' + d + '世</div>';
    });
    if (layer.innerHTML !== html) layer.innerHTML = html;
  }

  function drawLines() {
    drawGenLabels();
    scheduleRail();
    var tree = $("tree");
    if (!tree) return;
    var treeRect = tree.getBoundingClientRect();
    var k = tree.offsetWidth ? treeRect.width / tree.offsetWidth : 1; // zoom factor

    function box(node, origin) {
      var r = node.getBoundingClientRect();
      return {
        left: (r.left - origin.left) / k,
        right: (r.right - origin.left) / k,
        top: (r.top - origin.top) / k,
        bottom: (r.bottom - origin.top) / k,
        cx: ((r.left + r.right) / 2 - origin.left) / k,
        cy: ((r.top + r.bottom) / 2 - origin.top) / k,
      };
    }

    tree.querySelectorAll(".branch").forEach(function (branch) {
      var origin = branch.getBoundingClientRect();
      var segs = [];
      var anchor = anchorAvatar(branch);
      if (!anchor) return;
      var a = box(anchor, origin);

      // Spouse: short horizontal line between the two avatars only.
      var couple = directChild(branch, ".couple");
      var cards = couple.querySelectorAll(":scope > .person");
      for (var ci = 0; ci + 1 < cards.length; ci++) {
        var l = box(cards[ci].querySelector(".avatar"), origin);
        var r = box(cards[ci + 1].querySelector(".avatar"), origin);
        segs.push([l.right, l.cy, r.left, r.cy]);
      }

      // Bloodline parent avatar → down through the toggle row.
      var row = directChild(branch, ".toggle-row");
      if (row) {
        var rowBox = box(row, origin);
        var toggle = row.firstChild;
        var dx = (dropClientX(branch) - origin.left) / k;
        var sy = a.cy;
        if (cards.length >= 2) sy = box(cards[0].querySelector(".avatar"), origin).cy;
        toggle.style.left = dx - rowBox.left + "px";
        // Collapsed: stop at the toggle (no dangling stub below the "+").
        var isOpen = function (tg) { return tg.getAttribute("aria-expanded") === "true" && !branch.classList.contains("is-collapsed"); };
        var endY = isOpen(toggle) ? rowBox.bottom : box(toggle, origin).cy;
        // Single parent: start below the whole name / second-line / date block so the line never runs through text.
        var textBottom = cards.length >= 2 ? sy : box(anchor.closest(".person") || anchor, origin).bottom + 3;
        var emptyW = (branch.getAttribute("data-empty-wives") || "").split(",").filter(Boolean).map(Number);
        if (emptyW.indexOf(0) < 0) segs.push([dx, textBottom, dx, endY]);
        if (cards.length > 2) {
          var extra = row.querySelectorAll(":scope > .branch-toggle[data-mgroup]");
          for (var wk = 2; wk < cards.length; wk++) {
            var wl = box(cards[wk - 1].querySelector(".avatar"), origin), wr = box(cards[wk].querySelector(".avatar"), origin);
            var wx = (wl.right + wr.left) / 2;
            var tg2 = extra[wk - 1];
            if (tg2) tg2.style.left = wx - rowBox.left + "px";
            if (emptyW.indexOf(wk - 1) < 0) segs.push([wx, wl.cy, wx, tg2 && !isOpen(tg2) ? box(tg2, origin).cy : rowBox.bottom]);
          }
        }
      }
      setLines(directChild(branch, ".line-layer"), segs);

      // Inside the (clipped) subtree: toggle → rail → each child's bloodline avatar.
      var subtree = directChild(branch, ".subtree");
      if (!subtree) return;
      var inner = subtree.firstChild;
      var innerOrigin = inner.getBoundingClientRect();
      var px = (dropClientX(branch) - innerOrigin.left) / k;
      var childrenInner = directChild(inner, ".children-inner");
      var railY = box(childrenInner, innerOrigin).top;
      var groupX = wifeDropXs(branch).map(function (cx) { return (cx - innerOrigin.left) / k; });
      if (!groupX.length) groupX = [px];
      var groups = groupX.map(function (gx) { return [gx]; });
      var csegs = [];
      childrenInner.querySelectorAll(":scope > .child-slot:not(.mg-hidden)").forEach(function (slot) {
        var ca = anchorAvatar(slot.firstChild);
        if (!ca) return;
        var c = box(ca, innerOrigin);
        var g = Math.min(+(slot.getAttribute("data-mother") || 0), groups.length - 1);
        groups[g].push(c.cx);
        csegs.push([c.cx, railY, c.cx, c.top]);
      });
      groups.forEach(function (xs) {
        if (xs.length < 2) return; // wife with no children: no drop
        csegs.push([xs[0], 0, xs[0], railY]);
        var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
        if (maxX - minX > 0.5) csegs.push([minX, railY, maxX, railY]);
      });
      setLines(directChild(inner, ".line-layer"), csegs);
    });
  }

  // Tidy-tree layout (deepest first). Each branch is as wide as
  // max(couple, children row incl. fixed --sibling-gap); the children row is
  // centered under the bloodline member's avatar (not the couple), with no
  // stretching or invisible spacers. Collapsed subtrees take no width.
  // Siblings share one couple height so every toggle row / drop line below them
  // starts and ends at the same y, whatever notes or dates a card carries.
  function equalizeSiblingCouples() {
    document.querySelectorAll(".children-inner").forEach(function (row) {
      var cs = [];
      row.querySelectorAll(":scope > .child-slot > .branch > .couple").forEach(function (c) {
        c.style.minHeight = ""; cs.push(c);
      });
      var h = 0;
      cs.forEach(function (c) { h = Math.max(h, c.offsetHeight); });
      cs.forEach(function (c) { if (c.offsetHeight) c.style.minHeight = h + "px"; });
    });
  }

  function balance() {
    equalizeSiblingCouples();
    var branches = Array.prototype.slice.call(document.querySelectorAll(".branch")).reverse();
    branches.forEach(function (br) {
      var couple = directChild(br, ".couple");
      var sub = directChild(br, ".subtree");
      var row = sub && sub.firstChild && directChild(sub.firstChild, ".children-inner");
      couple.style.marginLeft = "";
      var cw = couple.offsetWidth;
      var cRect = couple.getBoundingClientRect(), ck = cRect.width / (couple.offsetWidth || 1);
      var ac = (dropClientX(br) - cRect.left) / ck;
      if (!row || br.classList.contains("is-collapsed")) {
        if (row) row.style.marginLeft = "0px";
        br.style.width = cw + "px";
        return;
      }
      row.style.marginLeft = "0px";
      packLeaves(row);
      var rw = row.scrollWidth;
      // centre of the first/last child anchors, so the rail is centred under the parent
      var slots = row.querySelectorAll(":scope > .child-slot:not(.mg-hidden)");
      var f = anchorAvatar(slots[0].firstChild), l = anchorAvatar(slots[slots.length - 1].firstChild);
      var rr = row.getBoundingClientRect(), k = rr.width / (row.offsetWidth || 1);
      var fx = (f.getBoundingClientRect().left + f.getBoundingClientRect().width / 2 - rr.left) / k;
      var lx = (l.getBoundingClientRect().left + l.getBoundingClientRect().width / 2 - rr.left) / k;
      var rc = (fx + lx) / 2;
      var wx = wifeDropXs(br);
      if (wx.length >= 1) {
        // Multi-wife: per-mother groups. Shift the couple (t = couple-left in row coords) and add
        // extra gap before later groups so each single-child group sits straight under its drop,
        // and the groups' rail spans stay left-to-right without crossing.
        var NG = wx.length, d = wx.map(function (x) { return (x - cRect.left) / ck; });
        var G = []; for (var gi = 0; gi < NG; gi++) G.push({ xs: [], start: null });
        slots.forEach(function (s) {
          var g = Math.min(+(s.getAttribute("data-mother") || 0), NG - 1), r = anchorAvatar(s.firstChild).getBoundingClientRect();
          G[g].xs.push(((r.left + r.right) / 2 - rr.left) / k);
          if (!G[g].start) G[g].start = s;
          G[g].last = s;
        });
        var GAP = 14, cg = parseFloat(getComputedStyle(row).columnGap) || 0, t = 0, E = [];
        // Per-generation contours of each group, so a wide subtree only has to clear cards on its own rows.
        var cc = couple.querySelectorAll(":scope > .person");
        var c0 = cc[0].getBoundingClientRect(), c1 = cc[1].getBoundingClientRect();
        var tightGap = Math.max(4, Math.min(cg, (c1.left - c0.right) / ck - 4)); // child row may be as tight as the wives' row
        var baseDepth = null;
        G.forEach(function (q) {
          q.cont = {};
          var cur = q.start; if (!cur) return;
          while (cur) {
            if (cur.classList.contains("child-slot") && !cur.classList.contains("mg-hidden")) {
              cur.querySelectorAll(".person[data-depth]").forEach(function (pc) {
                if (pc.closest(".subtree.is-collapsed") && pc.closest(".subtree.is-collapsed") !== null && cur.contains(pc.closest(".subtree.is-collapsed"))) return;
                var dp = +pc.getAttribute("data-depth"), r = pc.getBoundingClientRect();
                var L = (r.left - rr.left) / k, R = (r.right - rr.left) / k;
                if (baseDepth === null || dp < baseDepth) baseDepth = dp;
                if (!q.cont[dp]) q.cont[dp] = [L, R]; else { q.cont[dp][0] = Math.min(q.cont[dp][0], L); q.cont[dp][1] = Math.max(q.cont[dp][1], R); }
              });
            }
            if (cur === q.last) break;
            cur = cur.nextElementSibling;
          }
        });
        var prevCont = {}, prevE = 0, prevMax = -Infinity;
        for (var g = 0; g < NG; g++) {
          var xs = G[g].xs, D = t + d[g];
          if (!xs.length) { E.push(prevE); continue; }
          var mn = Math.min.apply(null, xs), mx = Math.max.apply(null, xs);
          var lo = prevMax + GAP - mn; // rail spans stay apart
          Object.keys(G[g].cont).forEach(function (dp) {
            if (!prevCont[dp]) return;
            var gp = +dp === baseDepth ? tightGap : cg;
            lo = Math.max(lo, prevCont[dp][1] + gp - G[g].cont[dp][0]);
          });
          var e = xs.length === 1 ? D - xs[0] : D - (mn + mx) / 2;
          if (e < lo) e = lo; // can't sit straight under its drop: fall back to a short jog
          E.push(e); prevE = e; prevMax = Math.max(D, mx + e);
          Object.keys(G[g].cont).forEach(function (dp) {
            var L = G[g].cont[dp][0] + e, R = G[g].cont[dp][1] + e;
            if (!prevCont[dp]) prevCont[dp] = [L, R]; else { prevCont[dp][0] = Math.min(prevCont[dp][0], L); prevCont[dp][1] = Math.max(prevCont[dp][1], R); }
          });
        }
        // normalise so nothing starts left of the row
        var minL = Infinity;
        G.forEach(function (q, gi) { Object.keys(q.cont).forEach(function (dp) { minL = Math.min(minL, q.cont[dp][0] + E[gi]); }); });
        var m0 = isFinite(minL) ? Math.min(0, minL) : 0;
        if (m0 < 0) { E = E.map(function (e) { return e - m0; }); t -= m0; }
        var acc = 0;
        for (var g3 = 0; g3 < NG; g3++) {
          if (!G[g3].start) continue;
          var add = E[g3] - acc; acc = E[g3];
          if (Math.abs(add) > 0.01) G[g3].start.style.marginLeft = (parseFloat(getComputedStyle(G[g3].start).marginLeft) || 0) + add + "px";
        }
        rw = row.scrollWidth;
        rc = t; ac = 0;
        if (rc < 0) { ac = -rc; rc = 0; }
      }
      var X = Math.max(ac, rc);
      var cL = X - ac, rL = X - rc;
      couple.style.marginLeft = cL + "px";
      row.style.marginLeft = rL + "px";
      br.style.width = Math.max(cL + cw, rL + rw) + "px";
    });
  }

  // A childless sibling only occupies its own card row, so it doesn't need
  // to clear the previous sibling's whole (possibly very wide) subtree; it
  // only has to clear that sibling's cards. Pull such leaves left to sit a
  // --sibling-gap after the previous sibling's cards, and give the next slot
  // the same amount back so every later subtree keeps its position.
  function packLeaves(row) {
    var slots = row.querySelectorAll(":scope > .child-slot");
    slots.forEach(function (s) { s.style.marginLeft = ""; });
    var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    var rr = row.getBoundingClientRect(), k = rr.width / (row.offsetWidth || 1);
    for (var i = 1; i < slots.length; i++) {
      var br = slots[i].firstChild;
      if (br.classList.contains("has-children")) continue;
      if (slots[i].classList.contains("mgroup-start")) continue; // keep the gap between mother groups
      var prev = directChild(slots[i - 1].firstChild, ".couple");
      var want = (prev.getBoundingClientRect().right - rr.left) / k + gap;
      var have = (slots[i].getBoundingClientRect().left - rr.left) / k;
      var shift = have - want;
      if (shift < 1) continue;
      // Accumulate: this slot may already carry the previous leaf's give-back.
      slots[i].style.marginLeft = (parseFloat(slots[i].style.marginLeft) || 0) - shift + "px";
      if (slots[i + 1]) slots[i + 1].style.marginLeft = shift + "px";
    }
  }

  var linesQueued = false;
  function scheduleLines() {
    if (linesQueued) return;
    linesQueued = true;
    requestAnimationFrame(function () {
      linesQueued = false;
      drawLines();
    });
  }

  // Redraw every frame while expand/collapse transitions run (sibling
  // positions shift as subtrees grow/shrink).
  var animUntil = 0;
  var animating = false;
  function animateLines() {
    animUntil = performance.now() + 700;
    if (animating) return;
    animating = true;
    (function frame() {
      drawLines();
      syncHeight();
      if (performance.now() < animUntil) requestAnimationFrame(frame);
      else animating = false;
    })();
  }

  // transform: scale() doesn't change layout size, so cancel the unscaled
  // overflow with a negative bottom margin. Must track the tree's CURRENT
  // height: subtrees animate open/closed, so it is re-synced on every resize.
  function syncHeight() {
    var tree = $("tree");
    if (!tree) return;
    var m = -(tree.offsetHeight * (1 - scale)) + "px";
    if (tree.style.marginBottom !== m) tree.style.marginBottom = m;
    // Same for width, so the page is only as wide as the scaled tree.
    var r = -(tree.offsetWidth * (1 - scale)) + "px";
    if (tree.style.marginRight !== r) tree.style.marginRight = r;
  }

  function applyZoom() {
    var tree = $("tree");
    // Scale from the top-left and recenter manually, so a tree wider than the
    // window still fits and stays centered (top-center origin would clip).
    var root = tree.querySelector(":scope > .branch");
    var w = root ? root.offsetWidth + 32 + (parseFloat(getComputedStyle(root).marginLeft) || 0) : tree.offsetWidth;
    var avail = document.documentElement.clientWidth - 48;
    tree.style.width = w + "px";
    tree.style.transformOrigin = "top left";
    tree.style.marginLeft = Math.max(0, (avail - w * scale) / 2) + "px";
    syncHeight();
    tree.style.transform = "scale(" + scale + ")";
    $("btn-zoom-reset").textContent = Math.round(scale * 100) + "%";
    animateLines();
  }

  function syncBar() {
    var bar = document.querySelector(".site-header");
    if (bar) document.documentElement.style.setProperty("--bar-h", bar.offsetHeight + "px");
  }

  function init() {
    syncBar();
    window.addEventListener("resize", syncBar);
    var tree = $("tree");
    var data = window.FAMILY_DATA;

    if (!data || !data.people || !data.rootId || !data.people[data.rootId]) {
      tree.appendChild(
        el("p", {
          className: "tree-error",
          text: "找不到家族資料，請編輯 family-data.js 後重新整理。",
        })
      );
      return;
    }

    ROOT_GEN = +data.rootGeneration || 14;
    computeLineBuckets(data.people, data.rootId);
    computeFocus(data.people, data.rootId, data.focusId);
    tree.appendChild(renderBranch(data.people[data.rootId], data.people, ROOT_GEN));
    balance();
    // Auto-fit: shrink the initial zoom so the whole tree fits the window width.
    var avail = document.documentElement.clientWidth - 48;
    var need = tree.firstChild.offsetWidth + (parseFloat(getComputedStyle(tree.firstChild).marginLeft) || 0);
    if (need > avail) {
      scale = Math.max(0.5, Math.floor((avail / need) * 100) / 100);
    }
    applyZoom();
    // Start centred on the focus person (陳清水), horizontally and vertically in the area below the header.
    // Re-centre while the layout settles (fonts, balancing), until the user scrolls/drags/zooms themselves.
    var userMoved = false;
    ["wheel", "pointerdown", "touchstart", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, function () { userMoved = true; }, { passive: true, once: true });
    });
    function centerFocus() {
      if (userMoved || !initCentering) return;
      var f = data.focusId && tree.querySelector('[data-id="' + data.focusId + '"]');
      if (!f) { scheduleRail(); return; }
      var r = f.getBoundingClientRect();
      var hdr = document.querySelector(".site-header"), hh = hdr ? hdr.offsetHeight : 0;
      var x = r.left + window.scrollX + r.width / 2 - document.documentElement.clientWidth / 2;
      var y = r.top + window.scrollY + r.height / 2 - (hh + (window.innerHeight - hh) / 2);
      window.scrollTo({ left: Math.max(0, x), top: Math.max(0, y), behavior: "instant" });
      scheduleRail();
    }
    requestAnimationFrame(centerFocus);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(centerFocus); });
    [300, 800, 1500].forEach(function (t) { setTimeout(centerFocus, t); });
    window.__fitWidth = applyZoom;
    if (window.ResizeObserver) new ResizeObserver(syncHeight).observe(tree);
    tree.addEventListener("transitionend", syncHeight);
    window.addEventListener("resize", scheduleLines);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleLines);
    tree.addEventListener("transitionend", scheduleLines);

    $("btn-expand-all").addEventListener("click", function () {
      setAll(true);
    });
    $("btn-collapse-all").addEventListener("click", function () {
      setAll(false);
    });
    $("btn-zoom-in").addEventListener("click", function () {
      scale = Math.min(1.6, Math.round((scale + 0.1) * 10) / 10);
      applyZoom();
    });
    $("btn-zoom-out").addEventListener("click", function () {
      scale = Math.max(0.5, Math.round((scale - 0.1) * 10) / 10);
      applyZoom();
    });
    $("btn-zoom-reset").addEventListener("click", function () {
      scale = 1;
      applyZoom();
    });
    enableDragPan();
  }

  // Click-and-drag panning with a mouse/pen: scrolls the window (the page is
  // the only scroller). Touch keeps native scrolling. Movement under 5px is
  // still a click; after a real drag the click is swallowed.
  function enableDragPan() {
    var wrap = $("tree-wrap");
    var THRESH = 5, start = null, dragging = false, suppress = false;
    wrap.classList.add("pannable");
    wrap.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch" || e.button !== 0) return;
      if (e.target.closest("button, a, input, select, textarea, label")) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      dragging = false;
    });
    window.addEventListener("pointermove", function (e) {
      if (!start || e.pointerId !== start.id) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!dragging) {
        if (Math.abs(dx) < THRESH && Math.abs(dy) < THRESH) return;
        dragging = true;
        document.documentElement.classList.add("is-panning");
        var sel = window.getSelection && window.getSelection();
        if (sel) sel.removeAllRanges();
      }
      window.scrollBy({ left: -dx, top: -dy, behavior: "instant" });
      start.x = e.clientX;
      start.y = e.clientY;
      e.preventDefault();
    });
    function end(e) {
      if (!start || (e && e.pointerId !== start.id)) return;
      if (dragging) {
        suppress = true;
        setTimeout(function () { suppress = false; }, 0);
      }
      start = null;
      dragging = false;
      document.documentElement.classList.remove("is-panning");
    }
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("click", function (e) {
      if (suppress) { e.preventDefault(); e.stopPropagation(); suppress = false; }
    }, true);
    // Avoid native text/image drag starting from the tree while panning.
    wrap.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

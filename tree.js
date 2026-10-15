/**
 * Family tree renderer + expand/collapse.
 * Reads window.FAMILY_DATA from family-data.js (classic script, works via file://).
 */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var DEFAULT_EXPAND_DEPTH = 6; // 第14世–第20世 open by default; use 全部展開 for the rest
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
    c.setAttribute("r", "48.1");
    c.setAttribute("fill", "none");
    c.setAttribute("stroke", "currentColor");
    c.setAttribute("stroke-width", "3.8");
    c.setAttribute("stroke-linecap", "round");
    c.setAttribute("stroke-dasharray", "7 6");
    svg.appendChild(c);
    return svg;
  }

  function genericAvatar(person) {
    return person.gender === "female" ? "avatars/default-female.jpg" : "avatars/default-male.jpg";
  }

  function parseYMD(v) {
    var m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/.exec(String(v || ""));
    return m ? { y: +m[1], m: +(m[2] || 1), d: +(m[3] || 1) } : null;
  }

  // Age today, or age at death if deathDate is set. null if unknown.
  function ageOf(person) {
    var b = parseYMD(person.birthDate);
    if (!b) return null;
    var e = parseYMD(person.deathDate);
    if (!e) { var t = new Date(); e = { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() }; }
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
  var ELDER_LEVELS = 6;

  function defaultAvatar(person, depth) {
    var g = ageGroup(ageOf(person));
    if (!g && !person.birthDate && depth != null && depth < ELDER_LEVELS) g = "90-100";
    if (!g) return genericAvatar(person);
    return "avatars/" + (person.gender === "female" ? "female" : "male") + "-" + g + ".jpg";
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
      el("p", { className: "person-name", text: person.name || person.englishName || "" }),
      person.englishName && person.name
        ? el("p", { className: "person-english", text: person.englishName })
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
  function renderBranch(person, people, depth) {
    var branch = el("div", { className: "branch" });
    branch.appendChild(makeLineLayer("branch-lines"));

    var spouse = person.spouseId ? people[person.spouseId] : null;
    var pair = coupleOrder(person, spouse);
    var couple = el("div", {
      className: "couple" + (spouse ? "" : " couple-single"),
    });
    pair.forEach(function (p, i) {
      if (i > 0) couple.appendChild(el("div", { className: "couple-gap", "aria-hidden": "true" }));
      var card = renderPerson(p, depth);
      if (p === person) card.classList.add("is-anchor"); // the bloodline member
      couple.appendChild(card);
    });
    if (spouse) {
    }
    branch.appendChild(couple);

    var children = getChildren(person, spouse, people);
    if (!children.length) return branch;

    couple.classList.add("has-children");
    branch.classList.add("has-children");

    var subtreeId = "subtree-" + person.id + "-" + ++uid;
    var expanded = depth < DEFAULT_EXPAND_DEPTH;
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

    children.forEach(function (child) {
      childrenInner.appendChild(
        el("div", { className: "child-slot" }, [renderBranch(child, people, depth + 1)])
      );
    });

    inner.appendChild(childrenInner);
    subtree.appendChild(inner);

    if (!expanded) branch.classList.add("is-collapsed");

    branch.appendChild(el("div", { className: "toggle-row" }, [toggle]));
    branch.appendChild(subtree);

    toggle.addEventListener("click", function () {
      var next = toggle.getAttribute("aria-expanded") !== "true";
      setExpanded(toggle, subtree, branch, next);
    });

    return branch;
  }

  function setExpanded(toggle, subtree, branch, expanded) {
    var name = toggle.getAttribute("data-name") || "";
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      (expanded ? "收合" : "展開") + name + "的子孫"
    );
    toggle.setAttribute("title", (expanded ? "收合" : "展開") + name + "的子孫");
    subtree.classList.toggle("is-collapsed", !expanded);
    branch.classList.toggle("is-collapsed", !expanded);
    balance();
    if (window.__fitWidth) window.__fitWidth();
    animateLines();
  }

  function setAll(expanded) {
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
    if (cards.length === 2) {
      var l = cards[0].querySelector(".avatar").getBoundingClientRect();
      var r = cards[1].querySelector(".avatar").getBoundingClientRect();
      return (l.right + r.left) / 2;
    }
    var a = anchorAvatar(branch).getBoundingClientRect();
    return (a.left + a.right) / 2;
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

  function drawLines() {
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
      if (cards.length === 2) {
        var l = box(cards[0].querySelector(".avatar"), origin);
        var r = box(cards[1].querySelector(".avatar"), origin);
        segs.push([l.right, l.cy, r.left, r.cy]);
      }

      // Bloodline parent avatar → down through the toggle row.
      var row = directChild(branch, ".toggle-row");
      if (row) {
        var rowBox = box(row, origin);
        var toggle = row.firstChild;
        var dx = (dropClientX(branch) - origin.left) / k;
        var sy = a.cy;
        if (cards.length === 2) sy = box(cards[0].querySelector(".avatar"), origin).cy;
        toggle.style.left = dx - rowBox.left + "px";
        // Collapsed: stop at the toggle (no dangling stub below the "+").
        var endY = branch.classList.contains("is-collapsed")
          ? box(toggle, origin).cy
          : rowBox.bottom;
        segs.push([dx, cards.length === 2 ? sy : a.bottom, dx, endY]);
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
      var xs = [];
      var csegs = [[px, 0, px, railY]];
      childrenInner.querySelectorAll(":scope > .child-slot > .branch").forEach(function (cb) {
        var ca = anchorAvatar(cb);
        if (!ca) return;
        var c = box(ca, innerOrigin);
        xs.push(c.cx);
        csegs.push([c.cx, railY, c.cx, c.top]);
      });
      if (!xs.length) return;
      var minX = Math.min.apply(null, xs);
      var maxX = Math.max.apply(null, xs);
      if (maxX - minX > 0.5) csegs.push([minX, railY, maxX, railY]);
      setLines(directChild(inner, ".line-layer"), csegs);
    });
  }

  // Tidy-tree layout (deepest first). Each branch is as wide as
  // max(couple, children row incl. fixed --sibling-gap); the children row is
  // centered under the bloodline member's avatar (not the couple), with no
  // stretching or invisible spacers. Collapsed subtrees take no width.
  function balance() {
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
      var slots = row.querySelectorAll(":scope > .child-slot");
      var f = anchorAvatar(slots[0].firstChild), l = anchorAvatar(slots[slots.length - 1].firstChild);
      var rr = row.getBoundingClientRect(), k = rr.width / (row.offsetWidth || 1);
      var fx = (f.getBoundingClientRect().left + f.getBoundingClientRect().width / 2 - rr.left) / k;
      var lx = (l.getBoundingClientRect().left + l.getBoundingClientRect().width / 2 - rr.left) / k;
      var rc = (fx + lx) / 2;
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
    var w = tree.firstChild ? tree.firstChild.offsetWidth + 32 : tree.offsetWidth;
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

    tree.appendChild(renderBranch(data.people[data.rootId], data.people, 0));
    balance();
    // Auto-fit: shrink the initial zoom so the whole tree fits the window width.
    var avail = document.documentElement.clientWidth - 48;
    var need = tree.firstChild.offsetWidth;
    if (need > avail) {
      scale = Math.max(0.5, Math.floor((avail / need) * 100) / 100);
    }
    applyZoom();
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

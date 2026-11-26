/**
 * Tree tools: name search (type-ahead) + minimap. Loaded after tree.js, which exposes window.__treeApi.
 * UI text is Traditional Chinese. No data is changed; everything is read from the rendered cards.
 */
(function () {
  "use strict";
  var api, tree, input, list, header, toggleBtn;
  var items = null, shown = [], active = -1, composing = false;
  var moveToken = 0, hitTimer = 0;
  var SEARCH_ZOOM = 1.1;
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- search ---------- */
  // Fold common variant forms so 尚/尙, 為/爲, 鎮/鎭 etc. all match; strip brackets and spaces.
  var FOLD = { "尚": "尙", "為": "爲", "为": "爲", "鎮": "鎭", "镇": "鎭", "陈": "陳", "颜": "顏", "温": "溫" };
  function norm(s) {
    return String(s || "").toLowerCase().replace(/[（）()\s·・]/g, "").replace(/[尚為为鎮镇陈颜温]/g, function (c) { return FOLD[c]; });
  }
  function text(node, sel) { var n = node.querySelector(sel); return n ? n.textContent.trim() : ""; }

  function relation(card) {
    var name = function (c) { return c ? text(c, ".person-name") : ""; };
    if (card.classList.contains("spouse")) {
      var cp = card.closest(".couple"), mate = cp && cp.querySelector(".person:not(.spouse)");
      return mate ? "配 " + name(mate) : "配偶";
    }
    var slot = card.closest(".child-slot");
    if (!slot) return "";
    var pb = slot.parentNode.closest(".subtree");
    var par = pb && pb.parentNode.querySelector(":scope > .couple > .person:not(.spouse)");
    return par ? name(par) + (card.classList.contains("female") ? "之女" : "之子") : "";
  }

  function buildIndex() {
    items = [];
    tree.querySelectorAll(".person[data-id]").forEach(function (card) {
      var name = text(card, ".person-name");
      if (!name) return;
      var en = text(card, ".person-english");
      items.push({
        card: card, name: name, en: en, nn: norm(name), ne: en.toLowerCase().replace(/\s+/g, " "),
        depth: api.depthOf(card), note: text(card, ".person-note"), rel: null
      });
    });
  }

  function find(q) {
    var nq = norm(q), eq = String(q).toLowerCase().trim().replace(/\s+/g, " ");
    if (!nq) return [];
    var out = [];
    items.forEach(function (it, i) {
      var s = 99, at = -1, inName = true;
      if (it.nn === nq) { s = 0; at = 0; }
      else if (it.nn.indexOf(nq) === 0) { s = 1; at = 0; }
      else if ((at = it.nn.indexOf(nq)) === 1) s = 2; // given name (after the surname)
      else if (at > 1) s = 3;
      if (it.ne && eq) {
        var e = it.ne === eq ? 0.5 : it.ne.indexOf(eq) === 0 ? 1.5 : it.ne.indexOf(" " + eq) >= 0 ? 2.5 : it.ne.indexOf(eq) >= 0 ? 3.5 : 99;
        if (e < s) { s = e; inName = false; }
      }
      if (s < 99) out.push({ it: it, s: s, i: i, inName: inName, at: at });
    });
    out.sort(function (a, b) { return a.s - b.s || a.it.depth - b.it.depth || a.i - b.i; });
    return out.slice(0, 10);
  }

  function renderList() {
    list.textContent = "";
    shown.forEach(function (m, k) {
      var it = m.it, li = document.createElement("li");
      li.setAttribute("role", "option"); li.id = "ts-opt-" + k; li.setAttribute("data-k", k);
      var n = document.createElement("span"); n.className = "ts-n";
      var q = norm(input.value);
      // highlight the matched run when the name has no brackets (offsets are then identical)
      if (m.inName && it.name === it.name.replace(/[（）()\s]/g, "") && it.nn === norm(it.name) && m.at >= 0 && q) {
        n.appendChild(document.createTextNode(it.name.slice(0, m.at)));
        var mk = document.createElement("mark"); mk.textContent = it.name.slice(m.at, m.at + q.length); n.appendChild(mk);
        n.appendChild(document.createTextNode(it.name.slice(m.at + q.length)));
      } else n.textContent = it.name;
      li.appendChild(n);
      if (it.en) { var e = document.createElement("span"); e.className = "ts-e"; e.textContent = it.en; li.appendChild(e); }
      if (it.rel === null) it.rel = relation(it.card);
      var meta = document.createElement("span"); meta.className = "ts-m";
      meta.textContent = "第" + api.genLabel(it.depth) + "世" + (it.rel ? "・" + it.rel : "") + (it.note ? "・" + it.note : "");
      li.appendChild(meta);
      list.appendChild(li);
    });
    if (!shown.length && input.value.trim()) {
      var none = document.createElement("li"); none.className = "ts-none"; none.setAttribute("role", "presentation");
      none.textContent = "找不到符合的姓名"; list.appendChild(none);
    }
    var open = shown.length > 0 || !!list.querySelector(".ts-none");
    list.hidden = !open;
    input.setAttribute("aria-expanded", open ? "true" : "false");
    setActive(shown.length ? 0 : -1);
  }

  function setActive(k) {
    active = k;
    list.querySelectorAll("[role=option]").forEach(function (li, j) { li.classList.toggle("on", j === k); li.setAttribute("aria-selected", j === k ? "true" : "false"); });
    if (k >= 0) { input.setAttribute("aria-activedescendant", "ts-opt-" + k); var o = document.getElementById("ts-opt-" + k); if (o && o.scrollIntoView) o.scrollIntoView({ block: "nearest" }); }
    else input.removeAttribute("aria-activedescendant");
  }

  function closeList() { list.hidden = true; input.setAttribute("aria-expanded", "false"); shown = []; }
  function mobile() { return window.matchMedia("(max-width:700px)").matches; }
  function setPanel(open) {
    header.classList.toggle("search-open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    api.headerChanged();
  }

  function update() {
    if (!items) buildIndex();
    shown = input.value.trim() ? find(input.value) : [];
    renderList();
  }

  function pick(k) {
    var m = shown[k]; if (!m) return;
    input.value = m.it.name;
    closeList();
    if (mobile()) { input.blur(); setPanel(false); }
    goTo(m.it.card);
  }

  /* ---------- go to a person: expand ancestors, pan + zoom, highlight ---------- */
  function view() { // centre of the visible area (below the header, right of the generation rail)
    var rl = document.querySelector(".gen-rail"), rw = rl ? rl.offsetWidth : 0, hh = header.offsetHeight;
    return { x: rw + (document.documentElement.clientWidth - rw) / 2, y: hh + (window.innerHeight - hh) / 2 };
  }
  function cardCenter(card) {
    var r = card.getBoundingClientRect();
    return { x: r.left + window.scrollX + r.width / 2, y: r.top + window.scrollY + r.height / 2 };
  }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function goTo(card) {
    var token = ++moveToken;
    document.querySelectorAll(".person.search-hit").forEach(function (c) { c.classList.remove("search-hit"); });
    var changed = api.expandTo(card);
    var last = null, stable = 0, t0 = performance.now();
    (function wait() { // let the expand transition + re-balance settle before measuring
      if (token !== moveToken) return;
      var r = card.getBoundingClientRect();
      if (last && Math.abs(r.left - last.left) < 0.5 && Math.abs(r.top - last.top) < 0.5 && r.width > 0) stable++; else stable = 0;
      last = r;
      if (!changed || stable >= 8 || performance.now() - t0 > 1600) fly(card, token);
      else requestAnimationFrame(wait);
    })();
  }

  function fly(card, token) {
    var s0 = api.getScale(), s1 = Math.min(1.6, Math.max(s0, SEARCH_ZOOM));
    var x0 = window.scrollX, y0 = window.scrollY, dur = reduceMotion ? 0 : 750, t0 = performance.now();
    function place(e) {
      if (s1 !== s0) api.setScale(s0 + (s1 - s0) * e);
      var c = cardCenter(card), v = view(), de = document.documentElement, bd = document.body;
      var tx = c.x - v.x, ty = c.y - v.y;
      // The page ends right below the tree: reserve room (same trick tree.js uses when anchoring) so the card can sit mid-screen.
      if (tx + de.clientWidth > de.scrollWidth) bd.style.minWidth = Math.ceil(tx + de.clientWidth) + "px";
      if (ty + window.innerHeight > de.scrollHeight) bd.style.minHeight = Math.ceil(ty + window.innerHeight) + "px";
      window.scrollTo({ left: x0 + (tx - x0) * e, top: y0 + (ty - y0) * e, behavior: "instant" });
    }
    (function frame(now) {
      if (token !== moveToken) return;
      var t = dur ? Math.min(1, (now - t0) / dur) : 1;
      place(ease(t));
      if (t < 1) return requestAnimationFrame(frame);
      place(1); // exact landing after the last zoom step
      requestAnimationFrame(function () { place(1); });
      card.classList.add("search-hit");
      clearTimeout(hitTimer);
      hitTimer = setTimeout(function () { card.classList.remove("search-hit"); }, 2800);
    })(t0);
  }
  ["wheel", "touchstart", "keydown"].forEach(function (ev) { // the user takes over: stop any fly-to in progress
    window.addEventListener(ev, function (e) { if (e.target === input) return; moveToken++; }, { passive: true });
  });

  function initSearch() {
    input = document.getElementById("tree-search-input");
    list = document.getElementById("tree-search-list");
    toggleBtn = document.getElementById("search-toggle");
    header = document.querySelector(".site-header");
    if (!input || !list) return;
    input.addEventListener("input", function () { if (!composing) update(); });
    input.addEventListener("compositionstart", function () { composing = true; });
    input.addEventListener("compositionend", function () { composing = false; update(); });
    input.addEventListener("focus", function () { if (input.value.trim()) update(); });
    input.addEventListener("keydown", function (e) {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (list.hidden) { update(); if (list.hidden) return; }
        e.preventDefault();
        if (shown.length) setActive((active + (e.key === "ArrowDown" ? 1 : -1) + shown.length) % shown.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (!shown.length) update();
        pick(active >= 0 ? active : 0);
      } else if (e.key === "Escape") {
        if (!list.hidden) closeList(); else { input.value = ""; if (mobile()) setPanel(false); input.blur(); }
      }
    });
    list.addEventListener("pointerdown", function (e) { e.preventDefault(); }); // keep focus so the click lands
    list.addEventListener("click", function (e) {
      var li = e.target.closest("[role=option]"); if (li) pick(+li.getAttribute("data-k"));
    });
    document.addEventListener("pointerdown", function (e) {
      if (!e.target.closest("#tree-search, #search-toggle")) closeList();
    });
    toggleBtn.addEventListener("click", function () {
      var open = !header.classList.contains("search-open");
      setPanel(open);
      if (open) input.focus(); else closeList();
    });
  }

  /* ---------- minimap ---------- */
  var mm, cv, ctx, vp, k = 1, pad = 5, dims = { w: 0, h: 0 }, drawQ = 0, scrollQ = 0, dragging = false, grab = { x: 0, y: 0 };
  var COLORS = { male: "rgba(52,82,143,.8)", female: "rgba(143,74,66,.8)", spouse: "rgba(156,139,118,.75)" };

  function geom() {
    var de = document.documentElement, rl = document.querySelector(".gen-rail");
    return { docW: de.scrollWidth, docH: de.scrollHeight, cw: de.clientWidth, ch: window.innerHeight,
      rw: rl ? rl.offsetWidth : 0, hh: header.offsetHeight };
  }

  function drawMap() {
    drawQ = 0;
    var g = geom();
    var small = mobile();
    if ((g.docW <= g.cw + 2 && g.docH <= g.ch + 2) || (small && g.ch < 480)) { mm.hidden = true; return; }
    mm.hidden = false;
    var maxW = small ? 104 : 190, maxH = small ? 60 : 100;
    k = Math.min(maxW / g.docW, maxH / g.docH);
    var w = Math.max(20, Math.round(g.docW * k)), h = Math.max(12, Math.round(g.docH * k));
    k = Math.min(w / g.docW, h / g.docH);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    cv.style.width = w + "px"; cv.style.height = h + "px";
    dims.w = g.docW; dims.h = g.docH;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var sx = window.scrollX, sy = window.scrollY;
    tree.querySelectorAll(".person[data-id]").forEach(function (c) {
      var r = c.getBoundingClientRect();
      if (!r.width || c.closest(".subtree.is-collapsed")) return;
      ctx.fillStyle = c.classList.contains("spouse") ? COLORS.spouse : c.classList.contains("female") ? COLORS.female : COLORS.male;
      var cw = Math.max(2.4, r.width * k * 0.7), chh = Math.max(2.4, r.height * k * 0.5);
      ctx.fillRect((r.left + sx + r.width / 2) * k - cw / 2, (r.top + sy + r.height * 0.3) * k - chh / 2, cw, chh);
    });
    placeViewport();
  }

  function placeViewport() {
    scrollQ = 0;
    if (mm.hidden) return;
    var g = geom();
    if (Math.abs(g.docW - dims.w) > 2 || Math.abs(g.docH - dims.h) > 2) return scheduleDraw();
    var l = (window.scrollX + g.rw) * k, t = (window.scrollY + g.hh) * k;
    var w = (g.cw - g.rw) * k, h = (g.ch - g.hh) * k;
    var W = dims.w * k, H = dims.h * k;
    l = Math.max(0, Math.min(l, W - 3)); t = Math.max(0, Math.min(t, H - 3));
    w = Math.max(4, Math.min(w, W - l)); h = Math.max(4, Math.min(h, H - t));
    vp.style.cssText = "left:" + l + "px;top:" + t + "px;width:" + w + "px;height:" + h + "px";
  }

  function scheduleDraw() { if (!drawQ) drawQ = requestAnimationFrame(drawMap); }
  function scheduleVp() { if (!scrollQ && !drawQ) scrollQ = requestAnimationFrame(placeViewport); }

  function moveTo(e) { // put the view centre under the pointer (keeping the grab offset when dragging the rectangle)
    var rect = cv.getBoundingClientRect(), g = geom();
    var px = (e.clientX - rect.left) / k - grab.x, py = (e.clientY - rect.top) / k - grab.y;
    var cx = g.rw + (g.cw - g.rw) / 2, cy = g.hh + (g.ch - g.hh) / 2;
    window.scrollTo({ left: Math.max(0, px - cx), top: Math.max(0, py - cy), behavior: "instant" });
  }

  function initMinimap() {
    mm = document.createElement("div");
    mm.id = "tree-minimap"; mm.hidden = true;
    mm.setAttribute("role", "img"); mm.setAttribute("aria-label", "家譜縮圖，點選或拖曳可移動檢視位置"); mm.title = "點選或拖曳以移動檢視位置";
    cv = document.createElement("canvas"); vp = document.createElement("div"); vp.className = "mm-view";
    var inner = document.createElement("div"); inner.className = "mm-inner";
    inner.appendChild(cv); inner.appendChild(vp);
    mm.appendChild(inner); document.body.appendChild(mm);
    ctx = cv.getContext("2d");
    mm.addEventListener("pointerdown", function (e) {
      if (e.button) return;
      e.preventDefault(); moveToken++; dragging = true; mm.setPointerCapture(e.pointerId);
      var rect = cv.getBoundingClientRect(), v = vp.getBoundingClientRect(), g = geom();
      var inside = e.clientX >= v.left && e.clientX <= v.right && e.clientY >= v.top && e.clientY <= v.bottom;
      grab = inside ? { x: (e.clientX - rect.left) / k - (window.scrollX + g.rw + (g.cw - g.rw) / 2), y: (e.clientY - rect.top) / k - (window.scrollY + g.hh + (g.ch - g.hh) / 2) } : { x: 0, y: 0 };
      mm.classList.add("drag"); moveTo(e);
    });
    mm.addEventListener("pointermove", function (e) { if (dragging) { e.preventDefault(); moveTo(e); } });
    function up(e) { if (!dragging) return; dragging = false; mm.classList.remove("drag"); try { mm.releasePointerCapture(e.pointerId); } catch (x) {} }
    mm.addEventListener("pointerup", up); mm.addEventListener("pointercancel", up);
    window.addEventListener("scroll", scheduleVp, { passive: true });
    window.addEventListener("resize", scheduleDraw);
    document.addEventListener("tree:layout", scheduleDraw);   // zoom, expand, collapse
    tree.addEventListener("transitionend", scheduleDraw);
    if (window.ResizeObserver) new ResizeObserver(scheduleDraw).observe(tree);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleDraw);
    [300, 900, 1800].forEach(function (t) { setTimeout(scheduleDraw, t); }); // images/fonts/balancing settling after load
    scheduleDraw();
  }

  function start() {
    api = window.__treeApi; tree = document.getElementById("tree");
    if (!api || !tree) return;
    initSearch();
    initMinimap();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

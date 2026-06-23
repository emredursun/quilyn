/* =====================================================================
   PegaAcademy — engine.js
   Client-side SPA router + localStorage state manager + view injector.

   Responsibilities
     - Load data/registry.json (the global track manifest).
     - Render sidebar (track switcher + module list + progress).
     - Hash router: #<trackId>/<moduleId>  e.g. #PBA/BA-M01
     - Fetch a module's JSON on demand and inject Study Guide,
       Exam Pitfalls, Practice Quiz, and Quick Recap views.
     - Persist progress to localStorage under "pega_lms_state".
   ===================================================================== */
(function () {
  "use strict";

  var STATE_KEY = "pega_lms_state";
  var REGISTRY_URL = "data/registry.json";
  // Cache-buster so newly-added tracks/modules always load (avoids stale browser cache).
  function nocache(url) { return url + (url.indexOf("?") < 0 ? "?" : "&") + "v=" + Date.now(); }

  var registry = null;       // parsed registry.json
  var activeTrackId = null;  // e.g. "PBA"
  var moduleCache = {};      // moduleId -> parsed JSON
  var pendingInteractives = []; // HTML payloads for sandboxed iframes, set as srcdoc after inject

  /* ============ State (localStorage) ============ */
  function loadState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt state */ }
    return { userProgress: {} };
  }
  function saveState(state) {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { }
  }
  function trackState(trackId) {
    var s = loadState();
    if (!s.userProgress) s.userProgress = {};
    if (!s.userProgress[trackId]) {
      s.userProgress[trackId] = { completedModules: [], quizRecords: {} };
    }
    return s;
  }
  function isModuleComplete(trackId, moduleId) {
    var s = loadState();
    var tp = s.userProgress && s.userProgress[trackId];
    return !!(tp && tp.completedModules && tp.completedModules.indexOf(moduleId) >= 0);
  }
  function markModuleComplete(trackId, moduleId) {
    var s = trackState(trackId);
    var cm = s.userProgress[trackId].completedModules;
    if (cm.indexOf(moduleId) < 0) cm.push(moduleId);
    saveState(s);
  }
  function recordQuiz(trackId, moduleId, scorePercent) {
    var s = trackState(trackId);
    var recs = s.userProgress[trackId].quizRecords;
    var prev = recs[moduleId] || { highScore: 0, attempts: 0, lastAttempted: null, scoreHistory: [] };
    var history = (prev.scoreHistory || []).slice();
    history.push(scorePercent);
    if (history.length > 5) history = history.slice(history.length - 5);
    recs[moduleId] = {
      highScore: Math.max(prev.highScore || 0, scorePercent),
      attempts: (prev.attempts || 0) + 1,
      lastAttempted: new Date().toISOString(),
      scoreHistory: history
    };
    // A score of 70%+ marks the module complete (PCBA-style pass threshold).
    if (scorePercent >= 70) markModuleComplete(trackId, moduleId);
    saveState(s);
  }
  function quizRecord(trackId, moduleId) {
    var s = loadState();
    var tp = s.userProgress && s.userProgress[trackId];
    return (tp && tp.quizRecords && tp.quizRecords[moduleId]) || null;
  }

  /* ============ Helpers ============ */
  function getTrack(trackId) {
    if (!registry) return null;
    return registry.tracks.filter(function (t) { return t.trackId === trackId; })[0] || null;
  }
  function getModuleMeta(trackId, moduleId) {
    var t = getTrack(trackId);
    if (!t) return null;
    return t.modules.filter(function (m) { return m.id === moduleId; })[0] || null;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
  // Re-push theme to live interactive iframes whenever the app theme toggles.
  function watchThemeForInteractives() {
    if (!window.MutationObserver) return;
    new MutationObserver(function () {
      var theme = currentTheme();
      document.querySelectorAll("iframe.pa-interactive").forEach(function (frame) {
        try { frame.contentWindow.postMessage({ type: "pa-theme", theme: theme }, "*"); } catch (e) { }
      });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ============ Sidebar ============ */
  function renderSidebar() {
    var track = getTrack(activeTrackId);
    // Track switcher logic now handled by <pega-track-switcher>
    // Just sync the active track state
    var switcher = document.querySelector("pega-track-switcher");
    if (switcher && switcher.activeTrackId !== activeTrackId) {
      switcher.activeTrackId = activeTrackId;
      if (typeof switcher.render === 'function') switcher.render();
    }

    // Progress mini-bar
    var totalReady = track.modules.filter(function (m) { return m.ready !== false; }).length;
    var doneCount = track.modules.filter(function (m) { return isModuleComplete(activeTrackId, m.id); }).length;
    var pct = totalReady ? Math.round(doneCount / track.modules.length * 100) : 0;
    document.getElementById("paProgFill").style.width = pct + "%";
    document.getElementById("paProgLabel").textContent =
      doneCount + " of " + track.modules.length + " modules complete (" + pct + "%)";

    // Module list
    var hash = parseHash();
    var ul = document.getElementById("paModList");
    ul.innerHTML = track.modules.map(function (m, i) {
      var done = isModuleComplete(activeTrackId, m.id);
      var active = hash.moduleId === m.id;
      var soon = m.ready === false;
      return (
        '<li><a href="#' + activeTrackId + "/" + m.id + '"' +
        ' class="' + (active ? "active " : "") + (done ? "done" : "") + '">' +
        '<span class="mnum">' + (done ? "✓" : (i + 1)) + "</span>" +
        '<span class="mname">' + esc(m.name) + "</span>" +
        (soon ? '<span class="pa-badge-soon">soon</span>' : (done ? '<span class="mtick">✓</span>' : "")) +
        "</a></li>"
      );
    }).join("");
  }

  /* ============ Router ============ */
  function parseHash() {
    var h = (location.hash || "").replace(/^#/, "");
    var parts = h.split("/").filter(Boolean);
    if (parts.length >= 2) return { trackId: parts[0], moduleId: parts[1] };
    if (parts.length === 1) return { trackId: parts[0], moduleId: null };
    return { trackId: null, moduleId: null };
  }

  function route() {
    var hash = parseHash();

    // SPA Shell Guard: Yield control if the route belongs to the App Shell
    if (hash.trackId === 'mock' || hash.trackId === 'review') {
      return;
    }

    if (hash.trackId && getTrack(hash.trackId)) activeTrackId = hash.trackId;
    renderSidebar();
    closeSidebarMobile();

    if (hash.moduleId) {
      var meta = getModuleMeta(activeTrackId, hash.moduleId);
      if (!meta) { renderHome(); return; }
      if (meta.ready === false) { renderComingSoon(meta); return; }
      loadModule(meta);
    } else {
      renderHome();
    }
  }

  /* ============ Home / Dashboard ============ */
  function buildScoreTrend(history) {
    if (!history || history.length < 2) return "";
    return '<span class="cspark">' + history.map(function (s) { return s + "%"; }).join(" → ") + "</span>";
  }

  function buildWeakAreaPanel(track) {
    var attempted = [];
    track.modules.forEach(function (m, i) {
      var rec = quizRecord(activeTrackId, m.id);
      if (rec && rec.attempts > 0) {
        attempted.push({ idx: i, m: m, rec: rec });
      }
    });
    if (!attempted.length) return "";

    // Sort by highScore ascending, take bottom 5
    var weak = attempted.slice().sort(function (a, b) { return a.rec.highScore - b.rec.highScore; }).slice(0, 5);

    var rows = weak.map(function (entry) {
      var pct = entry.rec.highScore;
      var barColor = pct >= 70 ? "var(--pa-ok)" : pct >= 50 ? "var(--pa-brand)" : "var(--pa-err)";
      return (
        '<div class="pa-weak-row" data-go="#' + activeTrackId + "/" + entry.m.id + '">' +
        '<div class="pa-weak-info">' +
        '<span class="pa-weak-num">M' + (entry.idx + 1) + "</span>" +
        '<span class="pa-weak-name">' + esc(entry.m.name) + "</span>" +
        "</div>" +
        '<div class="pa-weak-bar-wrap">' +
        '<div class="pa-weak-bar" style="width:' + pct + '%;background:' + barColor + '"></div>' +
        '</div>' +
        '<span class="pa-weak-pct">' + pct + "%</span>" +
        "</div>"
      );
    }).join("");

    return (
      '<div class="pa-weak-panel">' +
      '<div class="pa-weak-head">📌 Focus Areas <span class="pa-weak-sub">lowest quiz scores</span></div>' +
      rows +
      "</div>"
    );
  }

  function renderHome() {
    var track = getTrack(activeTrackId);
    setCrumbs(track.trackName, null);
    var cards = track.modules.map(function (m, i) {
      var done = isModuleComplete(activeTrackId, m.id);
      var rec = quizRecord(activeTrackId, m.id);
      var soon = m.ready === false;
      var metaText = soon ? "Coming soon" : (rec ? ("Best: " + rec.highScore + "% · " + rec.attempts + " attempt(s)") : "Not started");
      var trend = rec ? buildScoreTrend(rec.scoreHistory) : "";
      return (
        '<div class="pa-card" data-go="#' + activeTrackId + "/" + m.id + '">' +
        '<div class="cnum">Module ' + (i + 1) + (soon ? " · 🔒" : "") + "</div>" +
        "<h4>" + esc(m.name) + "</h4>" +
        '<div class="cmeta"><span>' + metaText + "</span>" +
        trend +
        (done ? '<span class="cdone">✓ Done</span>' : "") + "</div>" +
        "</div>"
      );
    }).join("");

    var weakPanel = buildWeakAreaPanel(track);

    var c = document.getElementById("paContent");
    c.innerHTML =
      '<div class="pa-hero">' +
      "<h2>" + esc(track.trackName) + "</h2>" +
      "<p>Offline study guide &amp; exam simulator. Select a module to begin. Progress is saved automatically in your browser.</p>" +
      "</div>" +
      weakPanel +
      '<div class="pa-cards">' + cards + "</div>" +
      '<div class="pa-footer">PegaAcademy LMS · data-driven · ' + track.modules.length + " modules</div>";

    c.querySelectorAll(".pa-card, .pa-weak-row").forEach(function (el) {
      el.addEventListener("click", function () { location.hash = el.getAttribute("data-go"); });
    });
    window.scrollTo({ top: 0 });
  }

  function renderComingSoon(meta) {
    setCrumbs(getTrack(activeTrackId).trackName, meta.name);
    document.getElementById("paContent").innerHTML =
      '<h2 class="pa-h2">' + esc(meta.name) + "</h2>" +
      '<div class="pa-empty">📦 This module is queued for the next content batch.<br>' +
      "Its deep-dive study guide and quiz are being authored.</div>";
    window.scrollTo({ top: 0 });
  }

  /* ============ Module loader ============ */
  function loadModule(meta) {
    setCrumbs(getTrack(activeTrackId).trackName, meta.name);
    var c = document.getElementById("paContent");
    c.innerHTML = '<div class="pa-empty">Loading module…</div>';

    var done = function (data) { moduleCache[meta.id] = data; renderModule(meta, data); };

    if (moduleCache[meta.id]) { done(moduleCache[meta.id]); return; }

    fetch(nocache(meta.file))
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(done)
      .catch(function (err) {
        c.innerHTML =
          '<h2 class="pa-h2">' + esc(meta.name) + "</h2>" +
          '<div class="pa-empty">⚠️ Could not load <code>' + esc(meta.file) + "</code>.<br>" +
          "If you opened <code>index.html</code> directly from disk, your browser blocks local <code>fetch()</code>. " +
          "Run a local server instead, e.g.:<br><br><code>python3 -m http.server</code><br>" +
          "then open <code>http://localhost:8000</code>.<br><br><small>" + esc(err.message) + "</small></div>";
      });
  }

  /* ============ Module view injector ============ */
  function renderModule(meta, data) {
    var c = document.getElementById("paContent");
    var moduleTitle = data.moduleTitle || meta.name;
    var moduleTitleHtml = data.moduleUrl
      ? '<h2 class="pa-h2">' + esc(moduleTitle) +
        ' <a class="pa-module-ext" href="' + esc(data.moduleUrl) + '" target="_blank" rel="noopener" title="View on Pega Academy">↗</a></h2>'
      : '<h2 class="pa-h2">' + esc(moduleTitle) + "</h2>";
    c.innerHTML =
      moduleTitleHtml +
      '<div class="pa-tabs">' +
      '<button data-v="guide" class="active">📘 Study Guide</button>' +
      '<button data-v="pitfalls">⚠️ Exam Pitfalls</button>' +
      '<button data-v="quiz">🧠 Practice Quiz</button>' +
      '<button data-v="recap">⚡ Quick Recap</button>' +
      '<span class="pa-quiz-pill" hidden>' +
      '<span class="pqp-track"><span class="pqp-fill"></span></span>' +
      '<b class="pqp-g">0</b>/<span class="pqp-t">?</span> ✓<b class="pqp-s">0</b>' +
      '</span>' +
      "</div>" +
      '<section class="pa-view active" id="v-guide">' + buildStudyGuide(data) + "</section>" +
      '<section class="pa-view" id="v-pitfalls">' + buildPitfalls(data) + "</section>" +
      '<section class="pa-view" id="v-quiz"><div id="paQuizMount"></div></section>' +
      '<section class="pa-view" id="v-recap">' + buildRecap(data) + "</section>";

    // Hydrate sandboxed interactive iframes (srcdoc set via JS to avoid attribute escaping).
    // The active theme is injected via the __THEME__ token and re-pushed via postMessage on load.
    var theme = currentTheme();
    c.querySelectorAll("iframe.pa-interactive").forEach(function (frame) {
      var idx = parseInt(frame.getAttribute("data-int"), 10);
      if (isNaN(idx) || pendingInteractives[idx] == null) return;
      frame.srcdoc = String(pendingInteractives[idx]).replace(/__THEME__/g, theme);
      frame.addEventListener("load", function () {
        try { frame.contentWindow.postMessage({ type: "pa-theme", theme: currentTheme() }, "*"); } catch (e) { }
      });
    });

    // Tab switching
    var tabs = c.querySelectorAll(".pa-tabs button");
    var views = c.querySelectorAll(".pa-view");
    var quizMounted = false;
    var pill = c.querySelector(".pa-quiz-pill");
    tabs.forEach(function (b) {
      b.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        views.forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        document.getElementById("v-" + b.getAttribute("data-v")).classList.add("active");
        pill.hidden = b.getAttribute("data-v") !== "quiz";
        if (b.getAttribute("data-v") === "quiz" && !quizMounted) {
          mountQuiz(meta, data, pill);
          quizMounted = true;
        }
      });
    });
    window.scrollTo({ top: 0 });

    // Activate scroll-aware breadcrumb: shows track only when H2 is visible,
    // expands to "Track / Module" when user has scrolled past the title.
    activateCrumbObserver(moduleTitle);
  }

  function buildObjectives(data) {
    var obj = data.learningObjectives || [];
    if (!obj.length) return "";
    var topicsHtml = "";
    if (data.topics && data.topics.length) {
      topicsHtml =
        '<div class="pa-topics">' +
        '<div class="pa-topics-head">📚 Pega Academy Topics</div>' +
        '<div class="pa-topics-links">' +
        data.topics.map(function (t) {
          return '<a class="pa-topic-link" href="' + esc(t.url) + '" target="_blank" rel="noopener">' +
            esc(t.title) +
            (t.duration ? ' <span class="pa-topic-dur">· ' + esc(t.duration) + "</span>" : "") +
            " ↗</a>";
        }).join("") +
        (data.moduleQuizUrl
          ? '<a class="pa-topic-link pa-quiz-ext" href="' + esc(data.moduleQuizUrl) + '" target="_blank" rel="noopener">🧪 Module Quiz ↗</a>'
          : "") +
        "</div></div>";
    }
    return (
      '<div class="pa-objectives"><div class="pa-obj-head">🎯 By the end of this module, you can:</div>' +
      "<ul>" + obj.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +
      (data.estTime ? '<div class="pa-obj-meta">⏱ ' + esc(data.estTime) + "</div>" : "") +
      topicsHtml +
      "</div>"
    );
  }

  function buildStudyGuide(data) {
    pendingInteractives = []; // reset per render; iframes are hydrated in renderModule
    var sg = data.studyGuide || [];
    var header = buildObjectives(data);
    if (!sg.length) return header || '<div class="pa-empty">No study guide content.</div>';
    return header + sg.map(function (sec) {
      var inner = "";
      (sec.elements || []).forEach(function (el) {
        if (el.type === "concept") {
          inner +=
            '<div class="pa-concept"><span class="pa-tag">Core Concept</span>' +
            '<span class="term">' + esc(el.term) + "</span>" +
            '<span class="desc">' + esc(el.description) + "</span></div>";
        } else if (el.type === "analogy") {
          inner +=
            '<div class="pa-analogy"><span class="pa-tag">Analogy</span>' +
            esc(el.text) + "</div>";
        } else if (el.type === "text") {
          inner += "<p>" + esc(el.text) + "</p>";
        } else if (el.type === "diagram") {
          // Authored, trusted inline SVG — injected raw so it renders as a figure.
          inner +=
            '<figure class="pa-figure">' + (el.svg || "") +
            (el.caption ? "<figcaption>" + esc(el.caption) + "</figcaption>" : "") +
            "</figure>";
        } else if (el.type === "interactive") {
          // Self-contained HTML exercise rendered in a sandboxed iframe.
          var idx = pendingInteractives.push(el.html || "") - 1;
          inner +=
            '<div class="pa-interactive-wrap">' +
            (el.title ? '<div class="pa-int-title">🧩 ' + esc(el.title) + "</div>" : "") +
            '<iframe class="pa-interactive" data-int="' + idx + '" ' +
            'sandbox="allow-scripts" loading="lazy" ' +
            'style="height:' + (parseInt(el.height, 10) || 360) + 'px"' +
            ' title="' + esc(el.title || "Interactive exercise") + '"></iframe>' +
            "</div>";
        }
      });
      if (sec.bulletPoints && sec.bulletPoints.length) {
        inner += '<ul class="pa-bullets">' +
          sec.bulletPoints.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>";
      }
      return '<div class="pa-section"><h3>' + esc(sec.sectionTitle) + "</h3>" + inner + "</div>";
    }).join("");
  }

  function buildPitfalls(data) {
    var ps = data.examPitfalls || [];
    if (!ps.length) return '<div class="pa-empty">No exam pitfalls listed.</div>';
    return ps.map(function (p) {
      return (
        '<div class="pa-pitfall">' +
        "<h4><span class=\"warn\">⚠️</span> " + esc(p.title) + "</h4>" +
        '<p class="trap">' + esc(p.trapDescription) + "</p>" +
        '<div class="bp"><b>Best practice:</b> ' + esc(p.bestPractice) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function buildRecap(data) {
    var r = data.quickRecap || [];
    if (!r.length) return '<div class="pa-empty">No quick recap available.</div>';
    return '<table class="pa-recap"><tbody>' +
      r.map(function (row) {
        return "<tr><th>" + esc(row.key) + "</th><td>" + esc(row.value) + "</td></tr>";
      }).join("") + "</tbody></table>";
  }

  function mountQuiz(meta, data, pill) {
    var mount = document.getElementById("paQuizMount");
    var questions = data.practiceQuiz || [];
    if (!questions.length) { mount.innerHTML = '<div class="pa-empty">No quiz for this module.</div>'; return; }
    PegaQuiz.render(mount, questions, function (pct) {
      recordQuiz(activeTrackId, meta.id, pct);
      renderSidebar(); // reflect completion immediately
    }, pill);
  }

  /* ============ Chrome ============ */
  function setCrumbs(track, module) {
    var el = document.getElementById("paCrumbs");
    // Store context for the scroll-aware observer
    el._paTrack  = track;
    el._paModule = module || null;
    el.title = module ? track + " / " + module : track;
    // On initial call always show track only.
    // activateCrumbObserver() will expand to "Track / Module" once H2 scrolls away.
    el.innerHTML = "<b>" + esc(track) + "</b>";
    // Tear down any previous observer so stale modules don't pollute new navigation.
    if (window._paCrumbObs) { window._paCrumbObs.disconnect(); window._paCrumbObs = null; }
  }

  /**
   * Scroll-aware breadcrumb using IntersectionObserver.
   * - H2 visible  → breadcrumb shows only track name  (no duplication with the on-screen title)
   * - H2 scrolled away → breadcrumb expands to "Track / Module" (provides context)
   */
  function activateCrumbObserver(moduleName) {
    if (!window.IntersectionObserver || !moduleName) return;
    var h2 = document.querySelector('.pa-h2');
    var el = document.getElementById('paCrumbs');
    if (!h2 || !el) return;
    var trackName = el._paTrack;

    window._paCrumbObs = new IntersectionObserver(function(entries) {
      var visible = entries[0].isIntersecting;
      if (visible) {
        // Title on screen — breadcrumb shows only track (clean, no duplicate)
        el.innerHTML = "<b>" + esc(trackName) + "</b>";
      } else {
        // Title scrolled away — breadcrumb provides full navigation context
        el.innerHTML = esc(trackName) + " / <b>" + esc(moduleName) + "</b>";
      }
    }, {
      threshold: 0,
      rootMargin: "-60px 0px 0px 0px"  // offset for the sticky topbar height
    });

    window._paCrumbObs.observe(h2);
  }
  function closeSidebarMobile() {
    document.getElementById("paSidebar").classList.remove("open");
  }

  /* ============ Boot ============ */
  function boot() {
    window.addEventListener("pega-track-changed", function (e) {
      activeTrackId = e.detail;
      renderSidebar();
      var hash = location.hash;
      if (hash.indexOf('#mock') === 0) {
        var contentEl = document.getElementById('paContent');
        if (contentEl) contentEl.innerHTML = '<pega-mock-view></pega-mock-view>';
      } else if (hash.indexOf('#review') === 0) {
        var contentEl = document.getElementById('paContent');
        if (contentEl) contentEl.innerHTML = '<pega-review-view></pega-review-view>';
      }
    });
    document.getElementById("paMenuToggle").addEventListener("click", function () {
      document.getElementById("paSidebar").classList.toggle("open");
    });
    window.addEventListener("hashchange", route);
    watchThemeForInteractives();

    fetch(nocache(REGISTRY_URL))
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        registry = data;
        activeTrackId = (registry.tracks[0] || {}).trackId;
        route();
      })
      .catch(function (err) {
        document.getElementById("paContent").innerHTML =
          '<div class="pa-empty">⚠️ Could not load <code>data/registry.json</code>.<br>' +
          "Browsers block local <code>fetch()</code> from <code>file://</code>. Run a local server:<br><br>" +
          "<code>python3 -m http.server</code><br>then open <code>http://localhost:8000</code><br><br>" +
          "<small>" + esc(err.message) + "</small></div>";
      });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();

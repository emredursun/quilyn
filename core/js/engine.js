/* Learning dashboard and module rendering; routes are owned by app-shell.js. */
(function () {
  "use strict";

  var STATE_KEY = "pega_lms_state";
  var REGISTRY_URL = "data/registry.json";
  // Cache-buster so newly-added tracks/modules always load (avoids stale browser cache).
  function nocache(url) { return url + (url.indexOf("?") < 0 ? "?" : "&") + "v=" + Date.now(); }

  var registry = null;       // parsed registry.json
  var activeTrackId = null;  // e.g. "PBA"
  var moduleCache = {};      // moduleId -> parsed JSON
  var moduleRequest = 0;     // invalidates responses from previous routes
  var pendingInteractives = []; // HTML payloads for sandboxed iframes, set as srcdoc after inject

  /* State (localStorage) */
  function loadState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (window.QuilynProgress) return window.QuilynProgress.read(STATE_KEY, { userProgress: {} });
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt state */ }
    return { userProgress: {} };
  }
  function saveState(state) {
    if (window.QuilynProgress) return window.QuilynProgress.write(STATE_KEY, state);
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
    if (scorePercent >= 70) {
      var completed = s.userProgress[trackId].completedModules;
      if (completed.indexOf(moduleId) < 0) completed.push(moduleId);
    }
    saveState(s);
    if (window.QuilynProgress) window.QuilynProgress.activity("quiz", trackId, moduleId);
  }
  function quizRecord(trackId, moduleId) {
    var s = loadState();
    var tp = s.userProgress && s.userProgress[trackId];
    return (tp && tp.quizRecords && tp.quizRecords[moduleId]) || null;
  }

  /* Helpers */
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
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // Like esc() but wraps bare https:// URLs in clickable anchor tags.
  function linkify(s) {
    var safe = String(s == null ? "" : s);
    var urlRe = /(https?:\/\/[^\s<>"']+)/g;
    var parts = safe.split(urlRe);
    return parts.map(function (part, i) {
      if (i % 2 === 1) {
        var escaped = esc(part);
        return '<a href="' + escaped + '" target="_blank" rel="noopener noreferrer">' + escaped + "</a>";
      }
      return esc(part);
    }).join("");
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

  /* Sidebar */
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
    var pct = totalReady ? Math.round(doneCount / totalReady * 100) : 0;
    document.getElementById("paProgFill").style.width = pct + "%";
    document.getElementById("paProgLabel").textContent =
      doneCount + " of " + totalReady + " available modules complete (" + pct + "%)";

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

  /* Router */
  function parseHash() {
    var h = (location.hash || "").replace(/^#/, "");
    var parts = h.split("/").filter(Boolean);
    if (parts.length >= 2) return { trackId: parts[0], moduleId: parts[1], tab: parts[2] || null, section: parts[3] || null };
    if (parts.length === 1) return { trackId: parts[0], moduleId: null };
    return { trackId: null, moduleId: null };
  }

  function route() {
    if (!registry) return;
    if(window.QuilynStudy)window.QuilynStudy.leaveLesson();
    moduleRequest++;
    if (window.PegaQuiz) window.PegaQuiz.unmount();
    if (window._paCrumbObs) { window._paCrumbObs.disconnect(); window._paCrumbObs = null; }
    var hash = parseHash();
    document.querySelectorAll('.pa-study-nav a').forEach(function(a){var current=a.getAttribute('href')==='#'+hash.trackId+(hash.moduleId?'/'+hash.moduleId:'');if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});

    if (hash.trackId === 'library' || hash.trackId === 'updates') {
      var libraryRequest=moduleRequest;
      if(window.QuilynShell)window.QuilynShell.renderMode('lms');
      activeTrackId=window.PegaStore.state.activeTrack;renderSidebar();closeSidebarMobile();
      var libraryContent=document.getElementById('paContent');libraryContent.textContent='Loading library…';
      setCrumbs(hash.trackId==='updates'?'What’s new':'Learning library',null);
      document.title=(hash.trackId==='updates'?'What’s new':'Learning library')+' — Quilyn';
      window.QuilynRuntime.library().then(function(api){if(libraryRequest===moduleRequest)return api.mount(libraryContent,activeTrackId,hash.trackId);}).catch(function(e){if(libraryRequest===moduleRequest)libraryContent.textContent=e.message;});return;
    }
    if (hash.trackId === 'history' || hash.trackId === 'mistakes' || hash.trackId === 'plan') {
      var request=moduleRequest;
      if(window.QuilynShell) window.QuilynShell.renderMode('lms');
      activeTrackId=window.PegaStore.state.activeTrack;
      renderSidebar();closeSidebarMobile();
      var content=document.getElementById('paContent');content.textContent='Loading learning records…';
      window.QuilynRuntime.personalization().then(function(study){
        if(request!==moduleRequest)return;
        var title=hash.trackId==='plan'?'Study plan':hash.trackId==='history'?'Attempt history':'Mistakes notebook';
        setCrumbs(title,null);
        document.title=title+' — Quilyn';
        if(hash.trackId==='plan')study.mount(content,getTrack(activeTrackId),hash.moduleId);
        else window.QuilynJournal.mount(content,activeTrackId,hash.trackId);
      }).catch(function(e){if(request===moduleRequest)content.textContent=e.message;});return;
    }
    if (hash.trackId === 'mock' || hash.trackId === 'review') {
      closeSidebarMobile();
      if (window.QuilynShell) window.QuilynShell.renderMode(hash.trackId);
      return;
    }
    if (window.QuilynShell) window.QuilynShell.renderMode('lms');

    if (window.PegaStore && getTrack(window.PegaStore.state.activeTrack)) activeTrackId = window.PegaStore.state.activeTrack;
    if (hash.trackId && getTrack(hash.trackId)) {
      activeTrackId = hash.trackId;
    }
    // Home and deep links must agree with the track used by mock/review views.
    window.QuilynActiveTrackId = activeTrackId;
    if (window.PegaStore && window.PegaStore.state.activeTrack !== activeTrackId)
      window.PegaStore.state.activeTrack = activeTrackId;
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

  /* Home / Dashboard */
  function buildScoreTrend(history) {
    if (!history || history.length < 2) return "";
    return '<span class="cspark">' + history.map(function (s) { return s + "%"; }).join(" → ") + "</span>";
  }

  function recentQuizScore(rec) {
    var values = (rec.scoreHistory || []).slice(-3);
    return values.length ? Math.round(values.reduce(function(a,b) { return a+b; },0) / values.length) : rec.highScore;
  }
  function buildWeakAreaPanel(track) {
    var attempted = [];
    track.modules.forEach(function (m, i) {
      var rec = quizRecord(activeTrackId, m.id);
      if (m.ready !== false && rec && rec.attempts > 0 && recentQuizScore(rec) < 70) {
        attempted.push({ idx: i, m: m, rec: rec });
      }
    });
    if (!attempted.length) return "";

    // Lowest recent averages, up to five modules.
    var weak = attempted.slice().sort(function (a, b) { return recentQuizScore(a.rec) - recentQuizScore(b.rec); }).slice(0, 5);

    var rows = weak.map(function (entry) {
      var pct = recentQuizScore(entry.rec);
      var barColor = pct >= 70 ? "var(--pa-ok)" : pct >= 50 ? "var(--pa-brand)" : "var(--pa-bad)";
      return (
        '<a class="pa-weak-row" href="#' + activeTrackId + "/" + entry.m.id + '">' +
        '<div class="pa-weak-info">' +
        '<span class="pa-weak-num">M' + (entry.idx + 1) + "</span>" +
        '<span class="pa-weak-name">' + esc(entry.m.name) + "</span>" +
        "</div>" +
        '<div class="pa-weak-bar-wrap">' +
        '<div class="pa-weak-bar" style="width:' + pct + '%;background:' + barColor + '"></div>' +
        '</div>' +
        '<span class="pa-weak-pct">' + pct + "%</span>" +
        "</a>"
      );
    }).join("");

    return (
      '<div class="pa-weak-panel">' +
      '<div class="pa-weak-head">📌 Focus Areas <span class="pa-weak-sub">recent quiz averages</span></div>' +
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
        '<a class="pa-card" href="#' + activeTrackId + "/" + m.id + '">' +
        '<div class="cnum">Module ' + (i + 1) + (soon ? " · 🔒" : "") + "</div>" +
        "<h3>" + esc(m.name) + "</h3>" +
        '<div class="cmeta"><span>' + metaText + "</span>" +
        trend +
        (done ? '<span class="cdone">✓ Done</span>' : "") + "</div>" +
        "</a>"
      );
    }).join("");

    var weakPanel = buildWeakAreaPanel(track);
    var ready = track.modules.filter(function(m) { return m.ready !== false; });
    var done = ready.filter(function(m) { return isModuleComplete(activeTrackId, m.id); }).length;
    var events = window.QuilynProgress.read('quilyn_activity', {version:1,events:[]}).events;
    var last = events.slice().reverse().find(function(e) { return e.track === activeTrackId && e.kind === 'visit' && ready.some(function(m) { return m.id === e.subject; }); });
    var completedIds = ready.filter(function(m) { return isModuleComplete(activeTrackId,m.id); }).map(function(m) { return m.id; });
    var next = selectNextModule(ready, completedIds, last && last.subject);
    var ts = window.PegaStore.state.tracks[activeTrackId] || {};
    var cardsDue = (ts.srs && ts.srs.cards) || {};
    var day = window.QuilynProgress.localDay(new Date());
    var due = Object.keys(cardsDue).filter(function(k) { return cardsDue[k].dueDate <= day; }).length;
    var mockScores = ts.mock || {};
    var scores = Object.values(mockScores);
    var c = document.getElementById('paContent'), request = moduleRequest;
    c.textContent = 'Loading your learning workspace…';
    window.QuilynRuntime.home().then(function(home) {
      if(request !== moduleRequest)return;
      c.innerHTML = home.render({track:track,next:next,returning:!!last,resuming:!!(last&&next&&next.id===last.subject),done:done,total:ready.length,due:due,scores:scores}) +
        weakPanel + '<h2 class="quilyn-section-title">All modules</h2><div class="pa-cards">' + cards + '</div>' +
        '<div class="pa-footer">Quilyn · ' + track.modules.length + ' modules</div>';
      window.scrollTo({top:0});c.focus({preventScroll:true});
    }).catch(function(e){if(request === moduleRequest)c.textContent=e.message;});
  }

  function selectNextModule(ready, completed, lastId) {
    return ready.find(function(m) { return m.id === lastId && !completed.includes(m.id); }) ||
      ready.find(function(m) { return !completed.includes(m.id); }) || ready[0];
  }

  function renderComingSoon(meta) {
    setCrumbs(getTrack(activeTrackId).trackName, meta.name);
    document.getElementById("paContent").innerHTML =
      '<h2 class="pa-h2">' + esc(meta.name) + "</h2>" +
      '<div class="pa-empty">📦 This module is queued for the next content batch.<br>' +
      "Its deep-dive study guide and quiz are being authored.</div>";
    window.scrollTo({ top: 0 });
    document.getElementById("paContent").focus({preventScroll:true});
  }

  /* Module loader */
  function loadModule(meta) {
    var request = moduleRequest;
    setCrumbs(getTrack(activeTrackId).trackName, meta.name);
    var c = document.getElementById("paContent");
    c.innerHTML = '<div class="pa-empty">Loading module…</div>';

    var done = function (data) {
      moduleCache[meta.id] = data;
      if (request === moduleRequest) renderModule(meta, data);
    };

    Promise.all([moduleCache[meta.id] ? Promise.resolve(moduleCache[meta.id]) : window.QuilynRuntime.json(meta.file), window.QuilynRuntime.personalization()])
      .then(function(results){done(results[0]);})
      .catch(function (err) {
        if (request !== moduleRequest) return;
        c.innerHTML = '<h2 class="pa-h2">' + esc(meta.name) + '</h2><div class="pa-empty" role="alert">This module is unavailable. Connect to the internet or download this learning track in Settings for offline use.<br><button class="pa-btn" id="quilyn-retry-module">Try again</button></div>';
        c.querySelector('#quilyn-retry-module').onclick = function() { loadModule(meta); };

      });
  }

  /* Module view injector */
  function renderModule(meta, data) {
    var c = document.getElementById("paContent");
    var moduleTitle = data.moduleTitle || meta.name;
    window.QuilynProgress.activity('visit', activeTrackId, meta.id);
    document.title = moduleTitle + ' — Quilyn';
    var academyLabel = (data.moduleId && /^(TAS|TAPI|TDS|AE|TMOB|TESTIM)/.test(data.moduleId)) ? "Tricentis Academy" : "Pega Academy";
    var moduleTitleHtml = data.moduleUrl
      ? '<h2 class="pa-h2">' + esc(moduleTitle) +
        ' <a class="pa-module-ext" href="' + esc(data.moduleUrl) + '" target="_blank" rel="noopener" title="View on ' + academyLabel + '">' + academyLabel + ' ↗</a></h2>'
      : '<h2 class="pa-h2">' + esc(moduleTitle) + "</h2>";
    c.innerHTML =
      moduleTitleHtml +
      '<p class="quilyn-provenance">Independent study notes · ' + (data.platformVersion ? 'Version ' + esc(data.platformVersion) : 'Version not documented') + ' · ' +
      (data.sourceReviewedOn ? 'Reviewed ' + esc(data.sourceReviewedOn) : 'Review date not documented') + ' · Module mastery: 70% quiz score</p>' +
      '<p class="quilyn-provenance"><a href="#library">Browse concepts</a> · <a target="_blank" rel="noopener noreferrer" href="https://github.com/emredursun/quilyn/issues/new?title='+encodeURIComponent('Content feedback: '+activeTrackId+'/'+meta.id)+'&amp;body='+encodeURIComponent('Lesson: https://emredursun.github.io/quilyn/#'+activeTrackId+'/'+meta.id+'\n\nDescribe the issue and include an official reference if available.\nDo not include personal progress or private data.')+'">Report a content issue ↗</a></p>' +
      '<div class="sp-section-bar"><div class="pa-tabs">' +
      '<button data-v="guide" class="active">📘 Study Guide</button>' +
      '<button data-v="pitfalls">⚠️ Exam Pitfalls</button>' +
      '<button data-v="quiz">🧠 Practice Quiz</button>' +
      '<button data-v="recap">⚡ Quick Recap</button>' +
      "</div></div>" +
      '<section class="pa-view active" id="v-guide">' + buildStudyGuide(data) + "</section>" +
      '<section class="pa-view" id="v-pitfalls">' + buildPitfalls(data) + "</section>" +
      '<section class="pa-view" id="v-quiz">' +
      '<span class="pa-quiz-pill" hidden>' +
      '<span class="pqp-track"><span class="pqp-fill"></span></span>' +
      '<b class="pqp-g">0</b>/<span class="pqp-t">?</span> ✓<b class="pqp-s">0</b>' +
      '</span>' +
      '<div id="paQuizMount"></div></section>' +
      '<section class="pa-view" id="v-recap">' + buildRecap(data) + "</section>";

    // Hydrate sandboxed interactive iframes (srcdoc set via JS to avoid attribute escaping).
    // The active theme is injected via the __THEME__ token and re-pushed via postMessage on load.
    var theme = currentTheme();
    c.querySelectorAll("iframe.pa-interactive").forEach(function (frame) {
      var idx = parseInt(frame.getAttribute("data-int"), 10);
      if (isNaN(idx) || pendingInteractives[idx] == null) return;
      window.QuilynRuntime.interactive(String(pendingInteractives[idx]),theme).then(function(html) {
        if (frame.isConnected) frame.srcdoc = html;
      }).catch(function() { frame.title = 'Exercise unavailable. Connect and reload this module.'; });
      frame.addEventListener("load", function () {
        try { frame.contentWindow.postMessage({ type: "pa-theme", theme: currentTheme() }, "*"); } catch (e) { }
      });
    });

    // Hydrate PDF libraries: clicking a list item swaps the shared viewer/toolbar.
    c.querySelectorAll(".pa-pdf-lib").forEach(function (lib) {
      var items = lib.querySelectorAll(".pa-pdf-lib-item");
      var frame = lib.querySelector(".pa-pdf-frame");
      var dlBtn = lib.querySelector(".pa-pdf-btn:not(.pa-pdf-btn-ghost)");
      var openBtn = lib.querySelector(".pa-pdf-btn-ghost");
      var titleEl = lib.querySelector(".pa-pdf-lib-title-text");
      var capEl = lib.querySelector(".pa-pdf-lib-caption");
      items.forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (btn.classList.contains("active")) return;
          items.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var src = btn.getAttribute("data-src");
          frame.src = src;
          dlBtn.href = src;
          dlBtn.setAttribute("download", btn.getAttribute("data-filename") || "");
          openBtn.href = src;
          titleEl.textContent = btn.getAttribute("data-title") || "";
          capEl.textContent = btn.getAttribute("data-caption") || "";
        });
      });
    });

    // Tab switching
    var tabs = c.querySelectorAll(".pa-tabs button");
    var views = c.querySelectorAll(".pa-view");
    c.querySelector('.pa-tabs').setAttribute('role', 'tablist');
    c.querySelector('.pa-tabs').setAttribute('aria-label', 'Module sections');
    tabs.forEach(function(tab, index) {
      var panel = document.getElementById('v-' + tab.dataset.v);
      tab.id = 'tab-' + tab.dataset.v; tab.setAttribute('role','tab');
      tab.setAttribute('aria-controls',panel.id); tab.setAttribute('aria-selected', String(index === 0)); tab.tabIndex = index === 0 ? 0 : -1;
      panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',tab.id); panel.hidden = index !== 0;
      tab.addEventListener('keydown', function(e) {
        var keys = ['ArrowLeft','ArrowRight','Home','End']; if (!keys.includes(e.key)) return;
        e.preventDefault(); var next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].click(); tabs[next].focus();
      });
    });
    var quizMounted = false;
    var pill = c.querySelector(".pa-quiz-pill");
    tabs.forEach(function (b) {
      b.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-selected", String(x === b)); x.tabIndex = x === b ? 0 : -1; });
        views.forEach(function (x) { x.classList.remove("active"); x.hidden = true; });
        b.classList.add("active");
        document.getElementById("v-" + b.getAttribute("data-v")).classList.add("active");
        document.getElementById("v-" + b.getAttribute("data-v")).hidden = false;
        pill.hidden = b.getAttribute("data-v") !== "quiz";
        if (b.getAttribute("data-v") === "quiz" && !quizMounted) {
          mountQuiz(meta, data, pill);
          quizMounted = true;
        }
      });
    });
    window.scrollTo({ top: 0 });
    document.getElementById("paContent").focus({preventScroll:true});

    // Activate scroll-aware breadcrumb: shows track only when H2 is visible,
    // expands to "Track / Module" when user has scrolled past the title.
    activateCrumbObserver(moduleTitle);
    if(window.QuilynStudy)window.QuilynStudy.attachLesson(c,activeTrackId,meta.id,parseHash().tab);
    var targetSection=parseHash().section;
    if(targetSection && parseHash().tab==='guide'){
      var target=Array.from(c.querySelectorAll('#v-guide [data-section-id]')).find(function(el){return el.getAttribute('data-section-id')===targetSection;});
      if(target){var heading=target.querySelector('h3');heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}
      else {var notice=document.createElement('p');notice.className='jl-meta';notice.setAttribute('role','status');notice.textContent='This lesson section is no longer available. The current study guide is shown.';c.querySelector('.pa-tabs').before(notice);}
    }
  }

  function buildObjectives(data) {
    var obj = data.learningObjectives || [];
    if (!obj.length) return "";
    var topicsAcademyLabel = (data.moduleId && /^(TAS|TAPI|TDS|AE|TMOB|TESTIM)/.test(data.moduleId)) ? "Tricentis Academy" : "Pega Academy";
    var topicsHtml = "";
    if (data.topics && data.topics.length) {
      topicsHtml =
        '<div class="pa-topics">' +
        '<div class="pa-topics-head"><svg class="i" aria-hidden="true"><use href="#i-book"/></svg> ' + topicsAcademyLabel + ' Topics</div>' +
        '<div class="pa-topics-links">' +
        data.topics.map(function (t) {
          if (!t.url) return '<span class="pa-topic-link">' + esc(t.title) + ' · HTTPS source unavailable</span>';
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
      '<div class="pa-objectives"><div class="pa-obj-head"><svg class="i" aria-hidden="true"><use href="#i-target"/></svg> By the end of this module, you can:</div>' +
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
          var cItemsHtml = "";
          if (el.items && el.items.length) {
            cItemsHtml = '<ul class="pa-concept-items">' +
              el.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
              "</ul>";
          }
          inner +=
            '<div class="pa-concept"><span class="pa-tag">Core Concept</span>' +
            '<span class="term">' + esc(el.term) + "</span>" +
            (el.description ? '<span class="desc">' + esc(el.description) + "</span>" : "") +
            cItemsHtml + "</div>";
        } else if (el.type === "analogy") {
          inner +=
            '<div class="pa-analogy"><span class="pa-tag">Analogy</span>' +
            esc(el.text) + "</div>";
        } else if (el.type === "text") {
          inner += "<p>" + esc(el.text) + "</p>";
        } else if (el.type === "steps") {
          inner +=
            '<div class="pa-steps">' +
            (el.title ? '<div class="pa-steps-title">' + esc(el.title) + "</div>" : "") +
            '<ol class="pa-steps-list">' +
            (el.items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
            "</ol></div>";
        } else if (el.type === "list") {
          inner +=
            '<div class="pa-list">' +
            (el.title ? '<div class="pa-list-title">' + esc(el.title) + "</div>" : "") +
            '<ul class="pa-list-items">' +
            (el.items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
            "</ul></div>";
        } else if (el.type === "table") {
          var tHead = el.headers ? "<thead><tr>" + el.headers.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") + "</tr></thead>" : "";
          var tBody = "<tbody>" + (el.rows || []).map(function (row) {
            return "<tr>" + row.map(function (cell) { return "<td>" + esc(cell) + "</td>"; }).join("") + "</tr>";
          }).join("") + "</tbody>";
          inner += '<div class="pa-table-wrap"><table class="pa-inline-table">' + tHead + tBody + "</table></div>";
        } else if (el.type === "note") {
          inner += '<div class="pa-note">' + linkify(el.text) + "</div>";
        } else if (el.type === "warning") {
          inner += '<div class="pa-warning">' + linkify(el.text) + "</div>";
        } else if (el.type === "links") {
          var linksHtml =
            '<div class="pa-links">' +
            (el.title ? '<div class="pa-links-title">' + esc(el.title) + "</div>" : "") +
            '<ul class="pa-links-list">' +
            (el.items || []).map(function (item) {
              return '<li><a href="' + esc(item.url) + '" target="_blank" rel="noopener noreferrer">' +
                esc(item.label) + "</a>" +
                (item.note ? '<span class="pa-links-note"> — ' + esc(item.note) + "</span>" : "") +
                "</li>";
            }).join("") +
            "</ul></div>";
          inner += linksHtml;
        } else if (el.type === "diagram") {
          // Authored, trusted inline SVG — injected raw so it renders as a figure.
          inner +=
            '<figure class="pa-figure">' + (el.svg || "") +
            (el.caption ? "<figcaption>" + esc(el.caption) + "</figcaption>" : "") +
            "</figure>";
        } else if (el.type === "pdf") {
          // Embedded PDF, rendered natively by the browser's built-in viewer.
          inner +=
            '<div class="pa-pdf-wrap">' +
            (el.title ? '<div class="pa-pdf-title">📄 ' + esc(el.title) + "</div>" : "") +
            '<div class="pa-pdf-toolbar">' +
            '<a class="pa-pdf-btn" href="' + esc(el.src) + '" download="' + esc(el.filename || "") + '">⬇ Download PDF</a>' +
            '<a class="pa-pdf-btn pa-pdf-btn-ghost" href="' + esc(el.src) + '" target="_blank" rel="noopener noreferrer">↗ Open in new tab</a>' +
            "</div>" +
            '<iframe class="pa-pdf-frame" src="' + esc(el.src) + '" ' +
            'style="height:' + (parseInt(el.height, 10) || 900) + 'px" loading="lazy" ' +
            'title="' + esc(el.title || "PDF document") + '"></iframe>' +
            (el.caption ? '<div class="pa-pdf-caption">' + esc(el.caption) + "</div>" : "") +
            "</div>";
        } else if (el.type === "pdf-library") {
          // One shared PDF viewer; clicking a list item swaps the iframe/toolbar (hydrated in renderModule).
          var libItems = el.items || [];
          var firstDoc = libItems[0] || {};
          inner +=
            '<div class="pa-pdf-lib">' +
            '<div class="pa-pdf-lib-list">' +
            libItems.map(function (it, i) {
              return '<button type="button" class="pa-pdf-lib-item' + (i === 0 ? " active" : "") + '" ' +
                'data-src="' + esc(it.src || "") + '" data-filename="' + esc(it.filename || "") + '" ' +
                'data-title="' + esc(it.title || "") + '" data-caption="' + esc(it.caption || "") + '">' +
                "📄 " + esc(it.title || "") + "</button>";
            }).join("") +
            "</div>" +
            '<div class="pa-pdf-lib-viewer">' +
            '<div class="pa-pdf-lib-title">📄 <span class="pa-pdf-lib-title-text">' + esc(firstDoc.title || "") + "</span></div>" +
            '<div class="pa-pdf-toolbar">' +
            '<a class="pa-pdf-btn" href="' + esc(firstDoc.src || "") + '" download="' + esc(firstDoc.filename || "") + '">⬇ Download PDF</a>' +
            '<a class="pa-pdf-btn pa-pdf-btn-ghost" href="' + esc(firstDoc.src || "") + '" target="_blank" rel="noopener noreferrer">↗ Open in new tab</a>' +
            "</div>" +
            '<iframe class="pa-pdf-frame" src="' + esc(firstDoc.src || "") + '" ' +
            'style="height:' + (parseInt(el.height, 10) || 900) + 'px" loading="lazy" ' +
            'title="PDF document"></iframe>' +
            '<div class="pa-pdf-lib-caption">' + esc(firstDoc.caption || "") + "</div>" +
            "</div>" +
            "</div>";
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
          sec.bulletPoints.map(function (b) { return "<li>" + linkify(b) + "</li>"; }).join("") + "</ul>";
      }
      return '<div class="pa-section"'+(sec.sectionId?' data-section-id="'+esc(sec.sectionId)+'"':'')+'><h3 tabindex="-1">' + esc(sec.sectionTitle) + "</h3>" + inner + "</div>";
    }).join("");
  }

  function buildPitfalls(data) {
    var ps = data.examPitfalls || [];
    if (!ps.length) return '<div class="pa-empty">No exam pitfalls listed.</div>';
    var cards = ps.map(function (p, i) {
      var num = (i + 1) < 10 ? "0" + (i + 1) : "" + (i + 1);
      return (
        '<div class="pa-pitfall">' +
          '<div class="pa-pf-hd">' +
            '<span class="pa-pf-num">' + num + '</span>' +
            '<span class="pa-pf-title-text">' + esc(p.title) + '</span>' +
          '</div>' +
          '<div class="pa-pf-trap">' +
            '<div class="pa-pf-lbl"><span class="pa-pf-icon">✗</span> The Trap</div>' +
            '<p>' + esc(p.trapDescription) + '</p>' +
          '</div>' +
          '<div class="pa-pf-fix">' +
            '<div class="pa-pf-lbl"><span class="pa-pf-icon">✓</span> The Fix</div>' +
            '<p>' + esc(p.bestPractice) + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join("");
    return '<div class="pa-pitfalls-wrap">' + cards + '</div>';
  }

  function buildRecap(data) {
    var r = data.quickRecap || [];
    if (!r.length) return '<div class="pa-empty">No quick recap available.</div>';
    return '<table class="pa-recap"><tbody>' +
      r.map(function (row) {
        if (typeof row === "string") return '<tr><td colspan="2">' + esc(row) + "</td></tr>";
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
    }, pill, false, {track:activeTrackId,moduleId:meta.id,name:meta.name,domain:data.examDomain||meta.examDomain||'General'});
  }

  /* Chrome */
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
    window.QuilynMobileNav.close();
  }

  /* Boot */
  function boot() {
    window.addEventListener("pega-track-changed", function (e) {
      activeTrackId = e.detail;
      route();
    });
    window.QuilynMobileNav.init();
    window.addEventListener("hashchange", route);
    window.addEventListener('quilyn-progress-external',function(e){
      if(!registry)return;
      var current=parseHash();
      if(e.detail.key==='pega_theme'){var theme=window.QuilynProgress.read('pega_theme','dark');document.documentElement.setAttribute('data-theme',theme);var icon=document.querySelector('#paThemeIcon use');if(icon)icon.setAttribute('href',theme==='light'?'#i-sun':'#i-moon');}
      if(['plan','history','mistakes'].includes(current.trackId)||!current.moduleId&&['home',''].includes(current.trackId)){
        if(current.trackId==='plan'&&document.activeElement&&document.activeElement.matches('input,select'))return;
        // Store receives its storage event after Progress dispatches this one.
        Promise.resolve().then(function(){if(['pega_lms_state','pega_universal_state','quilyn_study','quilyn_learning',null].includes(e.detail.key))route();});
      }else if(e.detail.key==='pega_lms_state'&&current.trackId!=='mock'&&current.trackId!=='review')renderSidebar();
    });
    watchThemeForInteractives();

    window.QuilynRuntime.json(REGISTRY_URL)
      .then(function (data) {
        registry = data;
        window.QuilynRegistry = data;
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

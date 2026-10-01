/* =====================================================================
   app-shell.js — Application chrome, theme and view mounting
   engine.js is the sole route dispatcher.
   Manages: theme toggle, nav active state, mock/review view mount/unmount,
   LMS chrome show/hide.
   Never touches engine.js, quiz-engine.js, or data/*.
   ===================================================================== */
(function (global) {
  'use strict';

  var THEME_KEY = 'pega_theme';
  var htmlEl = document.documentElement;
  var currentMode = null; /* 'lms' | 'mock' | 'review' */

  /* ── Theme ──────────────────────────────────────────────────────────── */
  function currentTheme() { return htmlEl.getAttribute('data-theme') || 'dark'; }

  function applyTheme(t) {
    htmlEl.setAttribute('data-theme', t);
    global.QuilynProgress.write(THEME_KEY,t);
    syncThemeIcon(t);
  }

  function syncThemeIcon(t) {
    /* Engine's topbar icon (index.html) */
    var iconUse = document.querySelector('#paThemeIcon use');
    if (iconUse) iconUse.setAttribute('href', t === 'light' ? '#i-sun' : '#i-moon');
  }

  /* ── Engine DOM references (engine.js owns these, we borrow them) ───── */
  function getContent()  { return document.getElementById('paContent'); }
  function getSidebar()  { return document.getElementById('paModList'); }
  function getCrumbs()   { return document.getElementById('paCrumbs'); }

  /* ── LMS chrome helpers ─────────────────────────────────────────────── */
  function setLmsChrome(visible) {
    ['.pa-progress-mini', '#paTrackSelect'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = visible ? '' : 'none';
    });
  }

  /* ── Nav active state ───────────────────────────────────────────────── */
  function setNavActive(mode) {
    document.querySelectorAll('.pa-nav a, .pa-nav .pa-nav-item').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      var isHome   = href === '#' || href === '#home' || href === 'index.html' || href === './' || href === '';
      var isMock   = href === '#mock'   || href.indexOf('mock-exams') >= 0;
      var isReview = href === '#review' || href.indexOf('review.html') >= 0;
      var active = (mode === 'lms'    && isHome)   ||
                   (mode === 'mock'   && isMock)   ||
                   (mode === 'review' && isReview);
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
  }

  /* ── Crumbs ─────────────────────────────────────────────────────────── */
  function setCrumbs(label) {
    var el = getCrumbs(); if (!el || !label) return;
    el.innerHTML = '<span class="pa-crumb pa-crumb--app">' + label + '</span>';
  }

  /* ── Mode transitions ───────────────────────────────────────────────── */
  function enterLms() {
    currentMode = 'lms';
    setLmsChrome(true);
    setNavActive('lms');
    document.title = "Quilyn — Free Certification Exam Prep (Pega, Tricentis Tosca & Testim)";

  }

  function enterMock() {
    if (currentMode === 'mock') return; /* already mounted — idempotent */
    if (currentMode === 'review' && global.ReviewView) global.ReviewView.unmount();

    var contentEl = getContent();
    var sidebarEl = getSidebar();
    if (!contentEl) return;

    currentMode = 'mock';
    setLmsChrome(false);
    setNavActive('mock');
    setCrumbs('Mock Exams');
    document.title = "Mock Exams — Quilyn";
    contentEl.innerHTML = '<pega-mock-view></pega-mock-view>';
  }

  function enterReview() {
    if (currentMode === 'review') return; /* already mounted — idempotent */
    if (currentMode === 'mock' && global.MockView) global.MockView.unmount();

    var contentEl = getContent();
    var sidebarEl = getSidebar();
    if (!contentEl) return;

    currentMode = 'review';
    setLmsChrome(false);
    setNavActive('review');
    setCrumbs('Smart Review');
    document.title = "Smart Review — Quilyn";
    contentEl.innerHTML = '<pega-review-view></pega-review-view>';
  }

  /* ── Rewrite stale nav hrefs to hash routes ─────────────────────────── */
  function patchNavHrefs() {
    document.querySelectorAll('.pa-nav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.indexOf('mock-exams.html') >= 0) a.setAttribute('href', '#mock');
      if (href.indexOf('review.html') >= 0)     a.setAttribute('href', '#review');
    });
  }

  /* ── Boot (runs after DOMContentLoaded, after engine.js registered) ─── */
  function boot() {
    /* ── Theme toggle ─────── */
    var toggleBtn = document.getElementById('paThemeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
      });
    }
    syncThemeIcon(currentTheme());

    /* ── Search button ─────── */
    var searchBtn = document.getElementById('paSearchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        if (global.PegaSearch) global.PegaSearch.show();
      });
    }

    /* ── Settings button ───── */
    var settingsBtn = document.getElementById('paSettingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function () {
        if (global.PegaSettings) global.PegaSettings.show();
      });
    }

    patchNavHrefs();

    /* Tear down the previous view before inserting its replacement. Custom
       element connection callbacks can run before the old node disconnects. */
    global.QuilynShell = { renderMode: function(mode) {
      if (global.MockView) global.MockView.unmount();
      if (global.ReviewView) global.ReviewView.unmount();
      var sidebar = getSidebar();
      if (sidebar && (mode === 'mock' || mode === 'review')) sidebar.textContent = 'Loading…';
      if (mode === 'mock') { currentMode = null; enterMock(); }
      else if (mode === 'review') { currentMode = null; enterReview(); }
      else enterLms();
    } };

    /* Initial dispatch */

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window);

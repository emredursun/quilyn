/* =====================================================================
   Quilyn — search.js
   On-demand learning content search overlay.
   Exposes window.PegaSearchView = { show, hide }
   ===================================================================== */
(function (global) {
  'use strict';

  var registry = null;
  var catalogue = null;
  var overlay = null;
  var debounceTimer = null;
  var registryPromise = null;
  var returnFocus = null;

  function loadRegistry() {
    if (registry && catalogue) return Promise.resolve(registry);
    if (registryPromise) return registryPromise;
    registryPromise = Promise.all([
      global.QuilynRuntime.json('data/registry.json'),
      global.QuilynRuntime.json('data/library-index.json').catch(function () { return null; }),
      global.QuilynRuntime.library()
    ]).then(function (values) { registry = values[0]; catalogue = values[1]; registryPromise = null; return registry; })
      .catch(function (err) { registryPromise = null; throw err; });
    return registryPromise;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function highlight(text, query) {
    if (!query) return esc(text);
    var lo = text.toLowerCase();
    var idx = lo.indexOf(query.toLowerCase());
    if (idx < 0) return esc(text);
    return esc(text.slice(0, idx)) +
      '<mark class="pa-srch-hl">' + esc(text.slice(idx, idx + query.length)) + '</mark>' +
      esc(text.slice(idx + query.length));
  }

  function search(query) {
    return global.QuilynLibrary ? global.QuilynLibrary.search(registry,catalogue,global.PegaStore?global.PegaStore.state.activeTrack:'',query) : [];
  }

  function renderResults(query, resultsEl) {
    if (!query.trim()) {
      resultsEl.innerHTML = '<div class="pa-srch-hint">Search modules, topics and concepts across all tracks. Your current track appears first.</div>';
      return;
    }
    if (!registry) {
      resultsEl.innerHTML = '<div class="pa-srch-hint">Loading…</div>';
      return;
    }
    var found = search(query);
    if (!found.length) {
      resultsEl.innerHTML = '<div class="pa-srch-hint">No learning content found for "<b>' + esc(query) + '</b>"</div>';
      return;
    }
    resultsEl.innerHTML = (catalogue ? '' : '<div class="pa-srch-hint">Topics and concepts are unavailable. Showing module matches.</div>') + found.map(function (item) {
      var track = registry.tracks.find(function(t) { return t.trackId===item.track; });
      return '<a class="pa-srch-item" href="' + esc(item.href) + '">' +
        '<span class="pa-srch-badge">' + esc(item.track) + '</span>' +
        '<span class="pa-srch-name">' + highlight(item.title, query.trim()) + '</span>' +
        '<span class="pa-srch-track">' + esc(item.kind+' · '+(item.moduleTitle||track&&track.trackName||item.track)) + '</span></a>';
    }).join('');

    resultsEl.querySelectorAll('.pa-srch-item').forEach(function (a) {
      a.addEventListener('click', function () { hide(); });
    });
  }

  function show() {
    if (!overlay || overlay.style.display === 'none') returnFocus = document.activeElement;
    if (overlay) {
      overlay.style.display = 'flex';
      global.QuilynRuntime.dialog(overlay, hide, 'Search learning content');
      var inp = overlay.querySelector('#pa-srch-input');
      if (inp) { inp.value = ''; inp.focus(); }
      var res = overlay.querySelector('#pa-srch-results');
      if (res) res.innerHTML = '<div class="pa-srch-hint">Search modules, topics and concepts across all tracks. Your current track appears first.</div>';
      loadRegistry().then(function () {
        if (overlay.style.display !== 'none' && res) renderResults(inp.value, res);
      }).catch(function () {
        if (overlay.style.display !== 'none' && res) res.textContent = 'Search is unavailable. Check your connection and try again.';
      });
      return;
    }

    overlay = document.createElement('div');
    overlay.id = 'pa-search-overlay';
    overlay.innerHTML =
      '<div class="pa-srch-dialog">' +
        '<div class="pa-srch-header">' +
          '<svg class="pa-srch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input type="search" id="pa-srch-input" class="pa-srch-input" aria-label="Search learning content" placeholder="Search modules, topics, concepts…" autocomplete="off" spellcheck="false" />' +
          '<button type="button" class="pa-srch-close" aria-label="Close search">Esc</button>' +
        '</div>' +
        '<div id="pa-srch-results" class="pa-srch-results" aria-live="polite">' +
          '<div class="pa-srch-hint">Search modules, topics and concepts across all tracks. Your current track appears first.</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    global.QuilynRuntime.dialog(overlay, hide, 'Search learning content');
    overlay.style.display = 'flex'; /* override CSS display:none on first mount */

    var input = overlay.querySelector('#pa-srch-input');
    var resultsEl = overlay.querySelector('#pa-srch-results');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hide();
    });
    overlay.querySelector('.pa-srch-close').addEventListener('click', hide);

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        renderResults(input.value, resultsEl);
      }, 140);
    });

    input.focus();
    loadRegistry().then(function () {
      if (overlay.style.display !== 'none') renderResults(input.value, resultsEl);
    }).catch(function () {
      if (overlay.style.display !== 'none') resultsEl.textContent = 'Search is unavailable. Check your connection and try again.';
    });
  }

  function hide() {
    if (overlay) { overlay.style.display = 'none'; global.QuilynRuntime.closeDialog(overlay); }
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }

  global.PegaSearchView = { show: show, hide: hide };

})(window);

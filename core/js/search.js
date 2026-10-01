/* =====================================================================
   Quilyn — search.js
   Global module search overlay.
   Exposes window.PegaSearch = { show, hide }
   ===================================================================== */
(function (global) {
  'use strict';

  var registry = null;
  var overlay = null;
  var debounceTimer = null;
  var registryPromise = null;
  var returnFocus = null;

  function loadRegistry() {
    if (registry) return Promise.resolve(registry);
    if (registryPromise) return registryPromise;
    registryPromise = global.QuilynRuntime.json('data/registry.json')
      .then(function (data) { registry = data; return data; })
      .catch(function (err) { registryPromise = null; throw err; });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
    if (!registry || !query.trim()) return [];
    var q = query.toLowerCase().trim();
    var results = [];
    registry.tracks.forEach(function (track) {
      track.modules.forEach(function (m) {
        if (m.ready === false) return;
        if (m.name.toLowerCase().indexOf(q) >= 0 || m.id.toLowerCase().indexOf(q) >= 0) {
          results.push({ track: track, module: m });
        }
      });
    });
    return results.slice(0, 20);
  }

  function handleKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); hide(); }
    if (e.key === 'Tab' && overlay && overlay.style.display !== 'none') {
      var controls = Array.from(overlay.querySelectorAll('input, button, a[href]'));
      if (!controls.length) return;
      var first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function renderResults(query, resultsEl) {
    if (!query.trim()) {
      resultsEl.innerHTML = '<div class="pa-srch-hint">Search available modules in every track</div>';
      return;
    }
    if (!registry) {
      resultsEl.innerHTML = '<div class="pa-srch-hint">Loading…</div>';
      return;
    }
    var found = search(query);
    if (!found.length) {
      resultsEl.innerHTML = '<div class="pa-srch-hint">No modules found for "<b>' + esc(query) + '</b>"</div>';
      return;
    }
    resultsEl.innerHTML = found.map(function (item) {
      var href = '#' + item.track.trackId + '/' + item.module.id;
      var trackLabel = item.track.trackName;
      return '<a class="pa-srch-item" href="' + href + '">' +
        '<span class="pa-srch-badge">' + esc(item.track.trackId) + '</span>' +
        '<span class="pa-srch-name">' + highlight(item.module.name, query) + '</span>' +
        '<span class="pa-srch-track">' + esc(trackLabel) + '</span>' +
      '</a>';
    }).join('');

    resultsEl.querySelectorAll('.pa-srch-item').forEach(function (a) {
      a.addEventListener('click', function () { hide(); });
    });
  }

  function show() {
    if (!overlay || overlay.style.display === 'none') returnFocus = document.activeElement;
    if (overlay) {
      overlay.style.display = 'flex';
      global.QuilynRuntime.dialog(overlay, hide, 'Search modules');
      var inp = overlay.querySelector('#pa-srch-input');
      if (inp) { inp.value = ''; inp.focus(); }
      var res = overlay.querySelector('#pa-srch-results');
      if (res) res.innerHTML = '<div class="pa-srch-hint">Search available modules in every track</div>';
      document.addEventListener('keydown', handleKey);
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
      '<div class="pa-srch-dialog" role="dialog" aria-modal="true" aria-label="Search modules">' +
        '<div class="pa-srch-header">' +
          '<svg class="pa-srch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input type="search" id="pa-srch-input" class="pa-srch-input" aria-label="Search modules" placeholder="Search modules…" autocomplete="off" spellcheck="false" />' +
          '<button type="button" class="pa-srch-close" aria-label="Close search">Esc</button>' +
        '</div>' +
        '<div id="pa-srch-results" class="pa-srch-results">' +
          '<div class="pa-srch-hint">Search available modules in every track</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    global.QuilynRuntime.dialog(overlay, hide, 'Search modules');
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
    document.addEventListener('keydown', handleKey);
    loadRegistry().then(function () {
      if (overlay.style.display !== 'none') renderResults(input.value, resultsEl);
    }).catch(function () {
      if (overlay.style.display !== 'none') resultsEl.textContent = 'Search is unavailable. Check your connection and try again.';
    });
  }

  function hide() {
    if (overlay) { overlay.style.display = 'none'; global.QuilynRuntime.closeDialog(overlay); }
    document.removeEventListener('keydown', handleKey);
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }

  /* Wire Cmd/Ctrl+K shortcut globally */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      show();
    }
  });

  global.PegaSearch = { show: show, hide: hide };

})(window);

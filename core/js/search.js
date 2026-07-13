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

  function loadRegistry() {
    if (registry) return Promise.resolve(registry);
    return fetch('data/registry.json?_t=' + Date.now())
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) { registry = data; return data; });
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
    if (e.key === 'Escape') hide();
  }

  function renderResults(query, resultsEl) {
    if (!query.trim()) {
      resultsEl.innerHTML = '<div class="pa-srch-hint">Start typing to search modules across both tracks</div>';
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
      var trackLabel = item.track.trackId === 'PSA' ? 'System Architect' : 'Business Architect';
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
    if (overlay) {
      overlay.style.display = 'flex';
      var inp = overlay.querySelector('#pa-srch-input');
      if (inp) { inp.value = ''; inp.focus(); }
      var res = overlay.querySelector('#pa-srch-results');
      if (res) res.innerHTML = '<div class="pa-srch-hint">Start typing to search modules across both tracks</div>';
      document.addEventListener('keydown', handleKey);
      return;
    }

    overlay = document.createElement('div');
    overlay.id = 'pa-search-overlay';
    overlay.innerHTML =
      '<div class="pa-srch-dialog">' +
        '<div class="pa-srch-header">' +
          '<svg class="pa-srch-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input type="text" id="pa-srch-input" class="pa-srch-input" placeholder="Search modules…" autocomplete="off" spellcheck="false" />' +
          '<kbd class="pa-srch-esc">Esc</kbd>' +
        '</div>' +
        '<div id="pa-srch-results" class="pa-srch-results">' +
          '<div class="pa-srch-hint">Start typing to search modules across both tracks</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    overlay.style.display = 'flex'; /* override CSS display:none on first mount */

    var input = overlay.querySelector('#pa-srch-input');
    var resultsEl = overlay.querySelector('#pa-srch-results');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hide();
    });

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        renderResults(input.value, resultsEl);
      }, 140);
    });

    input.focus();
    document.addEventListener('keydown', handleKey);
    loadRegistry();
  }

  function hide() {
    if (overlay) overlay.style.display = 'none';
    document.removeEventListener('keydown', handleKey);
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

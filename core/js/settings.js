/* =====================================================================
   Quilyn — settings.js
   Progress backup (export/import) and settings modal.
   Exposes window.PegaSettings = { show, hide }
   ===================================================================== */
(function (global) {
  'use strict';

  var KNOWN_KEYS = ['pega_universal_state', 'pega_lms_state', 'pega_theme'];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Export ───────────────────────────────────────────────────────── */
  function gatherState() {
    var bundle = { version: 2, exportedAt: new Date().toISOString(), state: {} };
    KNOWN_KEYS.forEach(function (k) {
      try {
        var raw = localStorage.getItem(k);
        if (raw != null) bundle.state[k] = JSON.parse(raw);
      } catch (e) {}
    });
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && (key.indexOf('pq_state_') === 0 || key.indexOf('pegaMock_') === 0)) {
        try { bundle.state[key] = JSON.parse(localStorage.getItem(key)); } catch (e) {}
      }
    }
    return bundle;
  }

  function exportProgress() {
    var bundle = gatherState();
    var json = JSON.stringify(bundle, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'quilyn-progress-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    showToast('Progress exported successfully');
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var bundle = JSON.parse(e.target.result);
        if (!bundle || !bundle.state) throw new Error('Invalid file — missing state object.');
        Object.keys(bundle.state).forEach(function (k) {
          localStorage.setItem(k, JSON.stringify(bundle.state[k]));
        });
        showToast('Progress imported! Reloading…', 1400);
        setTimeout(function () { location.reload(); }, 1500);
      } catch (err) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (!confirm('Delete ALL quiz scores, SRS cards, and streaks? This cannot be undone.')) return;
    if (!confirm('Last chance — click OK to permanently reset everything.')) return;
    var keysToRemove = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && (
        k.indexOf('pega') === 0 ||
        k.indexOf('pq_') === 0 ||
        k.indexOf('pegaMock_') === 0
      )) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(function (k) { localStorage.removeItem(k); });
    hide();
    showToast('All progress reset. Reloading…', 1400);
    setTimeout(function () { location.reload(); }, 1500);
  }

  /* ── Toast ────────────────────────────────────────────────────────── */
  function showToast(msg, duration) {
    var t = document.createElement('div');
    t.className = 'pa-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 400);
    }, duration || 2500);
  }

  /* ── Study heatmap (calendar) ─────────────────────────────────────── */
  function buildHeatmap() {
    var state = null;
    try { state = JSON.parse(localStorage.getItem('pega_universal_state') || 'null'); } catch (e) {}
    if (!state || !state.tracks) return '';

    /* Collect all study dates from both track SRS records */
    var dateCounts = {};
    Object.keys(state.tracks).forEach(function (trackId) {
      var srs = state.tracks[trackId] && state.tracks[trackId].srs;
      if (!srs || !srs.cards) return;
      Object.values(srs.cards).forEach(function (card) {
        if (card.dueDate) {
          /* Each dueDate implies the card was reviewed — credit the day before */
          var reviewed = card.dueDate;
          dateCounts[reviewed] = (dateCounts[reviewed] || 0) + 1;
        }
      });
    });

    /* Also track today from LMS quiz records */
    var lms = null;
    try { lms = JSON.parse(localStorage.getItem('pega_lms_state') || 'null'); } catch (e) {}
    if (lms && lms.userProgress) {
      Object.keys(lms.userProgress).forEach(function (trackId) {
        var qr = lms.userProgress[trackId] && lms.userProgress[trackId].quizRecords;
        if (!qr) return;
        Object.values(qr).forEach(function (rec) {
          if (rec.lastAttempted) {
            var d = rec.lastAttempted.slice(0, 10);
            dateCounts[d] = (dateCounts[d] || 0) + 1;
          }
        });
      });
    }

    if (!Object.keys(dateCounts).length) return '';

    /* Build last-12-weeks calendar */
    var today = new Date();
    var cells = [];
    for (var i = 83; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(today.getDate() - i);
      var ds = d.toISOString().slice(0, 10);
      var count = dateCounts[ds] || 0;
      var level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
      cells.push('<span class="pa-hm-cell l' + level + '" title="' + esc(ds) + (count ? ': ' + count + ' activities' : ': no activity') + '"></span>');
    }

    return '<div class="pa-settings-section">' +
      '<h4>📅 Study Activity (last 12 weeks)</h4>' +
      '<div class="pa-heatmap">' + cells.join('') + '</div>' +
      '<div class="pa-hm-legend">' +
        '<span>Less</span>' +
        '<span class="pa-hm-cell l0"></span>' +
        '<span class="pa-hm-cell l1"></span>' +
        '<span class="pa-hm-cell l2"></span>' +
        '<span class="pa-hm-cell l3"></span>' +
        '<span class="pa-hm-cell l4"></span>' +
        '<span>More</span>' +
      '</div>' +
    '</div>';
  }

  /* ── Keyboard shortcuts reference ─────────────────────────────────── */
  var SHORTCUTS_HTML =
    '<div class="pa-settings-section">' +
      '<h4>⌨️ Keyboard Shortcuts</h4>' +
      '<table class="pa-kbd-table">' +
        '<tr><td><kbd>Ctrl/⌘ K</kbd></td><td>Open module search</td></tr>' +
        '<tr><td><kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd></td><td>Select quiz option</td></tr>' +
        '<tr><td><kbd>Enter</kbd></td><td>Check answer / Next question (SRS)</td></tr>' +
        '<tr><td><kbd>H</kbd></td><td>Toggle hint</td></tr>' +
        '<tr><td><kbd>Esc</kbd></td><td>Close overlays / search</td></tr>' +
      '</table>' +
    '</div>';

  /* ── Modal ────────────────────────────────────────────────────────── */
  var modal = null;

  function show() {
    if (modal) {
      modal.classList.add('pa-modal-open');
      refreshHeatmap();
      return;
    }

    modal = document.createElement('div');
    modal.id = 'pa-settings-modal';
    modal.className = 'pa-modal-overlay pa-modal-open';
    modal.innerHTML =
      '<div class="pa-modal" role="dialog" aria-modal="true" aria-label="Settings">' +
        '<div class="pa-modal-header">' +
          '<h3>⚙️ Settings</h3>' +
          '<button class="pa-modal-close" id="pa-settings-close" aria-label="Close">✕</button>' +
        '</div>' +
        '<div class="pa-modal-body" id="pa-settings-body">' +
          '<div class="pa-settings-section">' +
            '<h4>📦 Export Progress</h4>' +
            '<p>Download your scores, SRS cards, and streaks as a JSON file. Use it to restore progress on another device or browser.</p>' +
            '<button class="pa-settings-btn primary" id="pa-export-btn">⬇ Export Progress</button>' +
          '</div>' +
          '<div class="pa-settings-section">' +
            '<h4>📂 Import Progress</h4>' +
            '<p>Load a previously exported file. <strong>This overwrites current progress.</strong></p>' +
            '<label class="pa-settings-btn" for="pa-import-file" style="cursor:pointer;">⬆ Import from File</label>' +
            '<input type="file" id="pa-import-file" accept=".json" style="display:none">' +
          '</div>' +
          '<div id="pa-heatmap-wrap"></div>' +
          SHORTCUTS_HTML +
          '<div class="pa-settings-section pa-settings-danger">' +
            '<h4>🗑️ Reset All Progress</h4>' +
            '<p>Permanently delete all quiz scores, SRS progress, and streaks.</p>' +
            '<button class="pa-settings-btn danger" id="pa-reset-btn">Reset Everything</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) { if (e.target === modal) hide(); });
    document.getElementById('pa-settings-close').addEventListener('click', hide);
    document.getElementById('pa-export-btn').addEventListener('click', exportProgress);
    document.getElementById('pa-import-file').addEventListener('change', function (e) {
      if (e.target.files[0]) importProgress(e.target.files[0]);
    });
    document.getElementById('pa-reset-btn').addEventListener('click', resetAll);

    refreshHeatmap();
  }

  function refreshHeatmap() {
    var wrap = document.getElementById('pa-heatmap-wrap');
    if (wrap) wrap.innerHTML = buildHeatmap();
  }

  function hide() {
    if (modal) modal.classList.remove('pa-modal-open');
  }

  global.PegaSettings = { show: show, hide: hide };

})(window);

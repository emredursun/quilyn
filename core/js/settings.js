/* =====================================================================
   Quilyn — settings.js
   Progress backup (export/import) and settings modal.
   Exposes window.PegaSettings = { show, hide }
   ===================================================================== */
(function (global) {
  'use strict';

  var KNOWN_KEYS = ['pega_universal_state', 'pega_lms_state', 'pega_theme', 'quilyn_activity', 'quilyn_learning'];
  var MAX_IMPORT_BYTES = 20 * 1024 * 1024;
  function isRecord(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
  function validEntry(key, value) {
    return global.QuilynProgress ? global.QuilynProgress.validEntry(key, value) : false;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Export ───────────────────────────────────────────────────────── */
  function gatherState() {
    var bundle = { version: 2, exportedAt: new Date().toISOString(), state: {} };
    function collect(k) {
      var raw = localStorage.getItem(k);
      if (raw === null) return;
      try {
        var value = k === 'pega_theme' ? raw : JSON.parse(raw);
        if (!validEntry(k,value)) throw new Error('Invalid saved value');
        bundle.state[k] = value;
      } catch (_) {
        if (!bundle.recovery) bundle.recovery = {};
        bundle.recovery[k] = raw;
      }
    }
    KNOWN_KEYS.forEach(function (k) {
      collect(k);
    });
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && (key.indexOf('pq_state_') === 0 || key.indexOf('pegaMock_') === 0)) {
        collect(key);
      }
      if (key && key.indexOf('quilyn_recovery_') === 0) {
        if (!bundle.recovery) bundle.recovery = {};
        bundle.recovery[key] = localStorage.getItem(key);
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
    showToast(bundle.recovery ? 'Export includes unreadable records as recovery text. They are not imported automatically.' : 'Progress exported successfully', 6000);
  }

  function importProgress(file) {
    if (file.size > MAX_IMPORT_BYTES) { alert('Import failed: file is larger than 20 MB.'); return; }
    var reader = new FileReader();
    reader.onerror = function() { showToast('The backup file could not be read.', 6000); };
    reader.onload = async function (e) {
      try {
        var bundle = JSON.parse(e.target.result);
        if (!isRecord(bundle) || bundle.version !== 2 || !isRecord(bundle.state))
          throw new Error('Unsupported or invalid progress file.');
        var keys = global.QuilynProgress.validateBundle(bundle);
        var unknown = await global.QuilynProgress.validateReferences(bundle);
        var body = document.getElementById('pa-import-preview');
        body.hidden = false;
        body.innerHTML = '<h4>Review your import</h4><p>This file will replace ' + keys.length +
          ' saved entries. Other entries are kept. ' + unknown.length + ' unmatched content entries will be preserved.</p><ul>' +
          keys.map(function(k) { return '<li>' + esc(k) + (localStorage.getItem(k) !== null ? ' — replace' : ' — add') + '</li>'; }).join('') +
          '</ul><button class="pa-settings-btn primary" id="pa-import-confirm">Apply import</button>' +
          '<button class="pa-settings-btn" id="pa-import-cancel">Cancel</button>';
        body.querySelector('#pa-import-cancel').onclick = function() { body.hidden = true; };
        body.querySelector('#pa-import-confirm').onclick = function() {
          try {
            if (global.PegaStore) global.PegaStore.flush();
            if (global.MockView) global.MockView.flush();
            global.QuilynProgress.applyBundle(bundle);
            // Stop the old session without resaving it over the imported data.
            if (global.MockView) global.MockView.unmount(true);
            if (global.PegaQuiz) global.PegaQuiz.unmount();
            location.reload();
          } catch (err) { showToast(err.message, 8000); }
        };
        body.querySelector('#pa-import-confirm').focus();
        return;
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
        KNOWN_KEYS.includes(k) ||
        /^pq_state_(?:default|#[A-Za-z0-9-]+\/[A-Za-z0-9-]+)$/.test(k) ||
        /^pegaMock_[A-Za-z0-9-]+_.{1,120}$/.test(k) || k.indexOf('quilyn_recovery_') === 0
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
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 400);
    }, duration || 2500);
  }

  /* ── Study heatmap (calendar) ─────────────────────────────────────── */
  function buildHeatmap() {
    var activity = global.QuilynProgress.read('quilyn_activity', { version: 1, events: [] });
    var dateCounts = {};
    activity.events.filter(function(e) { return e.kind !== 'visit'; }).forEach(function(e) {
      dateCounts[e.day] = (dateCounts[e.day] || 0) + 1;
    });
    if (!Object.keys(dateCounts).length) return '<p class="pa-empty">Study activity will appear after your next quiz or review. Historical activity is not inferred.</p>';

    /* Build last-12-weeks calendar */
    var today = new Date();
    var cells = [];
    for (var i = 83; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(today.getDate() - i);
      var ds = global.QuilynProgress.localDay(d);
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
    if (!global.QuilynJournal && global.QuilynRuntime.learning) { global.QuilynRuntime.learning().then(show).catch(function(e){showToast(e.message,6000);});return; }
    if (modal) {
      modal.classList.add('pa-modal-open');
      refreshHeatmap();
      global.QuilynRuntime.dialog(modal, hide, 'Settings');
      return;
    }

    modal = document.createElement('div');
    modal.id = 'pa-settings-modal';
    modal.className = 'pa-modal-overlay pa-modal-open';
    modal.innerHTML =
      '<div class="pa-modal">' +
        '<div class="pa-modal-header">' +
          '<h3>⚙️ Settings</h3>' +
          '<button class="pa-modal-close" id="pa-settings-close" aria-label="Close">✕</button>' +
        '</div>' +
        '<div class="pa-modal-body" id="pa-settings-body">' +
          '<div class="pa-settings-section">' +
            '<h4>📦 Export Progress</h4>' +
            '<p>Download your scores, SRS cards, streaks, attempt history and mistakes notebook as a JSON file. Use it to restore progress on another device or browser.</p>' +
            '<button class="pa-settings-btn primary" id="pa-export-btn">⬇ Export Progress</button>' +
          '</div>' +
          '<div class="pa-settings-section">' +
            '<h4>📂 Import Progress</h4>' +
            '<p>Load a previously exported file. <strong>This overwrites current progress.</strong></p>' +
            '<button class="pa-settings-btn" id="pa-import-trigger">Import from file</button>' +
            '<input type="file" id="pa-import-file" accept=".json" style="display:none">' +
          '</div>' +
          '<div id="pa-import-preview" hidden></div>' +
          '<div class="pa-settings-section"><h4>Offline learning</h4><div id="quilyn-offline-panel"></div></div>' +
          '<div id="pa-heatmap-wrap"></div>' +
          SHORTCUTS_HTML +
          '<div class="pa-settings-section pa-settings-danger">' +
            '<h4>🗑️ Reset All Progress</h4>' +
            '<p>Permanently delete quiz scores, SRS progress, streaks, attempt history and mistakes notebook records.</p>' +
            '<button class="pa-settings-btn danger" id="pa-reset-btn">Reset Everything</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    global.QuilynRuntime.dialog(modal, hide, 'Settings');
    document.getElementById('pa-import-trigger').onclick = function() { document.getElementById('pa-import-file').click(); };
    if (global.QuilynOffline) global.QuilynOffline.render(document.getElementById('quilyn-offline-panel'));

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
    if (modal) { modal.classList.remove('pa-modal-open'); global.QuilynRuntime.closeDialog(modal); }
  }

  global.PegaSettings = { show: show, hide: hide };

})(window);

/* =====================================================================
   Quilyn — enhancement.js  (additive decoration layer)
   Runs AFTER engine.js. Never removes or replaces engine output.
   Guards every mutation with data-enh to stay idempotent.
   ===================================================================== */
(function () {
  'use strict';

  /* ── Module → domain map (same as review.html) ─────────────────── */
  var MOD_DOMAIN = {
    'SA-M01':'Application Development','SA-M02':'Case Management','SA-M03':'Security',
    'SA-M04':'Application Development','SA-M05':'Pega GenAI','SA-M06':'Application Development',
    'SA-M07':'Data & Integration','SA-M08':'Data & Integration','SA-M09':'Data & Integration',
    'SA-M10':'User Experience','SA-M11':'User Experience','SA-M12':'Case Management',
    'SA-M13':'Case Management','SA-M14':'Case Management','SA-M15':'Case Management',
    'SA-M16':'Case Management','SA-M17':'Case Management','SA-M18':'Security',
    'SA-M19':'Application Development','SA-M20':'Application Development',
    'SA-M21':'Application Development','SA-M22':'Application Development',
    'SA-M23':'Application Development','SA-M24':'Case Management','SA-M25':'Case Management',
    'SA-M26':'Data & Integration','SA-M27':'Data & Integration','SA-M28':'Case Management',
    'SA-M29':'Case Management','SA-M30':'Case Management','SA-M31':'Case Management',
    'SA-M32':'Case Management','SA-M33':'Application Development','SA-M34':'Data & Integration',
    'SA-M35':'Data & Integration','SA-M36':'Data & Integration','SA-M37':'Data & Integration',
    'SA-M38':'Data & Integration','SA-M39':'Data & Integration','SA-M40':'Security',
    'SA-M41':'Security','SA-M42':'User Experience','SA-M43':'User Experience',
    'SA-M44':'Application Development','SA-M45':'DevOps','SA-M46':'DevOps',
    'SA-M47':'Insights','SA-M48':'Application Development',
    'BA-M01':'Case Management','BA-M02':'Application Development','BA-M03':'Application Development',
    'BA-M04':'Application Development','BA-M05':'Application Development','BA-M06':'Pega GenAI',
    'BA-M07':'Application Development','BA-M08':'Case Management','BA-M09':'Data & Integration',
    'BA-M10':'User Experience','BA-M11':'Case Management','BA-M12':'Case Management',
    'BA-M13':'Case Management','BA-M14':'Data & Integration','BA-M15':'Security',
    'BA-M16':'User Experience','BA-M17':'Insights','BA-M18':'DevOps','BA-M19':'DevOps'
  };

  var DCOLORS = {
    'Case Management':        '#4f7cff',
    'Data & Integration':     '#22d3ee',
    'Application Development':'#7a5cff',
    'Security':               '#ff5d6c',
    'User Experience':        '#1fc77d',
    'Pega GenAI':             '#f59e0b',
    'DevOps':                 '#e879f9',
    'Insights':               '#34d399'
  };

  var DOMAINS = [
    'Case Management','Data & Integration','Application Development',
    'Security','User Experience','Pega GenAI','DevOps','Insights'
  ];

  /* ── State helpers ──────────────────────────────────────────────── */
  var LMS_KEY = 'pega_lms_state';
  var UNIVERSAL_KEY = 'pega_universal_state';

  function loadLMS() {
    try { var r = localStorage.getItem(LMS_KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; }
  }

  function getActiveTrackId() {
    var h = (location.hash || '').replace(/^#/, '').split('/');
    return h[0] || null;
  }

  /* SRS lives inside pega_universal_state, keyed by track */
  function loadSRS() {
    try {
      var raw = localStorage.getItem(UNIVERSAL_KEY);
      if (!raw) return null;
      var state = JSON.parse(raw);
      var track = getActiveTrackId() || 'PSA';
      return (state.tracks && state.tracks[track] && state.tracks[track].srs) || null;
    } catch(e) { return null; }
  }

  function getTrackProgress(trackId) {
    var lms = loadLMS();
    if (!lms || !lms.userProgress || !lms.userProgress[trackId]) return null;
    return lms.userProgress[trackId];
  }

  function countDueToday() {
    var srs = loadSRS();
    if (!srs || !srs.cards) return 0;
    var today = new Date().toISOString().slice(0, 10);
    return Object.keys(srs.cards).filter(function(k) {
      return srs.cards[k].dueDate <= today;
    }).length;
  }

  /* ── SVG helper ─────────────────────────────────────────────────── */
  function icon(id, cls) {
    return '<svg class="i' + (cls ? ' ' + cls : '') + '"><use href="#i-' + id + '"/></svg>';
  }

  /* ── Tab emoji → SVG swap ───────────────────────────────────────── */
  var TAB_ICONS = {
    'Study Guide':   'book',
    'Exam Pitfalls': 'alert',
    'Practice Quiz': 'target',
    'Quick Recap':   'zap'
  };

  function decorateTabs() {
    var tabs = document.querySelectorAll('.pa-tabs button:not([data-enh])');
    tabs.forEach(function(btn) {
      var txt = btn.textContent.trim();
      Object.keys(TAB_ICONS).forEach(function(label) {
        if (txt.indexOf(label) >= 0) {
          btn.setAttribute('data-enh', '1');
          btn.innerHTML = icon(TAB_ICONS[label]) + ' ' + label;
        }
      });
    });
  }

  /* ── Domain color-coding on home cards ──────────────────────────── */
  function decorateCards() {
    var cards = document.querySelectorAll('.pa-card:not([data-enh])');
    cards.forEach(function(card) {
      var go = card.getAttribute('data-go') || '';
      var parts = go.replace(/^#/, '').split('/');
      var moduleId = parts[1] || '';
      var domain = MOD_DOMAIN[moduleId];
      if (!domain) return;

      var color = DCOLORS[domain] || '#6d8bff';
      card.setAttribute('data-enh', '1');
      card.setAttribute('data-domain', domain);

      /* Thin left accent bar */
      var bar = document.createElement('span');
      bar.className = 'pa-card-domain-bar';
      bar.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:' +
        'var(--pa-r-lg) 0 0 var(--pa-r-lg);background:' + color + ';opacity:.7';
      card.appendChild(bar);

      /* Domain chip under the title */
      var cnum = card.querySelector('.cnum');
      if (cnum && !cnum.querySelector('.pa-domain-chip')) {
        var chip = document.createElement('span');
        chip.className = 'pa-domain-chip';
        chip.textContent = domain;
        chip.style.cssText = 'display:inline-block;font-size:10px;font-weight:600;' +
          'letter-spacing:.3px;padding:1px 7px;border-radius:999px;margin-left:7px;' +
          'background:' + color + '22;color:' + color + ';border:1px solid ' + color + '44;' +
          'vertical-align:middle;text-transform:none;font-variant-numeric:normal';
        cnum.appendChild(chip);
      }
    });
  }

  /* ── Home stats / resume band ───────────────────────────────────── */
  function buildProgressRing(pct) {
    var r = 22, c = 2 * Math.PI * r;
    var dash = (pct / 100) * c;
    /* Uses currentColor (set to var(--pa-brand) via .pa-enh-ring in CSS) */
    return '<div class="pa-enh-ring" aria-label="' + pct + '% complete">' +
      '<svg width="56" height="56" viewBox="0 0 56 56" style="transform:rotate(-90deg)" aria-hidden="true">' +
      '<circle cx="28" cy="28" r="' + r + '" fill="none" stroke="var(--pa-line)" stroke-width="4"/>' +
      '<circle cx="28" cy="28" r="' + r + '" fill="none" stroke="currentColor" stroke-width="4"' +
      ' stroke-dasharray="' + dash.toFixed(1) + ' ' + c.toFixed(1) + '"' +
      ' stroke-linecap="round"/>' +
      '</svg>' +
      '<span class="pa-enh-ring__label">' + pct + '%</span>' +
      '</div>';
  }

  function buildDomainBars(trackId, completedSet) {
    /* Only for PSA track where we have the domain map */
    if (trackId !== 'PSA') return '';
    return DOMAINS.map(function(dom) {
      var mods = Object.keys(MOD_DOMAIN).filter(function(mid){ return MOD_DOMAIN[mid] === dom; });
      var done = mods.filter(function(mid){
        return completedSet.indexOf(trackId.replace('PSA','SA') + '-' + mid.replace('SA-','') ) >= 0 ||
               completedSet.indexOf(mid) >= 0;
      }).length;
      var pct = mods.length ? Math.round(done / mods.length * 100) : 0;
      var col = DCOLORS[dom] || '#6d8bff';
      return '<div class="pa-enh-domain">' +
        '<div class="pa-enh-domain__meta">' +
        '<span class="pa-enh-domain__name">' + dom + '</span>' +
        '<span class="pa-enh-domain__count">' + done + '/' + mods.length + '</span>' +
        '</div>' +
        '<div class="pa-enh-domain__track">' +
        '<div class="pa-enh-domain__fill" style="width:' + pct + '%;--domain-color:' + col + '"></div>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  function injectBand() {
    var content = document.getElementById('paContent');
    if (!content) return;
    var cards = content.querySelector('.pa-cards');
    if (!cards) return;

    /* Remove stale band on re-route */
    var old = content.querySelector('.pa-enh-band');
    if (old) old.remove();

    var trackId = getActiveTrackId();
    if (!trackId) return;
    var tp = getTrackProgress(trackId);

    var completed = (tp && tp.completedModules) ? tp.completedModules : [];
    var quizRecs  = (tp && tp.quizRecords) ? tp.quizRecords : {};

    /* Count total ready modules from registry if available — fallback to 48 for PSA, 19 for PBA */
    var total = trackId === 'PSA' ? 48 : (trackId === 'PBA' ? 19 : Math.max(Object.keys(quizRecs).length, completed.length, 1));
    var done  = completed.length;
    var pct   = total ? Math.min(100, Math.round(done / total * 100)) : 0;

    /* Find first incomplete module (for Resume CTA) */
    var resumeHash = null;
    var resumeLabel = null;
    var modList = document.querySelectorAll('#paModList a:not(.done)');
    for (var i = 0; i < modList.length; i++) {
      var a = modList[i];
      if (!a.classList.contains('done')) {
        var href = a.getAttribute('href');
        var name = a.querySelector('.mname') ? a.querySelector('.mname').textContent.trim() : '';
        if (href && name) { resumeHash = href; resumeLabel = name; break; }
      }
    }

    /* SRS streak + due today */
    var srs = loadSRS();
    var streak   = (srs && srs.streak) ? srs.streak : 0;
    var dueToday = countDueToday();

    /* Band container — all layout/visual handled by .pa-enh-band in theme.css */
    var band = document.createElement('div');
    band.className = 'pa-enh-band';

    /* Glow overlay — styled via .pa-enh-band__glow */
    var glow = '<div class="pa-enh-band__glow" aria-hidden="true"></div>';

    /* Left: progress ring — styled via .pa-enh-ring + .pa-enh-ring__label */
    var leftCol = buildProgressRing(pct);

    /* Centre: resume CTA — styled via .pa-enh-resume / .pa-enh-complete */
    var resumeBtn = resumeHash
      ? '<a href="' + resumeHash + '" class="pa-enh-resume">' +
        icon('chevron-right') +
        '<span class="pa-enh-resume__label">Continue: ' + resumeLabel + '</span>' +
        '</a>'
      : '<span class="pa-enh-complete">' + icon('check') + ' All modules complete!</span>';

    /* Stats row — styled via .pa-enh-stats + .pa-enh-stat */
    var statsItems = [
      '<div class="pa-enh-stat">' +
        icon('check', 'i-sm') +
        '<span><b>' + done + '</b> / ' + total + ' complete</span>' +
        '</div>',
      streak > 0
        ? '<div class="pa-enh-stat pa-enh-stat--streak">' +
          icon('flame', 'i-sm') +
          '<span><b>' + streak + '</b> day streak</span>' +
          '</div>'
        : '',
      dueToday > 0
        ? '<div class="pa-enh-stat">' +
          icon('calendar', 'i-sm') +
          '<span><b>' + dueToday + '</b> due today</span>' +
          '</div>'
        : ''
    ].filter(Boolean).join('');

    var centreCol = '<div class="pa-enh-centre">' +
      resumeBtn +
      '<div class="pa-enh-stats">' + statsItems + '</div>' +
      '</div>';

    /* Right: domain bars (PSA only) — styled via .pa-enh-domains + .pa-enh-domain* */
    var domainBars = (trackId === 'PSA')
      ? '<div class="pa-enh-domains">' + buildDomainBars(trackId, completed) + '</div>'
      : '';

    band.innerHTML = glow + leftCol + centreCol + (domainBars || '');
    /* Note: responsive media query is now in theme.css — no injected <style> needed */

    content.insertBefore(band, cards);
  }

  /* ── Main decoration pass ───────────────────────────────────────── */
  function decorate() {
    var content = document.getElementById('paContent');
    if (!content) return;
    decorateTabs();
    if (content.querySelector('.pa-cards')) {
      injectBand();
      decorateCards();
    }
  }

  /* ── Observer: re-decorate on engine content changes ────────────── */
  var _debounce = null;
  function scheduleDecorate() {
    clearTimeout(_debounce);
    _debounce = setTimeout(decorate, 60);
  }

  document.addEventListener('DOMContentLoaded', function () {
    decorate();
    var content = document.getElementById('paContent');
    if (content && window.MutationObserver) {
      new MutationObserver(function(muts) {
        var changed = muts.some(function(m){ return m.addedNodes.length > 0; });
        if (changed) scheduleDecorate();
      }).observe(content, { childList: true, subtree: false });
    }
  });

  window.addEventListener('hashchange', scheduleDecorate);
})();

/* =====================================================================
   mock-view.js — Mock Exam view module
   Exposes <pega-mock-view> custom element.
   Never touches engine.js, quiz-engine.js, or data/*.
   ===================================================================== */
(function (global) {
  'use strict';

  var PASS = 0.65, TIME_MIN = 90;
  var EXAMS = {};

  /* ── Engine state ───────────────────────────────────────────────────── */
  var timerId = null;
  var current = null;
  var answers = [];   // array of arrays — selected option indices per question
  var checked = [];   // bool per question — true after "Check Answer" clicked
  var remaining = 0;
  var startTs = 0;
  var paused = false;
  var _root = null;
  var LETTERS = ["A","B","C","D","E"];

  function esc(t) { return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function q(id) { return _root ? _root.querySelector('#mv-' + id) : null; }

  function getTrack() {
    return (global.PegaStore && global.PegaStore.state.activeTrack) ? global.PegaStore.state.activeTrack : 'PSA';
  }
  function loadScores() {
    if (!global.PegaStore) return {};
    var track = getTrack();
    if (!global.PegaStore.state.tracks[track]) global.PegaStore.state.tracks[track] = { mock: {} };
    return global.PegaStore.state.tracks[track].mock;
  }
  function saveScore(name, pct) {
    if (global.PegaStore) {
      var track = getTrack();
      if (!global.PegaStore.state.tracks[track]) global.PegaStore.state.tracks[track] = { mock: {} };
      global.PegaStore.state.tracks[track].mock[name] = Math.max(global.PegaStore.state.tracks[track].mock[name]||0, pct);
    }
  }

  /* ── LocalStorage persistence ───────────────────────────────────────── */
  function stateKey(name) {
    return 'pegaMock_' + getTrack() + '_' + (name || current);
  }
  function saveState() {
    if (!current) return;
    try {
      localStorage.setItem(stateKey(), JSON.stringify({
        name: current, answers: answers, checked: checked, remaining: remaining
      }));
    } catch(e) {}
  }
  function clearState(name) {
    try { localStorage.removeItem(stateKey(name)); } catch(e) {}
  }
  function loadState(name) {
    try {
      var raw = localStorage.getItem(stateKey(name));
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  function show(id) {
    ['home','exam','results'].forEach(function(s) {
      var el = q(s); if (el) el.classList.toggle('v-hide', s !== id);
    });
    if (_root) _root.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  /* ── Home screen ────────────────────────────────────────────────────── */
  function renderHome() {
    var scores = loadScores();
    var grid = q('examGrid'); if (!grid) return;
    grid.innerHTML = '';

    var examKeys = Object.keys(EXAMS);
    if (examKeys.length === 0) {
      grid.innerHTML =
        '<div style="text-align:center;padding:40px;grid-column:1/-1;background:var(--pa-surface-alt);border-radius:12px;border:1px dashed var(--pa-border)">' +
        '<div style="font-size:3rem;margin-bottom:16px">🚧</div>' +
        '<h3 style="margin-bottom:8px">Content Coming Soon</h3>' +
        '<p class="v-muted" style="max-width:400px;margin:0 auto">Mock exams for this track are currently being authored and will be available in a future update.</p>' +
        '</div>';
    } else {
      examKeys.forEach(function(name) {
        var qs = EXAMS[name];
        var best = scores[name] != null ? ('Best: ' + scores[name] + '%') : 'Not attempted';
        var saved = loadState(name);
        var inProgress = saved && saved.answers && saved.answers.length === qs.length &&
                         saved.answers.some(function(a) { return a.length > 0; });
        var el = document.createElement('div'); el.className = 'examcard';
        el.innerHTML = '<h3>' + esc(name) + '</h3>' +
          '<p>' + qs.length + ' questions · 90 min · 65% to pass</p>' +
          '<div class="best">' + esc(best) + '</div>' +
          (inProgress ? '<div class="in-progress-badge">In progress</div>' : '');
        el.onclick = function() { startExam(name); };
        grid.appendChild(el);
      });
    }

    /* Domain weighting table — computed dynamically from actual exam data */
    var domWrap = q('domTable'); if (domWrap) domWrap.innerHTML = buildDomainTable();

    show('home');
  }

  function buildDomainTable() {
    /* Aggregate domain totals across all exams in this track */
    var domCounts = {};
    var total = 0;
    Object.values(EXAMS).forEach(function(qs) {
      qs.forEach(function(qu) {
        domCounts[qu.d] = (domCounts[qu.d] || 0) + 1;
        total++;
      });
    });
    var examCount = Object.keys(EXAMS).length || 1;
    var perExam = total / examCount;
    if (perExam === 0) return '';
    var rows = Object.keys(domCounts).sort().map(function(d) {
      var avg = Math.round(domCounts[d] / examCount);
      var pct = Math.round(avg / perExam * 100);
      return '<tr><td>' + esc(d) + '</td><td>' + pct + '%</td><td>' + avg + '</td></tr>';
    }).join('');
    return '<table class="dtable"><thead><tr><th>Domain</th><th>Exam %</th><th>Questions</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  /* ── Exam flow ──────────────────────────────────────────────────────── */
  function isMulti(qu) { return qu.t === 'multi' || qu.t === 'multiple'; }

  /* Normalise a source URL so duplicates collapse to one entry */
  function srcNorm(url) {
    if (/exact2pass\.com.*pegacpsa23v1/.test(url))
      return 'https://www.exact2pass.com/pegacpsa23v1-certified-pega-system-architect-23-question-1.html';
    return url;
  }

  /* Map a (normalised) URL to a human-readable label */
  function srcLabel(url) {
    var rules = [
      [/processexam\.com/,           'ProcessExam.com — CPSA Sample Questions'],
      [/proprofs\.com.*pega-7-csa/,  'ProProfs — Pega CSA Mock Exam'],
      [/proprofs\.com.*prpc-csa-72/, 'ProProfs — PRPC CSA 72 Exam'],
      [/open-exam-prep\.com/,        'Open Exam Prep — 100+ Free CPSA Questions'],
      [/pass4success\.com/,          'Pass4Success — PEGACPSA23V1 Exam Questions'],
      [/exact2pass\.com/,            'Exact2Pass — PEGACPSA23V1 Real Exam Questions'],
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(url)) return rules[i][1];
    }
    try { return new URL(url).hostname; } catch(e) { return url; }
  }

  /* ── Pause / Resume ─────────────────────────────────────────────────── */
  function pauseExam() {
    if (paused) return;
    paused = true;
    clearInterval(timerId);
    saveState();

    var pb = q('pauseBtn'); if (pb) pb.textContent = '▶ Resume';

    var layer = document.createElement('div');
    layer.id = 'mv-pauseLayer';
    layer.style.cssText = 'position:fixed;inset:0;background:rgba(10,14,35,.9);z-index:998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;backdrop-filter:blur(6px)';
    layer.innerHTML =
      '<div style="font-size:3.5rem;line-height:1">⏸</div>' +
      '<h2 style="margin:0;color:var(--pa-ink,#eef1fb)">Exam Paused</h2>' +
      '<p style="margin:0;color:var(--pa-ink-soft,#939bbd);font-size:14px">Questions are hidden. Your progress is saved.</p>' +
      '<button class="v-btn v-primary" style="margin-top:8px;padding:10px 32px;font-size:15px" id="mv-resumeLayer">▶ Resume</button>';
    document.body.appendChild(layer);
    document.getElementById('mv-resumeLayer').onclick = resumeExam;
  }

  function resumeExam() {
    if (!paused) return;
    paused = false;
    var layer = document.getElementById('mv-pauseLayer');
    if (layer) layer.remove();
    var pb = q('pauseBtn'); if (pb) pb.textContent = '⏸ Pause';
    startTimer();
  }

  /* ── Start exam (checks for saved state first) ──────────────────────── */
  function startExam(name) {
    var saved = loadState(name);
    /* Only offer resume if the saved state matches the current question count */
    if (saved && saved.answers && saved.answers.length === EXAMS[name].length &&
        saved.answers.some(function(a) { return a.length > 0; })) {
      showResumeDialog(name, saved);
      return;
    }
    doStartExam(name, null);
  }

  function showResumeDialog(name, saved) {
    var answeredCount = saved.answers.filter(function(a) { return a.length > 0; }).length;
    var totalCount = EXAMS[name].length;
    var rm = Math.floor(saved.remaining / 60), rs = saved.remaining % 60;
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:center;justify-content:center';
    overlay.innerHTML =
      '<div style="background:var(--pa-surface-1,#1a2040);border-radius:14px;padding:28px 32px;max-width:420px;width:90%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.5)">' +
        '<div style="font-size:2.5rem;margin-bottom:12px">💾</div>' +
        '<h3 style="margin:0 0 8px;color:var(--pa-ink,#eef1fb)">Resume saved progress?</h3>' +
        '<p style="margin:0 0 20px;font-size:14px;color:var(--pa-ink-soft,#939bbd)">' +
          answeredCount + ' of ' + totalCount + ' answered · ' +
          (rm < 10 ? '0' : '') + rm + ':' + (rs < 10 ? '0' : '') + rs + ' remaining' +
        '</p>' +
        '<div style="display:flex;gap:10px;justify-content:center">' +
          '<button class="v-btn" id="mv-rdFresh">Start fresh</button>' +
          '<button class="v-btn v-primary" id="mv-rdResume">Resume</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#mv-rdResume').onclick = function() {
      document.body.removeChild(overlay);
      doStartExam(name, saved);
    };
    overlay.querySelector('#mv-rdFresh').onclick = function() {
      document.body.removeChild(overlay);
      clearState(name);
      doStartExam(name, null);
    };
  }

  function doStartExam(name, saved) {
    current = name;
    paused = false;
    var qs = EXAMS[name];

    if (saved) {
      answers  = saved.answers;
      checked  = saved.checked;
      remaining = saved.remaining;
    } else {
      answers   = qs.map(function() { return []; });
      checked   = qs.map(function() { return false; });
      remaining = TIME_MIN * 60;
    }
    startTs = Date.now();

    var examTitle = q('examTitle');
    if (examTitle) examTitle.textContent = name + ' — answer all ' + qs.length + ' questions, then Submit.';

    /* Collect unique sources and render header attribution */
    var srcEl = q('examSources');
    if (srcEl) {
      var srcMap = {};
      qs.forEach(function(qu) {
        if (qu.src) {
          var norm = srcNorm(qu.src);
          if (!srcMap[norm]) srcMap[norm] = srcLabel(norm);
        }
      });
      var keys = Object.keys(srcMap);
      if (keys.length > 0) {
        srcEl.innerHTML =
          '<div class="exam-sources">' +
            '<span class="exam-sources-label">Sources:</span>' +
            keys.map(function(url) {
              return '<a href="' + url + '" target="_blank" rel="noopener">' + esc(srcMap[url]) + '</a>';
            }).join('') +
          '</div>';
      } else {
        srcEl.innerHTML = '';
      }
    }

    /* Update the "/N" total in the progress bar */
    var acNode = q('ansTotal'); if (acNode) acNode.textContent = qs.length;

    var wrap = q('questions'); if (!wrap) return; wrap.innerHTML = '';

    qs.forEach(function(qu, i) {
      var multi = isMulti(qu);
      var card = document.createElement('div'); card.className = 'q'; card.dataset.i = i;
      var opts = qu.o.map(function(opt, j) {
        return "<div class='opt " + (multi?'multi':'single') + "' data-j='" + j + "'>" +
          "<span class='mk'>" + LETTERS[j] + "</span><span class='ot'>" + esc(opt) + "</span></div>";
      }).join('');

      card.innerHTML =
        "<div class='qmeta'>" +
          "<span class='dom" + (multi?' multi':'') + "'>" + esc(qu.d) + (multi?' · choose '+(qu.n||qu.a.length):'') + "</span>" +
          "<span class='num'>Q"+(i+1)+" / "+qs.length+"</span>" +
        "</div>" +
        "<div class='stem'>" + esc(qu.q) + "</div>" +
        "<div class='opts'>" + opts + "</div>" +
        "<div class='check-wrap'><button class='v-btn check-btn' disabled>Check Answer</button></div>" +
        "<div class='verdict'></div>" +
        "<div class='rat'><b>Rationale:</b> " + esc(qu.r) + "</div>" +
        (qu.src ? "<div class='qsrc'><a href='" + qu.src + "' target='_blank' rel='noopener'>View source question ↗</a></div>" : "");

      card.querySelectorAll('.opt').forEach(function(o) {
        o.onclick = function() { pick(i, parseInt(o.dataset.j), card); };
      });
      card.querySelector('.check-btn').onclick = function() { checkAnswer(i, card); };

      wrap.appendChild(card);
    });

    /* Restore visual state when resuming a saved session */
    if (saved) restoreCardVisuals();

    /* Reset top bar */
    var sb = q('submitBtn'), sb2 = q('submitBtn2'), qb = q('quitBtn'), pb = q('pauseBtn');
    if (sb) sb.classList.remove('v-hide');
    if (sb2) sb2.classList.remove('v-hide');
    if (qb) qb.textContent = 'Quit';
    if (pb) { pb.textContent = '⏸ Pause'; pb.disabled = false; }

    updateBar(); startTimer();
    show('exam');
  }

  /* Re-applies selection/check visuals to cards when restoring a saved session */
  function restoreCardVisuals() {
    var qs = EXAMS[current];
    qs.forEach(function(qu, i) {
      var card = _root.querySelector('.q[data-i="'+i+'"]'); if (!card) return;

      if (answers[i] && answers[i].length > 0) {
        card.querySelectorAll('.opt').forEach(function(o) {
          o.classList.toggle('sel', answers[i].indexOf(parseInt(o.dataset.j)) >= 0);
        });
        var btn = card.querySelector('.check-btn');
        if (btn) btn.disabled = false;
      }

      if (checked[i]) {
        card.querySelectorAll('.opt').forEach(function(o) {
          var j = parseInt(o.dataset.j);
          o.onclick = null;
          o.classList.remove('sel');
          if (qu.a.indexOf(j) >= 0) o.classList.add('correct');
          else if (answers[i].indexOf(j) >= 0) o.classList.add('wrong');
        });
        var ok = setsEqual(answers[i], qu.a);
        var ansLetters = qu.a.map(function(x) { return LETTERS[x]; }).join(', ');
        var verdict = card.querySelector('.verdict');
        if (verdict) {
          verdict.textContent = ok ? '✓ Correct' : '✗ Incorrect — correct answer: ' + ansLetters;
          verdict.className = 'verdict ' + (ok ? 'ok' : 'no');
        }
        card.classList.add('reviewed');
        var btn = card.querySelector('.check-btn');
        if (btn) btn.style.display = 'none';
      }
    });
    updateBar();
  }

  function pick(i, j, card) {
    if (checked[i]) return; // locked after individual check
    var qu = EXAMS[current][i];
    if (isMulti(qu)) {
      var pos = answers[i].indexOf(j);
      if (pos >= 0) answers[i].splice(pos, 1); else answers[i].push(j);
    } else {
      answers[i] = [j];
    }
    card.querySelectorAll('.opt').forEach(function(o) {
      o.classList.toggle('sel', answers[i].indexOf(parseInt(o.dataset.j)) >= 0);
    });
    /* Enable check button as soon as something is selected */
    var btn = card.querySelector('.check-btn');
    if (btn) btn.disabled = answers[i].length === 0;
    updateBar();
    saveState();
  }

  function checkAnswer(i, card) {
    if (checked[i] || answers[i].length === 0) return;
    checked[i] = true;

    var qu = EXAMS[current][i];
    var ok = setsEqual(answers[i], qu.a);
    var ansLetters = qu.a.map(function(x) { return LETTERS[x]; }).join(', ');

    /* Color options and lock clicks */
    card.querySelectorAll('.opt').forEach(function(o) {
      var j = parseInt(o.dataset.j);
      o.onclick = null;
      o.classList.remove('sel');
      if (qu.a.indexOf(j) >= 0) o.classList.add('correct');
      else if (answers[i].indexOf(j) >= 0) o.classList.add('wrong');
    });

    /* Verdict */
    var verdict = card.querySelector('.verdict');
    if (verdict) {
      verdict.textContent = ok ? '✓ Correct' : '✗ Incorrect — correct answer: ' + ansLetters;
      verdict.className = 'verdict ' + (ok ? 'ok' : 'no');
    }

    /* Show rationale, hide check button */
    card.classList.add('reviewed');
    var btn = card.querySelector('.check-btn');
    if (btn) btn.style.display = 'none';

    saveState();
  }

  function updateBar() {
    var qs = EXAMS[current]; if (!qs) return;
    var ans = answers.filter(function(a) { return a.length > 0; }).length;
    var ac = q('ansCount'); if (ac) ac.textContent = ans;
    var prog = q('prog'); if (prog) prog.style.width = (ans/qs.length*100) + '%';
  }

  function startTimer() {
    clearInterval(timerId); renderTime();
    var tickCount = 0;
    timerId = setInterval(function() {
      remaining--;
      renderTime();
      if (++tickCount % 10 === 0) saveState(); // persist every 10 s
      if (remaining <= 0) { clearInterval(timerId); submitExam(true); }
    }, 1000);
  }

  function renderTime() {
    var m = Math.floor(remaining/60), s = remaining%60;
    var t = q('timer'); if (!t) return;
    t.textContent = (m<10?'0':'') + m + ':' + (s<10?'0':'') + s;
    t.className = 'timer' + (remaining<=60?' crit':(remaining<=300?' warn':''));
  }

  function setsEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.slice().sort().join('|') === b.slice().sort().join('|');
  }

  /* ── Submit & Results ───────────────────────────────────────────────── */
  function submitExam(auto) {
    if (!auto) {
      var unanswered = answers.filter(function(a) { return a.length === 0; }).length;
      if (unanswered > 0) {
        showConfirm(
          unanswered + ' question(s) unanswered. Submit anyway?',
          function() { doSubmit(false); }
        );
        return;
      }
    }
    doSubmit(auto);
  }

  function showConfirm(msg, onOk) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center';
    overlay.innerHTML =
      '<div style="background:var(--pa-surface-1,#1a2040);border-radius:14px;padding:28px 32px;max-width:380px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.5)">' +
        '<p style="margin:0 0 20px;font-size:15px;color:var(--pa-ink)">' + esc(msg) + '</p>' +
        '<div style="display:flex;gap:10px;justify-content:center">' +
          '<button class="v-btn" id="mv-confirmCancel">Cancel</button>' +
          '<button class="v-btn v-primary" id="mv-confirmOk">Submit</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#mv-confirmOk').onclick = function() { document.body.removeChild(overlay); onOk(); };
    overlay.querySelector('#mv-confirmCancel').onclick = function() { document.body.removeChild(overlay); };
  }

  function doSubmit(auto) {
    clearInterval(timerId);
    clearState(); // exam finished — clear saved progress

    var qs = EXAMS[current];
    var correct = 0;
    var dom = {}; /* derive domains dynamically — no hardcoded list */

    qs.forEach(function(qu, i) {
      if (!dom[qu.d]) dom[qu.d] = { c: 0, t: 0 };
      dom[qu.d].t++;
      if (setsEqual(answers[i], qu.a)) { correct++; dom[qu.d].c++; }
    });

    var pct = Math.round(correct / qs.length * 100);
    var passed = correct / qs.length >= PASS;
    saveScore(current, pct);

    /* Populate result cards */
    var resTitle = q('resTitle'); if (resTitle) resTitle.textContent = current;
    var resScore = q('resScore');
    if (resScore) { resScore.textContent = correct + ' / ' + qs.length; resScore.className = 'big ' + (passed?'pass':'fail'); }
    var resPct = q('resPct');
    if (resPct) resPct.textContent = pct + '%  (pass mark 65%)';
    var pill = q('resPill');
    if (pill) { pill.textContent = passed ? 'PASS' : 'FAIL'; pill.className = 'pill ' + (passed?'pass':'fail'); }

    var used = Math.floor((Date.now()-startTs)/1000);
    if (auto) used = TIME_MIN * 60;
    var um = Math.floor(used/60), us = used % 60;
    var resTime = q('resTime');
    if (resTime) resTime.textContent = 'Time used: ' + um + 'm ' + (us<10?'0':'') + us + 's' + (auto?' (time expired — auto-submitted)':'');

    /* Domain breakdown */
    var db = q('domBreak');
    if (db) {
      db.innerHTML = '<h3 class="res-section-title">Domain breakdown</h3>';
      Object.keys(dom).forEach(function(d) {
        var o = dom[d]; if (!o || o.t === 0) return;
        var p = Math.round(o.c / o.t * 100);
        var col = p >= 65 ? 'var(--pa-ok,#34d399)' : (p >= 50 ? 'var(--pa-warn,#fbbf24)' : 'var(--pa-bad,#fb7185)');
        db.insertAdjacentHTML('beforeend',
          '<div class="dombar">' +
            '<div class="lab"><span>' + esc(d) + '</span><span>' + o.c + '/' + o.t + ' (' + p + '%)</span></div>' +
            '<div class="track"><i style="width:' + p + '%;background:' + col + '"></i></div>' +
          '</div>');
      });
    }

    show('results');
  }

  /* ── Review (post-submit full walkthrough) ──────────────────────────── */
  function reviewExam() {
    var qs = EXAMS[current];
    qs.forEach(function(qu, i) {
      var card = _root.querySelector('.q[data-i="'+i+'"]'); if (!card) return;

      /* Hide check button */
      var btn = card.querySelector('.check-btn');
      if (btn) btn.style.display = 'none';

      /* If not already individually checked, apply colors now */
      if (!checked[i]) {
        card.querySelectorAll('.opt').forEach(function(o) {
          var j = parseInt(o.dataset.j);
          o.onclick = null;
          o.classList.remove('sel');
          if (qu.a.indexOf(j) >= 0) o.classList.add('correct');
          else if (answers[i].indexOf(j) >= 0) o.classList.add('wrong');
        });
      }

      card.classList.add('reviewed');
      var ok = setsEqual(answers[i], qu.a);
      card.classList.remove('ok','no'); card.classList.add(ok?'ok':'no');

      var ansLetters = qu.a.map(function(x) { return LETTERS[x]; }).join(', ');
      var verdict = card.querySelector('.verdict');
      if (verdict) {
        verdict.textContent = ok ? '✓ Correct' : '✗ Incorrect — correct answer: ' + ansLetters;
        verdict.className = 'verdict ' + (ok?'ok':'no');
      }
    });

    show('exam');
    var sb=q('submitBtn'), sb2=q('submitBtn2'), qb=q('quitBtn'), pb=q('pauseBtn'), tm=q('timer');
    if (sb) sb.classList.add('v-hide');
    if (sb2) sb2.classList.add('v-hide');
    if (qb) qb.textContent = 'Back to results';
    if (pb) pb.classList.add('v-hide');
    if (tm) { tm.textContent = 'Review'; tm.className = 'timer'; }
    if (_root) _root.scrollIntoView({ behavior:'instant', block:'start' });
  }

  /* ── View HTML ──────────────────────────────────────────────────────── */
  function getHTML() {
    return '<div class="pa-view pa-view--mock">' +
      /* ── Home ── */
      '<section id="mv-home">' +
        '<div class="v-card">' +
          '<h2>Choose a mock exam</h2>' +
          '<p class="v-muted">Each exam mirrors the real certification blueprint with a 90-minute timer and a 65% pass mark.</p>' +
          '<div class="examgrid" id="mv-examGrid"></div>' +
        '</div>' +
        '<div class="v-card">' +
          '<h2>Domain weighting (per exam)</h2>' +
          '<div id="mv-domTable"></div>' +
        '</div>' +
      '</section>' +
      /* ── Exam ── */
      '<section id="mv-exam" class="v-hide">' +
        '<div class="exambar">' +
          '<span class="timer" id="mv-timer">90:00</span>' +
          '<button class="v-btn pause-btn" id="mv-pauseBtn">⏸ Pause</button>' +
          '<div class="prog"><i id="mv-prog"></i></div>' +
          '<span class="ac">Answered <b id="mv-ansCount">0</b>/<span id="mv-ansTotal">0</span></span>' +
          '<div class="v-row" style="margin-left:auto">' +
            '<button class="v-btn" id="mv-quitBtn">Quit</button>' +
            '<button class="v-btn v-primary" id="mv-submitBtn">Submit Exam</button>' +
          '</div>' +
        '</div>' +
        '<div id="mv-examTitle" class="v-muted" style="padding:10px 2px 4px"></div>' +
        '<div id="mv-examSources"></div>' +
        '<div id="mv-questions"></div>' +
        '<div style="text-align:center;margin-top:18px">' +
          '<button class="v-btn v-primary" id="mv-submitBtn2">Submit Exam</button>' +
        '</div>' +
      '</section>' +
      /* ── Results ── */
      '<section id="mv-results" class="v-hide">' +
        '<div class="v-card result">' +
          '<div class="v-muted res-exam-name" id="mv-resTitle"></div>' +
          '<div class="big" id="mv-resScore"></div>' +
          '<div id="mv-resPct" class="v-muted"></div>' +
          '<div style="margin:12px 0"><span class="pill" id="mv-resPill"></span></div>' +
          '<div class="v-muted" id="mv-resTime"></div>' +
          '<div class="dombars" id="mv-domBreak"></div>' +
          '<div class="v-row" style="justify-content:center;margin-top:20px;flex-wrap:wrap;gap:8px">' +
            '<button class="v-btn" id="mv-reviewBtn">Review answers</button>' +
            '<button class="v-btn" id="mv-retryBtn">Retake this exam</button>' +
            '<button class="v-btn v-primary" id="mv-homeBtn">Back to exams</button>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '</div>';
  }

  function getSidebarHTML() {
    var scores = loadScores();
    return Object.keys(EXAMS).map(function(name, i) {
      var sc = scores[name];
      var best = sc != null ? (sc + '%') : null;
      return '<li><a href="javascript:void(0)" data-exam="' + esc(name) + '" class="pa-shell-sidebar-item' + (best && sc >= 65 ? ' done' : '') + '">' +
        '<span class="pa-shell-sidebar-num' + (best && sc >= 65 ? ' done' : '') + '">' + (i+1) + '</span>' +
        '<span style="flex:1;min-width:0">' +
          '<span style="display:block">' + esc(name) + '</span>' +
          (best ? '<span style="font-size:11px;color:var(--pa-ok,#34d399)">' + best + '</span>' :
                  '<span style="font-size:11px;color:var(--pa-muted,#939bbd)">Not attempted</span>') +
        '</span></a></li>';
    }).join('');
  }

  /* ── Public API ─────────────────────────────────────────────────────── */
  function mount(contentEl, sidebarEl) {
    clearInterval(timerId); timerId = null; current = null; paused = false;
    answers = []; checked = []; _root = null;

    contentEl.innerHTML = getHTML();
    _root = contentEl.querySelector('.pa-view--mock');

    if (sidebarEl) {
      sidebarEl.innerHTML = getSidebarHTML();
      wireSidebar(sidebarEl);
    }

    q('homeBtn').addEventListener('click', function() {
      renderHome();
      if (sidebarEl) { sidebarEl.innerHTML = getSidebarHTML(); wireSidebar(sidebarEl); }
    });
    q('retryBtn').addEventListener('click', function() { startExam(current); });
    q('reviewBtn').addEventListener('click', reviewExam);
    q('submitBtn').addEventListener('click', function() { submitExam(false); });
    q('submitBtn2').addEventListener('click', function() { submitExam(false); });
    q('pauseBtn').addEventListener('click', function() {
      if (paused) resumeExam(); else pauseExam();
    });
    q('quitBtn').addEventListener('click', function() {
      if (q('quitBtn').textContent === 'Back to results') {
        q('submitBtn').classList.remove('v-hide');
        q('submitBtn2').classList.remove('v-hide');
        q('pauseBtn').classList.remove('v-hide');
        q('quitBtn').textContent = 'Quit';
        show('results'); return;
      }
      showConfirm('Quit this exam? Your saved progress will be cleared.', function() {
        clearInterval(timerId);
        clearState();
        renderHome();
      });
    });

    renderHome();
  }

  function wireSidebar(sidebarEl) {
    if (!sidebarEl) return;
    sidebarEl.querySelectorAll('.pa-shell-sidebar-item').forEach(function(a) {
      a.addEventListener('click', function(e) { e.preventDefault(); startExam(a.getAttribute('data-exam')); });
    });
  }

  function unmount() {
    clearInterval(timerId); timerId = null; current = null; paused = false; _root = null;
    var layer = document.getElementById('mv-pauseLayer');
    if (layer) layer.remove();
  }

  /* Cache the parsed exam bank so we fetch the (large) JSON only once */
  var _examsPromise = null;
  function loadExamBank() {
    if (!_examsPromise) {
      _examsPromise = fetch('data/mock-exams.json')
        .then(function(res) { if (!res.ok) throw new Error('mock-exams.json HTTP ' + res.status); return res.json(); })
        .catch(function(err) {
          console.error('Failed to load mock exams:', err);
          _examsPromise = null;
          return {};
        });
    }
    return _examsPromise;
  }

  class PegaMockView extends HTMLElement {
    connectedCallback() {
      var self = this;
      var track = getTrack();
      loadExamBank().then(function(data) {
        EXAMS = (data && data[track]) || {};
        mount(self, document.getElementById('paModList'));
      });
    }
    disconnectedCallback() { unmount(); }
  }

  customElements.define('pega-mock-view', PegaMockView);

})(window);

/* =====================================================================
   review-view.js — Smart Review (SRS) view module
   Exposes window.ReviewView = { mount(contentEl, sidebarEl), unmount() }
   Never touches engine.js, quiz-engine.js, or data/*.
   ===================================================================== */
(function (global) {
  'use strict';

  var SRS_KEY = 'pega_srs_state';
  var BOX_DAYS = [0, 2, 4, 8, 16];
  var SESSION_SIZE = 15;

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

  var DOMAINS = ['Case Management','Data & Integration','Application Development',
    'Security','User Experience','Pega GenAI','DevOps','Insights'];

  var DCOLORS = {
    'Case Management':'#4f7cff','Data & Integration':'#22d3ee',
    'Application Development':'#7a5cff','Security':'#ff5d6c',
    'User Experience':'#1fc77d','Pega GenAI':'#f59e0b',
    'DevOps':'#e879f9','Insights':'#34d399'
  };

  var LETTERS = ['A','B','C','D','E','F'];

  /* ── Per-mount state ────────────────────────────────────────────────── */
  var _root = null;
  var cardBank = {};
  var srs = {};
  var session = [];
  var sessIdx = 0;
  var sessResults = [];
  var currentSelected = [];
  var currentQ = null;
  var currentKey = null;

  /* ── Utilities ──────────────────────────────────────────────────────── */
  function r(id) { return _root ? _root.querySelector('#rv-' + id) : null; }
  function esc(s) { return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function today() { return new Date().toISOString().slice(0,10); }
  function addDays(ds, n) { var d=new Date(ds+'T12:00:00'); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }
  function setsEqual(a,b) { if(a.length!==b.length) return false; return a.slice().sort().join('|')===b.slice().sort().join('|'); }
  function shuffle(arr) { var a=arr.slice(),i,j,t; for(i=a.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=a[i];a[i]=a[j];a[j]=t;} return a; }
  function nocache(url) { return url+(url.indexOf('?')<0?'?':'&')+'_t='+Date.now(); }
  function scrollTop() { if(_root) _root.scrollIntoView({behavior:'instant',block:'start'}); }

  function getTrack() {
    return (global.PegaStore && global.PegaStore.state.activeTrack) ? global.PegaStore.state.activeTrack : 'PSA';
  }

  function showSec(id) {
    ['loading','error','empty','dashboard','session','summary'].forEach(function(s) {
      var el=r(s); if(el) el.classList.toggle('v-hide', s!==id);
    });
  }

  /* ── SRS state ──────────────────────────────────────────────────────── */
  function loadSRS() {
    if (global.PegaStore) {
      var t = getTrack();
      if (!global.PegaStore.state.tracks[t]) global.PegaStore.state.tracks[t] = { mock: {}, srs: {} };
      var stateSrs = global.PegaStore.state.tracks[t].srs;
      if (!stateSrs) { stateSrs = {}; global.PegaStore.state.tracks[t].srs = stateSrs; }
      if (!stateSrs.cards) stateSrs.cards = {};
      if (!stateSrs.surpriseIds) stateSrs.surpriseIds = [];
      if (!stateSrs.streak) stateSrs.streak = 0;
      return stateSrs;
    }
    return {cards:{},streak:0,lastStudyDate:null,surpriseIds:[]};
  }
  function saveSRS() { /* Auto-persisted by ES6 Proxy */ }

  /* ── Due logic ──────────────────────────────────────────────────────── */
  function isDue(key) { var c=srs.cards[key]; return !c||c.dueDate<=today(); }
  function getDueKeys() {
    var keys=Object.keys(cardBank).filter(isDue);
    keys.sort(function(a,b){var da=srs.cards[a]?srs.cards[a].dueDate:'2000-01-01';var db=srs.cards[b]?srs.cards[b].dueDate:'2000-01-01';return da<db?-1:da>db?1:0;});
    return keys;
  }
  function getStats() {
    var t=today(),due=0,nw=0,mastered=0;
    Object.keys(cardBank).forEach(function(k){var c=srs.cards[k];if(!c){nw++;due++;return;}if(c.box===5)mastered++;if(c.dueDate<=t)due++;});
    return {total:Object.keys(cardBank).length,due:due,newCards:nw,mastered:mastered};
  }

  /* ── Grading ────────────────────────────────────────────────────────── */
  function gradeCard(key,correct,conf) {
    var t=today();
    if(!srs.cards[key]) srs.cards[key]={box:1,dueDate:t,totalSeen:0,totalCorrect:0,surpriseCount:0};
    var c=srs.cards[key]; c.totalSeen=(c.totalSeen||0)+1;
    var wasSurprise=(conf==='sure'&&!correct);
    if(correct){if(conf==='sure')c.box=Math.min(5,(c.box||1)+1);c.totalCorrect=(c.totalCorrect||0)+1;}
    else{c.box=1;if(wasSurprise){c.surpriseCount=(c.surpriseCount||0)+1;srs.surpriseIds=[key].concat((srs.surpriseIds||[]).filter(function(k){return k!==key;})).slice(0,20);}}
    c.dueDate=addDays(t,BOX_DAYS[(c.box||1)-1]);
    if(srs.lastStudyDate!==t){srs.streak=(srs.lastStudyDate===addDays(t,-1))?(srs.streak||0)+1:1;srs.lastStudyDate=t;}
    saveSRS(); return wasSurprise;
  }

  /* ── Session ────────────────────────────────────────────────────────── */
  function startSession() {
    var due=getDueKeys();
    if(due.length===0){renderDashboard();showSec('dashboard');return;}
    session=shuffle(due.slice(0,SESSION_SIZE)); sessIdx=0; sessResults=[];
    showSec('session');
    var st=r('scnt-tot'); if(st) st.textContent=session.length;
    renderQ(0);
  }

  function renderQ(idx) {
    var key=session[idx]; var entry=cardBank[key]; var q=entry.q;
    var isMulti=q.type==='multi-select';
    var box=srs.cards[key]?srs.cards[key].box:1;
    var domain=MOD_DOMAIN[entry.moduleId]||'General';
    currentSelected=[]; currentQ=q; currentKey=key;
    var sc=r('scnt-cur'); if(sc) sc.textContent=idx+1;
    var sb=r('sprg-bar'); if(sb) sb.style.width=(idx/session.length*100)+'%';
    var boxDots=[1,2,3,4,5].map(function(b){return '<span'+(b<=box?' class="on"':'')+'></span>';}).join('');
    var optsHtml=q.options.map(function(o,i){return '<div class="opt '+(isMulti?'multi':'single')+'" data-id="'+esc(o.id)+'"><span class="mk">'+LETTERS[i]+'</span><span class="ot">'+esc(o.text)+'</span></div>';}).join('');
    var hintHtml=q.hint?'<button class="v-btn hint-btn" id="rv-hint-btn">💡 Hint</button><div class="hintbox" id="rv-hintbox">'+esc(q.hint)+'</div>':'';
    var selectLabel=isMulti?esc(domain)+' · Select '+(q.selectCount||q.correctOptions.length):esc(domain);
    var qn=r('qcontainer'); if(!qn) return;
    qn.innerHTML=
      '<div class="qcard">'+
        '<div class="qmeta">'+
          '<span class="qdom'+(isMulti?' multi':'')+'">'+selectLabel+'</span>'+
          '<span class="qboxdots">Box '+box+': '+boxDots+'</span>'+
        '</div>'+
        '<div class="qmod">'+esc(entry.moduleName)+'</div>'+
        '<div class="qstem">'+esc(q.scenario)+'</div>'+
        '<div class="opts-wrap">'+optsHtml+'</div>'+
        hintHtml+
        '<div class="conf-wrap" id="rv-conf-wrap">'+
          '<p>How confident are you in your answer?</p>'+
          '<div class="conf-btns">'+
            '<button class="cbtn g" data-conf="guess">🤞 Just Guessing</button>'+
            '<button class="cbtn u" data-conf="unsure">🤔 Unsure</button>'+
            '<button class="cbtn s" data-conf="sure">✅ Confident</button>'+
          '</div>'+
        '</div>'+
        '<div class="verdict" id="rv-verdict"></div>'+
        '<div class="rationale" id="rv-rationale"><b>Rationale:</b> '+esc(q.rationale)+'</div>'+
        '<div class="btn-row" style="margin-top:13px">'+
          '<button class="v-btn v-primary v-hide" id="rv-btn-next">'+(idx+1<session.length?'Next →':'📊 Results')+'</button>'+
        '</div>'+
      '</div>';

    var optEls=qn.querySelectorAll('.opt');
    optEls.forEach(function(el){
      el.addEventListener('click',function(){
        if(el.classList.contains('dis')) return;
        var id=el.getAttribute('data-id');
        if(isMulti){var pos=currentSelected.indexOf(id);if(pos>=0){currentSelected.splice(pos,1);el.classList.remove('sel');}else{currentSelected.push(id);el.classList.add('sel');}}
        else{currentSelected=[id];optEls.forEach(function(x){x.classList.remove('sel');});el.classList.add('sel');}
        var ready=isMulti?currentSelected.length===(q.selectCount||q.correctOptions.length):currentSelected.length===1;
        if(ready){var cw=_root.querySelector('#rv-conf-wrap');if(cw)cw.classList.add('show');}
      });
    });
    qn.querySelectorAll('.cbtn').forEach(function(btn){btn.addEventListener('click',function(){submitConf(btn.getAttribute('data-conf'));});});
    var hb=qn.querySelector('#rv-hint-btn');
    if(hb) hb.addEventListener('click',function(){var hbox=_root.querySelector('#rv-hintbox');if(hbox)hbox.classList.toggle('show');});
    var nb=qn.querySelector('#rv-btn-next');
    if(nb) nb.addEventListener('click',advanceSession);
  }

  function submitConf(conf) {
    if(!currentSelected.length) return;
    var q=currentQ; var key=currentKey;
    var qn=r('qcontainer'); if(!qn) return;
    qn.querySelectorAll('.opt').forEach(function(el){el.classList.add('dis');});
    var cw=_root.querySelector('#rv-conf-wrap'); if(cw) cw.classList.remove('show');
    var isCorrect=setsEqual(currentSelected,q.correctOptions);
    var wasSurprise=gradeCard(key,isCorrect,conf);
    qn.querySelectorAll('.opt').forEach(function(el){
      var id=el.getAttribute('data-id');
      var inAns=q.correctOptions.indexOf(id)>=0;
      var picked=currentSelected.indexOf(id)>=0;
      var mk=el.querySelector('.mk');
      if(inAns){el.classList.add('cor');if(mk)mk.textContent='✓';}
      else if(picked){el.classList.add('wrg');if(mk)mk.textContent='✗';}
    });
    var vEl=_root.querySelector('#rv-verdict');
    if(vEl){
      vEl.classList.add('show');
      if(isCorrect){
        var confNote=conf==='sure'?' · ⬆ Box promoted!':' · Box unchanged';
        vEl.className='verdict ok show';vEl.textContent='✓ Correct'+confNote;
      } else {
        var ansL=q.correctOptions.map(function(cid){var i=q.options.findIndex(function(o){return o.id===cid;});return LETTERS[i];}).join(', ');
        var msg=q.type==='multi-select'?'✗ Incorrect (no partial credit). Correct set: '+ansL:'✗ Incorrect. Correct answer: '+ansL;
        vEl.className='verdict no show';vEl.innerHTML=esc(msg)+(wasSurprise?' <span class="surp-badge">⚡ Surprise!</span>':'');
      }
    }
    var rat=_root.querySelector('#rv-rationale'); if(rat) rat.classList.add('show');
    var nb=_root.querySelector('#rv-btn-next'); if(nb) nb.classList.remove('v-hide');
    var sb=r('sprg-bar'); if(sb) sb.style.width=((sessIdx+1)/session.length*100)+'%';
    sessResults.push({key:key,correct:isCorrect,conf:conf,wasSurprise:wasSurprise});
  }

  function advanceSession() {
    sessIdx++;
    if(sessIdx>=session.length){renderSummary();return;}
    renderQ(sessIdx); scrollTop();
  }

  /* ── Summary ────────────────────────────────────────────────────────── */
  function renderSummary() {
    showSec('summary');
    var total=sessResults.length;
    var correct=sessResults.filter(function(r){return r.correct;}).length;
    var surprises=sessResults.filter(function(r){return r.wasSurprise;}).length;
    var pct=total?Math.round(correct/total*100):0;
    var promoted=sessResults.filter(function(r){return r.correct&&r.conf==='sure';}).length;
    var pctClass=pct>=70?'ok':pct>=50?'brand':'bad';
    var sg=r('sum-grid');
    if(sg) sg.innerHTML=
      '<div class="sum-stat"><div class="big '+pctClass+'">'+pct+'%</div><div class="slbl">Accuracy</div></div>'+
      '<div class="sum-stat"><div class="big brand">'+correct+' / '+total+'</div><div class="slbl">Correct / Total</div></div>'+
      '<div class="sum-stat"><div class="big ok">'+promoted+'</div><div class="slbl">⬆ Cards Promoted</div></div>'+
      '<div class="sum-stat"><div class="big surp">'+surprises+'</div><div class="slbl">⚡ Surprise Errors</div></div>';
    var sd=r('sum-surp');
    if(sd){
      if(surprises>0){var st=r('sum-surp-title');if(st)st.textContent='⚡ '+surprises+' surprise error'+(surprises>1?'s':'')+' this session';sd.classList.remove('v-hide');}
      else{sd.classList.add('v-hide');}
    }
    scrollTop();
  }

  /* ── Dashboard ──────────────────────────────────────────────────────── */
  function renderDashboard() {
    var stats=getStats(); var t=today();
    var sr=r('stats-row');
    if(sr) sr.innerHTML=
      '<div class="stat-box"><div class="num brand">'+stats.due+'</div><div class="lbl">Due Today</div></div>'+
      '<div class="stat-box"><div class="num">'+stats.newCards+'</div><div class="lbl">New Cards</div></div>'+
      '<div class="stat-box"><div class="num ok">'+stats.mastered+'</div><div class="lbl">Mastered</div></div>'+
      '<div class="stat-box"><div class="num">'+stats.total+'</div><div class="lbl">Total Cards</div></div>'+
      '<div class="stat-box"><div class="num warn">'+(srs.streak||0)+' 🔥</div><div class="lbl">Day Streak</div></div>';
    var btnStart=r('btn-start');
    if(btnStart){if(stats.due===0){btnStart.textContent='✓ All caught up today!';btnStart.disabled=true;}else{btnStart.textContent='▶ Review '+Math.min(stats.due,SESSION_SIZE)+' Cards';btnStart.disabled=false;}}
    var dg=r('domain-grid');
    if(dg) dg.innerHTML=DOMAINS.map(function(dom){
      var keys=Object.keys(cardBank).filter(function(k){return(MOD_DOMAIN[cardBank[k].moduleId]||'')===dom;});
      var mastered=keys.filter(function(k){return srs.cards[k]&&srs.cards[k].box>=3;}).length;
      var pct=keys.length?Math.round(mastered/keys.length*100):0;
      return '<div class="drow"><div class="dmeta"><span class="dname">'+esc(dom)+'</span><span class="dpct">'+pct+'% ('+mastered+'/'+keys.length+')</span></div><div class="dbar"><i style="width:'+pct+'%;background:'+(DCOLORS[dom]||'#4f7cff')+'"></i></div></div>';
    }).join('');
    var surpIds=(srs.surpriseIds||[]).slice(0,10);
    var cardSurp=r('card-surp');
    if(cardSurp){
      if(surpIds.length>0){
        cardSurp.classList.remove('v-hide');
        var sl=r('surp-list');
        if(sl) sl.innerHTML=surpIds.map(function(key){var e=cardBank[key];if(!e)return '';var stem=e.q.scenario.length>110?e.q.scenario.slice(0,110)+'…':e.q.scenario;return '<li><span>⚡</span><span><span class="smod">'+esc(e.moduleName)+'</span>'+esc(stem)+'</span></li>';}).filter(Boolean).join('');
      } else {
        cardSurp.classList.add('v-hide');
      }
    }
    renderSidebarStats();
  }

  /* ── Sidebar ────────────────────────────────────────────────────────── */
  function renderSidebarStats() {
    if(!_sidebarEl) return;
    var stats=getStats();
    _sidebarEl.innerHTML=
      '<li class="pa-shell-sidebar-item pa-shell-sidebar-header">Overview</li>'+
      '<li><div class="rv-sidebar-stat"><span>Due Today</span><b style="color:var(--pa-brand,#6d8bff)">'+stats.due+'</b></div></li>'+
      '<li><div class="rv-sidebar-stat"><span>New Cards</span><b>'+stats.newCards+'</b></div></li>'+
      '<li><div class="rv-sidebar-stat"><span>Mastered</span><b style="color:var(--pa-ok,#34d399)">'+stats.mastered+'</b></div></li>'+
      '<li><div class="rv-sidebar-stat"><span>Total</span><b>'+stats.total+'</b></div></li>'+
      '<li><div class="rv-sidebar-stat"><span>Streak</span><b style="color:var(--pa-warn,#fbbf24)">'+(srs.streak||0)+' 🔥</b></div></li>'+
      '<li style="margin-top:12px">'+
        '<a href="javascript:void(0)" id="rv-sb-start" class="pa-shell-sidebar-item">▶ Start Session</a>'+
      '</li>';
    var sbStart=_sidebarEl.querySelector('#rv-sb-start');
    if(sbStart) sbStart.addEventListener('click',function(){showSec('session');startSession();});
  }

  /* ── View HTML ──────────────────────────────────────────────────────── */
  function getHTML() {
    return '<div class="pa-view pa-view--review">'+
      /* loading */
      '<section id="rv-loading">'+
        '<div class="loading-state">'+
          '<div class="spinner"></div>'+
          '<div>Loading question bank… (48 modules)</div>'+
          '<div id="rv-load-prog" style="margin-top:6px;font-size:13px;color:var(--pa-muted,#939bbd)"></div>'+
        '</div>'+
      '</section>'+
      /* error */
      '<section id="rv-error" class="v-hide">'+
        '<div class="err-box">'+
          '<b>⚠️ Failed to load</b>'+
          '<p style="margin-top:6px;font-size:13px">Opening via <code>file://</code> blocks <code>fetch()</code>. Run a local server:</p>'+
          '<code>python3 -m http.server</code>'+
          '<p style="margin-top:8px;font-size:13px">Then open: <code>http://localhost:8000/</code></p>'+
          '<div id="rv-err-detail" style="margin-top:8px;font-size:12px;color:#ff9ea6"></div>'+
        '</div>'+
      '</section>'+
      /* empty state */
      '<section id="rv-empty" class="v-hide">'+
        '<div class="v-empty-state" style="text-align:center; padding: 40px; background: var(--pa-surface-alt); border-radius: 12px; border: 1px dashed var(--pa-border); margin: 20px;">' +
        '<div style="font-size: 3rem; margin-bottom: 16px;">🚧</div>' +
        '<h3 style="margin-bottom: 8px;">Content Coming Soon</h3>' +
        '<p class="v-muted" style="max-width: 400px; margin: 0 auto;">Smart Review flashcards for this track are currently being authored and will be available in a future update.</p>' +
        '</div>'+
      '</section>'+
      /* dashboard */
      '<section id="rv-dashboard" class="v-hide">'+
        '<div class="v-card">'+
          '<h2>📊 Overview</h2>'+
          '<div class="stats-row" id="rv-stats-row"></div>'+
          '<div class="v-row" style="margin-top:14px">'+
            '<button class="v-btn v-primary" id="rv-btn-start">▶ Start Review Session</button>'+
            '<button class="v-btn v-danger" id="rv-btn-reset">Reset Progress</button>'+
          '</div>'+
        '</div>'+
        '<div class="v-card">'+
          '<h2>Domain Mastery</h2>'+
          '<div class="domain-grid" id="rv-domain-grid"></div>'+
        '</div>'+
        '<div class="v-card v-hide" id="rv-card-surp">'+
          '<h2>⚡ High-Confidence Errors <span style="font-size:13px;color:var(--pa-muted,#939bbd);font-weight:400">(last 10)</span></h2>'+
          '<p style="font-size:13px;color:var(--pa-muted,#939bbd);margin-bottom:10px">Cards you answered "Confident" but got wrong — the hypercorrection effect makes these the fastest to fix permanently.</p>'+
          '<ul class="surp-list" id="rv-surp-list"></ul>'+
        '</div>'+
        '<div class="v-card">'+
          '<h2>ℹ️ How It Works</h2>'+
          '<div class="info-box">'+
            '<b>Spaced repetition (Leitner 5-box):</b> Today → +2 days → +4 → +8 → +16. Wrong answer = back to Box 1.<br>'+
            '<b>Confidence calibration:</b> "Confident" + correct → promoted. "Guessing"/"Unsure" + correct → stays (shorter interval).<br>'+
            '<b>⚡ Surprise:</b> "Confident" + wrong → Box 1 + priority queue. Hypercorrection effect.<br>'+
            '<b>Interleaved:</b> Each session pulls from all modules in random order.'+
          '</div>'+
        '</div>'+
      '</section>'+
      /* session */
      '<section id="rv-session" class="v-hide">'+
        '<div class="sess-bar">'+
          '<div class="sprg"><i id="rv-sprg-bar"></i></div>'+
          '<span class="scnt"><b id="rv-scnt-cur">1</b> / <b id="rv-scnt-tot">15</b></span>'+
          '<button class="v-btn" style="margin-left:auto;font-size:12px;padding:5px 12px" id="rv-btn-quit">Exit</button>'+
        '</div>'+
        '<div id="rv-qcontainer"></div>'+
      '</section>'+
      /* summary */
      '<section id="rv-summary" class="v-hide">'+
        '<div class="v-card" style="text-align:center">'+
          '<h2 style="border:none;padding:0;margin-bottom:8px">✅ Session Complete</h2>'+
          '<div class="sum-grid" id="rv-sum-grid"></div>'+
          '<div id="rv-sum-surp" class="v-hide" style="margin:12px 0;background:var(--surpbg,#2d1e00);border:1px solid rgba(245,158,11,.3);border-radius:10px;padding:12px 15px;text-align:left">'+
            '<b style="color:var(--surp,#f59e0b)" id="rv-sum-surp-title">⚡ Surprise errors detected</b>'+
            '<p style="font-size:13px;color:var(--pa-muted,#939bbd);margin-top:4px">These cards were reset to Box 1 and added to your priority queue.</p>'+
          '</div>'+
          '<div class="v-row" style="justify-content:center;margin-top:14px">'+
            '<button class="v-btn v-primary" id="rv-btn-newsess">▶ New Session</button>'+
            '<button class="v-btn" id="rv-btn-todash">📊 Dashboard</button>'+
          '</div>'+
        '</div>'+
      '</section>'+
    '</div>';
  }

  var _sidebarEl = null;

  /* ── Public API ─────────────────────────────────────────────────────── */
  function mount(contentEl, sidebarEl) {
    /* Reset state from any prior mount */
    cardBank={}; srs={}; session=[]; sessIdx=0; sessResults=[]; currentSelected=[]; currentQ=null; currentKey=null; _root=null; _sidebarEl=sidebarEl||null;

    contentEl.innerHTML=getHTML();
    _root=contentEl.querySelector('.pa-view--review');

    srs=loadSRS();

    /* Wire buttons */
    var btnStart=r('btn-start'); if(btnStart) btnStart.addEventListener('click',startSession);
    var btnReset=r('btn-reset'); if(btnReset) btnReset.addEventListener('click',function(){
      if(confirm('All SRS progress will be permanently deleted. Are you sure?')){
        if(global.PegaStore) { 
          var t = getTrack();
          if (!global.PegaStore.state.tracks[t]) global.PegaStore.state.tracks[t] = { mock: {}, srs: {} };
          global.PegaStore.state.tracks[t].srs = {cards:{},streak:0,lastStudyDate:null,surpriseIds:[]}; 
          srs = global.PegaStore.state.tracks[t].srs; 
        }
        renderDashboard();
      }
    });
    var btnQuit=r('btn-quit'); if(btnQuit) btnQuit.addEventListener('click',function(){
      if(sessResults.length>0){renderSummary();}else{showSec('dashboard');renderDashboard();}
    });
    var btnNew=r('btn-newsess'); if(btnNew) btnNew.addEventListener('click',startSession);
    var btnToDash=r('btn-todash'); if(btnToDash) btnToDash.addEventListener('click',function(){showSec('dashboard');renderDashboard();});

    if(sidebarEl){
      sidebarEl.innerHTML='<li><div class="rv-sidebar-stat"><span style="color:var(--pa-muted,#939bbd)">Loading…</span></div></li>';
    }

    showSec('loading');

    var activeTrackId = getTrack();
    fetch(nocache('data/registry.json'))
      .then(function(res){if(!res.ok)throw new Error('registry.json HTTP '+res.status);return res.json();})
      .then(function(reg){
        var track=reg.tracks.filter(function(t){return t.trackId===activeTrackId;})[0];
        if(!track) throw new Error(activeTrackId + ' track not found in registry.json');
        var mods=track.modules.filter(function(m){return m.ready!==false;});
        if(mods.length===0) throw new Error('EMPTY_TRACK');
        var loaded=0;
        var progEl=r('load-prog'); if(progEl) progEl.textContent='0 / '+mods.length+' modules';
        return Promise.all(mods.map(function(meta){
          return fetch(nocache(meta.file))
            .then(function(res){if(!res.ok)throw new Error(meta.file+' HTTP '+res.status);return res.json();})
            .then(function(data){
              var mid=data.moduleId||meta.id; var mname=data.moduleTitle||meta.name;
              (data.practiceQuiz||[]).forEach(function(q){cardBank[mid+'::'+q.questionId]={moduleId:mid,moduleName:mname,q:q};});
              loaded++;
              if(progEl) progEl.textContent=loaded+' / '+mods.length+' modules loaded';
            });
        }));
      })
      .then(function(){
        if(Object.keys(cardBank).length === 0) {
          showSec('empty');
          if(sidebarEl) sidebarEl.innerHTML='<li><div class="rv-sidebar-stat"><span style="color:var(--pa-muted,#939bbd)">No cards</span></div></li>';
        } else {
          showSec('dashboard');
          renderDashboard();
        }
      })
      .catch(function(err){
        if(err.message==='EMPTY_TRACK') {
          showSec('empty');
          if(sidebarEl) sidebarEl.innerHTML='<li><div class="rv-sidebar-stat"><span style="color:var(--pa-muted,#939bbd)">No cards</span></div></li>';
          return;
        }
        showSec('error');
        var ed=r('err-detail');if(ed)ed.textContent=String(err);
      });
  }

  function unmount() {
    _root=null; _sidebarEl=null;
    cardBank={}; srs={}; session=[]; sessIdx=0; sessResults=[]; currentSelected=[]; currentQ=null; currentKey=null;
  }

  class PegaReviewView extends HTMLElement {
    connectedCallback() {
      // The LMS shell sidebar is known globally
      mount(this, document.getElementById('paModList'));
    }
    disconnectedCallback() {
      unmount();
    }
  }

  customElements.define('pega-review-view', PegaReviewView);

})(window);

/* Loaded on demand before learning interactions. Historical snapshots never mutate course content. */
(function(global){
  'use strict';
  var KEY='quilyn_learning', LIMIT=50, MAX_MISSES=500;
  var kinds=['quiz','mock','review','retry'], modes=['practice','simulation'];
  function id(){return global.crypto&&global.crypto.randomUUID?global.crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2);}
  function text(v,n){return typeof v==='string'&&v.length<=n;}
  function date(v){return typeof v==='string'&&Number.isFinite(Date.parse(v));}
  function equal(a,b){return JSON.stringify(a.slice().sort())===JSON.stringify(b.slice().sort());}
  function signature(q){return global.QuilynProgress.quizSignature({type:q.type,scenario:q.scenario,options:q.options,correctOptions:q.correct});}
  function validFeedback(q, ids){
    return (q.lessonSection===undefined || text(q.lessonSection,120)&&/^[A-Za-z0-9-]{1,120}$/.test(q.lessonSection)) &&
      (q.explanationReviewedOn===undefined || /^\d{4}-\d{2}-\d{2}$/.test(q.explanationReviewedOn)&&date(q.explanationReviewedOn)) &&
      (q.optionExplanations===undefined || q.optionExplanations && typeof q.optionExplanations==='object' && !Array.isArray(q.optionExplanations) && Object.keys(q.optionExplanations).length===ids.length && ids.every(function(id){return Object.prototype.hasOwnProperty.call(q.optionExplanations,id)&&text(q.optionExplanations[id],2000)&&q.optionExplanations[id].trim().length>0;}));
  }
  function feedbackFields(result,q){
    if(q.lessonSection!==undefined)result.lessonSection=q.lessonSection;
    if(q.optionExplanations!==undefined)result.optionExplanations=Object.assign({},q.optionExplanations);
    if(q.explanationReviewedOn!==undefined)result.explanationReviewedOn=q.explanationReviewedOn;
    return result;
  }
  function validQuestion(q){
    return q&&text(q.key,20000)&&text(q.track,80)&&/^[A-Za-z0-9-]+$/.test(q.track)&&text(q.moduleId,120)&&text(q.questionId,120)&&text(q.domain,200)&&text(q.scenario,20000)&&text(q.rationale,20000)&&text(q.source,2000)&&(!q.source||/^https:\/\//.test(q.source))&&
      ['single-select','multi-select'].includes(q.type)&&Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=12&&q.options.every(function(o){return o&&text(o.id,120)&&text(o.text,20000);})&&new Set(q.options.map(function(o){return o.id;})).size===q.options.length&&
      Array.isArray(q.correct)&&q.correct.length>0&&q.correct.every(function(a){return q.options.some(function(o){return o.id===a;});})&&new Set(q.correct).size===q.correct.length&&
      (q.type!=='single-select'||q.correct.length===1)&&text(q.signature,100000)&&signature(q)===q.signature&&validFeedback(q,q.options.map(function(o){return o.id;}));
  }
  function validRow(r){return r&&(r.slot===undefined||text(r.slot,200))&&validQuestion(r.snapshot)&&Array.isArray(r.selected)&&new Set(r.selected).size===r.selected.length&&r.selected.every(function(a){return r.snapshot.options.some(function(o){return o.id===a;});})&&(r.snapshot.type!=='single-select'||r.selected.length<=1)&&[null,'guess','unsure','sure'].includes(r.conf);}
  function bytes(state){return new TextEncoder().encode(JSON.stringify(state)).length;}
  function valid(state){
    if(!state||state.version!==1||!Array.isArray(state.attempts)||state.attempts.length>LIMIT||!state.mistakes||typeof state.mistakes!=='object'||Array.isArray(state.mistakes))return false;
    var keys=Object.keys(state.mistakes);if(keys.length>MAX_MISSES||bytes(state)>2000000)return false;
    return state.attempts.every(function(a){return a&&text(a.id,200)&&text(a.track,80)&&text(a.name,500)&&kinds.includes(a.kind)&&modes.includes(a.mode)&&['in-progress','completed','abandoned'].includes(a.status)&&date(a.startedAt)&&date(a.updatedAt)&&Number.isInteger(a.total)&&a.total>0&&a.total<=200&&Number.isFinite(a.elapsedSeconds)&&a.elapsedSeconds>=0&&a.elapsedSeconds<=86400*365&&Array.isArray(a.rows)&&a.rows.length<=a.total&&a.rows.every(validRow)&&new Set(a.rows.map(function(r){return r.slot||r.snapshot.key;})).size===a.rows.length&&a.rows.every(function(r){return validRow(r)&&r.snapshot.track===a.track;});})&&
      new Set(state.attempts.map(function(a){return a.id;})).size===state.attempts.length&&keys.every(function(k){var m=state.mistakes[k];return validRow(m)&&m.snapshot.key===k&&date(m.lastAt)&&Number.isInteger(m.failures)&&m.failures>0&&typeof m.resolved==='boolean'&&kinds.includes(m.kind);});
  }
  function read(){return global.QuilynProgress.read(KEY,{version:1,attempts:[],mistakes:{}});}
  function quizQuestion(track,module,q,domain){
    if(q.learningSnapshot)return q.learningSnapshot;
    var result={key:track+'/'+module+'/'+q.questionId,track:track,moduleId:module||'',questionId:q.questionId,domain:domain||'General',type:q.type,scenario:q.scenario,options:q.options.map(function(o){return {id:o.id,text:o.text};}),correct:q.correctOptions.slice(),rationale:q.rationale||'',source:global.QuilynRuntime.safeUrl(q.sourceUrl||q.src||'')};
    if(!q.sourceUrl&&!q.src)result.source='';result.signature=signature(result);return feedbackFields(result,q);
  }
  function mockQuestion(track,name,q,index){
    var result={track:track,moduleId:q.sourceModuleId||'',questionId:q.sourceQuestionId||q.questionId||'Q'+(index+1),domain:q.d||'General',type:q.a.length>1?'multi-select':'single-select',scenario:q.q,options:q.o.map(function(v,i){return {id:String.fromCharCode(65+i),text:v};}),correct:q.a.map(function(i){return String.fromCharCode(65+i);}),rationale:q.r||'',source:q.src||''};
    result.signature=signature(result);
    result.key=q.sourceModuleId&&q.sourceQuestionId?track+'/'+q.sourceModuleId+'/'+q.sourceQuestionId:track+'/mock/'+result.signature;
    return feedbackFields(result,q);
  }
  function bankSignature(track,name,questions){return JSON.stringify(questions.map(function(q,i){var s=mockQuestion(track,name,q,i);return [s.key,s.signature];}));}
  function questionKey(key){var parts=key.split('/');if(parts.length===3)parts[1]=global.QuilynProgress.moduleId(parts[0],parts[1]);return parts.join('/');}
  function record(meta,rows){
    var state=read(), now=new Date().toISOString();
    var a=state.attempts.find(function(v){return v.id===meta.id;});
    if(!a){a={id:meta.id,track:meta.track,kind:meta.kind,mode:meta.mode||'practice',name:meta.name,total:meta.total,startedAt:meta.startedAt||now,rows:[]};state.attempts.push(a);}
    rows.forEach(function(row){
      var previous=a.rows.findIndex(function(r){return (r.slot||r.snapshot.key)===(row.slot||row.snapshot.key);});
      var old=previous<0?null:a.rows[previous];
      if(old&&old.snapshot.signature===row.snapshot.signature&&equal(old.selected,row.selected))return;
      if(previous<0)a.rows.push(row);else a.rows[previous]=row;
      var key=row.snapshot.key, correct=equal(row.selected,row.snapshot.correct);
      var matches=Object.keys(state.mistakes).filter(function(k){return questionKey(k)===questionKey(key)&&state.mistakes[k].snapshot.signature===row.snapshot.signature;});
      if(!correct&&!state.mistakes[key]&&matches.length)key=matches[0];
      var miss=state.mistakes[key], snapshot=key===row.snapshot.key?row.snapshot:Object.assign({},row.snapshot,{key:key});
      if(!correct){state.mistakes[key]={snapshot:snapshot,selected:row.selected.slice(),conf:row.conf,kind:meta.kind,lastAt:now,failures:(miss&&miss.snapshot.signature===row.snapshot.signature?miss.failures:0)+1,resolved:false};}
      else matches.forEach(function(k){state.mistakes[k].resolved=true;state.mistakes[k].lastAt=now;});
    });
    a.status=meta.status||'in-progress';a.elapsedSeconds=meta.elapsedSeconds||0;a.updatedAt=now;
    state.attempts.sort(function(a,b){return a.updatedAt.localeCompare(b.updatedAt);});state.attempts=state.attempts.slice(-LIMIT);
    var misses=Object.values(state.mistakes).sort(function(a,b){return a.lastAt.localeCompare(b.lastAt);});
    state.mistakes=Object.fromEntries(misses.slice(-MAX_MISSES).map(function(m){return [m.snapshot.key,m];}));
    while(bytes(state)>2000000&&state.attempts.length>1)state.attempts.shift();
    while(bytes(state)>2000000&&Object.keys(state.mistakes).length){delete state.mistakes[Object.keys(state.mistakes)[0]];}
    return global.QuilynProgress.write(KEY,state);
  }
  function abandon(attemptId){
    var attempt=read().attempts.find(function(a){return a.id===attemptId;});
    return !attempt||attempt.status!=='in-progress'||record(Object.assign({},attempt,{status:'abandoned'}),[]);
  }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function contentVersion(a){return JSON.stringify(a.rows.map(function(r){return [r.slot||r.snapshot.key,r.snapshot.signature];}).sort(function(a,b){return a[0].localeCompare(b[0]);}));}
  function score(a){return a.rows.filter(function(r){return equal(r.selected,r.snapshot.correct);}).length;}
  function feedbackHTML(s){
    var detail=s.optionExplanations?'<details class="jl-feedback"><summary>Why each option fits or fails</summary><ul>'+s.options.map(function(o){return '<li><strong>'+esc(o.id)+' · '+(s.correct.includes(o.id)?'Correct':'Incorrect')+'</strong><p>'+esc(s.optionExplanations[o.id])+'</p></li>';}).join('')+'</ul>'+(s.explanationReviewedOn?'<p class="jl-meta">Explanation reviewed '+esc(s.explanationReviewedOn)+'</p>':'')+'</details>':'';
    var lesson=s.moduleId?'<a class="jl-lesson-link" href="#'+encodeURIComponent(s.track)+'/'+encodeURIComponent(global.QuilynProgress.moduleId(s.track,s.moduleId))+'/guide'+(s.lessonSection?'/'+encodeURIComponent(s.lessonSection):'')+'">'+(s.lessonSection?'Review related lesson section':'Open lesson')+'</a>':'';
    return detail+lesson;
  }
  function rowHTML(row){
    var s=row.snapshot, correct=equal(row.selected,s.correct);
    return '<article class="jl-question"><p class="jl-meta">'+esc(s.domain)+' · '+(correct?'Correct':'Incorrect')+(row.conf==='sure'&&!correct?' · High-confidence error':'')+'</p><h3>'+esc(s.scenario)+'</h3><ul>'+s.options.map(function(o){return '<li>'+ (row.selected.includes(o.id)?'Your answer: ':'')+(s.correct.includes(o.id)?'Correct: ':'')+esc(o.text)+'</li>';}).join('')+'</ul><p>'+esc(s.rationale)+'</p>'+feedbackHTML(s)+(s.source?' <a href="'+esc(s.source)+'" target="_blank" rel="noopener">View source</a>':'')+'</article>';
  }
  function mount(el,track,view){
    var root=document.createElement('section');root.className='jl-view';el.replaceChildren(root);
    var state=read(), kind='',domain='',status='active',confidence='all',query='';
    function draw(){
      if(!root.isConnected)return;
      var misses=Object.values(state.mistakes).filter(function(m){return m.snapshot.track===track&&(!kind||m.kind===kind)&&(!domain||m.snapshot.domain===domain)&&(status==='all'||(status==='resolved'?m.resolved:!m.resolved))&&(confidence!=='sure'||m.conf==='sure')&&(!query||m.snapshot.scenario.toLowerCase().includes(query.toLowerCase()));}).sort(function(a,b){return b.lastAt.localeCompare(a.lastAt);});
      var attempts=state.attempts.filter(function(a){return a.track===track&&(!kind||a.kind===kind);}).slice().reverse();
      var domains=Array.from(new Set(Object.values(state.mistakes).filter(function(m){return m.snapshot.track===track;}).map(function(m){return m.snapshot.domain;}))).sort();
      root.innerHTML='<h2>'+(view==='history'?'Attempt history':'Mistakes notebook')+'</h2><nav class="jl-links"><a href="#history"'+(view==='history'?' aria-current="page"':'')+'>History</a><a href="#mistakes"'+(view==='mistakes'?' aria-current="page"':'')+'>Mistakes</a><a href="#home">Learning home</a></nav><p class="jl-meta">Records start with answers recorded in this version. Up to 50 attempts and 500 mistake records are kept on this device, with a 2 MB data limit. Export a backup in Settings.</p><label>Activity <select id="jl-kind"><option value="">All activities</option>'+kinds.map(function(k){return '<option'+(kind===k?' selected':'')+'>'+k+'</option>';}).join('')+'</select></label>'+
        (view==='mistakes'?'<div class="jl-filters"><label>Status <select id="jl-status">'+['active','resolved','all'].map(function(v){return '<option'+(status===v?' selected':'')+'>'+v+'</option>';}).join('')+'</select></label><label>Domain <select id="jl-domain"><option value="">All domains</option>'+domains.map(function(d){return '<option'+(domain===d?' selected':'')+'>'+esc(d)+'</option>';}).join('')+'</select></label><label>Confidence <select id="jl-confidence"><option value="all">All</option><option value="sure"'+(confidence==='sure'?' selected':'')+'>Confident errors</option></select></label><label>Search mistakes <input id="jl-search" value="'+esc(query)+'" type="search"></label></div><button class="pa-btn primary" id="jl-retry"'+(!misses.some(function(m){return !m.resolved;})?' disabled':'')+'>Practice up to 5 active mistakes</button><p role="status">'+misses.length+' matching records</p><div id="jl-results">'+(misses.length?misses.map(function(m){return '<details><summary>'+esc(m.snapshot.scenario)+' · '+(m.resolved?'Resolved':'Active')+' · '+m.failures+' miss(es)</summary>'+rowHTML(m)+'</details>';}).join(''):'<p>No matching mistakes. Your new mistakes will appear here.</p>')+'</div>':
        '<div id="jl-results">'+(attempts.length?attempts.map(function(a,i){var previous=attempts.slice(i+1).find(function(p){return a.status==='completed'&&p.status==='completed'&&p.kind===a.kind&&p.name===a.name&&p.mode===a.mode&&p.total===a.total&&contentVersion(p)===contentVersion(a);});return '<details><summary>'+esc(a.name)+' · '+esc(a.mode)+' · '+esc(a.status)+' · '+score(a)+'/'+a.total+' · '+esc(new Date(a.updatedAt).toLocaleString())+'</summary>'+(previous?'<p>Previous: '+score(previous)+'/'+previous.total+' → Current: '+score(a)+'/'+a.total+'</p>':'')+'<p>'+a.rows.length+' evaluated of '+a.total+(a.kind==='mock'?'; elapsed '+Math.round(a.elapsedSeconds/60)+' min':'')+'. Historical explanations reflect the recorded content version.</p>'+a.rows.map(rowHTML).join('')+'</details>';}).join(''):'<p>No recorded attempts yet. Complete a quiz, mock exam or review.</p>')+'</div>');
      root.querySelector('#jl-kind').onchange=function(){kind=this.value;draw();};
      if(view==='mistakes'){
        root.querySelector('#jl-status').onchange=function(){status=this.value;draw();};root.querySelector('#jl-domain').onchange=function(){domain=this.value;draw();};root.querySelector('#jl-confidence').onchange=function(){confidence=this.value;draw();};
        root.querySelector('#jl-search').onchange=function(){query=this.value;draw();};
        root.querySelector('#jl-retry').onclick=function(){var chosen=misses.filter(function(m){return !m.resolved;}).slice(0,5);var host=document.createElement('section');root.appendChild(host);this.disabled=true;global.PegaQuiz.render(host,chosen.map(function(m,i){var s=m.snapshot;return {questionId:'retry-'+i,type:s.type,scenario:s.scenario,options:s.options,correctOptions:s.correct,rationale:s.rationale,learningSnapshot:s};}),function(){state=read();var b=document.createElement('button');b.className='pa-btn';b.textContent='Return to notebook';b.onclick=draw;host.appendChild(b);},null,true,{track:track,name:'Mistake review'});host.scrollIntoView({block:'start'});};
      }
      document.getElementById('paContent').focus({preventScroll:true});
    }
    draw();
  }
  function examControls(root,config){
    var wrap=root.querySelector('#mv-questions'), nav=document.createElement('div');nav.className='jl-exam-nav';wrap.before(nav);
    var cards=Array.from(wrap.children);
    function draw(){
      var focused=nav.contains(document.activeElement)?document.activeElement.id:null;
      nav.innerHTML='<label>View <select id="jl-layout"><option value="single"'+(config.view==='single'?' selected':'')+'>One question</option><option value="list"'+(config.view==='list'?' selected':'')+'>All questions</option></select></label><label>Question <select id="jl-jump">'+cards.map(function(c,i){return '<option value="'+i+'"'+(config.index===i?' selected':'')+'>Q'+(i+1)+(config.answers[i].length?' · Answered':' · Unanswered')+(config.flags[i]?' · Marked':'')+'</option>';}).join('')+'</select></label><button class="v-btn" id="jl-prev"'+(config.index===0?' disabled':'')+'>Previous</button><button class="v-btn" id="jl-flag" aria-pressed="'+!!config.flags[config.index]+'">'+(config.flags[config.index]?'Unmark':'Mark for review')+'</button><button class="v-btn" id="jl-next"'+(config.index===cards.length-1?' disabled':'')+'>Next</button>';
      if(config.disabled)nav.querySelectorAll('button,select').forEach(function(control){control.disabled=true;});
      if(focused){var control=nav.querySelector('#'+focused);if(control&&!control.disabled)control.focus({preventScroll:true});}
      cards.forEach(function(c,i){c.hidden=config.view==='single'&&i!==config.index;});
      nav.querySelector('#jl-layout').onchange=function(){if(config.disabled)return;config.view=this.value;changed();};nav.querySelector('#jl-jump').onchange=function(){if(config.disabled)return;config.index=Number(this.value);changed();};
      nav.querySelector('#jl-prev').onclick=function(){if(config.disabled)return;config.index--;changed();};nav.querySelector('#jl-next').onclick=function(){if(config.disabled)return;config.index++;changed();};nav.querySelector('#jl-flag').onclick=function(){if(config.disabled)return;config.flags[config.index]=!config.flags[config.index];changed();};
    }
    function changed(){if(config.disabled)return;draw();config.save(config);(config.view==='single'?nav:cards[config.index]).scrollIntoView({block:'start'});}
    draw();return {refresh:draw,disable:function(){config.disabled=true;draw();},config:config};
  }
  global.QuilynJournal={id:id,abandon:abandon,valid:valid,record:record,read:read,quizQuestion:quizQuestion,mockQuestion:mockQuestion,bankSignature:bankSignature,feedbackHTML:feedbackHTML,validFeedback:validFeedback,mount:mount,examControls:examControls};
})(window);

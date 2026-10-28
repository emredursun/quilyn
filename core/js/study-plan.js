/* Personal study preferences. Recommendations are estimates, never readiness scores. */
(function(global){
  'use strict';
  var KEY='quilyn_study', TABS=['guide','pitfalls','quiz','recap'], activeLesson=null;
  var MINUTES=[10,15,20,30,45,60,90,120];
  function identifier(value){return typeof value==='string'&&/^[A-Za-z0-9-]{1,120}$/.test(value);}
  function day(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
  function valid(state){
    if(!state||state.version!==1||!state.tracks||typeof state.tracks!=='object'||Array.isArray(state.tracks)||Object.keys(state.tracks).length>50)return false;
    return Object.keys(state.tracks).every(function(track){var p=state.tracks[track];
      return identifier(track)&&p&&validReading(p.savedSections)&&(p.examDate===null||day(p.examDate))&&MINUTES.includes(p.minutes)&&Array.isArray(p.bookmarks)&&p.bookmarks.length<=300&&p.bookmarks.every(identifier)&&new Set(p.bookmarks).size===p.bookmarks.length&&
        p.positions&&typeof p.positions==='object'&&!Array.isArray(p.positions)&&Object.keys(p.positions).length<=300&&Object.keys(p.positions).every(function(id){var pos=p.positions[id];return identifier(id)&&pos&&TABS.includes(pos.tab)&&(pos.section===null||typeof pos.section==='string'&&pos.section.length<=300)&&typeof pos.at==='string'&&Number.isFinite(Date.parse(pos.at));})&&
        p.skipped&&(p.skipped.day===null||day(p.skipped.day))&&Array.isArray(p.skipped.ids)&&p.skipped.ids.length<=300&&p.skipped.ids.every(function(id){return typeof id==='string'&&/^(review|mistakes|mock|lesson:[A-Za-z0-9-]+|recap:[A-Za-z0-9-]+)$/.test(id);})&&new Set(p.skipped.ids).size===p.skipped.ids.length;
    });
  }
  function readingKey(item){return JSON.stringify([item.module,item.section,item.concept||'']);}
  function validReading(items){return items===undefined||Array.isArray(items)&&items.length<=300&&items.every(function(b){return b&&identifier(b.module)&&identifier(b.section)&&typeof b.title==='string'&&b.title.trim().length>0&&b.title.length<=300&&(b.concept===undefined||typeof b.concept==='string'&&b.concept.trim().length>0&&b.concept.length<=300);})&&new Set(items.map(readingKey)).size===items.length;}
  function toggleReading(track,item){return change(track,function(p){var items=p.savedSections||[],key=readingKey(item);p.savedSections=items.some(function(b){return readingKey(b)===key;})?items.filter(function(b){return readingKey(b)!==key;}):items.concat(item);});}
  function readingHref(track,b){return '#'+encodeURIComponent(track)+'/'+encodeURIComponent(b.module)+'/guide/'+encodeURIComponent(b.section)+(b.concept?'/'+encodeURIComponent(b.concept):'');}
  function savedReadingHTML(track,p){
    var items=p.savedSections||[];if(!items.length)return '';
    return '<section class="sp-collection" aria-labelledby="sp-saved-reading"><h3 id="sp-saved-reading">Saved sections &amp; concepts</h3><div class="sp-bookmark-grid">'+items.map(function(b){var meta=track.modules.find(function(m){return m.id===b.module&&m.ready!==false;});return '<article class="sp-saved-card" data-bookmark-name="'+esc((b.title+' '+(b.concept||'')+' '+(meta?meta.name:b.module)).toLowerCase())+'"><div class="sp-saved-top"><span class="sp-muted">'+(b.concept?'Concept':'Section')+'</span><button type="button" class="pa-btn sp-remove" data-remove-section="'+esc(readingKey(b))+'" aria-label="Remove saved item: '+esc(b.concept||b.title)+'">Remove</button></div><h4>'+esc(b.concept||b.title)+'</h4><p class="sp-muted">'+esc(meta?meta.name:b.module)+(b.concept?' · '+esc(b.title):'')+'</p>'+(meta?'<a class="sp-inline" href="'+esc(readingHref(track.trackId,b))+'">Open '+(b.concept?'concept':'section')+'</a>':'<p class="sp-muted">This module is unavailable. The saved reference is kept.</p>')+'</article>';}).join('')+'</div></section>';
  }
  function attachReadingSaves(root,track,module){
    var guide=root.querySelector('#v-guide');if(!guide)return {refresh:function(){}};
    var controls=[];
    function add(host,item){var button=document.createElement('button');button.type='button';button.className='sp-reading-save'+(item.concept?'':' sp-section-save');button.innerHTML=icon('bookmark');host.appendChild(button);controls.push({button:button,item:item});button.onclick=function(){var had=(preferences(track).savedSections||[]).some(function(b){return readingKey(b)===readingKey(item);});var ok=toggleReading(track,item);refresh();var status=root.querySelector('#sp-tool-status');if(status)status.textContent=ok?(had?'Removed from Bookmarks.':'Saved to Bookmarks.'):'Could not update Bookmarks. Your previous list is kept.';};}
    Array.from(guide.querySelectorAll('.pa-section[data-section-id]')).forEach(function(section){var title=section.querySelector('h3').textContent,id=section.getAttribute('data-section-id');add(section.querySelector('h3'),{module:module,section:id,title:title});Array.from(section.querySelectorAll('.pa-concept')).forEach(function(card){var term=card.querySelector('.term');if(term)add(card,{module:module,section:id,title:title,concept:term.textContent});});});
    function refresh(){var saved=preferences(track).savedSections||[];controls.forEach(function(c){var has=saved.some(function(b){return readingKey(b)===readingKey(c.item);});c.button.setAttribute('aria-pressed',String(has));var label=(has?'Remove saved ':'Save ')+(c.item.concept?'concept: '+c.item.concept:'section: '+c.item.title);c.button.setAttribute('aria-label',label);c.button.title=label;});}
    refresh();
    var parts=(global.location&&global.location.hash||'').split('/');
    if(parts[4]){var focused=false;function focusConcept(){if(focused||!root.isConnected||!guide.isConnected||guide.hidden||root.querySelector('#v-guide')!==guide)return;focused=true;var name;try{name=decodeURIComponent(parts[4]);}catch(_){return;}var control=controls.find(function(c){return c.item.section===parts[3]&&c.item.concept===name;});if(control){var term=control.button.parentNode.querySelector('.term');term.tabIndex=-1;term.focus({preventScroll:true});term.scrollIntoView({block:'start'});}else {var status=root.querySelector('#sp-tool-status');if(status)status.textContent='The saved concept name has changed. Its lesson section is shown.';}}if(global.requestAnimationFrame)global.requestAnimationFrame(focusConcept);if(global.setTimeout)global.setTimeout(focusConcept,150);}
    return {refresh:refresh};
  }

  async function validateSavedReferences(state,registry){
    var missing=[];
    for(var trackId of Object.keys(state.tracks))for(var b of state.tracks[trackId].savedSections||[]){
      var track=registry.tracks.find(function(t){return t.trackId===trackId;}),meta=track&&track.modules.find(function(m){return m.id===b.module&&m.ready!==false;});
      if(!meta){missing.push(trackId+'/'+b.module+'/'+b.section);continue;}
      try{var data=await global.QuilynRuntime.json(meta.file),section=(data.studyGuide||[]).find(function(s){return s.sectionId===b.section;});if(!section||b.concept&&!(section.elements||[]).some(function(e){return e.type==='concept'&&e.term===b.concept;}))missing.push(trackId+'/'+b.module+'/'+b.section);}
      catch(_){missing.push(trackId+'/'+b.module+'/'+b.section);}
    }
    return missing;
  }
  function read(){return global.QuilynProgress.read(KEY,{version:1,tracks:{}});}
  function empty(){return {examDate:null,minutes:30,bookmarks:[],positions:{},skipped:{day:null,ids:[]}};}
  function preferences(track){return read().tracks[track]||empty();}
  function change(track,fn){var state=read();var p=state.tracks[track]||empty();fn(p);state.tracks[track]=p;return global.QuilynProgress.write(KEY,state);}
  function today(){return global.QuilynProgress.localDay(new Date());}
  function ordinal(day){return Date.parse(day+'T00:00:00Z')/86400000;}
  function average(record){var scores=(record&&record.scoreHistory||[]).slice(-3);return scores.length?scores.reduce(function(a,b){return a+b;},0)/scores.length:null;}
  function recommend(track,user,journal,p,date){
    var ready=track.modules.filter(function(m){return m.ready!==false;}), progress=user.lms&&user.lms.userProgress&&user.lms.userProgress[track.trackId]||{}, completed=new Set(progress.completedModules||[]), records=progress.quizRecords||{};
    var misses=Object.values(journal.mistakes||{}).filter(function(m){return m.snapshot.track===track.trackId&&!m.resolved;});
    var weak=ready.filter(function(m){var score=average(records[m.id]);return score!==null&&score<70;}).sort(function(a,b){return average(records[a.id])-average(records[b.id]);});
    var unfinished=ready.filter(function(m){return !completed.has(m.id);});
    var cards=user.tracks&&user.tracks[track.trackId]&&user.tracks[track.trackId].srs&&user.tracks[track.trackId].srs.cards||{};
    var due=Object.keys(cards).filter(function(id){return ready.some(function(m){return m.id===global.QuilynProgress.moduleId(track.trackId,id.split('::')[0]);})&&cards[id].dueDate<=date;}).length;
    var actions=[],left=p.minutes,skips=p.skipped.day===date?p.skipped.ids:[], plannedModules=new Set();
    function add(id,title,url,minutes,reason){if(skips.includes(id)||left<minutes)return;var module=ready.find(function(m){return id==='lesson:'+m.id||id==='recap:'+m.id;});actions.push({id:id,title:title,url:url,minutes:minutes,reason:reason,moduleEstimate:module?module.studyEstimate||null:null,topic:module?module.studyArea||module.examDomain||null:null});left-=minutes;}
    if(ready.length){
      if(due)add('review','Scheduled review','#review',10,due+' previously studied cards are due. Review as many as fit in this block.');
      if(misses.length)add('mistakes','Revisit mistakes','#mistakes',10,misses.length+' unresolved mistakes in your notebook. Start with their explanations.');
      weak.forEach(function(m){if(left<10||skips.includes('lesson:'+m.id))return;add('lesson:'+m.id,m.name,'#'+track.trackId+'/'+m.id+'/guide',10,'Recent quiz average '+Math.round(average(records[m.id]))+'%; revisit the guide before another quiz.');plannedModules.add(m.id);});
      unfinished.forEach(function(m){if(left<10||plannedModules.has(m.id)||skips.includes('lesson:'+m.id))return;add('lesson:'+m.id,m.name,'#'+track.trackId+'/'+m.id+'/guide',Math.min(20,left),'Next unfinished module in course order. Study for this block, then resume later; use the Practice Quiz when ready.');});
      if(!unfinished.length&&!weak.length){
        var examMinutes=track.exam&&track.exam.timeMinutes||90;
        if(examMinutes<=left)add('mock','Full mock practice','#mock',examMinutes,'All available modules are completed. Use a mock to sample wider coverage; this is practice, not a readiness guarantee.');
        var m=ready[Math.floor(ordinal(date))%ready.length];add('recap:'+m.id,'Recall: '+m.name,'#'+track.trackId+'/'+m.id+'/recap',10,'Periodic recall for a completed track. Try explaining the concepts before reading the recap.');
      }
    }
    var workload=unfinished.length*20+weak.length*10, days=p.examDate?ordinal(p.examDate)-ordinal(date)+1:null;
    return {actions:actions,due:due,mistakes:misses.length,unfinished:unfinished.length,available:ready.length,weak:weak.length,workload:workload,days:days,capacity:days===null?null:Math.max(0,days)*p.minutes,used:p.minutes-left};
  }
  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function userState(){return global.PegaStore?global.PegaStore.state:global.QuilynProgress.read('pega_universal_state',{});}
  function icon(name){return '<svg class="i" aria-hidden="true"><use href="#i-'+name+'"/></svg>';}
  function workspace(track,p,plan,bookmarks,positions,timeline,notice,section,date){
    var savedCount=bookmarks.length+(p.savedSections||[]).length;
    var saved=section==='bookmarks', tabs={guide:'Study Guide',pitfalls:'Exam Pitfalls',quiz:'Practice Quiz',recap:'Quick Recap'};
    function lesson(v){return '#'+track.trackId+'/'+v.id;}
    function reading(){return '<section class="sp-panel sp-reading" aria-labelledby="sp-reading-title"><div class="sp-panel-heading"><h3 id="sp-reading-title">Pick up where you left off</h3>'+icon('book')+'</div>'+(positions.length?positions.slice(0,3).map(function(v){return '<a class="sp-reading-link" href="'+lesson(v.meta)+'"><span><strong>'+esc(v.meta.name)+'</strong><small>'+esc(tabs[v.pos.tab])+(v.pos.section?' · '+esc(v.pos.section):'')+'</small></span>'+icon('chevron-right')+'</a>';}).join(''):'<p class="sp-muted">Your recent lessons will appear here after you study.</p><a class="sp-inline" href="#home">Explore your learning track '+icon('chevron-right')+'</a>')+'</section>';}
    function moduleContext(a){
      if(!a.id.startsWith('lesson:')&&!a.id.startsWith('recap:'))return '';
      var estimate=a.moduleEstimate==='Reference'?'Reference material · no duration provided':a.moduleEstimate||'Duration not documented';
      return '<dl class="sp-task-context">'+(a.topic?'<div><dt>Study topic</dt><dd>'+esc(a.topic)+'</dd></div>':'')+'<div><dt>Module’s listed estimate</dt><dd>'+esc(estimate)+'</dd></div></dl>';
    }
    var h='<header class="sp-heading"><span class="sp-eyebrow">'+icon(saved?'bookmark':'calendar')+'YOUR LEARNING SPACE</span><h2>'+(saved?'Keep the lessons that matter.':'Make time for your next step.')+'</h2><p>'+esc(track.trackName)+'</p></header><nav class="sp-switch" aria-label="Study plan sections"><a href="#plan"'+(!saved?' aria-current="page"':'')+'>'+icon('calendar')+'Study plan</a><a href="#plan/bookmarks"'+(saved?' aria-current="page"':'')+'>'+icon('bookmark')+'Bookmarks <span>'+savedCount+'</span></a></nav><p role="status" id="sp-notice">'+esc(notice)+'</p>';
    if(saved){
      h+='<section class="sp-collection" aria-labelledby="sp-bookmarks"><div class="sp-collection-head"><div><h3 id="sp-bookmarks" tabindex="-1">Your saved items</h3><p class="sp-muted">A personal shortlist for revision and a second look.</p></div><label class="sp-search">Search saved items<input id="sp-search" type="search" placeholder="Find a lesson, section or concept…" autocomplete="off"></label></div><p class="sp-muted" id="sp-search-count" role="status">'+savedCount+' saved '+(savedCount===1?'item':'items')+'</p><div class="sp-bookmark-grid">'+bookmarks.map(function(m,i){var pos=p.positions[m.id];return '<article class="sp-saved-card" data-bookmark-name="'+esc(m.name.toLowerCase())+'"><div class="sp-saved-top"><span class="sp-saved-icon">'+icon('bookmark')+'</span><span class="sp-muted">'+esc(m.id)+'</span><button class="pa-btn sp-remove" data-remove="'+esc(m.id)+'" aria-label="Remove bookmark: '+esc(m.name)+'" title="Remove bookmark">'+icon('bookmark')+'<span>Remove</span></button></div><h4><a href="'+lesson(m)+'">'+esc(m.name)+'</a></h4><p class="sp-muted">'+(pos?'Last opened · '+esc(tabs[pos.tab]):'Saved for your next study session')+'</p><a class="sp-inline" href="'+lesson(m)+'">'+(pos?'Continue lesson':'Open lesson')+' '+icon('chevron-right')+'</a></article>';}).join('')+'</div><div class="sp-empty" id="sp-no-results"'+(savedCount?' hidden':'')+'>'+icon('bookmark')+'<h4>'+(savedCount?'No matching saved items':'Build your revision shortlist')+'</h4><p>'+(savedCount?'Try another module or concept name or clear your search.':'Bookmark a module or save a section or concept in a lesson to keep it here.')+'</p>'+(!savedCount?'<a class="pa-btn primary" href="#home">Explore lessons</a>':'')+'</div></section>'+savedReadingHTML(track,p)+reading();
    }else{
      h+='<div class="sp-layout"><div class="sp-main"><section class="sp-panel sp-today" aria-labelledby="sp-today-title"><div class="sp-panel-heading"><div><span class="sp-eyebrow">TODAY’S FOCUS</span><h3 id="sp-today-title">A little progress, made intentional.</h3></div><span class="sp-time">'+plan.used+'<small> / '+p.minutes+' min</small></span></div><p class="sp-muted">Planned study blocks, not completed time. A module may take several blocks across different days.</p><div class="sp-budget" aria-hidden="true"><span style="width:'+Math.round(plan.used/p.minutes*100)+'%"></span></div><ol class="sp-agenda">'+plan.actions.map(function(a,i){return '<li class="sp-task'+(i===0?' sp-task-next':'')+'"><span class="sp-step" aria-hidden="true">'+(i+1)+'</span><div class="sp-task-body"><span class="sp-eyebrow">'+(i===0?'START HERE':'UP NEXT')+' · '+a.minutes+' MIN TODAY</span><h4>'+esc(a.title)+'</h4><p>'+esc(a.reason)+'</p>'+moduleContext(a)+'<div class="sp-task-actions"><a class="pa-btn'+(i===0?' primary':'')+'" href="'+esc(a.url)+'">'+(i===0?'Start activity':'Open activity')+' '+icon('chevron-right')+'</a><button class="pa-btn sp-quiet" data-skip="'+esc(a.id)+'" aria-label="Skip today: '+esc(a.title)+'">Skip today</button></div></div></li>';}).join('')+'</ol>'+(plan.actions.length?'':'<div class="sp-empty">'+icon('check')+'<h4>'+(plan.available?'Your schedule is clear':'Lessons are on their way')+'</h4><p>'+(plan.available?'Restore skipped suggestions or choose a lesson from your track.':'This track does not have available lesson content yet.')+'</p></div>')+'<details class="sp-plan-reasons"><summary>Why these activities?</summary><p>Due reviews come first, followed by unresolved mistakes, modules with a recent quiz average below 70%, and unfinished modules in course order. Skipped activities stay out of today’s plan. Completed tracks can get periodic recall or mock practice when time permits.</p><p>Today’s minutes are a study budget. Listed module estimates describe the content and may include ranges or extra practice. They are not measured completion times.</p></details><div class="sp-agenda-footer"><span class="sp-muted">Suggestions adapt to your latest results.</span><button class="pa-btn sp-quiet" id="sp-reset-skips">Restore skipped activities</button></div></section>'+reading()+'</div><aside class="sp-side" aria-label="Study preferences"><section class="sp-panel"><div class="sp-panel-heading"><h3>Your study rhythm</h3>'+icon('calendar')+'</div><p class="sp-muted">Choose a pace that fits your day.</p><form id="sp-form" class="sp-preferences"><label for="sp-date">Target exam date <small>Optional</small><input id="sp-date" type="date" min="'+date+'" value="'+esc(p.examDate)+'"></label><label for="sp-minutes">Daily time budget<select id="sp-minutes">'+MINUTES.map(function(m){return '<option value="'+m+'"'+(m===p.minutes?' selected':'')+'>'+m+' minutes</option>';}).join('')+'</select></label><button class="pa-btn primary" type="submit">Save plan</button></form><p class="sp-private">'+icon('lock')+'Saved on this device. Included in your Settings backup.</p></section><section class="sp-panel sp-outlook"><h3>Your planning horizon</h3><dl><div><dt>Modules to complete</dt><dd>'+plan.unfinished+' <small>/ '+plan.available+'</small></dd></div><div><dt>Modules to revisit</dt><dd>'+plan.weak+'</dd></div><div><dt>Target date</dt><dd class="sp-date-value">'+(p.examDate?esc(new Date(p.examDate+'T12:00:00').toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})):'Not set')+'</dd></div></dl><p class="sp-muted">'+esc(timeline)+'</p><details><summary>How the budget works</summary><p class="sp-muted">The daily plan uses 10-minute review blocks and up to 20-minute learning blocks. These do not represent the full duration of a module.'+(plan.days>0?' Your budget spans '+plan.days+' calendar days including today ('+plan.capacity+' min).':'')+' Quiz, revision and mock practice also need time. The plan does not predict an exam result or a completion date.</p></details></section></aside></div>';
    }
    return h+'<footer class="sp-footer"><a href="#home">Learning home</a><a href="#history">Attempt history</a><a href="#mistakes">Mistakes notebook</a></footer>';
  }
  function mount(el,track,section){
    leaveLesson();var root=document.createElement('section');root.className='jl-view sp-view';el.replaceChildren(root);var notice='',searchTerm='';
    function draw(){
      if(!root.isConnected)return;var p=preferences(track.trackId),date=today(),plan=recommend(track,userState(),global.QuilynJournal.read(),p,date);
      var timeline=!p.examDate?'Add an exam date to see the study time available at your chosen daily pace.':plan.days<=0?'Your saved exam date has passed. Update it to plan another target.':plan.capacity+' min available across '+plan.days+' calendar days at '+p.minutes+' min per day. This is your time budget; it does not guarantee completion of the track.';
      var bookmarks=p.bookmarks.map(function(id){return track.modules.find(function(m){return m.id===id&&m.ready!==false;});}).filter(Boolean);
      var positions=Object.keys(p.positions).map(function(id){return {meta:track.modules.find(function(m){return m.id===id&&m.ready!==false;}),pos:p.positions[id]};}).filter(function(v){return v.meta;}).sort(function(a,b){return b.pos.at.localeCompare(a.pos.at);});
      root.innerHTML=workspace(track,p,plan,bookmarks,positions,timeline,notice,section,date);
      var form=root.querySelector('#sp-form');if(form)form.onsubmit=function(e){e.preventDefault();var target=root.querySelector('#sp-date').value||null,minutes=Number(root.querySelector('#sp-minutes').value);if(target&&(!day(target)||target<date)){notice='Choose today or a future date.';draw();return;}var ok=change(track.trackId,function(p){p.examDate=target;p.minutes=minutes;});notice=ok?'Plan saved. Suggestions updated.':'Plan could not be saved; your previous preferences are kept.';draw();root.querySelector('#sp-form button').focus();};
      root.querySelectorAll('[data-skip]').forEach(function(b){b.onclick=function(){var id=b.dataset.skip;var ok=change(track.trackId,function(p){if(p.skipped.day!==date)p.skipped={day:date,ids:[]};if(!p.skipped.ids.includes(id))p.skipped.ids.push(id);});notice=ok?'Suggestion skipped for today.':'Skip could not be saved.';draw();root.querySelector('#sp-reset-skips').focus();};});
      var reset=root.querySelector('#sp-reset-skips');if(reset)reset.onclick=function(){var ok=change(track.trackId,function(p){p.skipped={day:date,ids:[]};});notice=ok?'Today’s suggestions restored.':'Skips could not be reset.';draw();root.querySelector('#sp-reset-skips').focus();};
      root.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){var ok=change(track.trackId,function(p){p.bookmarks=p.bookmarks.filter(function(id){return id!==b.dataset.remove;});});notice=ok?'Bookmark removed.':'Bookmark could not be removed.';draw();root.querySelector('#sp-search').focus();};});
      root.querySelectorAll('[data-remove-section]').forEach(function(b){b.onclick=function(){var ok=change(track.trackId,function(p){p.savedSections=(p.savedSections||[]).filter(function(item){return readingKey(item)!==b.dataset.removeSection;});});notice=ok?'Saved item removed.':'Saved item could not be removed.';draw();root.querySelector('#sp-search').focus();};});
      var search=root.querySelector('#sp-search');if(search)search.oninput=function(){searchTerm=search.value;var term=searchTerm.trim().toLowerCase(),count=0;root.querySelectorAll('[data-bookmark-name]').forEach(function(card){card.hidden=card.dataset.bookmarkName.indexOf(term)<0;if(!card.hidden)count++;});root.querySelector('#sp-no-results').hidden=count>0;root.querySelector('#sp-search-count').textContent=count+' of '+(bookmarks.length+(p.savedSections||[]).length)+' saved items';};if(search&&searchTerm){search.value=searchTerm;search.oninput();}
    }
    draw();el.focus({preventScroll:true});
    if(section==='bookmarks'){var heading=root.querySelector('#sp-bookmarks');heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}
  }
  var moduleMenus={};
  function moduleRows(track,progress,positions,activeId,practice){
    return track.modules.map(function(meta,index){
      var rec=(progress.quizRecords||{})[meta.id],history=rec&&(rec.scoreHistory||[]).slice(-3);
      var score=history&&history.length?history.reduce(function(a,b){return a+b;},0)/history.length:rec&&rec.highScore;
      var done=(progress.completedModules||[]).includes(meta.id),weak=!!(rec&&rec.attempts>0&&score<70);
      return {meta:meta,number:index+1,active:meta.id===activeId,done:done,weak:weak,started:done||!!positions[meta.id]||!!(rec&&rec.attempts>0)||!!(practice&&practice[meta.id])};
    });
  }
  function moduleNavigation(root,track,progress,activeId){
    var pref=moduleMenus[track.trackId]||(moduleMenus[track.trackId]={view:'course',status:'all',closed:{}});
    var practice={};track.modules.forEach(function(m){var saved=global.QuilynProgress.read('pq_state_#'+track.trackId+'/'+m.id,{});practice[m.id]=Object.keys(saved.answers||{}).length>0;});
    var rows=moduleRows(track,progress,preferences(track.trackId).positions,activeId,practice);
    root.innerHTML='<li class="sp-module-browser"><div class="sp-module-filters"><label>Show<select class="sp-module-status"><option value="all">All modules</option><option value="progress">In progress</option><option value="review">Review suggested</option><option value="complete">Completed</option><option value="new">Not started</option></select></label><label>Arrange<select class="sp-module-view"><option value="course">Course order</option><option value="topic">By topic</option></select></label></div><p class="sp-module-count" role="status"></p><p class="sp-module-explanation" hidden>Review suggested: recent quiz average below 70%.</p><div class="sp-module-results"></div><button type="button" class="pa-btn sp-module-clear" hidden>Show all modules</button></li>';
    var status=root.querySelector('.sp-module-status'),view=root.querySelector('.sp-module-view'),results=root.querySelector('.sp-module-results'),clear=root.querySelector('.sp-module-clear');
    status.value=pref.status;view.value=pref.view;
    function matches(row){if(row.meta.ready===false)return pref.status==='all';return pref.status==='all'||pref.status==='review'&&row.weak||pref.status==='complete'&&row.done||pref.status==='progress'&&row.started&&!row.done||pref.status==='new'&&!row.started;}
    function link(row){var m=row.meta,label=m.ready===false?'Coming soon':row.weak?(row.done?'Completed · review suggested':'Review suggested'):row.done?'Completed':row.started?'In progress':'Not started';
      return '<li><a href="#'+encodeURIComponent(track.trackId)+'/'+encodeURIComponent(m.id)+'" class="'+(row.active?'active ':'')+(row.done?'done':'')+'"'+(row.active?' aria-current="page"':'')+'><span class="mnum">'+(row.done?'✓':row.number)+'</span><span class="mname">'+esc(m.name)+'<small class="sp-module-state">'+label+'</small></span></a></li>';
    }
    function draw(){
      var shown=rows.filter(matches),activeHidden=rows.some(function(row){return row.active;})&&!shown.some(function(row){return row.active;});
      root.querySelector('.sp-module-count').textContent=shown.length+' of '+rows.length+' modules'+(activeHidden?' · Current module is outside this filter.':'');
      root.querySelector('.sp-module-explanation').hidden=pref.status!=='review';clear.hidden=pref.status==='all';
      if(!shown.length){results.innerHTML='<p class="sp-module-empty">No modules match this filter. Your progress is kept.</p>';return;}
      if(pref.view==='course'){results.innerHTML='<ul>'+shown.map(link).join('')+'</ul>';return;}
      var groups=new Map();shown.forEach(function(row){var key=row.meta.studyArea||row.meta.examDomain||'Other modules';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);});
      results.innerHTML=Array.from(groups,function(entry){var name=entry[0],members=entry[1],open=pref.closed[name]===undefined?members.some(function(row){return row.active;}):!pref.closed[name];return '<details class="sp-module-group"'+(open?' open':'')+'><summary>'+esc(name)+' <span>'+members.length+'</span></summary><ul>'+members.map(link).join('')+'</ul></details>';}).join('');
      results.querySelectorAll('details').forEach(function(group,i){var name=Array.from(groups.keys())[i];group.ontoggle=function(){if(group.isConnected)pref.closed[name]=!group.open;};});
    }
    status.onchange=function(){pref.status=status.value;draw();};view.onchange=function(){pref.view=view.value;draw();};clear.onclick=function(){pref.status=status.value='all';draw();status.focus();};draw();
  }

  function lessonContents(root,track,module){
    var guide=root.querySelector('#v-guide');
    if(!guide)return function(){};
    var sections=Array.from(guide.querySelectorAll('.pa-section[data-section-id]'));
    if(!sections.length)return function(){};
    var contents=document.createElement('details');contents.className='sp-contents';
    contents.open=!global.matchMedia('(max-width:860px)').matches;
    contents.innerHTML='<summary>In this lesson <span>'+sections.length+' sections</span></summary><nav aria-label="Lesson contents"><ol>'+sections.map(function(section,i){return '<li><a href="#'+encodeURIComponent(track)+'/'+encodeURIComponent(module)+'/guide/'+encodeURIComponent(section.getAttribute('data-section-id'))+'"><span>'+(i+1)+'</span>'+esc(section.querySelector('h3').textContent)+'</a></li>';}).join('')+'</ol></nav>';
    guide.prepend(contents);
    var links=Array.from(contents.querySelectorAll('a'));
    return function(heading){
      sections.forEach(function(section,i){if(section.querySelector('h3')===heading)links[i].setAttribute('aria-current','location');else links[i].removeAttribute('aria-current');});
    };
  }
  function attachLesson(root,track,module,requestedTab){
    leaveLesson();var saved=preferences(track).positions[module], toolbar=document.createElement('div');toolbar.className='sp-lesson-tools';
    toolbar.setAttribute('aria-label','Lesson status');
    var canResume=!!(saved&&(saved.section||saved.tab!=='guide'));
    toolbar.innerHTML='<button class="pa-btn" id="sp-bookmark" aria-pressed="false"></button><button class="pa-btn" id="sp-resume" aria-label="Resume reading" title="Resume reading"'+(!canResume?' hidden':'')+'><svg class="i" aria-hidden="true"><use href="#i-book"/></svg>Resume</button><span class="sp-tool-status" role="status" id="sp-tool-status"></span>';
    root.querySelector('.sp-section-bar').before(toolbar);
    var button=toolbar.querySelector('#sp-bookmark');button.classList.add('sp-bookmark-action');
    var resumeButton=toolbar.querySelector('#sp-resume');resumeButton.classList.add('sp-resume-action');
    root.querySelector('.sp-section-bar').appendChild(resumeButton);
    root.querySelector('.sp-section-bar').appendChild(button);
    function bookmarkLabel(){var has=preferences(track).bookmarks.includes(module);button.setAttribute('aria-pressed',String(has));button.setAttribute('aria-label',has?'Remove module bookmark':'Bookmark module');button.title=has?'Remove module bookmark':'Bookmark module';button.innerHTML='<svg class="i" aria-hidden="true"><use href="#i-bookmark"/></svg><span>'+ (has?'Bookmarked':'Bookmark')+'</span>';}
    button.onclick=function(){var wasSaved=preferences(track).bookmarks.includes(module);var ok=change(track,function(p){p.bookmarks=p.bookmarks.includes(module)?p.bookmarks.filter(function(id){return id!==module;}):p.bookmarks.concat(module);});bookmarkLabel();toolbar.querySelector('#sp-tool-status').textContent=ok?(wasSaved?'Bookmark removed.':'Saved to Bookmarks in the navigation menu.'):'Bookmark could not be saved. Please try again.';};bookmarkLabel();
    var readingSaves=attachReadingSaves(root,track,module);
    var updateContents=lessonContents(root,track,module);
    var previousSection=saved&&saved.section||null;
    function updateSection(){
      if(!root.isConnected||root.querySelector('.pa-tabs button.active').dataset.v!=='guide')return;
      var bar=root.querySelector('.sp-section-bar'), threshold=bar.getBoundingClientRect().bottom+24;
      var heading=Array.from(root.querySelectorAll('#v-guide .pa-section>h3')).filter(function(h){return h.getBoundingClientRect().top<=threshold;}).pop();
      if(heading)previousSection=heading.textContent.slice(0,300);
      updateContents(heading);
    }
    function capture(){
      updateSection();
      return {tab:root.querySelector('.pa-tabs button.active').dataset.v,section:previousSection,at:new Date().toISOString()};
    }
    function flush(){if(root.isConnected){var pos=capture();change(track,function(p){p.positions[module]=pos;});}}
    function resume(){if(!saved)return;var tab=root.querySelector('.pa-tabs button[data-v="'+saved.tab+'"]');if(tab){tab.click();if(saved.tab!=='guide')tab.focus();}if(saved.tab==='guide'&&saved.section){var heading=Array.from(root.querySelectorAll('#v-guide .pa-section>h3')).find(function(h){return h.textContent===saved.section;});if(heading){heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}}}
    function external(event){if(event.detail.key==='quilyn_study'||event.detail.key===null){saved=preferences(track).positions[module];bookmarkLabel();readingSaves.refresh();resumeButton.hidden=!(saved&&(saved.section||saved.tab!=='guide'));}}
    global.addEventListener('quilyn-progress-external',external);
    resumeButton.onclick=resume;
    // Restore the tab, but scroll to a saved section only after the user chooses Resume.
    var initialTab=TABS.includes(requestedTab)?requestedTab:saved&&saved.tab;
    if(initialTab){var tab=root.querySelector('.pa-tabs button[data-v="'+initialTab+'"]');if(tab)tab.click();}
    global.addEventListener('scroll',updateSection,{passive:true});
    activeLesson={root:root,flush:flush,cleanup:function(){global.removeEventListener('scroll',updateSection);global.removeEventListener('quilyn-progress-external',external);}};
  }
  function discardLesson(){if(activeLesson){activeLesson.cleanup();activeLesson=null;}}
  function leaveLesson(){if(activeLesson)activeLesson.flush();discardLesson();}
  global.addEventListener('pagehide',leaveLesson);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'&&activeLesson)activeLesson.flush();});
  global.QuilynStudy={validateSavedReferences:validateSavedReferences,readingKey:readingKey,toggleReading:toggleReading,readingHref:readingHref,moduleRows:moduleRows,moduleNavigation:moduleNavigation,valid:valid,read:read,preferences:preferences,change:change,recommend:recommend,mount:mount,attachLesson:attachLesson,leaveLesson:leaveLesson,discardLesson:discardLesson};
})(window);

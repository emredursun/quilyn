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
      return identifier(track)&&p&&(p.examDate===null||day(p.examDate))&&MINUTES.includes(p.minutes)&&Array.isArray(p.bookmarks)&&p.bookmarks.length<=300&&p.bookmarks.every(identifier)&&new Set(p.bookmarks).size===p.bookmarks.length&&
        p.positions&&typeof p.positions==='object'&&!Array.isArray(p.positions)&&Object.keys(p.positions).length<=300&&Object.keys(p.positions).every(function(id){var pos=p.positions[id];return identifier(id)&&pos&&TABS.includes(pos.tab)&&(pos.section===null||typeof pos.section==='string'&&pos.section.length<=300)&&typeof pos.at==='string'&&Number.isFinite(Date.parse(pos.at));})&&
        p.skipped&&(p.skipped.day===null||day(p.skipped.day))&&Array.isArray(p.skipped.ids)&&p.skipped.ids.length<=300&&p.skipped.ids.every(function(id){return typeof id==='string'&&/^(review|mistakes|mock|lesson:[A-Za-z0-9-]+|recap:[A-Za-z0-9-]+)$/.test(id);})&&new Set(p.skipped.ids).size===p.skipped.ids.length;
    });
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
    function add(id,title,url,minutes,reason){if(skips.includes(id)||left<minutes)return;actions.push({id:id,title:title,url:url,minutes:minutes,reason:reason});left-=minutes;}
    if(ready.length){
      if(due)add('review','Scheduled review','#review',10,due+' previously studied cards are due.');
      if(misses.length)add('mistakes','Revisit mistakes','#mistakes',10,misses.length+' active mistakes in your notebook.');
      weak.forEach(function(m){if(left<10||skips.includes('lesson:'+m.id))return;add('lesson:'+m.id,m.name,'#'+track.trackId+'/'+m.id+'/guide',10,'Recent quiz average '+Math.round(average(records[m.id]))+'%; revisit the guide before another quiz.');plannedModules.add(m.id);});
      unfinished.forEach(function(m){if(left<10||plannedModules.has(m.id)||skips.includes('lesson:'+m.id))return;add('lesson:'+m.id,m.name,'#'+track.trackId+'/'+m.id,Math.min(20,left),'Build understanding in an unfinished module, then check your recall with its Practice Quiz.');});
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
    var saved=section==='bookmarks', tabs={guide:'Study Guide',pitfalls:'Exam Pitfalls',quiz:'Practice Quiz',recap:'Quick Recap'};
    function lesson(v){return '#'+track.trackId+'/'+v.id;}
    function reading(){return '<section class="sp-panel sp-reading" aria-labelledby="sp-reading-title"><div class="sp-panel-heading"><h3 id="sp-reading-title">Pick up where you left off</h3>'+icon('book')+'</div>'+(positions.length?positions.slice(0,3).map(function(v){return '<a class="sp-reading-link" href="'+lesson(v.meta)+'"><span><strong>'+esc(v.meta.name)+'</strong><small>'+esc(tabs[v.pos.tab])+(v.pos.section?' · '+esc(v.pos.section):'')+'</small></span>'+icon('chevron-right')+'</a>';}).join(''):'<p class="sp-muted">Your recent lessons will appear here after you study.</p><a class="sp-inline" href="#home">Explore your learning track '+icon('chevron-right')+'</a>')+'</section>';}
    var h='<header class="sp-heading"><span class="sp-eyebrow">'+icon(saved?'bookmark':'calendar')+'YOUR LEARNING SPACE</span><h2>'+(saved?'Keep the lessons that matter.':'Make time for your next step.')+'</h2><p>'+esc(track.trackName)+'</p></header><nav class="sp-switch" aria-label="Study plan sections"><a href="#plan"'+(!saved?' aria-current="page"':'')+'>'+icon('calendar')+'Study plan</a><a href="#plan/bookmarks"'+(saved?' aria-current="page"':'')+'>'+icon('bookmark')+'Bookmarks <span>'+bookmarks.length+'</span></a></nav><p role="status" id="sp-notice">'+esc(notice)+'</p>';
    if(saved){
      h+='<section class="sp-collection" aria-labelledby="sp-bookmarks"><div class="sp-collection-head"><div><h3 id="sp-bookmarks" tabindex="-1">Your saved modules</h3><p class="sp-muted">A personal shortlist for revision and a second look.</p></div><label class="sp-search">Search saved modules<input id="sp-search" type="search" placeholder="Find a saved lesson…" autocomplete="off"></label></div><p class="sp-muted" id="sp-search-count" role="status">'+bookmarks.length+' saved '+(bookmarks.length===1?'module':'modules')+'</p><div class="sp-bookmark-grid">'+bookmarks.map(function(m,i){var pos=p.positions[m.id];return '<article class="sp-saved-card" data-bookmark-name="'+esc(m.name.toLowerCase())+'"><div class="sp-saved-top"><span class="sp-saved-icon">'+icon('bookmark')+'</span><span class="sp-muted">'+esc(m.id)+'</span><button class="pa-btn sp-remove" data-remove="'+esc(m.id)+'" aria-label="Remove bookmark: '+esc(m.name)+'" title="Remove bookmark">'+icon('bookmark')+'<span>Remove</span></button></div><h4><a href="'+lesson(m)+'">'+esc(m.name)+'</a></h4><p class="sp-muted">'+(pos?'Last opened · '+esc(tabs[pos.tab]):'Saved for your next study session')+'</p><a class="sp-inline" href="'+lesson(m)+'">'+(pos?'Continue lesson':'Open lesson')+' '+icon('chevron-right')+'</a></article>';}).join('')+'</div><div class="sp-empty" id="sp-no-results"'+(bookmarks.length?' hidden':'')+'>'+icon('bookmark')+'<h4>'+(bookmarks.length?'No matching saved modules':'Build your revision shortlist')+'</h4><p>'+(bookmarks.length?'Try another module name or clear your search.':'Use Bookmark in a lesson’s toolbar to keep it here for later.')+'</p>'+(!bookmarks.length?'<a class="pa-btn primary" href="#home">Explore lessons</a>':'')+'</div></section>'+reading();
    }else{
      h+='<div class="sp-layout"><div class="sp-main"><section class="sp-panel sp-today" aria-labelledby="sp-today-title"><div class="sp-panel-heading"><div><span class="sp-eyebrow">TODAY’S FOCUS</span><h3 id="sp-today-title">A little progress, made intentional.</h3></div><span class="sp-time">'+plan.used+'<small> / '+p.minutes+' min</small></span></div><p class="sp-muted">Suggested time, not completed time. Choose an activity to begin.</p><div class="sp-budget" aria-hidden="true"><span style="width:'+Math.round(plan.used/p.minutes*100)+'%"></span></div><ol class="sp-agenda">'+plan.actions.map(function(a,i){return '<li class="sp-task'+(i===0?' sp-task-next':'')+'"><span class="sp-step" aria-hidden="true">'+(i+1)+'</span><div class="sp-task-body"><span class="sp-eyebrow">'+(i===0?'START HERE':'UP NEXT')+' · '+a.minutes+' MIN ESTIMATE</span><h4>'+esc(a.title)+'</h4><p>'+esc(a.reason)+'</p><div class="sp-task-actions"><a class="pa-btn'+(i===0?' primary':'')+'" href="'+esc(a.url)+'">'+(i===0?'Start activity':'Open activity')+' '+icon('chevron-right')+'</a><button class="pa-btn sp-quiet" data-skip="'+esc(a.id)+'" aria-label="Skip today: '+esc(a.title)+'">Skip today</button></div></div></li>';}).join('')+'</ol>'+(plan.actions.length?'':'<div class="sp-empty">'+icon('check')+'<h4>'+(plan.available?'Your schedule is clear':'Lessons are on their way')+'</h4><p>'+(plan.available?'Restore skipped suggestions or choose a lesson from your track.':'This track does not have available lesson content yet.')+'</p></div>')+'<div class="sp-agenda-footer"><span class="sp-muted">Suggestions adapt to your latest results.</span><button class="pa-btn sp-quiet" id="sp-reset-skips">Restore skipped activities</button></div></section>'+reading()+'</div><aside class="sp-side" aria-label="Study preferences"><section class="sp-panel"><div class="sp-panel-heading"><h3>Your study rhythm</h3>'+icon('calendar')+'</div><p class="sp-muted">Choose a pace that fits your day.</p><form id="sp-form" class="sp-preferences"><label for="sp-date">Target exam date <small>Optional</small><input id="sp-date" type="date" min="'+date+'" value="'+esc(p.examDate)+'"></label><label for="sp-minutes">Daily time<select id="sp-minutes">'+MINUTES.map(function(m){return '<option value="'+m+'"'+(m===p.minutes?' selected':'')+'>'+m+' minutes</option>';}).join('')+'</select></label><button class="pa-btn primary" type="submit">Save plan</button></form><p class="sp-private">'+icon('lock')+'Saved on this device. Included in your Settings backup.</p></section><section class="sp-panel sp-outlook"><h3>The bigger picture</h3><dl><div><dt>Modules to complete</dt><dd>'+plan.unfinished+' <small>/ '+plan.available+'</small></dd></div><div><dt>Modules to revisit</dt><dd>'+plan.weak+'</dd></div><div><dt>Target date</dt><dd class="sp-date-value">'+(p.examDate?esc(new Date(p.examDate+'T12:00:00').toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})):'Not set')+'</dd></div></dl><p class="sp-muted">'+esc(timeline)+'</p><details><summary>How the estimate works</summary><p class="sp-muted">Initial study estimate: '+plan.workload+' min, using 20 min per unfinished module and 10 min per weak module. These are planning estimates, not measured learning times.'+(plan.days>0?' Your budget spans '+plan.days+' calendar days including today ('+plan.capacity+' min).':'')+' Quiz, revision and mock time may require more time. This is not a readiness assessment.</p></details></section></aside></div>';
    }
    return h+'<footer class="sp-footer"><a href="#home">Learning home</a><a href="#history">Attempt history</a><a href="#mistakes">Mistakes notebook</a></footer>';
  }
  function mount(el,track,section){
    leaveLesson();var root=document.createElement('section');root.className='jl-view sp-view';el.replaceChildren(root);var notice='',searchTerm='';
    function draw(){
      if(!root.isConnected)return;var p=preferences(track.trackId),date=today(),plan=recommend(track,userState(),global.QuilynJournal.read(),p,date);
      var timeline=!p.examDate?'Add an exam date to compare your study budget with the estimate.':plan.days<=0?'Your saved exam date has passed. Update it to plan another target.':plan.workload>plan.capacity?'Your remaining initial-study estimate exceeds the available budget by '+(plan.workload-plan.capacity)+' minutes. Adjust your target date or daily time.':'Your budget covers this initial-study estimate. Quiz, revision and mock time may require more time; this is not a readiness assessment.';
      var bookmarks=p.bookmarks.map(function(id){return track.modules.find(function(m){return m.id===id&&m.ready!==false;});}).filter(Boolean);
      var positions=Object.keys(p.positions).map(function(id){return {meta:track.modules.find(function(m){return m.id===id&&m.ready!==false;}),pos:p.positions[id]};}).filter(function(v){return v.meta;}).sort(function(a,b){return b.pos.at.localeCompare(a.pos.at);});
      root.innerHTML=workspace(track,p,plan,bookmarks,positions,timeline,notice,section,date);
      var form=root.querySelector('#sp-form');if(form)form.onsubmit=function(e){e.preventDefault();var target=root.querySelector('#sp-date').value||null,minutes=Number(root.querySelector('#sp-minutes').value);if(target&&(!day(target)||target<date)){notice='Choose today or a future date.';draw();return;}var ok=change(track.trackId,function(p){p.examDate=target;p.minutes=minutes;});notice=ok?'Plan saved. Suggestions updated.':'Plan could not be saved; your previous preferences are kept.';draw();root.querySelector('#sp-form button').focus();};
      root.querySelectorAll('[data-skip]').forEach(function(b){b.onclick=function(){var id=b.dataset.skip;var ok=change(track.trackId,function(p){if(p.skipped.day!==date)p.skipped={day:date,ids:[]};if(!p.skipped.ids.includes(id))p.skipped.ids.push(id);});notice=ok?'Suggestion skipped for today.':'Skip could not be saved.';draw();root.querySelector('#sp-reset-skips').focus();};});
      var reset=root.querySelector('#sp-reset-skips');if(reset)reset.onclick=function(){var ok=change(track.trackId,function(p){p.skipped={day:date,ids:[]};});notice=ok?'Today’s suggestions restored.':'Skips could not be reset.';draw();root.querySelector('#sp-reset-skips').focus();};
      root.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){var ok=change(track.trackId,function(p){p.bookmarks=p.bookmarks.filter(function(id){return id!==b.dataset.remove;});});notice=ok?'Bookmark removed.':'Bookmark could not be removed.';draw();root.querySelector('#sp-search').focus();};});
      var search=root.querySelector('#sp-search');if(search)search.oninput=function(){searchTerm=search.value;var term=searchTerm.trim().toLowerCase(),count=0;root.querySelectorAll('[data-bookmark-name]').forEach(function(card){card.hidden=card.dataset.bookmarkName.indexOf(term)<0;if(!card.hidden)count++;});root.querySelector('#sp-no-results').hidden=count>0;root.querySelector('#sp-search-count').textContent=count+' of '+bookmarks.length+' saved modules';};if(search&&searchTerm){search.value=searchTerm;search.oninput();}
    }
    draw();el.focus({preventScroll:true});
    if(section==='bookmarks'){var heading=root.querySelector('#sp-bookmarks');heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}
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
    var previousSection=saved&&saved.section||null;
    function updateSection(){
      if(!root.isConnected||root.querySelector('.pa-tabs button.active').dataset.v!=='guide')return;
      var bar=root.querySelector('.sp-section-bar'), threshold=bar.getBoundingClientRect().bottom+24;
      var heading=Array.from(root.querySelectorAll('#v-guide .pa-section>h3')).filter(function(h){return h.getBoundingClientRect().top<=threshold;}).pop();
      if(heading)previousSection=heading.textContent.slice(0,300);
    }
    function capture(){
      updateSection();
      return {tab:root.querySelector('.pa-tabs button.active').dataset.v,section:previousSection,at:new Date().toISOString()};
    }
    function flush(){if(root.isConnected){var pos=capture();change(track,function(p){p.positions[module]=pos;});}}
    function resume(){if(!saved)return;var tab=root.querySelector('.pa-tabs button[data-v="'+saved.tab+'"]');if(tab){tab.click();if(saved.tab!=='guide')tab.focus();}if(saved.tab==='guide'&&saved.section){var heading=Array.from(root.querySelectorAll('#v-guide .pa-section>h3')).find(function(h){return h.textContent===saved.section;});if(heading){heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}}}
    function external(event){if(event.detail.key==='quilyn_study'||event.detail.key===null){saved=preferences(track).positions[module];bookmarkLabel();resumeButton.hidden=!(saved&&(saved.section||saved.tab!=='guide'));}}
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
  global.QuilynStudy={valid:valid,read:read,preferences:preferences,change:change,recommend:recommend,mount:mount,attachLesson:attachLesson,leaveLesson:leaveLesson,discardLesson:discardLesson};
})(window);

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
    var due=Object.keys(cards).filter(function(id){return ready.some(function(m){return m.id===id.split('::')[0];})&&cards[id].dueDate<=date;}).length;
    var actions=[],left=p.minutes,skips=p.skipped.day===date?p.skipped.ids:[], plannedModules=new Set();
    function add(id,title,url,minutes,reason){if(skips.includes(id)||left<minutes)return;actions.push({id:id,title:title,url:url,minutes:minutes,reason:reason});left-=minutes;}
    if(ready.length){
      if(due)add('review','Scheduled review','#review',10,due+' previously studied cards are due.');
      if(misses.length)add('mistakes','Revisit mistakes','#mistakes',10,misses.length+' active mistakes in your notebook.');
      weak.forEach(function(m){if(left<10||skips.includes('lesson:'+m.id))return;add('lesson:'+m.id,m.name,'#'+track.trackId+'/'+m.id+'/guide',10,'Recent quiz average '+Math.round(average(records[m.id]))+'%; revisit the guide before another quiz.');plannedModules.add(m.id);});
      unfinished.forEach(function(m){if(left<10||plannedModules.has(m.id)||skips.includes('lesson:'+m.id))return;add('lesson:'+m.id,m.name,'#'+track.trackId+'/'+m.id,Math.min(20,left),'This available module has not reached the 70% quiz completion threshold. Study one block, then check your understanding.');});
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
  function mount(el,track){
    leaveLesson();var root=document.createElement('section');root.className='jl-view sp-view';el.replaceChildren(root);var notice='';
    function draw(){
      if(!root.isConnected)return;var p=preferences(track.trackId),date=today(),plan=recommend(track,userState(),global.QuilynJournal.read(),p,date);
      var timeline=!p.examDate?'Add an exam date to compare your study budget with the estimate.':plan.days<=0?'Your saved exam date has passed. Update it to plan another target.':plan.workload>plan.capacity?'Your remaining initial-study estimate exceeds the available budget by '+(plan.workload-plan.capacity)+' minutes. Adjust your target date or daily time.':'Your budget covers this initial-study estimate. Quiz, revision and mock time may require more time; this is not a readiness assessment.';
      var bookmarks=p.bookmarks.map(function(id){return track.modules.find(function(m){return m.id===id&&m.ready!==false;});}).filter(Boolean);
      var positions=Object.keys(p.positions).map(function(id){return {meta:track.modules.find(function(m){return m.id===id&&m.ready!==false;}),pos:p.positions[id]};}).filter(function(v){return v.meta;}).sort(function(a,b){return b.pos.at.localeCompare(a.pos.at);});
      root.innerHTML='<h2>Study plan</h2><p class="jl-meta">'+esc(track.trackName)+' · Preferences stay on this device and are included in Settings backups.</p><form id="sp-form" class="sp-preferences"><label>Exam date (optional)<input id="sp-date" type="date" min="'+date+'" value="'+esc(p.examDate)+'"></label><label>Daily study time<select id="sp-minutes">'+MINUTES.map(function(m){return '<option value="'+m+'"'+(m===p.minutes?' selected':'')+'>'+m+' minutes</option>';}).join('')+'</select></label><button class="pa-btn primary" type="submit">Save plan</button></form><p role="status" id="sp-notice">'+esc(notice)+'</p><p>'+esc(timeline)+'</p><p class="jl-meta">'+plan.unfinished+' unfinished available modules · '+plan.weak+' modules with recent quiz averages below 70%. Estimated initial study: '+plan.workload+' min. Estimates use 20 min per unfinished module + 10 min per weak module, not measured learning times. '+(plan.days!==null&&plan.days>0?plan.days+' calendar days including today; '+plan.capacity+' min of budget.':'')+'</p><h3>Today · '+plan.used+' / '+p.minutes+' planned minutes</h3><p class="jl-meta">Suggestions refresh from your latest results. Open an activity to work on it; opening a link does not mark it complete. You can skip any suggestion for today.</p><div class="sp-actions">'+(plan.actions.length?plan.actions.map(function(a){return '<article class="sp-action"><div><h4>'+esc(a.title)+'</h4><p>'+esc(a.reason)+'</p><span class="jl-meta">'+a.minutes+' min estimate</span></div><a class="pa-btn primary" href="'+esc(a.url)+'">Open activity</a><button class="pa-btn" data-skip="'+esc(a.id)+'">Skip today</button></article>';}).join(''): '<p>'+(plan.available?'No suggestions fit the remaining budget today. You can open any module or reset today’s skips.':'No available lesson content for this track yet.')+'</p>')+'</div><button class="pa-btn" id="sp-reset-skips">Reset today’s skips</button><h3>Continue reading</h3>'+(positions.length?positions.slice(0,3).map(function(v){return '<p><a href="#'+track.trackId+'/'+v.meta.id+'">'+esc(v.meta.name)+'</a> · '+esc(v.pos.tab)+(v.pos.section?' · '+esc(v.pos.section):'')+'</p>';}).join(''):'<p>Your last lesson tab and guide section will appear after you study.</p>')+'<h3>Bookmarked modules</h3>'+(bookmarks.length?bookmarks.map(function(m){return '<p><a href="#'+track.trackId+'/'+m.id+'">'+esc(m.name)+'</a> <button class="pa-btn" data-remove="'+m.id+'" aria-label="Remove bookmark: '+esc(m.name)+'">Remove</button></p>';}).join(''):'<p>Use Bookmark module at the top of a lesson to save it here.</p>')+'<nav class="jl-links"><a href="#home">Learning home</a><a href="#history">Attempt history</a><a href="#mistakes">Mistakes notebook</a></nav>';
      root.querySelector('#sp-form').onsubmit=function(e){e.preventDefault();var target=root.querySelector('#sp-date').value||null,minutes=Number(root.querySelector('#sp-minutes').value);if(target&&(!day(target)||target<date)){notice='Choose today or a future date.';draw();return;}var ok=change(track.trackId,function(p){p.examDate=target;p.minutes=minutes;});notice=ok?'Plan saved. Suggestions updated.':'Plan could not be saved; your previous preferences are kept.';draw();};
      root.querySelectorAll('[data-skip]').forEach(function(b){b.onclick=function(){var id=b.dataset.skip;var ok=change(track.trackId,function(p){if(p.skipped.day!==date)p.skipped={day:date,ids:[]};if(!p.skipped.ids.includes(id))p.skipped.ids.push(id);});notice=ok?'Suggestion skipped for today.':'Skip could not be saved.';draw();};});
      root.querySelector('#sp-reset-skips').onclick=function(){var ok=change(track.trackId,function(p){p.skipped={day:date,ids:[]};});notice=ok?'Today’s suggestions restored.':'Skips could not be reset.';draw();};
      root.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){var ok=change(track.trackId,function(p){p.bookmarks=p.bookmarks.filter(function(id){return id!==b.dataset.remove;});});notice=ok?'Bookmark removed.':'Bookmark could not be removed.';draw();};});
    }
    draw();el.focus({preventScroll:true});
  }
  function attachLesson(root,track,module,requestedTab){
    leaveLesson();var saved=preferences(track).positions[module], toolbar=document.createElement('div');toolbar.className='sp-lesson-tools';
    toolbar.innerHTML='<button class="pa-btn" id="sp-bookmark" aria-pressed="false">Bookmark module</button><a href="#plan">Study plan & bookmarks</a><button class="pa-btn" id="sp-resume"'+(!saved?' hidden':'')+'>Resume saved position</button>';
    root.querySelector('.pa-tabs').before(toolbar);
    var button=toolbar.querySelector('#sp-bookmark');
    function bookmarkLabel(){var has=preferences(track).bookmarks.includes(module);button.setAttribute('aria-pressed',String(has));button.textContent=has?'Bookmarked':'Bookmark module';}
    button.onclick=function(){change(track,function(p){p.bookmarks=p.bookmarks.includes(module)?p.bookmarks.filter(function(id){return id!==module;}):p.bookmarks.concat(module);});bookmarkLabel();};bookmarkLabel();
    var previousSection=saved&&saved.section||null;
    function updateSection(){
      if(!root.isConnected||root.querySelector('.pa-tabs button.active').dataset.v!=='guide')return;
      var heading=Array.from(root.querySelectorAll('#v-guide .pa-section>h3')).filter(function(h){return h.getBoundingClientRect().top<=150;}).pop();
      if(heading)previousSection=heading.textContent.slice(0,300);
    }
    function capture(){
      updateSection();
      return {tab:root.querySelector('.pa-tabs button.active').dataset.v,section:previousSection,at:new Date().toISOString()};
    }
    function flush(){if(root.isConnected){var pos=capture();change(track,function(p){p.positions[module]=pos;});}}
    function resume(){if(!saved)return;var tab=root.querySelector('.pa-tabs button[data-v="'+saved.tab+'"]');if(tab)tab.click();if(saved.tab==='guide'&&saved.section){var heading=Array.from(root.querySelectorAll('#v-guide .pa-section>h3')).find(function(h){return h.textContent===saved.section;});if(heading)heading.scrollIntoView({block:'start'});}}
    toolbar.querySelector('#sp-resume').onclick=resume;
    // Restore the tab, but scroll to a saved section only after the user chooses Resume.
    var initialTab=TABS.includes(requestedTab)?requestedTab:saved&&saved.tab;
    if(initialTab){var tab=root.querySelector('.pa-tabs button[data-v="'+initialTab+'"]');if(tab)tab.click();}
    global.addEventListener('scroll',updateSection,{passive:true});
    activeLesson={root:root,flush:flush,cleanup:function(){global.removeEventListener('scroll',updateSection);}};
  }
  function leaveLesson(){if(activeLesson){activeLesson.flush();activeLesson.cleanup();activeLesson=null;}}
  global.addEventListener('pagehide',leaveLesson);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'&&activeLesson)activeLesson.flush();});
  global.QuilynStudy={valid:valid,read:read,preferences:preferences,change:change,recommend:recommend,mount:mount,attachLesson:attachLesson,leaveLesson:leaveLesson};
})(window);

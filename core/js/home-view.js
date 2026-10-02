(function(global){
  'use strict';
  function esc(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function icon(name){return '<svg class="i" aria-hidden="true"><use href="#i-'+name+'"/></svg>';}
  function link(href,label,name){return '<a href="'+esc(href)+'">'+icon(name)+'<span>'+label+'</span>'+icon('chevron-right')+'</a>';}
  function render(d){
    var pct=d.total?Math.round(d.done/d.total*100):0;
    var complete=d.total>0&&d.done===d.total;
    var number=d.next?d.track.modules.findIndex(function(m){return m.id===d.next.id;})+1:0;
    return '<header class="qh-heading"><span class="quilyn-eyebrow">YOUR LEARNING WORKSPACE</span><h2>'+esc(d.track.trackName)+'</h2><p>A clear next step. A little practice. Steady progress.</p></header>'+
      '<section class="qh-dashboard" aria-label="Your next steps"><article class="qh-next"><div class="qh-label">'+icon('book')+'<span>'+(complete?'KEEP YOUR KNOWLEDGE FRESH':d.resuming?'PICK UP WHERE YOU LEFT OFF':'YOUR NEXT STEP')+'</span></div>'+
      '<h3>'+(d.next?esc(d.next.name):'New learning is on the way')+'</h3><p>'+(d.next?'Module '+number+' · '+(complete?'Revisit a mastered module.':d.returning?'Continue your learning journey.':'Start here and build your foundation.'):'Explore your study tools while more modules are prepared.')+'</p><div class="qh-next-actions">'+
      (d.next?'<a class="pa-btn primary" href="#'+esc(d.track.trackId)+'/'+esc(d.next.id)+'">'+(complete?'Revisit module':d.returning?'Continue learning':'Start learning')+icon('chevron-right')+'</a>':'')+'<a class="qh-text-link" href="#plan">View study plan '+icon('chevron-right')+'</a></div></article>'+
      '<article class="qh-review"><div class="qh-label">'+icon('repeat')+'<span>SMART REVIEW</span></div><h3>'+d.due+' <span>cards due today</span></h3><p>'+(d.due?'Strengthen what you’ve learned with a focused review.':'No scheduled cards due. Explore new cards at your own pace.')+'</p><a class="pa-btn" href="#review">'+(d.due?'Start review':'Explore review')+icon('chevron-right')+'</a></article>'+
      '<article class="qh-progress"><div class="qh-progress-head"><h3>Track progress</h3><strong>'+pct+'%</strong></div><progress max="100" value="'+pct+'" aria-label="Modules mastered">'+pct+'%</progress><p><strong>'+d.done+' of '+d.total+'</strong> available modules mastered <span>· 70%+ quiz score</span></p>'+
      (d.total<(d.track.plannedModuleCount||d.track.modules.length)?'<p>'+d.total+' of '+(d.track.plannedModuleCount||d.track.modules.length)+' planned modules available</p>':'')+
      '<a class="qh-mock" href="#mock"><span>'+icon('clipboard')+'<span>Mock exams<small>'+(d.scores.length?'Best practice result: '+Math.max.apply(null,d.scores)+'%':'Your first practice exam awaits')+'</small></span></span>'+icon('chevron-right')+'</a></article></section>'+
      '<nav class="qh-tools" aria-label="Learning tools"><section><h3>Plan & practice</h3><div>'+link('#plan','Study plan','calendar')+link('#plan/bookmarks','Bookmarks','bookmark')+link('#mistakes','Mistakes notebook','target')+'</div></section><section><h3>Records & resources</h3><div>'+link('#history','Attempt history','trending-up')+link('#library','Learning library','book')+link('learn/','Reading guides','book')+link('#updates','What’s new','zap')+'</div></section></nav>';
  }
  global.QuilynHome={render:render};
})(window);

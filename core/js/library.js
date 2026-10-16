/* Searchable content catalogue. Definitions retain their source lesson context. */
(function(global){
 'use strict';
 var mountGeneration=0;
 function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
 function find(entries,track,kind,query,area){var words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);return entries.filter(function(e){return (!track||e.track===track)&&(!kind||e.kind===kind)&&(!area||e.studyArea===area)&&words.every(function(w){return (e.title+' '+e.text+' '+e.moduleTitle).toLocaleLowerCase().includes(w);});});}
 function topicTrack(entries,track,area){if(!area||!track||entries.some(function(e){return e.track===track&&e.studyArea===area;}))return track;var matches=Array.from(new Set(entries.filter(function(e){return e.studyArea===area;}).map(function(e){return e.track;})));return matches.length===1?matches[0]:'';}
  function search(registry,catalogue,track,query) {
    if (!registry || !query.trim()) return [];
    var q = query.toLowerCase().trim(), words = q.split(/\s+/);
    var entries = catalogue ? catalogue.entries : [];
    if (!catalogue) registry.tracks.forEach(function (t) {
      t.modules.forEach(function (m) {
        if (m.ready !== false) entries.push({track:t.trackId,module:m.id,title:m.name,text:'',kind:'module',href:'#'+t.trackId+'/'+m.id});
      });
    });
    return entries.filter(function (e) {
      return words.every(function (word) { return (e.title+' '+(e.text||'')+' '+(e.moduleTitle||'')+' '+(e.module||'')).toLowerCase().includes(word); });
    }).sort(function (a,b) {
      function rank(e) { var title=e.title.toLowerCase(); return (e.track===track?100:0)+(title===q?30:title.startsWith(q)?20:title.includes(q)?10:0); }
      return rank(b)-rank(a);
    }).slice(0,20);
  }

 function reportLink(track,module,section){var title='Content feedback: '+track+' / '+module;var body='Track: '+track+'\nModule: '+module+'\nSection: '+(section||'not specified')+'\nLesson: https://emredursun.github.io/quilyn/#'+track+'/'+module+(section?'/guide/'+section:'')+'\n\nWhat seems incorrect or unclear?\n\nExpected content and an official reference, if available:\n\n';return 'https://github.com/emredursun/quilyn/issues/new?title='+encodeURIComponent(title)+'&body='+encodeURIComponent(body);}
 async function mount(el,track,mode){
  var request=++mountGeneration,route=location.hash;
  if(mode==='updates'){el.innerHTML='<section class="lib-view"><h2>What’s new</h2><p>Explore the latest improvements to your learning tools.</p><article><h3>Learning tools · October 2026</h3><ul><li>Attempt history and a mistakes notebook with targeted retries.</li><li>Learning and exam simulation modes with saved answers and question flags.</li><li>Personal study plans, bookmarks and Resume in the lesson toolbar.</li><li>Option-specific feedback for all 203 PSSA module questions.</li><li>A searchable lesson and concept library with direct section links.</li></ul></article><p><a href="#library">Explore the library</a> · <a href="#home">Learning home</a></p></section>';el.focus({preventScroll:true});return;}
  el.textContent='Loading lesson library…';var data=await global.QuilynRuntime.json('data/library-index.json');if(request!==mountGeneration||!el.isConnected||location.hash!==route||!/^#library(?:\/|$)/.test(location.hash))return;
  el.innerHTML='<section class="lib-view"><h2>Learning library</h2><p>Find lessons, topics and concepts across all tracks. Definitions are independent study notes; open the lesson for context.</p><form class="lib-filters" role="search"><label for="lib-query">Search<input type="search" id="lib-query" placeholder="For example: case locking" maxlength="200"></label><label for="lib-track">Learning track<select id="lib-track"><option value="">All tracks</option>'+data.tracks.map(function(t){return '<option value="'+esc(t.id)+'"'+(t.id===track?' selected':'')+'>'+esc(t.name)+'</option>';}).join('')+'</select></label><label for="lib-kind">Show<select id="lib-kind"><option value="">Everything</option><option value="module">Modules</option><option value="topic">Topics</option><option value="concept">Concept glossary</option></select></label><label for="lib-area">Study topic<select id="lib-area"><option value="">All topics</option>'+Array.from(new Set(data.entries.map(function(e){return e.studyArea;}).filter(Boolean))).sort().map(function(a){return '<option>'+esc(a)+'</option>';}).join('')+'</select></label></form><p id="lib-count" role="status"></p><div id="lib-results"></div><button class="pa-btn" id="lib-more">Show more</button><p><a href="#updates">What’s new</a> · <a href="#home">Learning home</a></p></section>';
  var query=el.querySelector('#lib-query'),tracks=el.querySelector('#lib-track'),kind=el.querySelector('#lib-kind'),area=el.querySelector('#lib-area'),limit=30;
  var path=location.hash.split('/');try{if(path[1]==='area')area.value=decodeURIComponent(path[2]||'');if(path[1]==='search')query.value=decodeURIComponent(path[2]||'').slice(0,200);}catch(_){}
  tracks.value=topicTrack(data.entries,tracks.value,area.value);
  function draw(){var rows=find(data.entries,tracks.value,kind.value,query.value,area.value);el.querySelector('#lib-count').textContent=rows.length+' results · showing '+Math.min(limit,rows.length);el.querySelector('#lib-results').innerHTML=rows.slice(0,limit).map(function(e){return '<article class="lib-entry"><span class="lib-meta">'+esc(e.track+' · '+e.kind)+'</span><h3><a href="'+esc(e.href)+'">'+esc(e.title)+'</a></h3>'+(e.text?'<p>'+esc(e.text)+'</p>':'')+'<p class="lib-meta">'+esc(e.moduleTitle)+' · '+esc(e.version?'Version '+e.version:'Version not documented')+' · '+esc(e.reviewedOn?'Source reviewed '+e.reviewedOn:'Source review date not documented')+'</p></article>';}).join('')||'<p>No matching content. Try fewer words or another track.</p>';el.querySelector('#lib-more').hidden=rows.length<=limit;}
  el.querySelector('form').onsubmit=function(e){e.preventDefault();};[query,tracks,kind,area].forEach(function(control){control.addEventListener('input',function(){if(control===area)tracks.value=topicTrack(data.entries,tracks.value,area.value);if(control===tracks&&area.value&&topicTrack(data.entries,tracks.value,area.value)!==tracks.value)area.value='';limit=30;draw();});});el.querySelector('#lib-more').onclick=function(){limit+=30;draw();};draw();el.focus({preventScroll:true});
 }
 global.QuilynLibrary={topicTrack:topicTrack,search:search,find:find,mount:mount,reportLink:reportLink};
})(window);

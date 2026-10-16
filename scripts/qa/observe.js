/* Local QA instrumentation only; never loaded by the production shell. */
(function () {
  'use strict';
  var types=PerformanceObserver.supportedEntryTypes;
  var metrics={fcpMs:null,lcpMs:null,cls:types.includes('layout-shift')?0:null,longTasks:types.includes('longtask')?0:null,longestTaskMs:types.includes('longtask')?0:null,interactions:types.includes('event')?0:null,longestInteractionMs:types.includes('event')?0:null};
  var sessionStart=0,sessionEnd=0,sessionValue=0;
  function observe(type,callback){
    if(!PerformanceObserver.supportedEntryTypes.includes(type))return;
    new PerformanceObserver(function(list){list.getEntries().forEach(callback);publish();}).observe({type:type,buffered:true,...(type==='event'?{durationThreshold:16}:{})});
  }
  function publish(){
    if(!document.body)return;
    var output=document.getElementById('quilyn-local-qa');
    if(!output){output=document.createElement('script');output.type='application/json';output.id='quilyn-local-qa';document.body.appendChild(output);}
    var nav=performance.getEntriesByType('navigation')[0];
    output.textContent=JSON.stringify({scope:'Local desktop; no CPU/network throttle; includes offline background downloads',supportedEntryTypes:types,url:location.hash,metrics:metrics,navigation:nav?{responseMs:nav.responseEnd-nav.startTime,domContentLoadedMs:nav.domContentLoadedEventEnd,loadMs:nav.loadEventEnd}:null,resources:performance.getEntriesByType('resource').length});
  }
  observe('paint',function(e){if(e.name==='first-contentful-paint')metrics.fcpMs=e.startTime;});
  observe('largest-contentful-paint',function(e){metrics.lcpMs=e.startTime;});
  observe('layout-shift',function(e){
    if(e.hadRecentInput)return;
    if(sessionStart&&e.startTime-sessionEnd<1000&&e.startTime-sessionStart<5000){sessionValue+=e.value;}else{sessionStart=e.startTime;sessionValue=e.value;}
    sessionEnd=e.startTime;metrics.cls=Math.max(metrics.cls,sessionValue);
  });
  observe('longtask',function(e){metrics.longTasks++;metrics.longestTaskMs=Math.max(metrics.longestTaskMs,e.duration);});
  var interactions=new Map();
  observe('event',function(e){if(!e.interactionId)return;interactions.set(e.interactionId,Math.max(interactions.get(e.interactionId)||0,e.duration));metrics.interactions=interactions.size;metrics.longestInteractionMs=Math.max(metrics.longestInteractionMs,e.duration);});
  document.addEventListener('DOMContentLoaded',publish);
  window.addEventListener('load',function(){setTimeout(publish,0);});
  window.addEventListener('hashchange',publish);
})();

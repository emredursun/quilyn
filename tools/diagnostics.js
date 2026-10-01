/* Local opt-in diagnostics. No telemetry, storage mutation or production loading. */
(function () {
  'use strict';
  var supported = window.PerformanceObserver ? PerformanceObserver.supportedEntryTypes : [];
  var metrics = {lcpMs:null,cls:null,maxInteractionMs:null,longTasks:0};
  var clsMax=0,sessionScore=0,sessionFirst=0,sessionLast=0;
  function observe(type,fn) {
    if(supported.indexOf(type)<0) return;
    try { var o=new PerformanceObserver(function(list){list.getEntries().forEach(fn);});o.observe({type:type,buffered:true,durationThreshold:16}); } catch(e) {}
  }
  observe('largest-contentful-paint',function(e){metrics.lcpMs=e.startTime;});
  observe('layout-shift',function(e){
    if(e.hadRecentInput) return;
    if(e.startTime-sessionLast>1000 || e.startTime-sessionFirst>5000){sessionScore=0;sessionFirst=e.startTime;}
    sessionScore+=e.value;sessionLast=e.startTime;clsMax=Math.max(clsMax,sessionScore);metrics.cls=clsMax;
  });
  if(supported.indexOf('layout-shift')>=0) metrics.cls=0;
  observe('event',function(e){if(e.interactionId)metrics.maxInteractionMs=Math.max(metrics.maxInteractionMs||0,e.duration);});
  observe('longtask',function(){metrics.longTasks++;});
  var panel;
  function report() {
    var nav=performance.getEntriesByType('navigation')[0];
    var resources=performance.getEntriesByType('resource');
    return {measuredAt:new Date().toISOString(),url:location.href,userAgent:navigator.userAgent,
      viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
      supportedEntryTypes:supported,metrics:metrics,
      navigation:nav?{type:nav.type,ttfbMs:nav.responseStart-nav.startTime,domContentLoadedMs:nav.domContentLoadedEventEnd,loadMs:nav.loadEventEnd,transferBytes:nav.transferSize}:null,
      resourceCount:resources.length,resourceTransferBytes:resources.reduce(function(n,r){return n+r.transferSize;},0),
      serviceWorkerControlled:Boolean(navigator.serviceWorker&&navigator.serviceWorker.controller),
      note:'Local lab snapshot. Missing metrics are unsupported, not zero. maxInteractionMs is observed maximum, not field p75 INP. No CPU throttling.'};
  }
  function update(){if(panel)panel.textContent=JSON.stringify(report(),null,2);}
  window.addEventListener('load',function(){setTimeout(function(){
    var container=document.createElement('details');container.id='quilyn-diagnostics';
    container.style.cssText='position:fixed;bottom:8px;left:8px;z-index:99999;max-width:90vw;max-height:60vh;overflow:auto;background:#fff;color:#111;border:2px solid #222;padding:8px;font:12px monospace';
    var summary=document.createElement('summary');summary.textContent='Local performance diagnostics';container.appendChild(summary);
    panel=document.createElement('pre');panel.id='quilyn-performance-report';container.appendChild(panel);
    var button=document.createElement('button');button.textContent='Download measurement';button.type='button';
    button.onclick=function(){var url=URL.createObjectURL(new Blob([JSON.stringify(report(),null,2)],{type:'application/json'}));var a=document.createElement('a');a.href=url;a.download='quilyn-performance.json';a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);};
    container.appendChild(button);document.body.appendChild(container);update();setInterval(update,1000);
  },3000);});
})();

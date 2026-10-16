const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function observer(types){
 const callbacks={},output={};let mounted=false;
 class PerformanceObserver{static supportedEntryTypes=types;constructor(callback){this.callback=callback;}observe({type}){callbacks[type]=this.callback;}}
 const context={PerformanceObserver,performance:{getEntriesByType:type=>type==='navigation'?[{startTime:0,responseEnd:12,domContentLoadedEventEnd:40,loadEventEnd:50}]:[]},location:{hash:'#home'},document:{body:{appendChild(){mounted=true;}},getElementById:()=>mounted?output:null,createElement:()=>output,addEventListener(){}},window:{addEventListener(){}},setTimeout};
 vm.runInNewContext(fs.readFileSync('scripts/qa/observe.js','utf8'),context);
 return {emit(type,...entries){callbacks[type]({getEntries:()=>entries});return JSON.parse(output.textContent);}};
}
test('local QA does not claim unsupported browser measurements are zero',()=>{
 const qa=observer(['paint']),report=qa.emit('paint',{name:'first-contentful-paint',startTime:90});
 assert.equal(report.metrics.fcpMs,90);assert.equal(report.metrics.cls,null);assert.equal(report.metrics.longTasks,null);assert.equal(report.metrics.interactions,null);assert.equal(report.navigation.loadMs,50);
});
test('local QA layout stability uses the largest session and excludes recent-input shifts',()=>{
 const qa=observer(['layout-shift']);const report=qa.emit('layout-shift',{startTime:100,value:.04},{startTime:200,value:.02},{startTime:300,value:.8,hadRecentInput:true},{startTime:2000,value:.03});
 assert.equal(report.metrics.cls,.06);
});
test('local QA counts distinct measured interactions and keeps their worst duration',()=>{
 const qa=observer(['event','longtask']);qa.emit('longtask',{duration:70},{duration:55});const report=qa.emit('event',{interactionId:1,duration:24},{interactionId:1,duration:32},{interactionId:2,duration:16},{interactionId:0,duration:400});
 assert.equal(report.metrics.interactions,2);assert.equal(report.metrics.longestInteractionMs,32);assert.equal(report.metrics.longTasks,2);assert.equal(report.metrics.longestTaskMs,70);
});

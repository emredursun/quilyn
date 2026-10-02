const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(mode){let now=100000,interval;const writes=[],records=[];const nodes={timer:{},ansCount:{},prog:{style:{}}};
 const window={PegaStore:{state:{activeTrack:'PSSA'}},QuilynProgress:{write:(k,v)=>writes.push({k,v})},QuilynJournal:{mockQuestion:(t,n,q,i)=>({key:'Q'+i}),record:(meta,rows)=>{records.push({meta,rows});return true;}}};
 const source=fs.readFileSync('core/js/mock-view.js','utf8').replace('})(window);',`window.modeAPI={startTimer,syncRemaining,pauseExam,checkAnswer,saveState,recordExam,remaining:()=>remaining,prime:()=>{current='Exam';mountedTrack='PSSA';examMode='${mode}';simulationEnd=160000;remaining=90;attemptId='attempt';startedAt='2026-10-02T10:00:00Z';bankVersion='content';flags=[true,false];answers=[[0],[]];checked=[true,false];EXAMS={Exam:[{},{ }]};_root={querySelector:selector=>window.nodes[selector.slice(4)]};examNav={config:{index:1,view:'single'},refresh(){}};}}; })(window);`);
 window.nodes=nodes;vm.runInNewContext(source,{window,HTMLElement:class{},customElements:{define(){}},Date:{now:()=>now},setInterval(fn){interval=fn;return 1;},clearInterval(){},document:{addEventListener(){}}});window.modeAPI.prime();return {api:window.modeAPI,writes,records,advance(ms){now+=ms;interval();}};
}
test('simulation uses an absolute deadline across navigation and resumes; practice preserves remaining duration',()=>{
 const sim=setup('simulation');sim.api.startTimer();assert.equal(sim.api.remaining(),60);sim.advance(15000);assert.equal(sim.api.remaining(),45);sim.api.startTimer();assert.equal(sim.api.remaining(),45);
 const practice=setup('practice');practice.api.startTimer();assert.equal(practice.api.remaining(),90);practice.advance(10000);assert.equal(practice.api.remaining(),80);
});
test('simulation cannot pause or reveal per-question feedback; navigation metadata survives saving',()=>{
 const sim=setup('simulation');sim.api.pauseExam();sim.api.checkAnswer(0,{querySelector(){throw Error('Feedback must stay hidden');}});sim.api.saveState();const v=sim.writes[0].v;
 assert.equal(v.mode,'simulation');assert.equal(v.deadline,160000);assert.equal(v.index,1);assert.equal(v.view,'single');assert.deepEqual(Array.from(v.flags),[true,false]);assert.equal(sim.records.length,0);
});
test('completed exams include unanswered questions; progress records only evaluated questions',()=>{
 const sim=setup('simulation');sim.api.recordExam('in-progress');assert.equal(sim.records[0].rows.length,1);sim.api.recordExam('completed');const completed=sim.records[1];assert.equal(completed.meta.mode,'simulation');assert.equal(completed.rows.length,2);assert.equal(completed.rows[1].selected.length,0);assert.equal(completed.rows[1].slot,'1');
});

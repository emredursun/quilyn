import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const registry=read('data/registry.json'),track=registry.tracks.find(t=>t.trackId==='CTFL');
const modules=track.modules.map(m=>read(m.file)),practice=modules.flatMap(m=>m.practiceQuiz),exams=Object.values(read('data/mock-exams.json').CTFL),coverage=read('data/istqb-ctfl/coverage.json');
const correct=(form,lo)=>{const q=exams[form].find(q=>q.learningObjectiveId==='FL-'+lo);assert.ok(q,lo);return q.a.map(i=>q.o[i]);};
const expectedLOs=[[2,3,1,5,3],[6,3,1],[3,5],[1,4,3,3,3],[7,4,3,1,1],[1,1]].flatMap((sections,c)=>sections.flatMap((n,s)=>Array.from({length:n},(_,i)=>`FL-${c+1}.${s+1}.${i+1}`)));
test('every official learning objective appears in at least one mock form, including both FL-5.1.1 and FL-5.1.3',()=>{
 const ids=new Set(exams.flat().map(q=>q.learningObjectiveId));assert.equal(expectedLOs.filter(lo=>!ids.has(lo)).length,0);
 for(const form of exams)assert.equal(form.filter(q=>['FL-5.1.1','FL-5.1.3'].includes(q.learningObjectiveId)).length,1);
});
test('CTFL maps all official learning objectives and chapter keywords to usable lessons and quizzes',()=>{
 assert.deepEqual(coverage.objectives.map(o=>o.id),expectedLOs);assert.equal(expectedLOs.length,64);
 assert.deepEqual(coverage.chapterKeywords.map(a=>a.length),[30,17,10,18,26,1]);
 assert.equal(practice.length,128);
 for(const o of coverage.objectives){const m=modules[o.chapter-1],qs=m.practiceQuiz.filter(q=>q.learningObjectiveId===o.id);assert.equal(qs.length,2,o.id);assert.ok(m.quizTopics.some(t=>t.id===o.id));assert.ok(m.studyGuide.some(s=>s.sectionId===qs[0].lessonSection));assert.ok(qs.every(q=>q.kLevel===o.kLevel&&q.provenance==='original-quilyn'&&q.sourceUrl.startsWith(coverage.syllabus)));}
 assert.ok(modules[0].studyGuide.some(s=>s.elements.some(e=>e.text?.includes('Keywords')||e.text?.includes('keywords'))));
});
test('six unseen forms have exact chapter, K-level and official selectable-objective distributions',()=>{
 assert.equal(exams.length,6);
 for(const form of exams){assert.equal(form.length,40);assert.deepEqual([1,2,3,4,5,6].map(n=>form.filter(q=>q.chapter===n).length),[8,6,4,11,9,2]);assert.deepEqual(['K1','K2','K3'].map(k=>form.filter(q=>q.kLevel===k).length),[8,24,8]);
  for(const g of coverage.groups)assert.equal(form.filter(q=>g.ids.includes(q.learningObjectiveId)).length,g.count,g.ids.join(','));
  for(const q of form){assert.equal(q.points,1);assert.equal(q.provenance,'original-quilyn');assert.ok(q.r.length>=70);assert.doesNotMatch(q.r,/\b(?:first|last|middle) (?:option|alternative|report|set)|middle pairs/i);assert.ok(q.a.every(a=>a>=0&&a<q.o.length));assert.equal(q.o.length,q.t==='single'?4:5);if(q.t!=='single'){assert.equal(q.a.length,2);assert.match(q.q,/Select TWO/);}}
  const counts=[0,0,0,0];form.filter(q=>q.t==='single').forEach(q=>counts[q.a[0]]++);assert.ok(Math.max(...counts)-Math.min(...counts)<=1);
 }
 const all=[...practice.map(q=>({id:q.questionId,text:q.scenario})),...exams.flat().map(q=>({id:q.questionId,text:q.q}))];
 assert.equal(new Set(all.map(q=>q.id)).size,368);assert.equal(new Set(all.map(q=>q.text.toLowerCase().replace(/[^a-z0-9]/g,''))).size,368);
 assert.ok(exams.flat().every(q=>!q.sourceQuestionId&&!q.sourceModuleId),'mocks must not silently reuse the topic bank');
});
// Oracle follows the official domain -> partition extrema -> feasible-neighbor union procedure.
function boundaryItems(partitions,variant){
 const min=partitions[0][0],max=partitions.at(-1)[1],boundaries=new Set(partitions.flat().filter(Number.isFinite)),items=new Set();
 for(const boundary of boundaries)for(const offset of variant===3?[-1,0,1]:[0]){const value=boundary+offset;if(value>=min&&value<=max)items.add(value);}
 return [...items].sort((a,b)=>a-b);
}
const partitions=(l,u,min=-Infinity)=>[[min,l-1],[l,u],[u+1,Infinity]];
test('BVA oracle includes invalid-partition extrema, domain endpoints and overlapping neighborhoods',()=>{
 assert.deepEqual(boundaryItems(partitions(10,50),2),[9,10,50,51]);
 assert.deepEqual(boundaryItems(partitions(10,50),3),[8,9,10,11,49,50,51,52]);
 assert.deepEqual(boundaryItems(partitions(10,50,0),3),[0,1,8,9,10,11,49,50,51,52]);
 assert.deepEqual(boundaryItems(partitions(2,2),2),[1,2,3]);
 assert.deepEqual(boundaryItems(partitions(2,2),3),[0,1,2,3,4]);
 assert.deepEqual(boundaryItems([[1,4],[5,6]],3),[1,2,3,4,5,6]);
});
test('all eight BVA answer keys follow explicit domain/partition models, including finite endpoints',()=>{
 const fixtures=[{l:20,u:80,n:3},{l:40,u:90,n:2,existing:[39,40,89,90]},{l:7,u:12,n:3},{l:2,u:8,n:2},{l:100,u:200,min:0,n:3,existing:[99,100,101,199,200]},{l:-5,u:5,n:3}];
 fixtures.forEach((f,i)=>{let expected=boundaryItems(partitions(f.l,f.u,f.min),f.n);if(f.existing)expected=expected.filter(n=>!f.existing.includes(n));const actual=(correct(i,'4.2.2')[0].match(/-?\d+/g)||[]).map(Number);assert.deepEqual(actual,expected,`form ${i+1}`);});
 const topic=modules[3].practiceQuiz.filter(q=>q.learningObjectiveId==='FL-4.2.2');
 assert.match(topic[0].scenario,/exact minimum/);assert.match(exams[3].find(q=>q.learningObjectiveId==='FL-4.2.2').q,/exact minimum/);
 topic.forEach((q,i)=>{const answer=q.options.find(o=>q.correctOptions.includes(o.id)).text;assert.deepEqual(answer.match(/-?\d+/g).map(Number),boundaryItems(i?partitions(10,30,0):partitions(18,65),i?3:2));});
});
test('decision-table topic keys derive the missing feasible case and its specified action',()=>{
 const cases=[{names:['member','basketHigh'],covered:[[true,true],[true,false],[false,true]],feasible:()=>true},{names:['member','coupon'],covered:[[false,false],[true,true]],feasible:(m,c)=>m||!c}];
 modules[3].practiceQuiz.filter(q=>q.learningObjectiveId==='FL-4.2.3').forEach((q,i)=>{const f=cases[i],missing=[false,true].flatMap(a=>[false,true].map(b=>[a,b])).filter(([a,b])=>f.feasible(a,b)&&!f.covered.some(pair=>pair[0]===a&&pair[1]===b));assert.equal(missing.length,1);const answer=q.options.find(o=>q.correctOptions.includes(o.id)).text;const actual=f.names.map(name=>new RegExp(name+'=(true|false)').exec(answer)?.[1]==='true');assert.deepEqual(actual,missing[0]);assert.equal(/no discount/.test(answer),!(actual[0]&&actual[1]));});
});
test('effort answer keys follow ratios, extrapolation and weighted three-point arithmetic',()=>{
 const expected=[250*3/5,(6+4*9+24)/6,(8+10+12)/3,(2+4*5+14)/6,320/4,(5+4*8+17)/6];
 expected.forEach((value,i)=>assert.equal(Number(correct(i,'5.1.4')[0].match(/^\d+/)[0]),value));
 assert.match(correct(1,'5.1.4')[0],/3 person-days$/);assert.equal((24-6)/6,3);
 assert.match(correct(5,'5.1.4')[0],/2 person-days$/);assert.equal((17-5)/6,2);
});
test('prioritization keys respect additional coverage, dependency eligibility and business weighting',()=>{
 function order(tests){const done=[],covered=new Set();while(done.length<tests.length){const candidates=tests.filter(t=>!done.includes(t.id)&&(t.dep||[]).every(id=>done.includes(id))).sort((a,b)=>(b.risk??b.items.filter(x=>!covered.has(x)).length)-(a.risk??a.items.filter(x=>!covered.has(x)).length)||a.id.localeCompare(b.id));const t=candidates[0];assert.ok(t);done.push(t.id);(t.items||[]).forEach(x=>covered.add(x));}return done;}
 const additional=[{id:'T1',items:['A','B','C','D']},{id:'T2',items:['A','B','C']},{id:'T3',items:['E','F']},{id:'T4',items:['F']}];assert.deepEqual(order(additional).slice(0,2),correct(0,'5.1.5')[0].split(' then '));
 assert.equal(order([{id:'C',risk:10,dep:['B']},{id:'A',risk:8},{id:'B',risk:5}]).join(', '),correct(1,'5.1.5')[0]);
 assert.equal(order([{id:'T1',risk:3},{id:'T2',risk:9,dep:['T1']},{id:'T3',risk:6}]).join(','),correct(4,'5.1.5')[0]);
 assert.equal(order([{id:'T1',risk:5},{id:'T2',risk:3+1},{id:'T3',risk:1}]).join(','),correct(5,'5.1.5')[0]);
});
test('state-transition keys follow the stated models rather than state-visit counts',()=>{
 function walk(edges,events){let state=edges[0][0];const used=new Set();for(const event of events.split(',').map(x=>x.trim())){const i=edges.findIndex(e=>e[0]===state&&e[1]===event);if(i<0)return {valid:false,used};used.add(i);state=edges[i][2];}return {valid:true,used};}
 const models=[[['Draft','submit','Pending'],['Pending','reject','Draft'],['Pending','approve','Done']],null,[['Idle','start','Running'],['Running','pause','Paused'],['Paused','resume','Running'],['Running','stop','Idle']],[['Open','fix','Resolved'],['Resolved','reopen','Open'],['Resolved','close','Closed']],null,[['Ready','run','Busy'],['Busy','finish','Ready'],['Busy','fail','Error'],['Error','reset','Ready']]];
 for(const i of [0,5]){const r=walk(models[i],correct(i,'4.2.4')[0]);assert.equal(r.valid,true);assert.equal(r.used.size,models[i].length);}
 const third=walk(models[2],'start,pause,resume,stop');assert.equal(correct(2,'4.2.4')[0],`${third.used.size/models[2].length*100}%`);
 assert.equal(walk(models[3],correct(3,'4.2.4')[0]).valid,false);
 assert.equal(correct(1,'4.2.4')[0],'100%');assert.equal(correct(4,'4.2.4')[0],`${3/4*100}%`);
});
test('topic scope keeps saved chapter state and cannot award chapter mastery',()=>{
 const source=readFileSync('core/js/engine.js','utf8'),body=source.slice(source.indexOf('  function mountQuiz('),source.indexOf('  /* Chrome */'));
 const calls=[],records=[],selector={value:'',addEventListener(_,fn){this.change=fn;}},quiz={};const mount={querySelector:s=>s==='#paQuizScope'?selector:quiz};
 const context={document:{getElementById:()=>mount},PegaQuiz:{render:(...args)=>calls.push(args)},recordQuiz:(...args)=>records.push(args),renderSidebar(){},activeTrackId:'CTFL',esc:String};vm.createContext(context);vm.runInContext(body,context);
 context.mountQuiz(track.modules[3],modules[3],null);assert.equal(calls.at(-1)[1].length,28);assert.equal(calls.at(-1)[4],false);
 selector.value='FL-4.2.2';selector.change();const topic=calls.at(-1);assert.equal(topic[1].length,2);assert.equal(topic[2],null);assert.equal(topic[4],true);assert.equal(topic[5].practiceScope,'topic');assert.equal(records.length,0);
 selector.value='';selector.change();calls.at(-1)[2](75);assert.equal(records.length,1);assert.equal(records[0][2],75);
});
test('CTFL uses 26/40 at 60 minutes and offers the provider-dependent extended timer',()=>{
 let source=readFileSync('core/js/mock-view.js','utf8').replace('})(window);','window.api={configureExam,getHTML,practiceMinutes,pass:()=>PASS}; })(window);');const window={};vm.runInNewContext(source,{window,HTMLElement:class{},customElements:{define(){}},console});const api=window.api;api.configureExam(track);
 assert.equal(api.practiceMinutes(40),60);assert.ok(25/40<api.pass());assert.ok(26/40>=api.pass());assert.match(api.getHTML(),/value="75"/);assert.match(api.getHTML(),/provider-confirmed eligibility/);
 api.configureExam(registry.tracks.find(t=>t.trackId==='PSSA'));assert.equal(api.practiceMinutes(60),90);assert.doesNotMatch(api.getHTML(),/id="mv-duration"/);
});

test('independent AI review receipt matches the current bank and all six reviewed modules',()=>{
 const status=read('docs/reports/istqb-assessment-status.json'),hash=value=>createHash('sha256').update(value).digest('hex');
 assert.equal(status.bankFingerprint,hash(JSON.stringify(read('data/mock-exams.json').CTFL)));
 assert.equal(status.independentReview,'completed-two-separate-ai-reviews-with-correction-recheck');
 assert.equal(status.humanSMESignoff,false);assert.equal(status.openBlockingFindings,0);
 assert.equal(status.correctedMockIds.length+status.correctedTopicIds.length,34);
 for(const m of track.modules)assert.equal(status.moduleSha256[m.file],hash(readFileSync(m.file)),m.file+' changed after recorded review');
 for(const path of status.reviewReports)assert.ok(readFileSync(path,'utf8').includes(status.reviewedBankFingerprint),path+' must record the reviewed bank');
 let chain=status.reviewedBankFingerprint;for(const c of status.bankChanges){assert.equal(c.from,chain);assert.equal(c.openBlockingFindings,0);assert.ok(readFileSync(c.report,'utf8').includes(c.to),c.report);assert.ok(readFileSync(c.review,'utf8').length>500);chain=c.to;}assert.equal(chain,status.bankFingerprint,'every bank change after review needs a recorded change and review');
 assert.equal(status.empiricalCalibration,'awaiting-candidate-data');assert.equal(status.candidateAttempts,0);assert.ok(status.formStrata.every(s=>s.n===0&&s.meanScore===null&&s.passProportion===null));
});

test('official teaching total is derived from chapter allocations and exam scope is explicit',()=>{
 const allocations=track.modules.map(m=>Number(read(m.file).estTime.match(/^\d+/)[0]));
 assert.deepEqual(allocations,[180,130,80,390,335,20]);
 assert.equal(allocations.reduce((a,b)=>a+b,0),1135);
 const text=JSON.stringify(modules[0].studyGuide);
 assert.match(text,/1,135 teaching minutes/);assert.doesNotMatch(text,/1,265/);
 const essentials=modules[0].studyGuide.find(s=>s.sectionId==='exam-readiness');assert.ok(essentials);
 assert.match(JSON.stringify(essentials),/concepts without a dedicated LO/);
 assert.match(JSON.stringify(essentials),/Introduction and appendices/);
 assert.match(JSON.stringify(essentials),/rescheduling\/retake/);
 assert.ok(essentials.elements.some(e=>e.type==='links'&&e.items.some(i=>i.url.includes('exam-providers'))));
});

test('K3 practice exercises are self-contained and render their solutions collapsed',()=>{
 const sections=modules.flatMap(m=>m.studyGuide),exercises=sections.flatMap(s=>s.elements.filter(e=>e.type==='exercise').map(e=>({...e,section:s.sectionId})));
 for(const lo of ['fl-4-2-1','fl-4-2-2','fl-4-2-3','fl-4-2-4','fl-4-5-3','fl-5-1-4','fl-5-1-5','fl-5-5-1'])assert.ok(exercises.some(e=>e.section===lo),lo+' needs a Try first exercise');
 for(const e of exercises){assert.ok(e.prompt&&e.solution&&e.title);assert.doesNotMatch(e.prompt,/Solution/);}
 const branch=exercises.find(e=>e.section==='fl-4-3-1');assert.match(branch.solution,/3\/4 = 75%/);assert.match(branch.solution,/4\/4 = 100%/);
 assert.match(exercises.find(e=>e.title==='Price field with two decimals').solution,/0\.00, 0\.01, 0\.02, 99\.98, 99\.99, 100\.00, 100\.01 \(7 values\)/);
 assert.match(exercises.find(e=>e.title==='Risk-based order with a dependency').solution,/T4, T3, T2, T1/);
 const order=sections.find(s=>s.sectionId==='fl-4-3-1').elements.map(e=>e.type==='text'?e.text.split(':')[0]:e.type);assert.ok(order.indexOf('exercise')<order.indexOf('Recap example'));
 let source=readFileSync('core/js/engine.js','utf8');assert.match(source,/el\.type === "exercise"[\s\S]{0,400}<details class="pa-exercise-solution"><summary>Show solution<\/summary>/);
 assert.match(readFileSync('learn/ctfl/ctfl-c4/index.html','utf8'),/<details><summary>Show solution<\/summary>/);
 assert.match(JSON.stringify(modules[0].studyGuide),/at least 1,135 teaching minutes/);
});

test('study additions review receipt matches the reviewed sources',()=>{
 const review=read('docs/reports/istqb-assessment-status.json').studyContentReview,hash=value=>createHash('sha256').update(value).digest('hex');
 assert.equal(review.openBlockingFindings,0);assert.equal(review.reviews,'two-separate-ai-reviews-with-correction-recheck');
 for(const [file,sha] of Object.entries(review.sourceSha256))assert.equal(hash(readFileSync(file)),sha,file+' changed after the study additions review');
 for(const path of review.reports)assert.ok(readFileSync(path,'utf8').length>500,path);
});

test('every chapter keyword section has original keyword self-checks and mock results add a K-level breakdown',()=>{
 const counts=modules.map(m=>m.studyGuide.find(s=>s.sectionId==='keyword-self-check').elements.filter(e=>e.type==='exercise').length);
 assert.ok(counts.every(n=>n>=1));assert.ok(counts.reduce((a,b)=>a+b,0)>=20);
 const source=readFileSync('core/js/mock-view.js','utf8');assert.match(source,/K-level breakdown/);assert.match(source,/examMode==='simulation'\?'':esc\(qu\.r\)\+\(global\.QuilynJournal&&global\.QuilynJournal\.objectiveHTML/);
});

test('track opens with a neutral introduction that names the official versions and defers to ISTQB sources',()=>{
 const intro=modules[0].studyGuide[0],text=JSON.stringify(intro);
 assert.equal(intro.sectionId,'about-this-track');
 for(const v of ['Syllabus v4.0.1','Exam Structures and Rules v1.2','Exam Structures and Rules Tables v1.19','the official document applies','not affiliated with','does not lead to certification','not been signed off'])assert.ok(text.includes(v),v);
 assert.doesNotMatch(text,/guarantee(?!d)|you will pass/i);
 assert.equal(modules.flatMap(m=>m.studyGuide).filter(s=>JSON.stringify(s).includes('Quilyn is not affiliated')).length,1);
});

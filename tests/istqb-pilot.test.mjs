import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePilot, fingerprint } from '../scripts/analyze-istqb-pilot.mjs';
const bank={'Mock Exam 1':[
 {questionId:'one',learningObjectiveId:'FL-1.1.1',kLevel:'K1',a:[0],o:['correct','wrong']},
 {questionId:'two',learningObjectiveId:'FL-4.2.2',kLevel:'K3',a:[0,1],o:['correct','correct','wrong']},
 {questionId:'three',learningObjectiveId:'FL-5.1.4',kLevel:'K3',a:[1],o:['wrong','correct']}
]};
const attempt=(id,responses,durationMinutes=60)=>({candidateId:id,form:'Mock Exam 1',mode:'simulation',firstExposure:true,completed:true,durationMinutes,elapsedSeconds:120,responses:responses.map((selected,i)=>({questionId:bank['Mock Exam 1'][i].questionId,selected}))});
const input=attempts=>({version:1,bankFingerprint:fingerprint(bank),attempts});
test('pilot statistics stay unknown without candidates and reject stale answer-key versions',()=>{
 const r=analyzePilot(input([]),bank);assert.equal(r.status,'awaiting-candidate-data');assert.equal(r.strata[0].items[0].proportionCorrect,null);assert.equal(r.strata[0].items[0].correctedItemTotalCorrelation,null);assert.throws(()=>analyzePilot({...input([]),bankFingerprint:'old'},bank));
});
test('analysis uses full-set keys, unanswered-as-wrong, first exposures and separate timer groups',()=>{
 const a=attempt('anon-1',[[0],[0],[]]),b=attempt('anon-2',[[0],[0,1],[1]]),c=attempt('anon-3',[[1],[0,1],[1]],75);
 const result=analyzePilot(input([a,b,c,a,{...b,mode:'practice'},{...b,firstExposure:false}]),bank),r=result.strata[0];assert.equal(result.eligibleAttempts,3);assert.equal(result.excluded.duplicate,1);assert.equal(result.excluded.nonSimulation,1);assert.equal(result.excluded.notFirstExposure,1);assert.equal(r.n,2);assert.equal(r.items[1].proportionCorrect,.5);assert.equal(r.items[2].unanswered,.5);assert.equal(result.strata[1].n,1);assert.ok(r.items[1].proportionCorrect95Wilson[0]<.5);assert.doesNotMatch(JSON.stringify(result),/anon-/);
});
test('item discrimination excludes the target item from total score and handles zero variance',()=>{
 const rows=[attempt('a',[[0],[0,1],[1]]),attempt('b',[[0],[0,1],[1]]),attempt('c',[[1],[2],[0]]),attempt('d',[[1],[2],[0]])];const r=analyzePilot(input(rows),bank);assert.equal(r.strata[0].items[0].correctedItemTotalCorrelation,1);assert.equal(analyzePilot(input(rows.slice(0,2)),bank).strata[0].items[0].correctedItemTotalCorrelation,null);
});
test('invalid selections, duplicate question responses and invalid timers are not silently analyzed',()=>{
 const a=attempt('a',[[0],[0,1],[1]]);assert.throws(()=>analyzePilot(input([{...a,candidateId:123}]),bank));assert.throws(()=>analyzePilot(input([{...a,form:'__proto__'}]),bank));assert.throws(()=>analyzePilot(input([{...a,durationMinutes:90}]),bank));assert.throws(()=>analyzePilot(input([{...a,responses:[a.responses[0],a.responses[0],a.responses[2]]}]),bank));assert.throws(()=>analyzePilot(input([attempt('a',[[0],[8],[1]])]),bank));
});

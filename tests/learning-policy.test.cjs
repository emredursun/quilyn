const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function review(bank, state) {
  const window = {QuilynProgress:{localDay:d=>d.toISOString().slice(0,10),activity(){}}};
  const source = fs.readFileSync('core/js/review-view.js','utf8').replace('})(window);',
    'window.policy={selectSession,getStats,currentStreak,mastered,gradeCard,set:(b,s)=>{cardBank=b;srs=s;}}; })(window);');
  vm.runInNewContext(source,{window,Date,Math,HTMLElement:class{},customElements:{define(){}}});
  window.policy.set(bank,state); return window.policy;
}
function bank() { return Object.fromEntries(Array.from({length:100},(_,i)=>['q'+i,{moduleId:'M'+Math.floor(i/10)}])); }
const day = new Date().toISOString().slice(0,10);
const card = (box=1)=>({box,dueDate:day,totalSeen:1,totalCorrect:0});
test('fresh sessions sample across modules without duplicate cards',()=>{
  const b=bank(),p=review(b,{cards:{},surpriseIds:[]});
  for(let i=0;i<20;i++) {
    const selected=p.selectSession(); assert.equal(selected.length,15);assert.equal(new Set(selected).size,15);
    assert.equal(new Set(selected.map(k=>b[k].moduleId)).size,10);
  }
});
test('due reviews receive quota, priority errors are included and future cards excluded',()=>{
  const b=bank(),cards={}; for(let i=0;i<40;i++)cards['q'+i]=card();
  cards.q99={...card(),dueDate:'2099-01-01'};
  const p=review(b,{cards,surpriseIds:['q35','q99','missing']});const selected=p.selectSession();
  assert.ok(selected.includes('q35'));assert.ok(!selected.includes('q99'));assert.equal(selected.filter(k=>cards[k]).length,11);assert.equal(selected.length,15);
});
test('review quota fills available capacity when no new cards remain',()=>{
  const b=bank(),cards=Object.fromEntries(Object.keys(b).map(k=>[k,card()]));
  assert.equal(review(b,{cards,surpriseIds:[]}).selectSession().length,15);
  assert.equal(review({q0:b.q0},{cards:{q0:card()},surpriseIds:[]}).selectSession().length,1);
});
test('mastery uses box five and a broken streak is displayed as zero',()=>{
  const p=review({q0:{moduleId:'M0'},q1:{moduleId:'M1'}},{cards:{q0:card(3),q1:card(5)},streak:9,lastStudyDate:'2000-01-01'});
  assert.equal(p.getStats().mastered,1);assert.equal(p.mastered('q0'),false);assert.equal(p.mastered('q1'),true);assert.equal(p.currentStreak(),0);
  p.set({}, {cards:{},streak:9,lastStudyDate:day});assert.equal(p.currentStreak(),9);
});
test('confident correction removes active priority and confident error adds it',()=>{
  const p=review({q0:{moduleId:'M0'}},{cards:{q0:card()},surpriseIds:['q0']});
  p.gradeCard('q0',true,'sure');assert.equal(p.selectSession().length,0);
  p.gradeCard('q0',false,'sure');assert.deepEqual(Array.from(p.selectSession()),['q0']);
});
test('focus scoring reflects recent regressions while retaining historical best',()=>{
  const window={};const source=fs.readFileSync('core/js/engine.js','utf8').replace('  document.addEventListener("DOMContentLoaded", boot);','  window.score = recentQuizScore;');
  vm.runInNewContext(source,{window,document:{},localStorage:{},console});
  assert.equal(window.score({highScore:90,scoreHistory:[90,40]}),65);
  assert.equal(window.score({highScore:100,scoreHistory:[100,100,30,40,50]}),40);
});
test('actual PSSA bank starts with fifteen different modules',()=>{
  const track=JSON.parse(fs.readFileSync('data/registry.json','utf8')).tracks.find(t=>t.trackId==='PSSA');const b={};
  for(const m of track.modules)for(const q of JSON.parse(fs.readFileSync(m.file,'utf8')).practiceQuiz)b[m.id+'::'+q.questionId]={moduleId:m.id};
  const selected=review(b,{cards:{},surpriseIds:[]}).selectSession();assert.equal(selected.length,15);assert.equal(new Set(selected.map(k=>b[k].moduleId)).size,15);
});

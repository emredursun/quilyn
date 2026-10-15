import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { exercises, topicAudit, literalArray } from '../scripts/audit-topic-quizzes.mjs';

test('every topic interactive is classified and every decision bank has valid balanced answers',()=>{
 const all=exercises();assert.equal(all.length,41);assert.equal(all.filter(e=>e.kind==='topic').length,24);assert.ok(all.every(e=>e.kind!=='unclassified'));
 for(const row of topicAudit()){assert.equal(row.skew,false,row.name);assert.deepEqual(row.errors,[],row.name);}
 for(const e of all.filter(e=>e.array))for(const q of e.array.value){assert.equal(q.opts.length,q.fbs.length);assert.ok(q.fbs.every(s=>typeof s==='string'&&s.length));}
});
test('literal extraction handles quotes, bracket characters and comments without running renderer code',()=>{
 const src='[{opts:["[", "]", "a\\\"b"], /* ] */ correct:0, fbs:["one","two","three"]}]; throw Error("renderer ran");';
 assert.equal(literalArray(src,0).value[0].opts[1],']');
});
function harness(exercise){
 const nodes=new Map(),created=[],buttons=Array.from({length:4},()=>({disabled:false,className:''}));
 const make=()=>({innerHTML:'',textContent:'',className:'',style:{},children:[],appendChild(el){this.children.push(el);},setAttribute(){}});
 const document={documentElement:{setAttribute(){}},getElementById(id){if(!nodes.has(id))nodes.set(id,make());return nodes.get(id);},querySelectorAll(){return buttons;},createElement(){const el=make();created.push(el);return el;}};
 const context=vm.createContext({document,window:{addEventListener(){}},console});
 const script=[...exercise.element.html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
 vm.runInContext(script,context,{timeout:200});
 return {context,nodes,created,buttons};
}
test('all 81 topic questions grade every option correctly and retain corresponding feedback',()=>{
 let graded=0;
 for(const exercise of exercises().filter(e=>e.array))for(const [i,q]of exercise.array.value.entries())for(let choice=0;choice<q.opts.length;choice++){
  const h=harness(exercise),c=h.context;c.cur=i;c.score=0;c.render();
  const render=[...h.nodes.values()].map(n=>n.innerHTML).join(' ');for(const text of q.opts)assert.ok(render.includes(text),exercise.name+' renders '+text);
  (c.ans||c.answer)(choice);
  assert.equal(c.score,choice===q.correct?1:0,exercise.name+'/Q'+(i+1)+' choice '+choice);
  assert.ok(h.nodes.get('prog').textContent.endsWith('Score: '+c.score+'/'+exercise.array.value.length),'progress score updates immediately');
  assert.ok(h.buttons.every(b=>b.disabled),'selection locks after grading');
  assert.ok(h.created.some(el=>el.textContent===q.fbs[choice]),'feedback follows selected option');
  assert.match(h.buttons[q.correct].className,/\bok\b/);
  graded++;
 }
 assert.equal(graded,324);
});
test('restarts restore the first question and score without changing option order',()=>{
 for(const e of exercises().filter(e=>e.array)){
  const h=harness(e),c=h.context;c.cur=1;c.score=3;c.restart();assert.equal(c.cur,0);assert.equal(c.score,0);
  const render=[...h.nodes.values()].map(n=>n.innerHTML).join(' ');const options=[...render.matchAll(/<button class="opt"[^>]*>([\s\S]*?)<\/button>/g)].map(m=>m[1]);assert.deepEqual(options,e.array.value[0].opts,e.name);
 }
});

const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function navigation(single=true,answers={}){
 let focus=null,active=null;const cards=Array.from({length:3},(_,i)=>({hidden:false,events:{},addEventListener(k,fn){this.events[k]=fn;},querySelector(){return {focus(){focus=i;}};},scrollIntoView(){}}));
 const elements=[];
 const document={createElement(){const controls={},el={setAttribute(){},querySelector(s){return controls[s]||(controls[s]={options:[{},{},{}]});}};elements.push(el);return el;}};
 const window={matchMedia:()=>({matches:single})};vm.runInNewContext(fs.readFileSync('core/js/learning-history.js','utf8'),{window,document});
 const api=window.QuilynJournal.practiceControls({children:cards,before(){},after(){}},['A','B','C'].map(questionId=>({questionId})),answers,i=>active=i);
 const [top,bottom]=elements;return {api,cards,top,bottom,active:()=>active,focus:()=>focus};
}
test('practice navigation restores the first unchecked question, retains answers and has bounded previous/next controls',()=>{
 const answers={A:{selected:['D'],graded:true},B:{selected:['A','C'],graded:false}},before=JSON.stringify(answers),h=navigation(true,answers);
 assert.equal(h.active(),1);assert.deepEqual(h.cards.map(c=>c.hidden),[true,false,true]);assert.equal(h.top.querySelector('.pq-jump').options[0].textContent,'Q1 · Checked');assert.equal(h.top.querySelector('.pq-jump').options[1].textContent,'Q2 · Selected');
 h.bottom.querySelector('.pq-next').onclick();assert.equal(h.active(),2);assert.equal(h.focus(),2);assert.equal(h.top.querySelector('.pq-next').disabled,true);
 h.top.querySelector('.pq-next').onclick();assert.equal(h.active(),2);h.top.querySelector('.pq-previous').onclick();assert.equal(h.active(),1);
 h.top.querySelector('.pq-layout').value='list';h.top.querySelector('.pq-layout').onchange();assert.deepEqual(h.cards.map(c=>c.hidden),[false,false,false]);assert.equal(h.bottom.hidden,true);
 h.cards[0].events.focusin();assert.equal(h.active(),0);assert.equal(h.top.querySelector('.pq-previous').disabled,true);assert.equal(JSON.stringify(answers),before);
});
test('status refresh tracks selection and grading, and stale navigation handlers cannot act after a conflict',()=>{
 const answers={},h=navigation(false,answers);assert.equal(h.active(),0);
 answers.B={selected:['B'],graded:false};h.api.refresh();assert.equal(h.top.querySelector('.pq-jump').options[1].textContent,'Q2 · Selected');
 answers.B.graded=true;h.api.refresh();assert.equal(h.top.querySelector('.pq-jump').options[1].textContent,'Q2 · Checked');assert.match(h.top.querySelector('.pq-status').textContent,/1 of 3 checked/);
 h.api.disable();assert.equal(h.top.querySelector('.pq-layout').disabled,true);assert.equal(h.top.querySelector('.pq-jump').disabled,true);h.bottom.querySelector('.pq-next').onclick();assert.equal(h.active(),0);
 h.top.querySelector('.pq-jump').value='2';h.top.querySelector('.pq-jump').onchange();assert.equal(h.active(),0);
});
test('completed practice remains browsable, with no answer or question-order rewrite',()=>{
 const answers=Object.fromEntries(['A','B','C'].map(id=>[id,{graded:true,selected:[id]}])),before=JSON.stringify(answers),h=navigation(true,answers);
 assert.equal(h.active(),0);h.top.querySelector('.pq-jump').value='2';h.top.querySelector('.pq-jump').onchange();assert.equal(h.active(),2);assert.equal(JSON.stringify(answers),before);
});
test('lesson contents use authored section IDs and update only the current location',()=>{
 const links=[0,1].map(()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}}));
 const headings=[{textContent:'First <concept>'},{textContent:'Second & example'}],sections=headings.map((h,i)=>({getAttribute:()=>['stable-one','stable-two'][i],querySelector:()=>h}));
 let inserted;const guide={querySelectorAll:()=>sections,prepend(el){inserted=el;}},window={addEventListener(){},matchMedia:()=>({matches:true})};
 const document={addEventListener(){},createElement:()=>({querySelectorAll:()=>links})};
 const source=fs.readFileSync('core/js/study-plan.js','utf8').replace('global.QuilynStudy={','global.QuilynStudy={contents:lessonContents,');vm.runInNewContext(source,{window,document});
 const update=window.QuilynStudy.contents({querySelector:()=>guide},'PSA','SA-M01');assert.equal(inserted.open,false);assert.match(inserted.innerHTML,/#PSA\/SA-M01\/guide\/stable-one/);assert.match(inserted.innerHTML,/First &lt;concept&gt;/);assert.match(inserted.innerHTML,/Second &amp; example/);
 update(headings[0]);assert.equal(links[0].attrs['aria-current'],'location');assert.equal(links[1].attrs['aria-current'],undefined);update(headings[1]);assert.equal(links[0].attrs['aria-current'],undefined);assert.equal(links[1].attrs['aria-current'],'location');
});

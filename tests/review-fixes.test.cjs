const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function node(){const handlers={},children=[],classes=new Set(),attrs={};return {handlers,children,style:{},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c),toggle(c,on){if(on===undefined)on=!classes.has(c);on?classes.add(c):classes.delete(c);return on;}},setAttribute:(k,v)=>attrs[k]=v,getAttribute:k=>attrs[k],addEventListener:(k,fn)=>handlers[k]=fn,appendChild:c=>children.push(c),prepend(){},scrollIntoView(){},querySelector(){return null;},querySelectorAll(){return [];},classes};}
test('quiz external change makes real option and check handlers inert; transient retries remain usable',()=>{
 for(const transient of [false,true]){const events={},writes=[],container=node(),cards=[];let option,check;
 const document={addEventListener(){},removeEventListener(){},createElement(){const el=node();Object.defineProperty(el,'innerHTML',{set(html){if(!html.includes('qhead'))return;option=node();option.setAttribute('data-id','A');check=node();el.querySelectorAll=s=>s==='.pa-opt'?[option]:[];el.querySelector=s=>s==='.check'?check:s==='.verdict'?node():null;cards.push(el);}});return el;}};
 const window={location:{hash:'#PSA/SA-M01'},addEventListener:(k,f)=>events[k]=f,removeEventListener(){},QuilynProgress:{read:()=>({version:2,answers:{}}),quizState:()=>({version:2,answers:{}}),quizSignature:()=> 'sig',write:(k,v)=>writes.push(JSON.parse(JSON.stringify(v)))}};
 container.querySelectorAll=s=>s==='.pa-opt'?[option]:s==='input,button'?[check]:[];
 vm.runInNewContext(fs.readFileSync('core/js/quiz-engine.js','utf8'),{window,document});
 window.PegaQuiz.render(container,[{questionId:'Q1',type:'single-select',scenario:'Which?',options:[{id:'A',text:'First'}],correctOptions:['A']}],null,null,transient,{});
 events['quilyn-progress-external']({detail:{key:'pq_state_#PSA/SA-M01'}});option.handlers.click();
 assert.equal(option.classes.has('selected'),transient);assert.equal(writes.length,0);
 if(!transient){check.handlers.click();assert.ok(!option.classes.has('correct'));assert.equal(check.disabled,true);}
 }
});
test('Reset Everything discards active work before deletion and pagehide cannot recreate keys',async()=>{
 const values=new Map([['quilyn_study','old'],['pega_universal_state','old'],['pegaMock_PSA_Exam','old'],['unrelated','keep']]),calls=[],timers=[];let lesson=true,mock=true,store=true;
 const window={QuilynProgress:{beginReset(){calls.push('suspend');}},QuilynStudy:{discardLesson(){lesson=false;calls.push('lesson');}},MockView:{discard(){mock=false;calls.push('mock');}},PegaStore:{discard(){store=false;calls.push('store');}}};
 const storage={get length(){return values.size;},key:i=>[...values.keys()][i],removeItem(k){calls.push('remove');values.delete(k);}};
 const document={getElementById:()=>null,querySelector:()=>null,createElement:()=>({setAttribute(){},classList:{add(){},remove(){}},remove(){}}),body:{appendChild(){}}};
 const source=fs.readFileSync('core/js/settings.js','utf8').replace('global.PegaSettings = {','global.PegaSettings = {resetAll:resetAll,');
 vm.runInNewContext(source,{window,localStorage:storage,document,confirm:()=>true,setTimeout:fn=>timers.push(fn),location:{reload(){if(lesson)values.set('quilyn_study','resurrected');if(mock)values.set('pegaMock_PSA_Exam','resurrected');if(store)values.set('pega_universal_state','resurrected');}}});
 window.PegaSettings.resetAll();timers.forEach(fn=>fn());assert.deepEqual(calls.slice(0,4),['suspend','lesson','mock','store']);assert.deepEqual([...values.keys()],['unrelated']);
});
test('lazy feature JS and CSS use the runtime script version from the HTML shell',async()=>{
 const html=fs.readFileSync('index.html','utf8'),token=html.match(/runtime\.js\?v=([^"']+)/)[1],versions=[...html.matchAll(/(?:core\/(?:js|css)\/[^"']+?)\?v=([^"']+)/g)].map(m=>m[1]);assert.ok(versions.every(v=>v===token));
 const assets=[],window={};const document={baseURI:'https://example.com/quilyn/',currentScript:{src:'https://example.com/quilyn/core/js/runtime.js?v='+token},addEventListener(){},createElement:()=>({remove(){}}),head:{appendChild(el){assets.push(el);el.onload();}}};
 vm.runInNewContext(fs.readFileSync('core/js/runtime.js','utf8'),{window,document,URL,Map});
 await window.QuilynRuntime.personalization();await window.QuilynRuntime.library();await window.QuilynRuntime.review();await window.QuilynRuntime.home();assert.equal(assets.length,9);assert.ok(assets.some(el=>(el.href||'').includes('core/css/study-plan.css')));assert.ok(assets.every(el=>new URL(el.src||el.href,document.baseURI).searchParams.get('v')===token));
});
function quotaQuiz(){
 const events={},values=new Map([['pq_state_#PSA/SA-M01',JSON.stringify({version:2,attemptId:'older-attempt',answers:{old:{selected:['A'],graded:true,signature:'old'}}})]]),writes=[],cards=[],notices=[],container=node();let reset,retry,renders=0,archives=0;
 const document={addEventListener(){},removeEventListener(){},createElement(tag){const el=node();if(tag==='button')reset=el;Object.defineProperty(el,'innerHTML',{set(html){
  if(html.includes('qhead')){const options=['A','B'].map(id=>{const option=node();option.setAttribute('data-id',id);return option;}),check=node(),verdict=node(),rationale=node();el.querySelectorAll=s=>s==='.pa-opt'?options:[];el.querySelector=s=>s==='.check'?check:s==='.verdict'?verdict:s==='.rationale'?rationale:null;cards.push({el,options,check,verdict});}
  if(html.includes('pa-retry-wrong')){retry=node();el.querySelector=s=>s==='.pa-retry-wrong'?retry:null;}
 }});return el;}};
 Object.defineProperty(container,'innerHTML',{set(){renders++;container.children.length=0;}});container.prepend=notice=>notices.push(notice);
 container.querySelectorAll=s=>s==='.pa-opt'?cards.at(-1).options:s==='input,button'?[reset,cards.at(-1).check]:[];
 const localStorage={getItem:k=>values.get(k)||null,setItem(k,v){writes.push(k);values.set(k,v);},removeItem(k){writes.push(k);values.delete(k);}};
 const progress={read:k=>JSON.parse(values.get(k)),quizState:()=>({version:2,answers:{}}),quizSignature:()=> 'sig',archive(){archives++;return false;},write:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),remove:k=>localStorage.removeItem(k)};
 const journal={id:()=> 'attempt',read:()=>({attempts:[{id:'older-attempt',total:2}]}),quizQuestion:()=>({}),feedbackHTML:()=>'',record(){writes.push('journal');},abandon(){writes.push('abandon');return true;}};
 const window={location:{hash:'#PSA/SA-M01'},addEventListener:(k,f)=>events[k]=f,removeEventListener(){},QuilynProgress:progress,QuilynJournal:journal};
 vm.runInNewContext(fs.readFileSync('core/js/quiz-engine.js','utf8'),{window,document,localStorage});
 window.PegaQuiz.render(container,[{questionId:'Q1',type:'single-select',scenario:'Which?',options:[{id:'A',text:'First'},{id:'B',text:'Second'}],correctOptions:['A']}],()=>writes.push('score'),null,false,{track:'PSA',moduleId:'SA-M01'});
 return {values,writes,cards,notices,get reset(){return reset;},get retry(){return retry;},get renders(){return renders;},get archives(){return archives;},conflict(){events['quilyn-progress-external']({detail:{key:'pq_state_#PSA/SA-M01'}});}};
}
test('archive quota failure permits grading, reset and retry without altering saved quiz, history or score',()=>{
 const h=quotaQuiz(),original=[...h.values];assert.equal(h.archives,1);let card=h.cards.at(-1);
 assert.notEqual(card.options[1].getAttribute('aria-disabled'),'true');card.options[1].handlers.click();assert.ok(card.options[1].classes.has('selected'));
 card.check.handlers.click();assert.ok(card.el.classes.has('answered'));assert.ok(card.options[1].classes.has('wrong'));assert.match(card.verdict.textContent,/Incorrect/);
 h.retry.handlers.click();card=h.cards.at(-1);card.options[0].handlers.click();card.check.handlers.click();assert.ok(card.options[0].classes.has('correct'));assert.deepEqual(h.writes,[]);
 const reset=quotaQuiz(),saved=[...reset.values];reset.reset.handlers.click();assert.equal(reset.renders,2);reset.cards.at(-1).options[0].handlers.click();reset.cards.at(-1).check.handlers.click();assert.deepEqual(reset.writes,[]);assert.deepEqual([...reset.values],saved);
 assert.deepEqual([...h.values],original);
});
test('external change still locks a quiz after archive failure, including stale Reset and Check handlers',()=>{
 const h=quotaQuiz(),card=h.cards.at(-1),reset=h.reset;card.options[0].handlers.click();h.conflict();h.conflict();
 assert.equal(h.notices.length,1);assert.equal(reset.disabled,true);assert.equal(card.check.disabled,true);assert.equal(card.options[1].getAttribute('aria-disabled'),'true');assert.ok(card.options[1].classes.has('disabled'));
 card.options[1].handlers.click();card.check.handlers.click();reset.handlers.click();assert.ok(card.options[0].classes.has('selected'));assert.ok(!card.options[1].classes.has('selected'));assert.ok(!card.el.classes.has('answered'));assert.equal(h.renders,1);assert.deepEqual(h.writes,[]);
});

test('quiz letter shortcuts respect browser commands, composition and editable focus',()=>{
 const handlers={},clicks=[],document={activeElement:{tagName:'DIV'},querySelectorAll:()=>[]},window={};
 const source=fs.readFileSync('core/js/quiz-engine.js','utf8').replace('})(window);',`window.quizKeys={handle:_kbHandler,prime:function(root){_kbContainer=root;_kbActiveIdx=0;}};})(window);`);
 vm.runInNewContext(source,{window,document});window.quizKeys.prime({isConnected:true,getClientRects:()=>[{}],querySelectorAll:()=>[{click(){clicks.push('answer');}}],querySelector:()=>({click(){clicks.push('hint');}})});
 function key(extra){let prevented=false;window.quizKeys.handle({key:'a',preventDefault(){prevented=true;},...extra});return prevented;}
 for(const flag of ['ctrlKey','metaKey','altKey','isComposing','defaultPrevented']){assert.equal(key({[flag]:true}),false,flag);assert.deepEqual(clicks,[]);}
 document.activeElement.isContentEditable=true;assert.equal(key({}),false);assert.deepEqual(clicks,[]);
 document.activeElement.isContentEditable=false;assert.equal(key({}),true);assert.deepEqual(clicks,['answer']);
});

test('graded quiz keeps only picked options selected so native checked state survives grading',()=>{
 const window={addEventListener(){},removeEventListener(){}},nodes=['A','B','C'].map(id=>{const el=node();el.setAttribute('data-id',id);el.querySelector=()=>null;return el;});nodes[2].classList.add('selected');
 const verdict=node(),rationale=node(),check=node(),card=node();card.querySelectorAll=()=>nodes;card.querySelector=s=>s==='.verdict'?verdict:s==='.rationale'?rationale:check;
 const source=fs.readFileSync('core/js/quiz-engine.js','utf8').replace('    /* Build each question card */','    global.gradeForTest=applyGradedState;\n    /* Build each question card */');
 vm.runInNewContext(source,{window,document:{addEventListener(){},createElement:()=>node()},localStorage:{getItem:()=>null}});
 window.QuilynProgress={quizState:()=>({version:2,answers:{}})};window.PegaQuiz.render(node(),[],null,null,true,{});
 const q={type:'multi-select',options:['A','B','C'].map(id=>({id})),correctOptions:['A','C']};window.gradeForTest(card,q,['A','B']);
 assert.equal(nodes[0].classes.has('selected'),true);assert.equal(nodes[1].classes.has('selected'),true);assert.equal(nodes[2].classes.has('selected'),false);assert.equal(nodes[0].classes.has('correct'),true);assert.equal(nodes[1].classes.has('wrong'),true);assert.equal(nodes[2].classes.has('correct'),true);assert.ok(nodes.every(el=>el.classes.has('disabled')));
});

test('mock check, restore and post-submit review retain only picked native controls, including unanswered cards',()=>{
 const document={addEventListener(){},getElementById:()=>null,querySelectorAll:()=>[]},window={QuilynProgress:{write(){}}};
 const source=fs.readFileSync('core/js/mock-view.js','utf8').replace('})(window);','global.mockForTest=function(root,picks,isChecked){_root=root;current="Exam";EXAMS={Exam:[{a:[0,2],r:"Reason"}]};answers=[picks];checked=[isChecked];externalConflict=false;examMode="practice";};global.checkForTest=checkAnswer;global.restoreForTest=restoreCardVisuals;global.reviewForTest=reviewExam;})(window);');
 vm.runInNewContext(source,{window,document,HTMLElement:class{},customElements:{define(){}},Date,console});
 vm.runInNewContext(fs.readFileSync('core/js/runtime.js','utf8').replace('global.QuilynRuntime = {','global.QuilynRuntime = {syncForTest:syncChoices,'),{window,document,Map});
 for(const path of ['check','restore','review'])for(const picks of [[0,1],[2],[]]){
  if(path==='check'&&!picks.length)continue;
  const options=[0,1,2].map(j=>{const option=node();option.dataset={j:String(j)};option.classList.add('sel');option.input={};option.querySelector=()=>option.input;return option;});
  const card=node();card.querySelectorAll=()=>options;card.querySelector=s=>s==='.check-btn'?node():null;options.forEach(o=>o.closest=()=>card.classes.has('reviewed')?card:null);
  const root=node();root.querySelector=s=>s.startsWith('.q[data-i=')?card:null;
  window.mockForTest(root,picks,path==='restore');
  if(path==='check')window.checkForTest(0,card);else if(path==='restore')window.restoreForTest();else window.reviewForTest();
  window.QuilynRuntime.syncForTest({querySelectorAll:()=>options});
  assert.deepEqual(options.map(o=>o.input.checked),options.map((o,j)=>picks.includes(j)),path+' '+picks);
  assert.ok(options.every(o=>o.input.disabled));assert.ok(options[0].classes.has('correct'));assert.ok(options[2].classes.has('correct'));
 }
});

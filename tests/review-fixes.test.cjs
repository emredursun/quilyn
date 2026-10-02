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
 await window.QuilynRuntime.personalization();await window.QuilynRuntime.library();await window.QuilynRuntime.review();assert.equal(assets.length,6);assert.ok(assets.every(el=>new URL(el.src||el.href,document.baseURI).searchParams.get('v')===token));
});

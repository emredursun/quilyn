(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Object vs Record",
    "scenario": "A team is modeling a 'Policy' entity. Someone says 'the Policy data object defines what a Policy IS; a Policy record is a specific customer's policy instance.' Another person says 'that's the same thing.' Who is right?",
    "opts": [
      "The second: data object and record both combine structure and values",
      "They are identical in App Studio but distinct in Dev Studio",
      "The terms are reversed: a record defines structure; an object holds instance values",
      "The first: a data object defines structure; a record holds instance values"
    ],
    "correct": 3,
    "fbs": [
      "✗ Incorrect. These are distinct concepts. Confusing them leads to misunderstanding how Pega manages data at design time vs. runtime.",
      "✗ Incorrect. The distinction between object and record is consistent across App Studio and Dev Studio — it does not change based on which tool you are using.",
      "✗ Incorrect. The convention is: object = structure/schema, record = values/instance. The first person has it correct.",
      "✓ Correct. Data object = schema/definition (like a class). Data record = an instance with actual values (like an object instance). The distinction mirrors the class/instance pattern in programming."
    ]
  },
  {
    "label": "Data Page Scope",
    "scenario": "An SA adds a 'ProductCatalog' Data Page that loads 10,000 product records. This should be available to all users across all sessions with sharing on the same node, subject to refresh and parameter configuration. Which scope is correct?",
    "opts": [
      "Node scope, with appropriate refresh and parameter settings",
      "Thread scope, limited to one Case thread",
      "Application scope, shared across every application node",
      "Requestor scope, shared across a user's Cases during their session"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. Node scope shares cached data on that node; refresh settings and parameters can cause additional loads — ideal for large product catalogs that rarely change.",
      "✗ Incorrect. Thread scope is per-Case — even the same user opening a second Case would trigger a reload. Extremely inefficient for a large shared catalog.",
      "✗ Incorrect. Node scope IS the correct choice here. Application scope is not a standard Pega Data Page scope option.",
      "✗ Incorrect. Requestor scope is per-user session — with 500 concurrent users, the catalog would be loaded 500 times into memory simultaneously. Not efficient for large shared reference data."
    ]
  },
  {
    "label": "Integration Map Usage",
    "scenario": "An SA is onboarding to a legacy Pega application and needs to quickly understand: which external systems does this application integrate with, which data objects connect to each system, and how many Data Pages exist per object. Where is this information found in one place?",
    "opts": [
      "Case Life Cycle",
      "Ruleset stack",
      "Integration Map",
      "Security Checklist"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. The Case Life Cycle shows workflow steps and automations, not the data architecture and external system dependencies.",
      "✗ Incorrect. The Ruleset stack shows which Rulesets are in scope and their layering order — it does not map data objects to external systems.",
      "✓ Correct. The Integration Map (Integration Designer) is the single visualization that shows data objects, Data Pages, and external system connections together.",
      "✗ Incorrect. The Security Checklist tracks compliance with security best practices — it is not a data integration visualization tool."
    ]
  },
  {
    "label": "Structural Change Impact",
    "scenario": "A data team adds a new field 'CustomerTier' to the Customer data object that was originally designed 2 years ago and is used by 12 Case Types. A junior developer says 'This is just adding a value — very low risk.' The SA flags it as a design-time change requiring more care. Who is right?",
    "opts": [
      "The SA is right, but only if 'CustomerTier' replaces an existing field; adding a completely new field with no existing counterpart is always safe",
      "The SA is right — adding a new field changes the data object's structure (schema), which affects all 12 Case Types that reference it; the team should review which Views and validations may need updating",
      "The junior developer is right — adding a field only makes it available; since no existing rules reference the new field, there is zero impact on existing Case Types",
      "Both are right — adding the field itself is low risk, but setting a default value for existing records is the higher-risk structural change"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. Adding any new field to a widely-used data object is a structural change that requires review, regardless of whether it replaces something or is net-new.",
      "✓ Correct. Adding a field IS a structural change. All 12 Case Types that include the Customer data object may need updated Views, validation rules, and Data Transform logic. It requires coordinated review.",
      "✗ Incorrect. Even though no existing rules reference the new field yet, adding it changes the schema that all 12 Case Types inherit. Review dependent Views, mappings and validations; do not assume automatic impact on every consumer.",
      "✗ Incorrect. The structural change concern is the field addition itself — not just the default value. The SA's concern is correct regardless of default value impact."
    ]
  }
],cur=0,score=0;
function render(){var s=S[cur];document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
var h='<div class="lbl">'+s.label+'</div><div class="sc">'+s.scenario+'</div>';
s.opts.forEach(function(o,i){h+='<button class="opt" data-quilyn-action="ans('+i+')">'+o+'</button>';});
document.getElementById('qc').innerHTML=h;document.getElementById('nav').innerHTML='';}
function ans(i){var s=S[cur];var bs=document.querySelectorAll('.opt');bs.forEach(function(b){b.disabled=true;});
var ok=i===s.correct;if(ok)score++;document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
s.opts.forEach(function(o,j){bs[j].className=j===s.correct?'opt ok':(j===i&&!ok?'opt bad':'opt');});
var fb=document.createElement('div');fb.className='fb '+(ok?'ok':'bad');fb.textContent=s.fbs[i];
document.getElementById('qc').appendChild(fb);
if(cur<S.length-1)document.getElementById('nav').innerHTML='<button class="btn p" data-quilyn-action="nxt()">Next →</button>';
else done();}
function nxt(){cur++;render();}
function done(){var p=Math.round(score/S.length*100);var m=p===100?'Perfect.':p>=75?'Good — review the missed items.':'Re-read the module content and retry.';
document.getElementById('qc').innerHTML='<div class="sb">'+score+'/'+S.length+' ('+p+'%)</div><div class="sm">'+m+'</div>';
document.getElementById('nav').innerHTML='<button class="btn" data-quilyn-action="restart()">Restart</button>';}
function restart(){cur=0;score=0;render();}
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

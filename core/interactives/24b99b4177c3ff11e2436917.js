(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Ruleset Versioning",
    "scenario": "A developer needs to safely experiment with a new SLA configuration without risking the production routing rule. The production Ruleset is at version 01-01-01. What should they do before making changes?",
    "opts": [
      "Create a new Rule type to hold the experimental logic — separate rule types cannot conflict with each other",
      "Create the changed Rule in a new appropriate development version, retaining the older version",
      "Copy the rule to a personal file, make changes in production, then restore the file copy if needed",
      "Edit the rule directly in the production version — Pega's rule locking prevents accidental overwrites in shared Rulesets"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. Creating a separate rule type doesn't protect the original — it changes the application architecture and doesn't version the original rule.",
      "Versioning retains an older definition. 01-01-02 is a patch increment, not a minor increment.",
      "✗ Incorrect. Copying to a file is a manual workaround outside Pega's rule management — not auditable, not recoverable through Pega tooling.",
      "✗ Incorrect. Editing directly in the production version is exactly what the developer should NOT do — there's no separation between the experiment and production logic."
    ]
  },
  {
    "label": "Branching for Parallel Work",
    "scenario": "Two developers need to independently experiment with routing changes at the same time, without interfering with each other or the main application. What mechanism supports parallel independent development?",
    "opts": [
      "Parallel minor Ruleset versions, merged after the experiments",
      "Separate Pega servers, synchronized through export/import",
      "Separate studio rule repositories, merged on publishing",
      "Separate branch Rulesets for each developer's experiment"
    ],
    "correct": 3,
    "fbs": [
      "Version boundaries alone do not provide the feature isolation and reviewed merge workflow requested here.",
      "Separate environments may be used in delivery, but branching directly expresses the requested isolated feature development.",
      "✗ Incorrect. App Studio and Dev Studio use the SAME rule repository — there is no studio-level isolation. Both developers would be editing the same rules.",
      "Branches isolate proposed changes; integration can still require conflict review."
    ]
  },
  {
    "label": "Local vs Shared Field",
    "scenario": "An SA is building a 'Fraud Claim' Case Type. They need a field 'FraudIndicatorScore' (a number calculated only for fraud claims) and a field 'CustomerAddress' (needed on Fraud Claims AND Service Request Claims). Where should each field be created?",
    "opts": [
      "FraudIndicatorScore → shared data object (for fraud reporting). CustomerAddress → Local Data Model (since this Case Type uses it)",
      "Both → a shared data object — Pega recommends all fields in shared objects for maximum flexibility",
      "FraudIndicatorScore → Local Data Model of the Fraud Claim Case Type (Case-specific). CustomerAddress → shared Address data object (reusable across Case Types)",
      "Both → Local Data Model of the Fraud Claim Case Type — each Case Type manages all its own fields independently"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. FraudIndicatorScore in a shared object makes no sense — it's not needed by other Case Types. CustomerAddress in the local Data Model means it can't be easily reused across Case Types.",
      "✗ Incorrect. FraudIndicatorScore is unique to fraud claims — putting it in a shared object pollutes the shared data model with Case-specific concepts.",
      "✓ Correct. Case-specific fields (FraudIndicatorScore) belong in the local Data Model. Reusable fields (CustomerAddress) belong in a shared data object to avoid duplication.",
      "✗ Incorrect. If CustomerAddress is duplicated in every Case Type's local Data Model, a change to the address structure requires updates in every Case Type. Shared objects prevent this."
    ]
  }
],cur=0,score=0;
function render(){var s=S[cur];document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
var h='<div class="lbl">'+s.label+'</div><div class="sc">'+s.scenario+'</div>';
s.opts.forEach(function(o,i){h+='<button class="opt" data-quilyn-action="ans('+i+')">'+o+'</button>';});
document.getElementById('qc').innerHTML=h;document.getElementById('nav').innerHTML='';}
function ans(i){var s=S[cur];var bs=document.querySelectorAll('.opt');bs.forEach(function(b){b.disabled=true;});
var ok=i===s.correct;if(ok)score++;
document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
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

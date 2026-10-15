(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('dark');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Blueprint Access",
    "scenario": "A BA has no Operator login to the company’s Pega Platform instance. Must that instance be provisioned before she can start a Blueprint design?",
    "opts": [
      "Yes — Blueprint accesses the company's Pega environment to validate rule names, so the user must be an Operator in that environment",
      "No — Blueprint is a separate SaaS service; Platform instance access is not required to start the proposal",
      "No — Blueprint is available in App Studio under File → New Blueprint; the BA just needs to open App Studio",
      "Yes — Blueprint requires at least a Pega free-trial account to authenticate before generating any proposals"
    ],
    "correct": 1,
    "fbs": [
      "Incorrect. A Platform Operator account is not the prerequisite for generating the proposal.",
      "Correct. Platform identity and Blueprint access are separate. Follow SaaS sign-in and collaboration requirements; the URL does not grant unrestricted access.",
      "✗ Incorrect. Blueprint is not a feature inside App Studio — it is a separate SaaS product at pega.com/blueprint.",
      "Incorrect. The source does not require a Platform trial environment before starting the separate SaaS design."
    ]
  },
  {
    "label": "Blueprint Import",
    "scenario": "In the documented new-application Blueprint import, which statement correctly describes Access Roles and the Branch?",
    "opts": [
      "Access Roles must be in the Branch, so their absence there proves the import failed",
      "Access Roles are never created by Blueprint import and always require recreation from scratch",
      "Access Roles are the exception to creation inside the Branch; this does not mean they are excluded from the application",
      "Only environments before Infinity 24 place Access Roles outside the Branch"
    ],
    "correct": 2,
    "fbs": [
      "Incorrect. Access Roles are the documented exception to branch placement.",
      "Incorrect. Absence from the Branch is not evidence of absence from the application.",
      "Correct. The source describes branch placement, not exclusion from asset creation. Inspect application security separately.",
      "Incorrect. The source does not state this release cutoff."
    ]
  },
  {
    "label": "Blueprint vs App Studio",
    "scenario": "After importing a Blueprint, a product manager says: 'Great — now that we have Blueprint, we don't need App Studio anymore. Blueprint is the replacement.' How should the SA respond?",
    "opts": [
      "Blueprint accelerates initial design; continue configuration in App Studio",
      "Blueprint replaces App Studio with a deploy-ready application requiring no configuration",
      "Blueprint replaces App Studio during design; return there after the application goes live",
      "Blueprint output requires Dev Studio for every subsequent configuration change"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. Blueprint jumpstarts design; App Studio is where the team builds, configures, and refines the actual running application.",
      "✗ Incorrect. A Blueprint import produces a starting point, not a finished application. Significant configuration, testing, and iteration remains in App Studio.",
      "✗ Incorrect. Blueprint is used pre-build and again when adding major features — it does not have a 'design phase only' limitation, and it does not replace App Studio for live applications.",
      "✗ Incorrect. App Studio remains the primary tool for configuring the application after a Blueprint import. There is no requirement to use Dev Studio instead."
    ]
  },
  {
    "label": "Blueprint Best Practices",
    "scenario": "A team skips the refinement step after Blueprint generates a proposal and immediately exports/imports it. The resulting application has misnamed Case Types and incorrect Data Model fields. What best practice did they violate?",
    "opts": [
      "Export within 30 minutes before the proposal expires",
      "Run PremBridge before generation to ensure correct field names",
      "Rely on automatic schema validation instead of reviewing the proposal",
      "Review and refine the generated proposal before exporting it"
    ],
    "correct": 3,
    "fbs": [
      "✗ Incorrect. Blueprint proposals do not expire on a time limit. The refinement step is about quality, not timing.",
      "✗ Incorrect. PremBridge is unrelated to Blueprint's field name accuracy. Review is a human responsibility, not a tool prerequisite.",
      "Incorrect. Whatever automated validation is available, it cannot prove that the proposal meets these business requirements.",
      "Correct. Compare the proposal to business requirements before importing; automated checks do not replace stakeholder and developer review."
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

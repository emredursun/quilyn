(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('dark');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Goal vs Deadline",
    "scenario": "A claims Step: agents SHOULD finish within 2 hours; they MUST finish within 8 hours or it escalates. How are these configured?",
    "opts": [
      "Two deadlines at different urgency levels",
      "Goal: 2 hours; Deadline: 8 hours",
      "Deadline: 2 hours; Goal: 8 hours",
      "Only an 8-hour deadline; no goal"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. A Step has one goal and one deadline, not two deadlines.",
      "✓ Correct. Goal is the earlier soft target; deadline is the later hard limit. The goal is the desired target in this policy.",
      "✗ Incorrect. This reverses the two times specified in the policy.",
      "✗ Incorrect. Skipping the goal loses the early-warning escalation at 2 hours."
    ]
  },
  {
    "label": "Create Stage",
    "scenario": "An SA tries to add a goal and deadline to the Create Stage of a Case Type but the option is unavailable. Why?",
    "opts": [
      "Goal/deadline can only be set in Dev Studio for the Create Stage",
      "SLAs are only allowed on the last Stage of a Case",
      "The Create Stage collects data before Case processing starts, so it cannot have a goal/deadline or escalation action",
      "You must first add an SLA at the Case level before any Stage SLA is allowed"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. The Create Stage cannot have an SLA in any studio — it is a design rule, not a UI limitation.",
      "✗ Incorrect. SLAs are allowed on any Stage except the Create Stage — not just the last one.",
      "✓ Correct. The Create Stage runs before Case processing begins, so SLAs/escalation actions cannot be set on it.",
      "✗ Incorrect. A Case-level SLA is not a prerequisite for Stage SLAs."
    ]
  },
  {
    "label": "Urgency update",
    "scenario": "A running Case’s Urgency is updated from 10 to 30. What happens to Assignments that are already open?",
    "opts": [
      "All open Assignments immediately inherit the new Urgency 30",
      "Nothing changes until each Assignment's goal has elapsed",
      "All Assignments reset to 10 and start climbing again",
      "Existing Assignments retain their Urgency; new Assignments inherit 30"
    ],
    "correct": 3,
    "fbs": [
      "✗ Incorrect. Existing Assignments are not retroactively changed.",
      "✗ Incorrect. The new value is used at Assignment creation, not at goal elapse.",
      "✗ Incorrect. There is no reset-to-10 behavior.",
      "✓ Correct. Updating Case Urgency affects new Assignments only; this Case update does not rewrite existing Assignments; their own SLA may still adjust urgency."
    ]
  }
],cur=0,score=0;
function render(){var s=S[cur];document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' \u2014 Score: '+score+'/'+S.length;
var h='<div class="lbl">'+s.label+'</div><div class="sc">'+s.scenario+'</div>';
s.opts.forEach(function(o,i){h+='<button class="opt" data-quilyn-action="ans('+i+')">'+o+'</button>';});
document.getElementById('qc').innerHTML=h;document.getElementById('nav').innerHTML='';}
function ans(i){var s=S[cur];var bs=document.querySelectorAll('.opt');bs.forEach(function(b){b.disabled=true;});
var ok=i===s.correct;if(ok)score++;
document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
s.opts.forEach(function(o,j){bs[j].className=j===s.correct?'opt ok':(j===i&&!ok?'opt bad':'opt');});
var fb=document.createElement('div');fb.className='fb '+(ok?'ok':'bad');fb.textContent=s.fbs[i];
document.getElementById('qc').appendChild(fb);
if(cur<S.length-1)document.getElementById('nav').innerHTML='<button class="btn p" data-quilyn-action="nxt()">Next \u2192</button>';
else done();}
function nxt(){cur++;render();}
function done(){var p=Math.round(score/S.length*100);var m=p===100?'Perfect.':p>=67?'Good \u2014 review the missed items.':'Re-read the module and retry.';
document.getElementById('qc').innerHTML='<div class="sb">'+score+'/'+S.length+' ('+p+'%)</div><div class="sm">'+m+'</div>';
document.getElementById('nav').innerHTML='<button class="btn" data-quilyn-action="restart()">Restart</button>';}
function restart(){cur=0;score=0;render();}
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

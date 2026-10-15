(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Named vs Pool",
    "scenario": "A procurement manager personally signs off on all contracts. No one else can approve in their absence — only they can complete the Contract Approval Assignment. Where should this Assignment be routed?",
    "opts": [
      "The manager's personal Worklist",
      "Broadcast to approver Worklists",
      "Route by lowest Assignment count",
      "The Contract Approval Work Queue"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. When a specific named individual must complete the work (personal accountability), route to their Worklist.",
      "✗ Incorrect. Broadcasting to multiple Worklists creates multiple Assignments and potential duplicate completions.",
      "✗ Incorrect. Load balancing chooses dynamically — it cannot guarantee the specific named manager receives every contract.",
      "✗ Incorrect. A Work Queue supports eligible users claiming shared work — the scenario requires ONE specific person."
    ]
  },
  {
    "label": "Shared Pool",
    "scenario": "A document verification team of 12 analysts must process verification requests. All 12 should see the same incoming requests. Whoever is free picks it up. Which routing applies?",
    "opts": [
      "The team lead's personal Worklist",
      "The shared Document Verification Work Queue",
      "Each analyst's individual Worklist",
      "Round-robin across the twelve individual Worklists"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. Manager delegation is a manual bottleneck — defeats the purpose of automated shared-pool routing.",
      "✓ Correct. Work Queue = shared pool. One Assignment, 12 can see it, first to claim processes it. No duplicates.",
      "✗ Incorrect. Broadcasting to 12 Worklists creates 12 separate Assignments — all 12 could submit the same verification, creating conflicts.",
      "✗ Incorrect. Round-robin sends to one analyst at a time, removing visibility from the other 11 who may also be available."
    ]
  },
  {
    "label": "Queue vs List Behavior",
    "scenario": "A CSR claims a customer complaint Assignment from the Work Queue. 30 minutes later, they are pulled into an urgent meeting. What happens to the Assignment they claimed?",
    "opts": [
      "It automatically returns to the Work Queue after 30 minutes of inactivity",
      "It becomes shared with the team when the CSR becomes inactive",
      "It stays in their Worklist until the CSR or manager reassigns it",
      "The SLA escalates it to the manager, who manually reassigns it"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. Assignments do not auto-return to a queue based on inactivity time. The SLA escalation timeout can trigger reassignment, but that requires explicit SLA configuration.",
      "✗ Incorrect. Claimed Assignments are not automatically shared — they are exclusively in the claiming CSR's Worklist until completed or explicitly reassigned.",
      "✓ Correct. Once claimed, the Assignment moves to the CSR's Worklist and is assigned to that operator. It does not auto-return unless a manager manually reassigns it (or an SLA escalation triggers reassignment).",
      "✗ Incorrect. An escalation notification requires explicit configuration; a notification alone does not reassign the work. Any automatic reassignment must be explicitly configured; notification and reassignment are different actions."
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

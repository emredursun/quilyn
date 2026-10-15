(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Finite recurrence",
    "scenario": "A manager notification should repeat at most three times after the deadline. Which design fits?",
    "opts": [
      "Set an event limit of three and configure the notification",
      "Treat the goal event as the first overdue repeat",
      "Leave repetition unlimited regardless of policy",
      "Increase urgency without defining a notification"
    ],
    "correct": 0,
    "fbs": [
      "The count bounds the notification series.",
      "The goal precedes the overdue intervals.",
      "Unlimited repeats do not meet the stated limit.",
      "Urgency alone does not define the notification."
    ]
  },
  {
    "label": "Priority ceiling",
    "scenario": "Urgency is already 100 and an applicable overdue event has Notify Manager configured. What happens?",
    "opts": [
      "Urgency reaches 100; the Assignment automatically completes",
      "Urgency remains 100; Notify Manager is suppressed",
      "Urgency increases beyond the maximum of 100",
      "Urgency remains 100; Notify Manager still executes"
    ],
    "correct": 3,
    "fbs": [
      "Priority does not establish completion.",
      "The cap does not suppress configured actions.",
      "The maximum remains 100.",
      "The cap applies to urgency, not the other configured action."
    ]
  },
  {
    "label": "Stop condition",
    "scenario": "An SLA should stop the overdue series when its Assignment is completed. Must the entire Case stay unresolved for the series to continue?",
    "opts": [
      "Always repeat until every task in the Case finishes",
      "Use Assignment completion as the relevant stop condition",
      "Ignore the event count",
      "Automatically restart the Assignment"
    ],
    "correct": 1,
    "fbs": [
      "Case resolution is not the only relevant stop condition.",
      "The documented recurring policy concerns the incomplete Assignment.",
      "A configured event limit also bounds repeats.",
      "Completion does not inherently restart the Assignment."
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

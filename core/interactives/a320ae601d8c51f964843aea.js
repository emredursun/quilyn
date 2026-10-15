(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Identify the shape",
    "scenario": "In a Process diagram you see an ORANGE DIAMOND. It adds a conditional path that supports more than one outcome and advances the Process automatically based on business logic. Which shape is this?",
    "opts": [
      "A Decision shape",
      "A Subprocess",
      "An Assignment shape",
      "An Automation shape"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. Decision shapes are orange diamonds. They add a conditional path supporting more than one outcome and advance the Process automatically based on business logic or Conditions.",
      "✗ Incorrect. A Subprocess is a BLUE rectangle, not an orange diamond.",
      "✗ Incorrect. An Assignment shape is a GREEN rectangle that pauses for a user — not an orange diamond.",
      "✗ Incorrect. Automation shapes (Create Case, Send email, Change Stage) are YELLOW rectangles, not orange diamonds."
    ]
  },
  {
    "label": "Connector vs Local Action",
    "scenario": "At an Assignment, clicking a button should COMPLETE the Assignment and ADVANCE the Case to the next shape. Which Flow Action type is this, and how is it configured?",
    "opts": [
      "A Decision shape — configured as an orange diamond in the Process Modeler",
      "An Automation — configured as a yellow rectangle in the Process Modeler",
      "A Connector Action — configured as a line shape (the connector/arrow) in the Process Modeler",
      "A Local Action — configured in the properties pane of the Assignment shape"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. A Decision shape automates branching — it is not a Flow Action that a user performs at an Assignment.",
      "✗ Incorrect. An Automation runs a system action — it is not the Flow Action that completes and advances an Assignment.",
      "✓ Correct. A Connector Action completes the Assignment and advances the Case; it is configured as a line shape (the connector) in the Process Modeler.",
      "✗ Incorrect. A Local Action UPDATES the Assignment but does NOT advance the Case — the opposite of what's needed here."
    ]
  },
  {
    "label": "Skipping a Stage",
    "scenario": "A Decision must move the Case to a DIFFERENT Stage in the Case Life Cycle, skipping a Stage to support out-of-sequence processing. Which shape does the Decision flow use to do this?",
    "opts": [
      "A Local Action",
      "The Change Stage shape",
      "The End shape",
      "A Collect information Step"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. A Local Action updates an Assignment in place; it does not move the Case between Stages.",
      "✓ Correct. One Decision flow variation uses the Change Stage shape to move the Case to another Stage; skipping a Stage supports out-of-sequence processing.",
      "✗ Incorrect. Ending the current Process is not the requested explicit Stage transition; an End does not inherently resolve the whole Case.",
      "✗ Incorrect. A Collect information Step gathers input — it does not change the Case's Stage."
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
function done(){var p=Math.round(score/S.length*100);var m=p===100?'Perfect.':p>=75?'Good \u2014 review the missed items.':'Re-read the module content and retry.';
document.getElementById('qc').innerHTML='<div class="sb">'+score+'/'+S.length+' ('+p+'%)</div><div class="sm">'+m+'</div>';
document.getElementById('nav').innerHTML='<button class="btn" data-quilyn-action="restart()">Restart</button>';}
function restart(){cur=0;score=0;render();}
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

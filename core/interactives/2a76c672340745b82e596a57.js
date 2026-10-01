(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

var S=[{"label":"Goal vs Deadline","scenario":"A claims Step: agents SHOULD finish within 2 hours; they MUST finish within 8 hours or it escalates. How are these configured?","opts":["2 hours = Goal (earlier, soft target); 8 hours = Deadline (later, hard limit). Urgency rises at each.","2 hours = Deadline; 8 hours = Goal (goals can be later than deadlines)","Only the 8-hour deadline \u2014 goals are unnecessary","Two deadlines at different urgency levels"],"correct":0,"fbs":["\u2713 Correct. Goal is the earlier soft target; deadline is the later hard limit. The goal is always earlier.","\u2717 Incorrect. The goal is always EARLIER than the deadline.","\u2717 Incorrect. Skipping the goal loses the early-warning escalation at 2 hours.","\u2717 Incorrect. A Step has one goal and one deadline, not two deadlines."]}, {"label":"Create Stage","scenario":"An SA tries to add a goal and deadline to the Create Stage of a Case Type but the option is unavailable. Why?","opts":["The Create Stage collects data before Case processing starts, so it cannot have a goal/deadline or escalation action","SLAs are only allowed on the last Stage of a Case","You must first add an SLA at the Case level before any Stage SLA is allowed","Goal/deadline can only be set in Dev Studio for the Create Stage"],"correct":0,"fbs":["\u2713 Correct. The Create Stage runs before Case processing begins, so SLAs/escalation actions cannot be set on it.","\u2717 Incorrect. SLAs are allowed on any Stage except the Create Stage \u2014 not just the last one.","\u2717 Incorrect. A Case-level SLA is not a prerequisite for Stage SLAs.","\u2717 Incorrect. The Create Stage cannot have an SLA in any studio \u2014 it is a design rule, not a UI limitation."]}, {"label":"Urgency update","scenario":"A manager raises a Case Type's initial Urgency from 10 to 30. What happens to Assignments that are already open?","opts":["They keep their original Urgency \u2014 the new value applies only to NEW Assignments created afterward","All open Assignments immediately jump to Urgency 30","All Assignments reset to Urgency 10 and climb again","Nothing changes until each Assignment's goal elapses"],"correct":0,"fbs":["\u2713 Correct. Updating Case Urgency affects new Assignments only; existing Assignments keep the Urgency they were created with.","\u2717 Incorrect. Existing Assignments are not retroactively changed.","\u2717 Incorrect. There is no reset-to-10 behavior.","\u2717 Incorrect. The new value is used at Assignment creation, not at goal elapse."]}],cur=0,score=0;
function render(){var s=S[cur];document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' \u2014 Score: '+score+'/'+S.length;
var h='<div class="lbl">'+s.label+'</div><div class="sc">'+s.scenario+'</div>';
s.opts.forEach(function(o,i){h+='<button class="opt" data-quilyn-action="ans('+i+')">'+o+'</button>';});
document.getElementById('qc').innerHTML=h;document.getElementById('nav').innerHTML='';}
function ans(i){var s=S[cur];var bs=document.querySelectorAll('.opt');bs.forEach(function(b){b.disabled=true;});
var ok=i===s.correct;if(ok)score++;
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

(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

var S=[{"label": "Mandatory decision", "scenario": "A reimbursement must wait for manager sign-off. Which design meets the requirement?", "opts": ["A required Approval Step before reimbursement", "A timer treated as approval", "An optional note", "A status label alone"], "correct": 0, "fbs": ["The required gate collects the decision.", "Time passing does not establish sign-off.", "An optional note cannot enforce the gate.", "A label does not collect a decision."]}, {"label": "Revision policy", "scenario": "Rejected work must enter Revision. What should be configured?", "opts": ["Reject flow changes to Revision", "Default rejection is enough", "Rename Reject to Revision", "Delete the request"], "correct": 0, "fbs": ["The explicit destination implements the policy.", "The default is Resolved-Rejected.", "A label does not change flow.", "Deleting the request does not provide revision."]}, {"label": "Shared decision", "scenario": "Any authorized finance reviewer may decide; only one decision is needed. Which routing fits?", "opts": ["A shared finance Work Queue", "A three-party cascade", "The applicant", "An unrelated executive"], "correct": 0, "fbs": ["The shared Assignment can be handled by an eligible reviewer.", "A cascade adds a series of decisions not required here.", "The applicant is not the specified reviewer.", "The executive is not the requested destination."]}],cur=0,score=0;
function render(){var s=S[cur];document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
var h='<div class="lbl">'+s.label+'</div><div class="sc">'+s.scenario+'</div>';
s.opts.forEach(function(o,i){h+='<button class="opt" data-quilyn-action="ans('+i+')">'+o+'</button>';});
document.getElementById('qc').innerHTML=h;document.getElementById('nav').innerHTML='';}
function ans(i){var s=S[cur];var bs=document.querySelectorAll('.opt');bs.forEach(function(b){b.disabled=true;});
var ok=i===s.correct;if(ok)score++;
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

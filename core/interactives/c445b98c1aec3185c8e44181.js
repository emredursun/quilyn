(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('dark');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

var S=[{"label": "Status Prefix", "scenario": "A CSR's dashboard shows a loan Case with status 'Pending-Approval'. Another shows 'Resolved-Approved'. A manager asks: 'Which Case is still open and which is closed?' How does a SA explain this quickly?", "opts": ["'Resolved-Approved' is closed — the 'Resolved-' prefix is Pega's signal that the Case has reached end-of-life. 'PendingApproval' (no Resolved- prefix) is still active", "'PendingApproval' is closed because the approval is pending final resolution. 'Resolved-Approved' is open — it shows the approval is resolved but the Case continues", "Both are open — a Case only closes when manually deleted from the system. Status prefixes are display labels only", "'Resolved-Approved' means the approval sub-process resolved, but the parent Case may still be open — the prefix only closes sub-processes"], "correct": 0, "fbs": ["✓ Correct. 'Resolved-' prefix = Case is closed. Any status without the 'Resolved-' prefix = Case is still active (New, Open-, Pending are all active).", "✗ Incorrect. 'Resolved-' closes the CASE, not the pending action. PendingApproval is an active status for a Case awaiting an approver's decision.", "✗ Incorrect. Status prefixes are meaningful to the Pega platform — it uses the 'Resolved-' prefix to automatically close Cases in reporting and querying.", "✗ Incorrect. 'Resolved-' at the Case level closes the entire Case, not just a sub-process. Sub-process resolution uses different mechanisms."]}, {"label": "Stage status", "scenario": "An Investigation Stage is configured with Open-Investigation. What changes when the Case enters that Stage?", "opts": ["The configured Case status is applied.", "The Case must be deleted.", "Every field becomes required.", "The status cannot be automated."], "correct": 0, "fbs": ["Correct. An explicit Stage status applies at entry.", "A status update does not delete the Case.", "Field requirements are separate configuration.", "Configured status updates can be automatic."]}, {"label": "Instruction override", "scenario": "The task Form needs a clearer instruction than its Step default. What can the SA configure?", "opts": ["Override the Step instructions in the Form.", "Store the instruction in the Case status.", "Rename the Work Queue.", "Remove all field validation."], "correct": 0, "fbs": ["Correct. Form instruction configuration supports a custom override.", "Status should communicate state, not store instructions.", "Routing destinations do not define Form instruction text.", "Guidance is not a replacement for enforcement."]}],cur=0,score=0;
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

(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

var S=[{"label": "Recipient changes", "scenario": "Different customers enter different email addresses. Which configuration adapts to each request?", "opts": ["Field recipient from the entered address", "A fixed address for every customer", "The Case status as an address", "An HTML link in the body with no recipient configured"], "correct": 0, "fbs": ["The Field supplies the customer-specific address.", "One fixed address ignores the changing customers.", "Status is not the recipient address.", "Body text does not establish the configured recipient."]}, {"label": "Record creator", "scenario": "The email must reach whoever created a related data record, which may differ from the Case creator. Which reference fits?", "opts": ["Create Operator on that data type", "Case Owner unconditionally", "Update Operator unconditionally", "The template’s author"], "correct": 0, "fbs": ["Create Operator identifies the data record creator.", "The Case creator can be different.", "The last updater need not be the creator.", "The template author is not the business recipient."]}, {"label": "Send event", "scenario": "A user should be emailed when work is routed to their Worklist. Which configuration expresses that event?", "opts": ["Enable Case-level Worklist routing email notifications", "Only store their address", "Only format a message preview", "Only create a participant category"], "correct": 0, "fbs": ["This enablement uses the requested routing event.", "An address alone does not send.", "A preview alone does not send.", "A participant category alone does not define the event."]}],cur=0,score=0;
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

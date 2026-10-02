(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

var S=[{"label": "Management depth", "scenario": "A request needs one manager below a threshold and two above it. Which setting fits?", "opts": ["Reporting structure with Custom conditional levels", "One level unconditionally", "All levels unconditionally", "A majority vote"], "correct": 0, "fbs": ["Conditions choose the required depth.", "One omits the second required level.", "All ignores the smaller-request limit.", "Voting does not encode this ordered depth."]}, {"label": "Cross-department review", "scenario": "A request needs its manager and an independent compliance reviewer in sequence. Which model fits?", "opts": ["Authority matrix with the required ordered parties", "Only the manager hierarchy", "Only the requester", "A first-response-wins broadcast"], "correct": 0, "fbs": ["The matrix can include a party outside the hierarchy.", "The independent reviewer is not inferred from manager relationships.", "The requester does not replace either reviewer.", "The policy requires both decisions, not the first reply."]}, {"label": "Table population", "scenario": "Several Decision table rows should supply approvers but only one result is collected. What should be checked?", "opts": ["Evaluate all rows", "Increase urgency", "Change a View color", "Remove all but one required reviewer"], "correct": 0, "fbs": ["Check the setting that gathers all matching results.", "Urgency does not change table evaluation.", "Presentation does not build the list.", "Removing required reviewers changes the policy."]}, {"label": "Reject policy", "scenario": "Rejection is configured to resolve the request. What follows a rejected decision?", "opts": ["The configured resolution path", "An automatic majority override", "An automatic new approval from the requester", "No flow action because only Approve is configurable"], "correct": 0, "fbs": ["Follow the explicit rejected outcome.", "The configuration does not establish voting.", "A restart requires its own design.", "Reject has configurable flow."]}],cur=0,score=0;
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
function done(){var p=Math.round(score/S.length*100);var m=p===100?'Perfect.':p>=75?'Good \u2014 review the missed items.':'Re-read the module and retry.';
document.getElementById('qc').innerHTML='<div class="sb">'+score+'/'+S.length+' ('+p+'%)</div><div class="sm">'+m+'</div>';
document.getElementById('nav').innerHTML='<button class="btn" data-quilyn-action="restart()">Restart</button>';}
function restart(){cur=0;score=0;render();}
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

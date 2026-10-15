(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Sum across a list",
    "scenario": "An order total must aggregate the already calculated cost of every line item. Which basic aggregate calculation choice fits directly?",
    "opts": [
      "A When condition",
      "Decision table: conditions",
      "Expression: field reference",
      "Function: Sum of"
    ],
    "correct": 3,
    "fbs": [
      "✗ Incorrect. A When condition returns true/false; it is not one of the three App Studio calculation types.",
      "✗ Incorrect. A Decision table returns a result from logical tests on conditions, not a running sum over a list.",
      "✗ Incorrect. The offered single-field reference does not aggregate all line costs. Expressions may use functions, so do not interpret this as a universal expression limitation.",
      "✓ Correct. Functions iterate over items in a list; Sum of adds all the line-item costs to produce the order total."
    ]
  },
  {
    "label": "Formula from fields",
    "scenario": "Order tax must equal the tax rate multiplied by the order total: .TaxRate * .OrderTotal. Which calculation type is this?",
    "opts": [
      "Expression: field multiplication",
      "Text concatenation",
      "Function: Maximum of",
      "Decision table: conditions"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. An expression references fields by name (dot operator) and supports operations like multiplication — .TaxRate * .OrderTotal.",
      "✗ Incorrect. Concatenation assembles TEXT strings, not a numeric product.",
      "✗ Incorrect. Maximum of finds the largest item in a list; it does not multiply two fields.",
      "✗ Incorrect. A Decision table returns a result from conditions; multiplication is an expression operation."
    ]
  },
  {
    "label": "Result from conditions",
    "scenario": "The interest rate for a loan must be selected from the loan type using a set of logical tests. The app is NOT based on Constellation. How do you make this work in App Studio?",
    "opts": [
      "Create a custom Decision table directly in App Studio — always available regardless of UI architecture",
      "Use a concatenation expression to join loan type and rate",
      "Build the Decision table in Dev Studio, mark it as a relevant record, then reference it from App Studio",
      "Use the Sum of function on the loan type list"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. Creating a CUSTOM Decision table directly in App Studio is supported only on Constellation-based applications.",
      "✗ Incorrect. Concatenation builds text strings; it does not perform conditional rate selection.",
      "✓ Correct. Custom Decision tables in App Studio require Constellation. Otherwise, build it in Dev Studio and mark it as a relevant record so App Studio can reference it.",
      "✗ Incorrect. Sum of adds list items — it cannot select a rate from the loan type via logical tests."
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
function done(){var p=Math.round(score/S.length*100);var m=p===100?'Perfect.':p>=67?'Good \u2014 review the missed items.':'Re-read the module content and retry.';
document.getElementById('qc').innerHTML='<div class="sb">'+score+'/'+S.length+' ('+p+'%)</div><div class="sm">'+m+'</div>';
document.getElementById('nav').innerHTML='<button class="btn" data-quilyn-action="restart()">Restart</button>';}
function restart(){cur=0;score=0;render();}
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

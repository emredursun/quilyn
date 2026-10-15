(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Field Type Selection",
    "scenario": "A form captures employee job titles. The company has exactly 8 valid titles (Manager, Analyst, etc.). An SA configures the field as Text (single line). A BA reviews and flags it. What is the problem and the correct field type?",
    "opts": [
      "Encode job titles in a Boolean true/false field",
      "Keep free text and validate allowed titles on submission",
      "Use a Picklist to constrain the eight valid titles",
      "Keep Text and rely on automatic allowed-list autocomplete"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. Using Boolean for job title is semantically wrong — Boolean is for true/false values. Misusing it creates data quality and readability problems.",
      "✗ Incorrect. Checking free text on submit catches mistakes late; users still face an open text box. A Picklist offers only the predefined values from the start.",
      "✓ Correct. A Picklist enforces a controlled list, preventing invalid entries and ensuring data consistency.",
      "✗ Incorrect. A Text (single line) field accepts any line of text. A fixed set of allowed values is what the Picklist Field Type provides."
    ]
  },
  {
    "label": "Calculated vs Editable",
    "scenario": "A shipping form has a 'Shipping fee' field that must equal a flat $5 for Standard, $15 for Express, or $35 for Overnight — based on the shipping type Picklist selection. A junior SA makes it a free-text Currency field with instructions to type the correct fee. What is the better design?",
    "opts": [
      "Keep an editable fee alongside a hidden calculated fee",
      "Keep an editable fee and validate it on submission",
      "Let the user select the fee from a Picklist",
      "Calculate the fee from shipping type and show it read-only"
    ],
    "correct": 3,
    "fbs": [
      "✗ Incorrect. Two fields for the same conceptual value is redundant and creates maintenance confusion. The correct design has one authoritative calculated value.",
      "✗ Incorrect. Validation on submit still lets users type a wrong fee and only rejects it later. A calculation sets the right value whenever the shipping type changes.",
      "✗ Incorrect. A Picklist of fees separates the fee selection from the shipping type selection, creating inconsistency — a user could select Express shipping but pick the $5 Standard fee.",
      "✓ Correct. The fee depends only on the shipping type, so a decision table can return it. Presenting the result read-only meets the no-override requirement."
    ]
  },
  {
    "label": "View Reusability",
    "scenario": "An SA builds a 'Customer Summary' view showing Name, Email, and Account Number. This exact combination needs to appear in 3 different Case Types. What is the most maintainable approach?",
    "opts": [
      "Build one reusable View on the shared data object that holds these fields and reference it from all 3 Case Types",
      "Use a Partial View in each Case Type, because Partial is the only View type that can ever be reused",
      "Build 3 copies of the View (one per Case Type) so each Case Type can evolve its Customer Summary independently without affecting others",
      "Build the View in Dev Studio as a Section rule, which is the only mechanism for cross-Case-Type UI reuse in Constellation"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. Views are reusable configurations. Defining the View where the shared fields live lets each Case Type reference it, so one change updates every consumer.",
      "✗ Incorrect. Reuse is a property of Views in general; it is not limited to one View type.",
      "✗ Incorrect. 3 copies create 3 maintenance problems — updating the layout or fields requires editing all 3 independently, risking drift and inconsistency.",
      "✗ Incorrect. In Constellation, Views (not Section rules) are the UI authoring unit. Section rules belong to the Traditional UI architecture."
    ]
  },
  {
    "label": "Read-only and editable together",
    "scenario": "In a loan Process, applicants enter their details in a form. At the next Step, a loan officer must see that information without changing it and record an approval decision. How should the loan officer View be configured?",
    "opts": [
      "Make every field in the officer View read-only and capture the decision outside the Case",
      "One View with the applicant fields set to read-only and the decision fields (such as approval reason) editable",
      "Reuse the applicant form unchanged, so the officer can correct any applicant field before deciding",
      "Two separate Case Types: one for the applicant data and one for the officer decision"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. The officer must record the decision in the Case, so the decision fields need to be editable.",
      "✓ Correct. A View can mix read-only fields for collected data with editable fields for the task at hand, as in the Views topic loan example.",
      "✗ Incorrect. The requirement is that the officer can read but not update the applicant data. Reusing the editable form ignores that.",
      "✗ Incorrect. Both Steps belong to the same loan Process; field editability is configured in the View, not by splitting the Case."
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

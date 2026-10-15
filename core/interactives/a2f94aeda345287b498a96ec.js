(function(){
(function(){var r=document.documentElement;function a(t){r.setAttribute('data-theme',t);}a('light');window.addEventListener('message',function(e){if(e.data&&e.data.type==='pa-theme')a(e.data.theme);});})()

/* quilyn-topic-balance-v1 */
var S=[
  {
    "label": "Direct User Entry",
    "scenario": "A health insurance claim form requires the claimant to enter details about the medical procedure directly on the claim: procedure code, date performed, and provider name. This data is unique to each claim and not reused elsewhere. Which relationship type applies?",
    "opts": [
      "Case reference — the procedure details are captured in a separate Case Type (e.g., Procedure Case) and referenced from the claim",
      "Embedded Data — the user enters data directly in the Case; it is stored with the specific Case instance and is not shared",
      "Query — the provider and procedure data is read from an external database, with the procedure code as the filter parameter",
      "Data reference — the procedure details are sourced from an external medical procedure catalog and referenced, not entered manually"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. Case reference is for when the data lives in another Pega Case. Here, there is no separate Case for procedures — the data is entered directly on the claim.",
      "✓ Correct. User enters procedure details directly in the claim form, stored with that specific Case — this is classic Embedded Data: user-entered, Case-specific, not shared.",
      "✗ Incorrect. Query is read-only access to external data with parameter filtering. The scenario says the claimant ENTERS these details — it is not a pre-existing lookup.",
      "✗ Incorrect. Data reference associates an existing reusable record outside the Case, whether locally or externally sourced. Here, the user is entering new data; it doesn't exist until they type it."
    ]
  },
  {
    "label": "Reuse External Object",
    "scenario": "A loan application references the applying Customer's profile. The Customer data (name, address, credit score) is maintained in a CRM system — not entered on the loan form. One Customer may have many loan applications over time. Which relationship type applies?",
    "opts": [
      "Data reference, Single record — the Customer is an external data object reused across many Cases; one Customer per loan application",
      "Embedded Data, Single record — the customer details are needed on the form, so the user enters them directly each time a new loan is applied for",
      "Query — the CRM is a read-only external database; the loan app retrieves customer data by passing the customer ID as a parameter",
      "Case reference — the Customer is managed as a separate Pega Case Type (Customer Case); the loan application references that Case"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. The Customer exists in an external system (CRM), is reused across many loan applications (not entered each time), and one customer per loan = Data reference, Single record.",
      "✗ Incorrect. If the user entered customer details each time, you'd get a different copy of the customer on every loan — data quality nightmare. External reusable data = Data reference.",
      "✗ Incorrect. Query models filtered read-only results; this scenario instead associates one maintained Customer. Data reference does not itself guarantee write access.",
      "✗ Incorrect. The scenario says the customer is in a CRM system, not managed as a Pega Case Type. Case reference is for other Pega Cases, not external CRM records."
    ]
  },
  {
    "label": "Another Case's Data",
    "scenario": "A 'Complaint' Case must display and link to the original 'Service Request' Case that triggered the complaint. The Service Request was created separately and already has a Case ID. Which relationship type applies?",
    "opts": [
      "Embedded Data — copy the relevant Service Request fields into the Complaint form so the agent has them without needing to navigate away",
      "Query — retrieve the Service Request data by passing the Case ID as a parameter to a read-only external data source",
      "Data reference — the Service Request is an existing record in the system; reference it the same way you would reference a Customer from a CRM",
      "Case reference — the Service Request is another Pega Case; Case reference lets the Complaint reference and display its data using the Case ID"
    ],
    "correct": 3,
    "fbs": [
      "✗ Incorrect. Copying fields with Embedded Data creates a static snapshot that won't update if the Service Request changes. Case reference models the association; refresh and access depend on configuration.",
      "✗ Incorrect. Query is for read-only access to data sources outside the current Case with parameter filtering. The Service Request is a Pega Case, not an external data source.",
      "✗ Incorrect. Data reference is for external data objects (from external systems or Pega's data layer). A Pega Case is not a data object — it is a Case Type instance.",
      "✓ Correct. The Service Request is another Pega Case — Case reference is specifically designed to link and surface data from another Case by its Case ID."
    ]
  },
  {
    "label": "Read-Only Lookup with Filter",
    "scenario": "A form must display the list of medical facilities near the patient's ZIP code, fetched from an external government registry. The SA cannot write back to this registry, and the ZIP code from the Case is used as the filter. Which type applies?",
    "opts": [
      "Data reference — the facility registry is an external data object; reference it by the facility ID after the user selects one",
      "Case reference — the facilities are managed as a Pega Case Type (Facility Case); reference them by Case ID",
      "Query — read-only access to external data with the ZIP code passed as a parameter to filter the relevant facilities",
      "Embedded Data, List of records — the facilities are entered by the user on the form for this specific Case"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. Data reference retrieves a specific record by key for reuse — the scenario asks for filtered results, not a keyed association to a selected reusable record.",
      "✗ Incorrect. The facilities are in a government registry, not managed as Pega Cases. Case reference is for Pega Case instances.",
      "✓ Correct. Query: external source ✓, read-only ✓, parameter-driven (ZIP code) ✓, returns a list of matching records ✓.",
      "✗ Incorrect. The user is not entering facility data — it already exists in a government registry. Embedded Data is for user-entered, Case-specific data."
    ]
  }
],cur=0,score=0;
function render(){var s=S[cur];document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
var h='<div class="lbl">'+s.label+'</div><div class="sc">'+s.scenario+'</div>';
s.opts.forEach(function(o,i){h+='<button class="opt" data-quilyn-action="ans('+i+')">'+o+'</button>';});
document.getElementById('qc').innerHTML=h;document.getElementById('nav').innerHTML='';}
function ans(i){var s=S[cur];var bs=document.querySelectorAll('.opt');bs.forEach(function(b){b.disabled=true;});
var ok=i===s.correct;if(ok)score++;document.getElementById('prog').textContent='Scenario '+(cur+1)+' of '+S.length+' — Score: '+score+'/'+S.length;
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

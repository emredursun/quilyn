(function(){

(function(){
  var root=document.documentElement;
  function apply(t){root.setAttribute('data-theme',t);}
  apply('dark');
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='pa-theme') apply(e.data.theme);
  });
})();


/* quilyn-topic-balance-v1 */
var problems = [
  {
    "label": "Case Life Cycle Design",
    "intro": "A junior SA designs a loan application Case Life Cycle. Review the structure and identify the ONE design flaw:",
    "config": [
      "Stage 1 (green): Create",
      "  Process: Collect applicant info",
      "    Step: Submit application form",
      "Stage 2 (blue): Credit Check",
      "  Process: Run credit evaluation",
      "    Step: Credit bureau lookup (automation)",
      "Stage 3 (green): Create",
      "Stage 4 (red): Resolution",
      "  Process: Notify applicant"
    ],
    "opts": [
      "The Resolution Stage name lacks a 'Resolved-' prefix",
      "Credit bureau lookup is an Automation Step",
      "The Credit Check Stage uses a noun phrase",
      "A second Create Stage was added"
    ],
    "correct": 3,
    "fbs": [
      "✗ Not the flaw. While Pega recommends 'Resolved-' prefix for Resolution Stage statuses, the Stage itself can be named anything descriptive. The flaw is structural, not a naming convention issue.",
      "✗ Not the flaw. Automation Steps (yellow) are valid and expected in Case Life Cycles — system actions like credit bureau lookups are automation Steps. Not all Steps need to be user Collect information Steps.",
      "✗ Not the flaw. 'Credit Check' (noun phrase) is a valid Stage name — Stages use noun/gerund naming. Verb+noun is the Process and Step convention, not the Stage convention.",
      "✓ Correct. There is exactly one Create Stage per Case Type — it is fixed as the first Stage and cannot be duplicated. Document upload should be a Process/Step inside a separate primary Stage, not a second Create Stage."
    ]
  },
  {
    "label": "Stage Type Usage",
    "intro": "An Alternate Stage collects corrections and must return automatically to Review. Which configuration is missing?",
    "config": [
      "Primary Stage: Review",
      "Alternate Stage: Correct Documents",
      "  Process: Collect corrections",
      "  Step: Collect information",
      "  Requirement: return automatically to Review",
      "  [No Change Stage automation configured]"
    ],
    "opts": [
      "Add a Change Stage automation targeting Review after correction work",
      "The Change Stage automation is wrong — rejections must always route to the Resolution Stage immediately; there is no way to loop within a Case Life Cycle",
      "Add Parallel Processes because every exception branch requires concurrent approval",
      "A Resolution Stage cannot be red; only the Create Stage has a color indicator"
    ],
    "correct": 0,
    "fbs": [
      "Correct. Use the explicit destination Stage for the required automatic return. Alternate Stages support exception handling; returning to a Primary Stage is not itself prohibited.",
      "Incorrect. A correction branch does not have to resolve immediately; it can return to the primary path.",
      "Incorrect. Parallel work is independent concurrency, not the required transition to Review.",
      "Incorrect. A Resolution Stage is identified by red. This does not configure the requested return destination."
    ]
  },
  {
    "label": "Draft Mode Usage",
    "intro": "An SA creates CustomerProfile in the designer’s Data & Interfaces area. What should the SA expect from the new draft data object?",
    "config": [
      "SA says:",
      "'I added a Draft data object called CustomerProfile — it has all the fields",
      " we discussed: firstName, lastName, email, dateOfBirth. I mapped them to",
      " the correct data types. Draft mode is great because it creates the real",
      " data object AND all the fields automatically so we can test right away.'"
    ],
    "opts": [
      "A configured object from names entered during the workshop",
      "An empty placeholder requiring separate field and integration configuration",
      "A fully configured object, but only when using Dev Studio",
      "No draft object: all data objects must be fully configured"
    ],
    "correct": 1,
    "fbs": [
      "✗ Incorrect. Draft mode does not auto-create fields from typed names. The Draft object is a placeholder shell only.",
      "✓ Correct. A Draft data object is a lightweight placeholder — no fields, no integration mapping, no data types. It lets the SA reference the object in the Case Life Cycle now and configure it fully later. The SA's statement misrepresents Draft mode.",
      "Incorrect. The documented designer action creates a placeholder; the claim of automatic production fields is unsupported.",
      "✗ Incorrect. Draft mode does support creating Draft data objects. You can reference them in the Case Life Cycle during the workshop. The issue is what those Draft objects contain — not that they cannot exist."
    ]
  },
  {
    "label": "Process Naming",
    "intro": "An SA names the following Case Life Cycle artifacts. Which ONE naming choice violates the Pega convention?",
    "config": [
      "Case Type name: 'Customer Onboarding'          ← outcome statement ✓",
      "Stage name:     'Document Review'               ← noun/gerund ✓",
      "Process name:   'Review documents'              ← verb+noun ✓",
      "Step name:      'Document Verification'         ← noun phrase",
      "Status:         'Pending-DocumentReview'        ← Pega status format ✓"
    ],
    "opts": [
      "Stage name 'Document Review' — Stages must use verb+noun ('Review Documents'), not a gerund/noun phrase",
      "Process name 'Review documents' — Processes must use a noun phrase ('Document Review'), not verb+noun",
      "Step name 'Document Verification' — Steps should use verb+noun ('Verify documents'), not a noun phrase",
      "Case Type name 'Customer Onboarding' — Case Types must use verb+noun format ('Onboard Customer'), not an outcome statement"
    ],
    "correct": 2,
    "fbs": [
      "✗ Incorrect. 'Document Review' is a valid gerund/noun phrase for a Stage. Stage naming uses noun/gerund forms — this is correct.",
      "✗ Incorrect. 'Review documents' (verb+noun) is the correct Process naming convention. Noun phrases like 'Document Review' are for Stages, not Processes.",
      "✓ Correct. Steps use verb+noun ('Collect information', 'Verify documents', 'Send confirmation'). 'Document Verification' is a noun phrase — that is the Stage naming pattern, not the Step pattern.",
      "✗ Incorrect. 'Customer Onboarding' is the correct Case Type format — an outcome statement or noun phrase describing the result of the Case. Verb+noun belongs to Steps and Processes."
    ]
  }
];

var cur = 0, score = 0;

function render() {
  var p = problems[cur];
  document.getElementById('prog').textContent = 'Problem ' + (cur+1) + ' of ' + problems.length + ' — Score: ' + score + '/' + problems.length;
  var cfg = p.config.map(function(l){ return l.includes('←') ? '<span class="flaw">'+l+'</span>' : l; }).join('\n');
  var html = '<div class="label">' + p.label + '</div>';
  html += '<div class="scenario">' + p.intro + '</div>';
  html += '<div class="config">' + cfg + '</div>';
  p.opts.forEach(function(o, i) {
    html += '<button class="opt" data-quilyn-action="answer(' + i + ')">' + o + '</button>';
  });
  document.getElementById('qcard').innerHTML = html;
  document.getElementById('nav').innerHTML = '';
}

function answer(idx) {
  var p = problems[cur];
  var btns = document.querySelectorAll('.opt');
  btns.forEach(function(b){ b.disabled = true; });
  var correct = idx === p.correct;
  if (correct) score++;
document.getElementById('prog').textContent='Problem '+(cur+1)+' of '+problems.length+' — Score: '+score+'/'+problems.length;
  p.opts.forEach(function(o, i) {
    btns[i].className = i === p.correct ? 'opt ok' : (i === idx && !correct ? 'opt bad' : 'opt');
  });
  var fb = document.createElement('div');
  fb.className = 'fb ' + (correct ? 'ok' : 'bad');
  fb.textContent = p.fbs[idx];
  document.getElementById('qcard').appendChild(fb);
  var nav = document.getElementById('nav');
  if (cur < problems.length - 1) {
    nav.innerHTML = '<button class="btn primary" data-quilyn-action="next()">Next problem →</button>';
  } else {
    showResult();
  }
}

function next() { cur++; render(); }

function showResult() {
  var pct = Math.round(score / problems.length * 100);
  var msg = pct === 100 ? 'Excellent — you can spot Case Life Cycle design errors confidently.' :
            pct >= 75 ? 'Good eye. Review the patterns you missed.' :
            'Work through the Case Life Cycle building blocks again, then retry.';
  document.getElementById('qcard').innerHTML = '<div class="score-big">' + score + ' / ' + problems.length + ' (' + pct + '%)</div><div class="score-msg">' + msg + '</div>';
  document.getElementById('nav').innerHTML = '<button class="btn" data-quilyn-action="restart()">Restart</button>';
}

function restart() { cur = 0; score = 0; render(); }
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

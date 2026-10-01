(function(){

(function(){
  var root=document.documentElement;
  function apply(t){root.setAttribute('data-theme',t);}
  apply('dark');
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='pa-theme') apply(e.data.theme);
  });
})();


var problems = [
  {
    label: "Case Life Cycle Design",
    intro: "A junior SA designs a loan application Case Life Cycle. Review the structure and identify the ONE design flaw:",
    config: [
      "Stage 1 (green): Create",
      "  Process: Collect applicant info",
      "    Step: Submit application form",
      "Stage 2 (blue): Credit Check",
      "  Process: Run credit evaluation",
      "    Step: Credit bureau lookup (automation)",
      "Stage 3 (green): Create  ← [SA added a second Create Stage for document upload]",
      "Stage 4 (red): Resolution",
      "  Process: Notify applicant",
    ],
    opts: [
      "A second Create Stage was added — only ONE Create Stage is allowed; it is always first and cannot be added again",
      "The Resolution Stage is missing its Stage name — Resolution Stages must be named 'Resolved-Approved' or 'Resolved-Rejected'",
      "The Credit bureau lookup Step has no green icon — all Steps must be Collect information Steps (green)",
      "Stage 2 is labeled 'Credit Check' — Stage names must use verb+noun format, not a noun phrase"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. There is exactly one Create Stage per Case Type — it is fixed as the first Stage and cannot be duplicated. Document upload should be a Process/Step inside a separate primary Stage, not a second Create Stage.",
      "✗ Not the flaw. While Pega recommends 'Resolved-' prefix for Resolution Stage statuses, the Stage itself can be named anything descriptive. The flaw is structural, not a naming convention issue.",
      "✗ Not the flaw. Automation Steps (yellow) are valid and expected in Case Life Cycles — system actions like credit bureau lookups are automation Steps. Not all Steps need to be user Collect information Steps.",
      "✗ Not the flaw. 'Credit Check' (noun phrase) is a valid Stage name — Stages use noun/gerund naming. Verb+noun is the Process and Step convention, not the Stage convention."
    ]
  },
  {
    label: "Stage Type Usage",
    intro: "An SA handles a loan rejection flow. Review this design and identify the flaw:",
    config: [
      "Stage 1: Create",
      "Stage 2: Review",
      "Stage 3: Approval",
      "  → If REJECTED: Change Stage automation → goes back to Stage 2 (Review)",
      "  [SA notes: 'Rejection loops back to Review for correction, then re-approval']",
      "Stage 4 (red): Resolution",
      "",
      "[No Alternate Stage defined]"
    ],
    opts: [
      "The rejection path should use an Alternate Stage for the exception flow — looping back to a primary Stage with a Change Stage automation risks skipping Steps and breaks the intended Case model",
      "The Change Stage automation is wrong — rejections must always route to the Resolution Stage immediately; there is no way to loop within a Case Life Cycle",
      "Stage 4 should not be red — only the Create Stage can be colored; all other Stages including Resolution must be blue",
      "Stage 3 needs a Parallel Process for approval — all approval Stages require at least two concurrent Processes by Pega convention"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. Exception flows (rejection → fix → re-approve) belong in Alternate Stages, not in loops between primary Stages. An Alternate Stage with a 'Fix Data' Process and a Change Stage automation back to Approval is the correct pattern.",
      "✗ Incorrect. Change Stage automations can route to any Stage, including back to an earlier one. The issue is not that looping is impossible — it is that doing it between primary Stages instead of using an Alternate Stage is a design anti-pattern.",
      "✗ Incorrect. Stage colors are meaningful: Create = green, Primary = blue, Alternate = orange, Resolution = red. Colors are assigned by Stage type, not choice.",
      "✗ Incorrect. Parallel Processes are an optional pattern for independent work that can happen concurrently. They are not required for approval Stages."
    ]
  },
  {
    label: "Draft Mode Usage",
    intro: "During a design workshop an SA uses Draft mode to rapidly sketch the Case Life Cycle. Spot the misunderstanding in this SA's statement:",
    config: [
      "SA says:",
      "'I added a Draft data object called CustomerProfile — it has all the fields",
      " we discussed: firstName, lastName, email, dateOfBirth. I mapped them to",
      " the correct data types. Draft mode is great because it creates the real",
      " data object AND all the fields automatically so we can test right away.'"
    ],
    opts: [
      "Draft data objects are placeholders with NO fields and NO integration — the SA must configure fields separately after the workshop; Draft mode does not auto-create them",
      "Draft mode only works for Stages and Processes — you cannot create Draft data objects; data objects must always be fully configured before being referenced",
      "The SA correctly described Draft mode — Draft data objects do include fields if you type their names in the Draft panel during the workshop",
      "Draft mode creates fully configured data objects only when the application is in Dev Studio; in App Studio, Draft objects are placeholders"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. A Draft data object is a lightweight placeholder — no fields, no integration mapping, no data types. It lets the SA reference the object in the Case Life Cycle now and configure it fully later. The SA's statement misrepresents Draft mode.",
      "✗ Incorrect. Draft mode does support creating Draft data objects. You can reference them in the Case Life Cycle during the workshop. The issue is what those Draft objects contain — not that they cannot exist.",
      "✗ Incorrect. Draft mode does not auto-create fields from typed names. The Draft object is a placeholder shell only.",
      "✗ Incorrect. Draft mode behavior is the same in both App Studio and Dev Studio — Draft data objects are always placeholders regardless of which studio you are in."
    ]
  },
  {
    label: "Process Naming",
    intro: "An SA names the following Case Life Cycle artifacts. Which ONE naming choice violates the Pega convention?",
    config: [
      "Case Type name: 'Customer Onboarding'          ← outcome statement ✓",
      "Stage name:     'Document Review'               ← noun/gerund ✓",
      "Process name:   'Review documents'              ← verb+noun ✓",
      "Step name:      'Document Verification'         ← noun phrase",
      "Status:         'Pending-DocumentReview'        ← Pega status format ✓"
    ],
    opts: [
      "Step name 'Document Verification' — Steps should use verb+noun ('Verify documents'), not a noun phrase",
      "Case Type name 'Customer Onboarding' — Case Types must use verb+noun format ('Onboard Customer'), not an outcome statement",
      "Stage name 'Document Review' — Stages must use verb+noun ('Review Documents'), not a gerund/noun phrase",
      "Process name 'Review documents' — Processes must use a noun phrase ('Document Review'), not verb+noun"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. Steps use verb+noun ('Collect information', 'Verify documents', 'Send confirmation'). 'Document Verification' is a noun phrase — that is the Stage naming pattern, not the Step pattern.",
      "✗ Incorrect. 'Customer Onboarding' is the correct Case Type format — an outcome statement or noun phrase describing the result of the Case. Verb+noun belongs to Steps and Processes.",
      "✗ Incorrect. 'Document Review' is a valid gerund/noun phrase for a Stage. Stage naming uses noun/gerund forms — this is correct.",
      "✗ Incorrect. 'Review documents' (verb+noun) is the correct Process naming convention. Noun phrases like 'Document Review' are for Stages, not Processes."
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

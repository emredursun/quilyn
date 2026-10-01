(function(){

(function(){
  var root=document.documentElement;
  function apply(t){root.setAttribute('data-theme',t);}
  apply('dark');
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='pa-theme') apply(e.data.theme);
  });
})();


var scenarios = [
  {
    label: "Studio Selection",
    scenario: "A Business Analyst needs to add a new text field to a customer-facing form. The field has no advanced validation and will be visible in App Studio. Where should the BA work?",
    opts: [
      "App Studio — App Studio handles standard field configuration and generates the underlying Property automatically",
      "Dev Studio — all field additions require Dev Studio to create the Property rule directly",
      "Admin Studio — Admin Studio manages all form configurations at runtime",
      "Prediction Studio — Prediction Studio controls which fields appear in forms"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. App Studio is designed for exactly this — adding standard fields without coding. It creates the underlying Property rule behind the scenes.",
      "✗ Incorrect. Dev Studio is needed only when the capability is unavailable in App Studio. Standard field addition is fully supported in App Studio — using Dev Studio here bypasses the 'work in the right environment for the skill' best practice.",
      "✗ Incorrect. Admin Studio is for runtime system administration (monitoring, user management, system config) — it has no form design capability.",
      "✗ Incorrect. Prediction Studio is the machine-learning environment for adaptive and predictive models — it has no role in form field configuration."
    ]
  },
  {
    label: "Advanced SLA",
    scenario: "An SA must configure an SLA with a business-hours-only timer and a custom escalation that reassigns the task to a backup team after 4 hours. App Studio's SLA panel only shows basic goal/deadline fields. Where should the SA configure the advanced options?",
    opts: [
      "Dev Studio — advanced SLA options (initialization, business-day calendars, multi-action escalations) are only accessible in Dev Studio",
      "App Studio — scroll down in the SLA panel; the advanced options are hidden below the fold",
      "Admin Studio — SLA scheduling is a runtime system configuration managed in Admin Studio",
      "Create a separate Wait Step with a Timer — this achieves the same result as an advanced SLA without needing Dev Studio"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. When App Studio's UI doesn't expose the needed capability, the SA moves to Dev Studio. Advanced SLA options — initialization behavior, business-day calendars, and multi-action escalation chains — live in the SLA rule in Dev Studio.",
      "✗ Incorrect. If App Studio's SLA panel doesn't show the option, it's not hidden — it genuinely isn't available in App Studio. The feature requires Dev Studio.",
      "✗ Incorrect. Admin Studio handles runtime administration (users, logs, system settings), not application rule configuration like SLAs.",
      "✗ Incorrect. A Wait Step with a Timer handles pause-and-continue logic, not business-hours SLA enforcement with escalation actions. These are different mechanisms with different purposes."
    ]
  },
  {
    label: "Integration Choice",
    scenario: "A CSR is live on the phone with a customer. They need to update the customer's address in a 30-year-old mainframe that exposes no REST API, no web service, and no database connector — only a green-screen terminal. Which integration approach fits?",
    opts: [
      "Attended RPA — a robot drives the mainframe UI in real time alongside the CSR, completing the update while the customer is still on the call",
      "Unattended RPA — queue the request for a batch job tonight when the mainframe is less busy",
      "Standard API connector — all modern mainframes expose at least a SOAP endpoint; use that",
      "Manual re-entry — have the CSR switch screens and type the address directly into the mainframe terminal"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. No API + active CSR call = Attended RPA. The robot drives the legacy UI in real time so the customer's address is updated before they hang up.",
      "✗ Incorrect. Unattended RPA is for background batch processing with no human waiting. A live customer on the phone cannot wait until tonight's batch run.",
      "✗ Incorrect. The scenario explicitly states no REST API, no web service — asserting the mainframe 'must have SOAP' contradicts the given constraints.",
      "✗ Incorrect. Manual re-entry is the pre-Pega workaround. While technically possible, it is error-prone, slow, and exactly what RPA exists to replace."
    ]
  },
  {
    label: "Rule Scope Extension",
    scenario: "An approval process rule was built for the Property Insurance Case Type. The same rule must now apply to Auto Insurance and Travel Insurance — all three share the same Pega application. How do you extend the rule's scope for reuse?",
    opts: [
      "In Dev Studio, extend the rule's scope from the Case Type level to the application level so all Case Types in the application inherit it",
      "In App Studio, copy-paste the rule into each Case Type's configuration — App Studio supports cross-Case-Type rule sharing via copy",
      "Create three separate rules (one per Case Type) — Pega does not support single-rule reuse across multiple Case Types in the same application",
      "In Admin Studio, set the rule's visibility flag to 'All Case Types' in the runtime rule management screen"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. Dev Studio exposes the full rule hierarchy, including the ability to change a rule's Applies-To class from a specific Case Type to a higher-level class (application or division), enabling reuse across Case Types.",
      "✗ Incorrect. App Studio does not expose scope/Applies-To controls. Copying creates maintenance debt — three copies of the same rule that must all be updated when the approval logic changes.",
      "✗ Incorrect. Pega explicitly supports rule inheritance across Case Types. Extending scope is the documented best practice for exactly this scenario.",
      "✗ Incorrect. Admin Studio manages runtime system configuration (users, logs, system resources) — it has no rule-authoring or scope-configuration capability."
    ]
  }
];

var cur = 0, score = 0;

function render() {
  var s = scenarios[cur];
  document.getElementById('prog').textContent = 'Scenario ' + (cur+1) + ' of ' + scenarios.length + ' — Score: ' + score + '/' + scenarios.length;
  var html = '<div class="label">' + s.label + '</div>';
  html += '<div class="scenario">' + s.scenario + '</div>';
  s.opts.forEach(function(o, i) {
    html += '<button class="opt" data-quilyn-action="answer(' + i + ')">' + o + '</button>';
  });
  document.getElementById('qcard').innerHTML = html;
  document.getElementById('nav').innerHTML = '';
}

function answer(idx) {
  var s = scenarios[cur];
  var btns = document.querySelectorAll('.opt');
  btns.forEach(function(b){ b.disabled = true; });
  var correct = idx === s.correct;
  if (correct) score++;
  s.opts.forEach(function(o, i) {
    var cls = i === s.correct ? 'opt ok' : (i === idx && !correct ? 'opt bad' : 'opt');
    btns[i].className = cls;
  });
  var fb = document.createElement('div');
  fb.className = 'fb ' + (correct ? 'ok' : 'bad');
  fb.textContent = s.fbs[idx];
  document.getElementById('qcard').appendChild(fb);
  var nav = document.getElementById('nav');
  if (cur < scenarios.length - 1) {
    nav.innerHTML = '<button class="btn primary" data-quilyn-action="next()">Next scenario →</button>';
  } else {
    showResult();
  }
}

function next() {
  cur++;
  render();
}

function showResult() {
  var pct = Math.round(score / scenarios.length * 100);
  var msg = pct === 100 ? 'Perfect — you know your studios and integration patterns.' :
            pct >= 75 ? 'Strong. Review the scenarios you missed before the exam.' :
            'Re-read the Studio selection rules and integration decision tree, then retry.';
  document.getElementById('qcard').innerHTML = '<div class="score-big">' + score + ' / ' + scenarios.length + ' (' + pct + '%)</div><div class="score-msg">' + msg + '</div>';
  document.getElementById('nav').innerHTML = '<button class="btn" data-quilyn-action="restart()">Restart</button>';
}

function restart() { cur = 0; score = 0; render(); }
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

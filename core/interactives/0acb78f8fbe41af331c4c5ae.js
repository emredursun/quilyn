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
    "label": "Persona Architecture",
    "scenario": "HealthCorp is launching a Pega claims application. It has 500 nurses who submit claims, 80 reviewers who approve/reject, and 15 compliance officers who view-only. A PM asks: 'How many Personas and Operators do we need?' What is the correct architecture?",
    "opts": [
      "595 Operators (one per individual) + 3 Personas (Nurse, Reviewer, Compliance Officer) — Operators are per-person logins; Personas are per-interaction-pattern",
      "3 Operators (one per role) + 3 Personas — Operators represent roles, not individuals, so one per job function is enough",
      "595 Operators + 595 Personas — each individual needs their own Persona for security isolation",
      "3 Personas + 0 Operators — modern Pega uses Personas as login identities; Operators are legacy"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. Operators = individual login accounts (595 for 595 people). Personas = reusable role templates (3 patterns: submit, approve, view-only). This is the standard Pega access architecture.",
      "✗ Incorrect. Operators are NOT role abstractions — they are individual user accounts. With 3 Operators, 595 people would share 3 logins, breaking audit trails and individual accountability.",
      "Incorrect. Shared business needs do not require a Persona per individual; each person still needs a unique account.",
      "Incorrect. A Persona describes a business user type, not an individual login account."
    ]
  },
  {
    "label": "Channel Assignment",
    "scenario": "A Nurse Persona uses a web portal on desktop and also needs access via a mobile app for field submissions. A Reviewer Persona only uses the web portal. How many Channel interfaces does each Persona need?",
    "opts": [
      "Nurse → 2 Channels (Web + Mobile); Reviewer → 1 Channel (Web) — one Persona can have multiple Channels for different delivery surfaces",
      "Each Persona can only have 1 Channel — create a separate NurseMobile Persona for mobile access and keep Nurse for desktop only",
      "Channels are application-wide, not per-Persona — configure Web and Mobile once at the application level and all Personas get both automatically",
      "Mobile access requires a completely separate Pega application — you cannot add a Mobile Channel to an existing Persona in the same app"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. One Persona can be associated with multiple Channels. The Nurse Persona gets both Web and Mobile Channel interfaces; the Reviewer gets Web only. This is the standard multi-channel Persona pattern.",
      "✗ Incorrect. Creating a separate Persona solely for a different device creates configuration duplication and maintenance burden. Multiple Channels on one Persona is the supported, recommended approach.",
      "Incorrect. Multiple Personas can share a Channel, but creating the Channel does not automatically authorize every Persona to use it.",
      "✗ Incorrect. Mobile Channels are supported within the same Pega application — no separate app is needed. Pega's App Studio supports adding Mobile Channel interfaces to existing Personas."
    ]
  },
  {
    "label": "User onboarding",
    "scenario": "Dana joins as a compliance officer. Which App Studio action creates the individual user and selects the appropriate business assignment?",
    "opts": [
      "Use Users > User management > People, enter Dana’s email address and assign the Compliance Officer Persona",
      "Share the existing generic admin account with Dana",
      "Create a Persona named Dana instead of an individual user",
      "Create a dedicated Channel for Dana instead of assigning a role"
    ],
    "correct": 0,
    "fbs": [
      "Correct. People manages individual users and their Persona or developer-role assignment. Verify the configured access against Dana’s duties.",
      "Incorrect. Accounts should be unique to each individual, not shared generic accounts.",
      "Incorrect. A Persona models a business user type, not Dana’s individual identity.",
      "Incorrect. A Channel is an interface and does not replace individual user creation or appropriate role assignment."
    ]
  },
  {
    "label": "Changing Access",
    "scenario": "A nurse, Alex, is promoted to a senior reviewer role. Alex should now approve claims instead of submitting them. What is the correct way to update Alex's access in Pega?",
    "opts": [
      "Assign the Reviewer Persona and verify that configured permissions match Alex’s new approval duties",
      "Add the Reviewer Access Role directly to Alex's Operator record in Dev Studio — this is more targeted than changing the Persona",
      "Create a new hybrid 'NurseReviewer' Persona for Alex — you cannot change a user's Persona once they have submitted Cases",
      "Delete Alex's Operator record and re-invite as a new user with the Reviewer role — this is the only way to fully reset access"
    ],
    "correct": 0,
    "fbs": [
      "Correct. Update the assignment to match the new business responsibilities and verify authorization; a Persona change is not a guarantee of every security or routing setting.",
      "Incorrect. Access Roles are application security configuration; directly adding a role to an Operator is not the documented People-tab role-assignment flow.",
      "Incorrect. Existing Case history does not imply a Persona assignment can never change.",
      "Incorrect. A role change does not require deleting the individual user and creating a replacement identity."
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
    btns[i].className = i === s.correct ? 'opt ok' : (i === idx && !correct ? 'opt bad' : 'opt');
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

function next() { cur++; render(); }

function showResult() {
  var pct = Math.round(score / scenarios.length * 100);
  var msg = pct === 100 ? 'Perfect — you understand the Operator/Persona/Channel/Access architecture cold.' :
            pct >= 75 ? 'Good. Review the scenarios you missed — especially the invite vs. Persona assignment distinction.' :
            'Re-study the Persona, Operator, and Access Group relationship before the exam.';
  document.getElementById('qcard').innerHTML = '<div class="score-big">' + score + ' / ' + scenarios.length + ' (' + pct + '%)</div><div class="score-msg">' + msg + '</div>';
  document.getElementById('nav').innerHTML = '<button class="btn" data-quilyn-action="restart()">Restart</button>';
}

function restart() { cur = 0; score = 0; render(); }
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

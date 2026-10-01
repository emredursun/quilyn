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
    label: "Persona Architecture",
    scenario: "HealthCorp is launching a Pega claims application. It has 500 nurses who submit claims, 80 reviewers who approve/reject, and 15 compliance officers who view-only. A PM asks: 'How many Personas and Operators do we need?' What is the correct architecture?",
    opts: [
      "595 Operators (one per individual) + 3 Personas (Nurse, Reviewer, Compliance Officer) — Operators are per-person logins; Personas are per-interaction-pattern",
      "3 Operators (one per role) + 3 Personas — Operators represent roles, not individuals, so one per job function is enough",
      "595 Operators + 595 Personas — each individual needs their own Persona for security isolation",
      "3 Personas + 0 Operators — modern Pega uses Personas as login identities; Operators are legacy"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. Operators = individual login accounts (595 for 595 people). Personas = reusable role templates (3 patterns: submit, approve, view-only). This is the standard Pega access architecture.",
      "✗ Incorrect. Operators are NOT role abstractions — they are individual user accounts. With 3 Operators, 595 people would share 3 logins, breaking audit trails and individual accountability.",
      "✗ Incorrect. Personas are shared role templates, not per-user objects. Creating 595 Personas defeats the purpose — you'd configure identical settings 595 times for nurses alone.",
      "✗ Incorrect. Operators are required in all Pega versions for user authentication and identity. Personas cannot serve as login accounts."
    ]
  },
  {
    label: "Channel Assignment",
    scenario: "A Nurse Persona uses a web portal on desktop and also needs access via a mobile app for field submissions. A Reviewer Persona only uses the web portal. How many Channel interfaces does each Persona need?",
    opts: [
      "Nurse → 2 Channels (Web + Mobile); Reviewer → 1 Channel (Web) — one Persona can have multiple Channels for different delivery surfaces",
      "Each Persona can only have 1 Channel — create a separate NurseMobile Persona for mobile access and keep Nurse for desktop only",
      "Channels are application-wide, not per-Persona — configure Web and Mobile once at the application level and all Personas get both automatically",
      "Mobile access requires a completely separate Pega application — you cannot add a Mobile Channel to an existing Persona in the same app"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. One Persona can be associated with multiple Channels. The Nurse Persona gets both Web and Mobile Channel interfaces; the Reviewer gets Web only. This is the standard multi-channel Persona pattern.",
      "✗ Incorrect. Creating a separate Persona solely for a different device creates configuration duplication and maintenance burden. Multiple Channels on one Persona is the supported, recommended approach.",
      "✗ Incorrect. Channels are configured per Persona, not globally. If they were application-wide, you couldn't give the Nurse mobile access without also giving the Reviewer mobile access.",
      "✗ Incorrect. Mobile Channels are supported within the same Pega application — no separate app is needed. Pega's App Studio supports adding Mobile Channel interfaces to existing Personas."
    ]
  },
  {
    label: "Access Grant Flow",
    scenario: "A new compliance officer, Dana, joins HealthCorp. An admin invites Dana to the application. Dana logs in but cannot see any claim Cases — only an empty portal. What step was missed, and what is the fix?",
    opts: [
      "Dana was not assigned a Persona — the invite grants application access but does not automatically assign a role; assigning the Compliance Officer Persona grants the correct Access Group and work routing",
      "Dana needs a second invite with a 'role' parameter — the first invite was incomplete because no role was specified in the invitation email",
      "Dana's Operator record must be manually linked to a Work Queue — Cases only appear when the Operator is added directly to a Work Queue routing rule",
      "The Compliance Officer Persona has not been created yet — an empty portal always means the Persona doesn't exist in the system"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. The invite gives Dana login access to the application, but Persona assignment is the separate step that grants Access Roles (what Dana can see/do) and work routing (which Cases appear). Without a Persona, Dana has access to the portal shell but no permissions.",
      "✗ Incorrect. There is no 'role parameter' in the Pega invitation flow. The invitation is a two-step process: (1) invite to the application, (2) assign Persona. These are separate actions.",
      "✗ Incorrect. Work Queues are routing destinations for unassigned work, not a prerequisite for an individual user to see Cases. Persona/Access Group assignment controls Case visibility.",
      "✗ Incorrect. An empty portal after login usually means the Persona exists but was not assigned, not that it is missing entirely. If the Persona didn't exist at all, the admin would not have been able to set it up in the first place."
    ]
  },
  {
    label: "Changing Access",
    scenario: "A nurse, Alex, is promoted to a senior reviewer role. Alex should now approve claims instead of submitting them. What is the correct way to update Alex's access in Pega?",
    opts: [
      "Change Alex's Persona from 'Nurse' to 'Reviewer' — the Persona change automatically updates the Access Group and all associated Access Roles",
      "Add the Reviewer Access Role directly to Alex's Operator record in Dev Studio — this is more targeted than changing the Persona",
      "Create a new hybrid 'NurseReviewer' Persona for Alex — you cannot change a user's Persona once they have submitted Cases",
      "Delete Alex's Operator record and re-invite as a new user with the Reviewer role — this is the only way to fully reset access"
    ],
    correct: 0,
    fbs: [
      "✓ Correct. Reassigning a Persona is the standard access-change pattern. The new Persona links to a different Access Group with the Reviewer's Access Roles. Simple, clean, and maintains audit history.",
      "✗ Incorrect. While technically possible to add Access Roles directly to an Operator record, this bypasses the Persona layer — the architectural design abstraction intended to keep access management maintainable at scale. It creates one-off exceptions that are hard to audit.",
      "✗ Incorrect. You can change a user's Persona at any time regardless of their history. Creating a hybrid Persona for a single user defeats the purpose of Personas as reusable role templates.",
      "✗ Incorrect. Deleting and re-inviting destroys the user's work history, audit trail, and assignment history. Never the right answer for a role change."
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

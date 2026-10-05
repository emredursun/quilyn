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
    "label": "Pre-Build Planning",
    "scenario": "Before any Pega environment is provisioned, a product team wants to use AI to describe their claims process in plain English and get a proposed Case Type structure, Data Model, and Persona list to review with stakeholders. Which tool fits?",
    "opts": [
      "Pega Blueprint — standalone SaaS tool that generates application structure from natural language descriptions before you open a Pega environment",
      "Pega GenAI Autopilot — AI assistant inside App Studio that suggests Case Types and Data Models as you build",
      "Pega GenAI Coach — provides expert guidance on claims handling to users during live Case work",
      "Pega GenAI Connect — lets you build custom AI features using the Pega GenAI gateway"
    ],
    "correct": 0,
    "fbs": [
      "Correct. Blueprint is independent SaaS design collaboration; a Pega Platform instance or Operator login is not needed. Review its proposal before importing and implementing it.",
      "✗ Incorrect. Autopilot operates INSIDE App Studio while you are actively building — it requires an existing Pega environment and an open application. It cannot be used before provisioning.",
      "✗ Incorrect. Coach is a runtime tool for end users during live Case work — not a design or planning tool for architects and product teams.",
      "✗ Incorrect. GenAI Connect is a developer tool for building custom AI-powered capabilities via the Pega GenAI gateway — it requires development work, not a pre-build planning session."
    ]
  },
  {
    "label": "Design-Time Acceleration",
    "scenario": "A developer is in App Studio configuring a new insurance Case Type. They want AI to automatically suggest field names, picklist values, and workflow steps as they work. Which tool provides this real-time in-context assistance?",
    "opts": [
      "Pega GenAI Autopilot — the in-App-Studio AI assistant that provides real-time suggestions for fields, workflows, and picklists during development (must be enabled first)",
      "Pega Blueprint — AI generates the structure upfront, but does not provide real-time suggestions while you are actively configuring in App Studio",
      "Pega GenAI Knowledge Buddy — answers questions from knowledge bases, which the developer could query for field naming conventions",
      "Pega GenAI Agents with Tool Rules — autonomous agents that can start Cases and run automations, applicable to the build-time workflow"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. Autopilot is the in-App-Studio real-time AI assistant. Important: it is inactive by default in Infinity '23 and '24 and must be explicitly configured and enabled.",
      "✗ Incorrect. Blueprint generates an application proposal before you start building — it does not provide real-time field/workflow suggestions inside App Studio during active configuration.",
      "✗ Incorrect. Knowledge Buddy answers questions from company documents — it is not an active configuration assistant that suggests fields and picklists in App Studio.",
      "✗ Incorrect. GenAI Agents are runtime automation tools — they start Cases and run processes during application execution, not during the development/configuration phase."
    ]
  },
  {
    "label": "Runtime End-User Support",
    "scenario": "A claims adjuster is working through a complex fraud investigation Case in the live Pega application. They are unsure of the correct investigative protocol for this type of claim. They need expert, context-aware guidance right now — specific to the current Case. Which GenAI tool is designed for this?",
    "opts": [
      "Pega GenAI Coach — provides expert task-specific guidance to end users during live Case work, tailored to the current task and context",
      "Pega Blueprint — the adjuster can open Blueprint and describe the fraud scenario to get an AI-generated investigation workflow",
      "Pega GenAI Autopilot — the developer can open Autopilot in App Studio and configure better guidance screens for the adjuster",
      "Pega GenAI Knowledge Buddy — retrieve contextual answers from organizational knowledge, rather than the specifically requested Coach task guidance"
    ],
    "correct": 0,
    "fbs": [
      "✓ Correct. Coach is the runtime end-user guidance tool — it is context-aware (knows the current Case and task) and provides expert recommendations to help users make better decisions mid-work.",
      "Incorrect. Blueprint proposes application designs rather than providing the requested guidance inside the live Case.",
      "✗ Incorrect. Autopilot is a developer tool in App Studio — it helps build the application, not guide users in the live application. The adjuster needs runtime support, not a developer configuration session.",
      "Knowledge Buddy can provide client-specific contextual information while working. Coach is the more direct choice for the explicitly requested Case-task coaching; Buddy is not limited to generic knowledge."
    ]
  },
  {
    "label": "Custom GenAI Feature",
    "scenario": "A developer wants a custom claim-summary automation in the Case flow: send a prompt, store the generated narrative in a target field and display it. Which component supports this?",
    "opts": [
      "Pega GenAI Connect — the developer framework for building custom GenAI capabilities via the Pega GenAI gateway, used with a Connect Generative AI Step in the Case flow",
      "Pega GenAI Coach — the runtime guidance tool that can be configured to auto-generate summaries and next-best-action recommendations for any Case",
      "Pega Blueprint — can be prompted to design a summary-generation workflow, which is then imported directly into the running application as a live feature",
      "Pega GenAI Knowledge Buddy — retrieves information from knowledge bases, which includes Case history documents, making it capable of auto-generating summaries"
    ],
    "correct": 0,
    "fbs": [
      "Correct. Use GenAI Connect with the configured prompt, response structure and target field; add the field to a View for display. This does not automatically create a next-best-action decision policy.",
      "Incorrect. The requirement asks for a configured custom Connect automation rather than task-specific Coach guidance.",
      "✗ Incorrect. Blueprint is a pre-build planning and design tool. It cannot import AI-generated workflows directly into a running application as executable features — it produces a design artifact for development, not a live integration.",
      "Incorrect. Organizational knowledge retrieval is not the specified Case-flow Connect automation and response-target configuration."
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
  var msg = pct === 100 ? 'Perfect — you know when to use each Pega GenAI tool.' :
            pct >= 75 ? 'Good. Review the tool you confused — design-time vs. runtime is the key axis.' :
            'Re-read the GenAI tool reference cards above, then retry.';
  document.getElementById('qcard').innerHTML = '<div class="score-big">' + score + ' / ' + scenarios.length + ' (' + pct + '%)</div><div class="score-msg">' + msg + '</div>';
  document.getElementById('nav').innerHTML = '<button class="btn" data-quilyn-action="restart()">Restart</button>';
}

function restart() { cur = 0; score = 0; render(); }
render();


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

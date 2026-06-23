/* =====================================================================
   PegaAcademy — quiz-engine.js
   Polymorphic Quiz Core: handles Single-Select and Multi-Select
   questions with strict, zero-partial-credit Pega exam scoring.

   Public API:
     PegaQuiz.render(container, questions, onComplete)
       - container : DOM element to render into
       - questions : array of question objects (see schema below)
       - onComplete: callback(scorePercent, correctCount, total) fired
                     once every question has been graded.

   Question schema (from data/business-architect/*.json):
     {
       questionId, type: "single-select" | "multi-select",
       selectCount (multi only), scenario, options:[{id,text}],
       correctOptions:[ids], hint, rationale
     }
   ===================================================================== */
(function (global) {
  "use strict";

  var LETTERS = ["A", "B", "C", "D", "E", "F"];

  function setsEqual(a, b) {
    if (a.length !== b.length) return false;
    var sa = a.slice().sort().join("|");
    var sb = b.slice().sort().join("|");
    return sa === sb;
  }

  /* ---- localStorage helpers ---- */
  // Key is derived from the URL hash so each module gets its own slot.
  function storageKey() {
    return "pq_state_" + (window.location.hash || "default");
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(storageKey());
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveState(state) {
    try { localStorage.setItem(storageKey(), JSON.stringify(state)); } catch (e) {}
  }

  function clearState() {
    try { localStorage.removeItem(storageKey()); } catch (e) {}
  }

  /* ---- Keyboard shortcut support ---- */
  var _kbActiveIdx = null; // index of question currently targeted by keyboard

  function _kbHandler(e) {
    /* Ignore if focus is on an input/textarea */
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    var key = e.key.toUpperCase();
    var letterMap = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };

    if (key in letterMap && _kbActiveIdx != null) {
      var optEls = _kbContainer && _kbContainer.querySelectorAll('.pa-q[data-idx="' + _kbActiveIdx + '"] .pa-opt');
      var idx = letterMap[key];
      if (optEls && optEls[idx]) { e.preventDefault(); optEls[idx].click(); }
      return;
    }
    if (key === 'ENTER' && _kbActiveIdx != null) {
      var checkBtn = _kbContainer && _kbContainer.querySelector('.pa-q[data-idx="' + _kbActiveIdx + '"] .check');
      if (checkBtn && !checkBtn.disabled) { e.preventDefault(); checkBtn.click(); }
      return;
    }
    if (key === 'H' && _kbActiveIdx != null) {
      var hintBtn = _kbContainer && _kbContainer.querySelector('.pa-q[data-idx="' + _kbActiveIdx + '"] .hint');
      if (hintBtn) { e.preventDefault(); hintBtn.click(); }
    }
  }

  var _kbContainer = null;

  function render(container, questions, onComplete, pill) {
    container.innerHTML = "";
    var total = questions.length;
    var graded = new Array(total).fill(false);
    var correctFlags = new Array(total).fill(false);

    /* Keyboard shortcuts: attach once per render, clean up on re-render */
    if (_kbContainer) document.removeEventListener('keydown', _kbHandler);
    _kbContainer = container;
    _kbActiveIdx = null;
    document.addEventListener('keydown', _kbHandler);

    // Restore persisted state; each entry: { selected: [ids], graded: bool, correct: bool }
    var state = loadState();

    /* ---- Reset button (inline, above questions) ---- */
    var resetBtn = document.createElement("button");
    resetBtn.className = "pa-btn pa-quiz-reset";
    resetBtn.type = "button";
    resetBtn.textContent = "Reset Quiz";
    container.appendChild(resetBtn);

    /* ---- Init pill ---- */
    if (pill) {
      pill.querySelector(".pqp-t").textContent = total;
      pill.querySelector(".pqp-g").textContent = "0";
      pill.querySelector(".pqp-s").textContent = "0";
      pill.querySelector(".pqp-fill").style.width = "0%";
    }

    var listWrap = document.createElement("div");
    container.appendChild(listWrap);

    var result = document.createElement("div");
    result.className = "pa-result";
    container.appendChild(result);

    function refreshBar() {
      var g = graded.filter(Boolean).length;
      var s = correctFlags.filter(Boolean).length;
      if (pill) {
        pill.querySelector(".pqp-g").textContent = g;
        pill.querySelector(".pqp-s").textContent = s;
        pill.querySelector(".pqp-fill").style.width = (g / total * 100) + "%";
      }
      if (g === total) finish(s);
    }

    function finish(score) {
      var pct = Math.round(score / total * 100);
      var msg;
      if (pct >= 90) msg = "Outstanding — you are exam-ready.";
      else if (pct >= 75) msg = "Solid. Review the misses and the Exam Pitfalls tab.";
      else if (pct >= 60) msg = "Getting there. Re-read the Study Guide, then retry.";
      else msg = "Work through the Study Guide again, then retry.";

      // Collect wrong questions for retry mode
      var wrongQuestions = questions.filter(function (q, i) { return !correctFlags[i]; });
      var retryHtml = wrongQuestions.length > 0
        ? '<button class="pa-btn pa-retry-wrong" type="button">↩ Retry wrong answers (' + wrongQuestions.length + ')</button>'
        : "";

      result.innerHTML =
        '<div class="sub">Quiz complete</div>' +
        '<div class="big">' + score + " / " + total + " (" + pct + "%)</div>" +
        '<div class="sub">' + msg + "</div>" +
        retryHtml;
      result.classList.add("show");
      result.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof onComplete === "function") onComplete(pct, score, total);

      var retryBtn = result.querySelector(".pa-retry-wrong");
      if (retryBtn) {
        retryBtn.addEventListener("click", function () {
          clearState();
          render(container, wrongQuestions, null, pill);
          container.scrollIntoView({ behavior: "smooth" });
        });
      }
    }

    /* ---- Apply graded visual state to a card ---- */
    function applyGradedState(card, q, selected) {
      var optEls = card.querySelectorAll(".pa-opt");
      var verdict = card.querySelector(".verdict");
      var rationale = card.querySelector(".rationale");
      var checkBtn = card.querySelector(".check");
      var isCorrect = setsEqual(selected, q.correctOptions);

      optEls.forEach(function (el) {
        el.classList.remove("selected");
        el.classList.add("disabled");
        var id = el.getAttribute("data-id");
        var inAnswer = q.correctOptions.indexOf(id) >= 0;
        var picked = selected.indexOf(id) >= 0;
        var badge = el.querySelector(".key");
        if (inAnswer) {
          el.classList.add("correct");
          if (badge) badge.textContent = "✓";
        } else if (picked) {
          el.classList.add("wrong");
          if (badge) badge.textContent = "✗";
        }
      });

      verdict.className = "verdict show " + (isCorrect ? "ok" : "no");
      if (isCorrect) {
        verdict.textContent = "✓ Correct.";
      } else {
        var ans = q.correctOptions.map(function (cid) {
          var i = q.options.findIndex(function (o) { return o.id === cid; });
          return LETTERS[i];
        }).join(", ");
        verdict.textContent = q.type === "multi-select"
          ? "✗ Incorrect (no partial credit). Correct set: " + ans
          : "✗ Incorrect. Correct answer: " + ans;
      }
      rationale.classList.add("show");
      checkBtn.disabled = true;
      return isCorrect;
    }

    /* ---- Build each question card ---- */
    questions.forEach(function (q, idx) {
      var isMulti = q.type === "multi-select";
      var saved = state[idx] || {};
      var selected = saved.selected ? saved.selected.slice() : [];

      var card = document.createElement("div");
      card.className = "pa-q";
      card.setAttribute("data-idx", idx);

      var typeLabel = isMulti
        ? "Multi-Select · choose " + (q.selectCount || q.correctOptions.length)
        : "Single-Select";

      var optsHtml = q.options.map(function (o, i) {
        return (
          '<div class="pa-opt ' + (isMulti ? "multi" : "single") + '" data-id="' + o.id + '">' +
            '<span class="key">' + LETTERS[i] + "</span>" +
            '<span class="txt">' + o.text + "</span>" +
          "</div>"
        );
      }).join("");

      card.innerHTML =
        '<div class="qhead">' +
          '<span class="qtype ' + (isMulti ? "multi" : "") + '">' + typeLabel + "</span>" +
          '<span class="qno">Question ' + (idx + 1) + " / " + total + "</span>" +
        "</div>" +
        '<div class="scenario">' + q.scenario + "</div>" +
        '<div class="opts">' + optsHtml + "</div>" +
        '<div class="controls">' +
          '<button class="pa-btn primary check" type="button">Check answer</button>' +
          '<button class="pa-btn hint" type="button">💡 Hint</button>' +
        "</div>" +
        '<div class="hintbox">' + (q.hint || "") + "</div>" +
        '<div class="verdict"></div>' +
        '<div class="rationale"><b>Rationale:</b> ' + (q.rationale || "") + "</div>";

      listWrap.appendChild(card);

      var optEls = card.querySelectorAll(".pa-opt");
      var checkBtn = card.querySelector(".check");
      var hintBtn = card.querySelector(".hint");
      var hintBox = card.querySelector(".hintbox");

      hintBtn.addEventListener("click", function () {
        hintBox.classList.toggle("show");
      });

      /* ---- Restore persisted state for this question ---- */
      if (saved.graded) {
        graded[idx] = true;
        correctFlags[idx] = applyGradedState(card, q, selected);
      } else if (selected.length > 0) {
        // Restore pre-check selections
        optEls.forEach(function (el) {
          if (selected.indexOf(el.getAttribute("data-id")) >= 0) {
            el.classList.add("selected");
          }
        });
      }

      /* ---- Option click ---- */
      optEls.forEach(function (el) {
        el.addEventListener("click", function () {
          if (graded[idx]) return;
          _kbActiveIdx = idx; /* track which question is active for keyboard */
          var id = el.getAttribute("data-id");
          if (isMulti) {
            var pos = selected.indexOf(id);
            if (pos >= 0) { selected.splice(pos, 1); el.classList.remove("selected"); }
            else { selected.push(id); el.classList.add("selected"); }
          } else {
            selected = [id];
            optEls.forEach(function (x) { x.classList.remove("selected"); });
            el.classList.add("selected");
          }
          // Persist selection immediately
          state[idx] = { selected: selected.slice(), graded: false };
          saveState(state);
        });
      });

      /* ---- Check answer ---- */
      checkBtn.addEventListener("click", function () {
        if (graded[idx]) return;
        if (selected.length === 0) {
          var verdict = card.querySelector(".verdict");
          verdict.textContent = "Select an answer first.";
          verdict.className = "verdict no show";
          return;
        }
        graded[idx] = true;
        var isCorrect = applyGradedState(card, q, selected);
        correctFlags[idx] = isCorrect;

        // Persist graded state
        state[idx] = { selected: selected.slice(), graded: true, correct: isCorrect };
        saveState(state);
        refreshBar();
      });
    });

    // Sync bar with any restored graded questions
    refreshBar();

    /* ---- Reset ---- */
    resetBtn.addEventListener("click", function () {
      clearState();
      render(container, questions, onComplete, pill);
      container.scrollIntoView({ behavior: "smooth" });
    });
  }

  global.PegaQuiz = { render: render };
})(window);

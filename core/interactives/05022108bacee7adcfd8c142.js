(function(){

(function(){
  var root=document.documentElement;
  function apply(t){root.setAttribute('data-theme',t);}
  apply('dark');
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='pa-theme') apply(e.data.theme);
  });
})();


var PRINCIPLES = [
  { letter: "I", text: "Manage Intelligence centrally — put all AI, decisioning, and business rules in the application layer, not scattered in channels or data systems" },
  { letter: "O", text: "Focus on Outcomes, align your process — use Case Management and Microjourneys to deliver specific customer outcomes" },
  { letter: "U", text: "Connect Up to Channels — presentation and channel interfaces connect up to the central business logic layer" },
  { letter: "D", text: "Connect Down to data, keep it clean — the data access layer connects downward to systems of record without exposing implementation details" },
  { letter: "V", text: "Manage Variations to be scale-ready — handle geographies, business lines, and customer-type variations through the Situational Layer Cake" }
];

var order = []; // indices into PRINCIPLES, in current displayed order
var checked = false;

function shuffle() {
  if (checked) { checked = false; document.getElementById('result').innerHTML = ''; }
  order = [0,1,2,3,4].sort(function(){ return Math.random()-.5; });
  renderList();
}

function renderList() {
  var dl = document.getElementById('drag-list');
  dl.innerHTML = '';
  order.forEach(function(pi, displayIdx) {
    var item = document.createElement('div');
    item.className = 'drag-item' + (checked ? ' locked' : '');
    item.draggable = !checked;
    item.dataset.pi = pi;
    item.dataset.di = displayIdx;
    item.innerHTML = '<span class="drag-handle">' + (checked ? '' : '⠿') + '</span>' +
                     '<span class="num">' + (displayIdx+1) + '.</span>' +
                     '<span>' + PRINCIPLES[pi].text + '</span>';
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragover', onDragOver);
    item.addEventListener('drop', onDrop);
    dl.appendChild(item);
  });
}

var dragSrc = null;
function onDragStart(e){ dragSrc = this; }
function onDragOver(e){ e.preventDefault(); }
function onDrop(e){
  e.preventDefault();
  if (!dragSrc || dragSrc === this) return;
  var a = parseInt(dragSrc.dataset.di), b = parseInt(this.dataset.di);
  var tmp = order[a]; order[a] = order[b]; order[b] = tmp;
  renderList();
}

function checkOrder() {
  checked = true;
  var resultHtml = '<div style="margin-top:14px">';
  var correct = 0;
  order.forEach(function(pi, di) {
    var isCorrect = pi === di;
    if (isCorrect) correct++;
    var p = PRINCIPLES[pi];
    resultHtml += '<div class="result-row ' + (isCorrect ? 'ok' : 'bad') + '">' +
      '<span class="pos">' + (isCorrect ? '✓' : '✗') + '</span>' +
      '<span><b>You placed:</b> ' + p.text.split(' — ')[0] + ' at position ' + (di+1) +
      (isCorrect ? '' : ' — should be position ' + (pi+1) + ' (' + PRINCIPLES[di].letter + ')') +
      '</span></div>';
  });
  var pct = Math.round(correct/5*100);
  var msg = correct === 5 ? 'I-O-U-D-V locked in. You have the sequence.' :
            correct >= 3 ? 'Getting there. Focus on the ' + (5-correct) + ' misplaced principle(s).' :
            'Review the five principles and their mnemonic, then try again.';
  resultHtml += '<div style="margin-top:12px"><div class="score-big">' + correct + '/5 (' + pct + '%)</div><div class="score-msg">' + msg + '</div></div>';
  resultHtml += '<button class="btn" data-quilyn-action="shuffle()" style="margin-top:10px">Try again</button>';
  resultHtml += '</div>';
  document.getElementById('result').innerHTML = resultHtml;
  renderList();
}

shuffle();

document.querySelectorAll('[data-quilyn-event-0]').forEach(function(el){el.addEventListener('click',function(event){checkOrder()
});});
document.querySelectorAll('[data-quilyn-event-1]').forEach(function(el){el.addEventListener('click',function(event){shuffle()
});});
var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

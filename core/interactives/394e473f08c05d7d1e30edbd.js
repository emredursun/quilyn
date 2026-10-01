(function(){

var pairs=[["Field","Property"],["Goal and deadline","Service-Level Agreement (SLA)"],["User","Operator"],["Team","Work Group"]];
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
var L=document.getElementById("L"),R=document.getElementById("R"),sc=document.getElementById("sc");
var selL=null,selR=null,done=0;
function build(){
 L.innerHTML="";R.innerHTML="";selL=null;selR=null;done=0;sc.textContent="0 / 4 matched";
 var li=shuffle(pairs.map(function(p,i){return{t:p[0],i:i};}));
 var ri=shuffle(pairs.map(function(p,i){return{t:p[1],i:i};}));
 li.forEach(function(o){var b=document.createElement("button");b.className="tok";b.textContent=o.t;b.dataset.i=o.i;b.dataset.side="L";b.onclick=pick;L.appendChild(b);});
 ri.forEach(function(o){var b=document.createElement("button");b.className="tok";b.textContent=o.t;b.dataset.i=o.i;b.dataset.side="R";b.onclick=pick;R.appendChild(b);});
}
function pick(e){
 var b=e.currentTarget;if(b.classList.contains("ok"))return;
 if(b.dataset.side==="L"){if(selL)selL.classList.remove("sel");selL=b;b.classList.add("sel");}
 else{if(selR)selR.classList.remove("sel");selR=b;b.classList.add("sel");}
 if(selL&&selR){
  if(selL.dataset.i===selR.dataset.i){
   selL.classList.add("ok");selR.classList.add("ok");selL.classList.remove("sel");selR.classList.remove("sel");
   selL=null;selR=null;done++;sc.textContent=done+" / 4 matched"+(done===4?" ✓ all correct!":"");
  } else {
   var a=selL,c=selR;a.classList.add("bad");c.classList.add("bad");
   setTimeout(function(){a.classList.remove("bad","sel");c.classList.remove("bad","sel");},520);
   selL=null;selR=null;
  }
 }
}
document.getElementById("rs").onclick=build;build();


window.addEventListener("message",function(e){if(e.data&&e.data.type==="pa-theme"){document.documentElement.setAttribute("data-theme",e.data.theme);}});


var actions={answer:typeof answer==='function'?answer:null,ans:typeof ans==='function'?ans:null,next:typeof next==='function'?next:null,nxt:typeof nxt==='function'?nxt:null,restart:typeof restart==='function'?restart:null,shuffle:typeof shuffle==='function'?shuffle:null};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\w+)\((\d*)\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});
})();

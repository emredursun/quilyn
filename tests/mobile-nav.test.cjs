const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup() {
  const doc = {activeElement:null};
  function node(tag='DIV') {
    const classes = new Set(), attributes = {}, listeners = {};
    return {tagName:tag,children:[],attributes,listeners,
      classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c),toggle(c,on){on?classes.add(c):classes.delete(c);}},
      style:{setProperty(){},removeProperty(){}},setAttribute(k,v){attributes[k]=v;},removeAttribute(k){delete attributes[k];},
      hasAttribute:k=>k in attributes,addEventListener(k,f){listeners[k]=f;},
      prepend(el){this.children.unshift(el);},appendChild(el){this.children.push(el);},
      contains(el){return this.children.includes(el);},
      getClientRects:()=>[{}],matches:()=>tag==='BUTTON'||tag==='A',focus(){doc.activeElement=this;}};
  }
  const drawer=node(),main=node(),toggle=node('BUTTON'),body=node(),app=node();
  const media={matches:true},events={},scrolls=[];
  Object.assign(doc,{body,createElement:t=>node(t.toUpperCase()),getElementById:id=>id==='paSidebar'?drawer:toggle,
    querySelector:s=>s==='.pa-main'?main:app});
  const window={matchMedia:()=>media,scrollY:240,scrollTo:(x,y)=>scrolls.push(y),getComputedStyle:()=>({visibility:'visible'}),addEventListener:(k,f)=>events[k]=f};
  vm.runInNewContext(fs.readFileSync('core/js/mobile-nav.js','utf8'),{window,document:doc});
  window.QuilynMobileNav.init();
  return {drawer,main,toggle,body,doc,media,events,scrolls,backdrop:app.children[0],close:drawer.children[0],window,node};
}
test('mobile drawer closes via backdrop and restores scrolling and focus',()=>{
  const s=setup();s.toggle.onclick();
  assert.equal(s.main.inert,true);assert.equal(s.backdrop.hidden,false);
  assert(s.body.classList.contains('quilyn-menu-open'));assert.equal(s.doc.activeElement,s.close);
  s.backdrop.onclick();assert.equal(s.main.inert,false);assert.equal(s.drawer.inert,true);
  assert.equal(s.doc.activeElement,s.toggle);assert.deepEqual(s.scrolls,[240]);
});
test('same-route navigation closes drawer; desktop resize removes scroll lock',()=>{
  const s=setup();s.toggle.onclick();const link=s.node('A');link.setAttribute('href','#mock');
  s.drawer.listeners.click({composedPath:()=>[link]});assert.equal(s.toggle.attributes['aria-expanded'],'false');
  s.toggle.onclick();s.media.matches=false;s.events.resize();
  assert.equal(s.drawer.inert,false);assert.equal(s.main.inert,false);
  assert.equal(s.drawer.attributes.role,undefined);assert(!s.body.classList.contains('quilyn-menu-open'));
});
test('focus wraps through shadow controls and Escape consumed by dropdown keeps drawer open',()=>{
  const s=setup(),host=s.node(),trigger=s.node('BUTTON'),last=s.node('A');
  host.shadowRoot={children:[trigger]};s.drawer.children.push(host,last);s.toggle.onclick();
  let prevented=false;
  s.drawer.listeners.keydown({key:'Tab',shiftKey:true,composedPath:()=>[s.close],preventDefault(){prevented=true;}});
  assert(prevented);assert.equal(s.doc.activeElement,last);
  s.drawer.listeners.keydown({key:'Tab',shiftKey:false,composedPath:()=>[last],preventDefault(){}});
  assert.equal(s.doc.activeElement,s.close);
  s.drawer.listeners.keydown({key:'Escape',defaultPrevented:true});assert.equal(s.toggle.attributes['aria-expanded'],'true');
  s.drawer.listeners.keydown({key:'Escape',preventDefault(){}});assert.equal(s.toggle.attributes['aria-expanded'],'false');
});

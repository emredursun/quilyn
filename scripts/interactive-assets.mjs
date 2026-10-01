import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const hash = s => createHash('sha256').update(s).digest('hex');
const registry = JSON.parse(readFileSync(resolve(root,'data/registry.json')));
const index = {};
const previous = existsSync(resolve(root,"data/interactive-manifest.json")) ? JSON.parse(readFileSync(resolve(root,"data/interactive-manifest.json"))) : {};
const check = process.argv.includes('--check');
const decode = s => s.replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
function emit(path, contents) {
  if (check) { if (readFileSync(resolve(root,path),'utf8') !== contents) throw new Error('Interactive assets are stale. Run npm run manifest:content.'); }
  else writeFileSync(resolve(root,path),contents);
}
if (!check) mkdirSync(resolve(root,'core/interactives'),{recursive:true});
for (const track of registry.tracks) for (const meta of track.modules.filter(m=>m.ready!==false)) {
  const data = JSON.parse(readFileSync(resolve(root,meta.file)));
  for (const section of data.studyGuide) for (const el of section.elements || []) if (el.type === 'interactive' && el.html) {
    const id = hash(el.html); if (index[id]) continue;
    index[id] = {};
    for (const theme of ['dark','light']) {
      let html = el.html.replace(/__THEME__/g,theme), handlers = [], scripts = [];
      html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_, code) => { scripts.push(code.replace(/(?<!\.)\bonclick=/g,'data-quilyn-action=')); return ''; });
      html = html.replace(/\s(on[a-z]+)\s*=\s*("([^"]*)"|'([^']*)')/gi, (_, event, quoted, a, b) => {
        const marker = 'data-quilyn-event-' + handlers.length;
        handlers.push(`document.querySelectorAll('[${marker}]').forEach(function(el){el.addEventListener('${event.slice(2)}',function(event){${decode(a ?? b)}\n});});`);
        return ` ${marker}=""`;
      });

      const actions = ['answer','ans','next','nxt','restart','shuffle'].map(name => `${name}:typeof ${name}==='function'?${name}:null`).join(',');
      const delegate = `var actions={${actions}};document.addEventListener('click',function(event){var button=event.target.closest('[data-quilyn-action]');if(!button)return;var match=/^(\\w+)\\((\\d*)\\)$/.exec(button.getAttribute('data-quilyn-action'));if(match&&actions[match[1]])actions[match[1]](match[2]?Number(match[2]):undefined);});`;
      const code = '(function(){\n' + scripts.join('\n') + '\n' + handlers.join('\n') + '\n' + delegate + '\n})();\n';
      const path = 'core/interactives/' + hash(code).slice(0,24) + '.js';
      emit(path,code); index[id][theme] = path;
    }
  }
}
emit('data/interactive-manifest.json',JSON.stringify(index,null,2)+'\n');
if (!check) {
  const keep = new Set(Object.values(index).flatMap(entry=>Object.values(entry)));
  for (const path of new Set(Object.values(previous).flatMap(entry=>Object.values(entry)))) if (!keep.has(path) && /^core\/interactives\/[a-f0-9]{24}\.js$/.test(path) && existsSync(resolve(root,path))) unlinkSync(resolve(root,path));
}
console.log('Interactive scripts verified: ' + Object.keys(index).length + ' exercises.');

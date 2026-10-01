import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const registry = JSON.parse(readFileSync(resolve(root, 'data/registry.json')));
const interactives = JSON.parse(readFileSync(resolve(root, 'data/interactive-manifest.json')));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const tracks = registry.tracks.map(track => {
  const moduleFiles = track.modules.filter(m => m.ready !== false).map(m => m.file);
  const scripts = new Set();
  for (const file of moduleFiles) {
    const module = JSON.parse(readFileSync(resolve(root,file)));
    for (const section of module.studyGuide) for (const element of section.elements || []) if (element.type === 'interactive' && element.html) {
      const entry = interactives[hash(element.html)];
      if (!entry) throw new Error('Missing interactive asset for ' + file);
      scripts.add(entry.dark); scripts.add(entry.light);
    }
  }
  const files = ['data/registry.json', 'data/mock-exams.json', 'data/interactive-manifest.json', ...moduleFiles, ...scripts]
    .map(path => { const bytes = readFileSync(resolve(root, path)); return { path, bytes: bytes.length, sha256: hash(bytes) }; });
  return { id: track.trackId, name: track.trackName, modules: moduleFiles.length,
    version: hash(JSON.stringify(files)).slice(0, 16), bytes: files.reduce((sum, f) => sum + f.bytes, 0), files };
});
const result = JSON.stringify({ version: 1, tracks }, null, 2) + '\n';
const target = resolve(root, 'data/content-manifest.json');
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== result) { console.error('Offline manifest is stale. Run npm run manifest:content.'); process.exitCode = 1; }
} else { writeFileSync(target, result); console.log('Offline content manifest generated.'); }

import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const sourceFiles = readdirSync(join(root, 'core/js')).filter(file => file.endsWith('.js'))
  .map(file => join('core/js', file));
const interactiveFiles = readdirSync(join(root, 'core/interactives')).filter(file => file.endsWith('.js')).map(file => join('core/interactives',file));
const scripts = readdirSync(join(root, 'scripts')).filter(file => file.endsWith('.mjs'))
  .map(file => join('scripts', file));
for (const file of [...sourceFiles, ...interactiveFiles, 'sw.js', ...scripts]) run(['--check', file]);
console.log(`Syntax verified: ${sourceFiles.length + interactiveFiles.length + scripts.length + 1} JavaScript files.`);
run(['scripts/validate-content.mjs']);
run(['scripts/interactive-assets.mjs', '--check']);
run(['scripts/content-quality.mjs', '--check']);
run(['scripts/content-manifest.mjs', '--check']);
const tests = readdirSync(join(root, 'tests')).filter(file => /\.test\.(?:cjs|mjs|js)$/.test(file))
  .sort().map(file => join('tests', file));
if (!tests.length) throw new Error('No regression tests found.');
run(['--test', ...tests]);

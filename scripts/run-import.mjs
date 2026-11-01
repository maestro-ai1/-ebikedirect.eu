// Runs the dealer import for a list of brands one after another and logs the result of each.
// node scripts/run-import.mjs "Cube:100" "Kalkhoff:60" ...     (brand:max models)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const log = (s) => { console.log(s); fs.appendFileSync('.image-work/run-import.log', s + '\n'); };
for (const arg of process.argv.slice(2)) {
  const [brand, max] = arg.split(':');
  const t0 = Date.now();
  const r = spawnSync('node', ['scripts/import-xxl.mjs', 'fetch', brand, max || '40'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const lines = (r.stdout || '').split('\n');
  const ok = lines.filter((l) => l.startsWith('OK')).length;
  const skip = lines.filter((l) => l.startsWith('SKIP')).length;
  const summary = lines.find((l) => /^candidates written/.test(l)) || lines.filter(Boolean).slice(-1)[0] || (r.stderr || '').split('\n')[0];
  log(`${brand}: OK ${ok}, skipped ${skip}, ${Math.round((Date.now() - t0) / 1000)}s | ${summary}`);
}
log('run finished');

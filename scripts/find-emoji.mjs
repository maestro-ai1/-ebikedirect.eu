// Lists every emoji or pictograph in source, content and public text files.
import fs from 'node:fs';
import path from 'node:path';
const re = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{2713}\u{2714}\u{2715}\u{2716}\u{2605}\u{2606}]/u;
const skip = new Set(['node_modules', '.next', '.git']);
let n = 0;
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!/\.(tsx?|json|md|txt|css|svg|mjs)$/.test(e.name) || e.name === 'package-lock.json') continue;
    fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => {
      if (re.test(l)) { n++; console.log(`${path.relative('.', p)}:${i + 1}: ${l.trim().slice(0, 110)}`); }
    });
  }
})('.');
console.log('emoji lines:', n);

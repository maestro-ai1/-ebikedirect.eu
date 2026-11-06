// node scripts/_add.cjs <adds.json>  adds = [{file, before, text}] ; inserts text (as new H2 sections) before the heading line `before` (must occur once)
const fs = require('fs');
const adds = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const a of adds) {
  let t = fs.readFileSync(a.file, 'utf8');
  const n = t.split(a.before).length - 1;
  if (n !== 1) { console.log('FAIL', a.file, n, a.before); continue; }
  t = t.replace(a.before, () => a.text.trim() + '\n\n' + a.before);
  fs.writeFileSync(a.file, t);
  console.log('ok', a.file);
}

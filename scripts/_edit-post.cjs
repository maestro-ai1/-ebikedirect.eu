// Usage: node scripts/_edit-post.cjs <file> <edits.json>   edits = [[old,new],...] ; each old must occur exactly once
const fs = require('fs');
const [file, ej] = process.argv.slice(2);
let t = fs.readFileSync(file, 'utf8');
const edits = JSON.parse(fs.readFileSync(ej, 'utf8'));
let bad = 0;
for (const [o, n] of edits) { const c = t.split(o).length - 1; if (c !== 1) { console.log('EDIT FAIL (' + c + ' matches):', o.slice(0, 70)); bad++; continue; } t = t.replace(o, () => n); }
fs.writeFileSync(file, t);
console.log('applied', edits.length - bad, 'of', edits.length);

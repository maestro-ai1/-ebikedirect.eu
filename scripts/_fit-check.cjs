const prods = require('../data/keywords/products.json').products;
const dump = Object.fromEntries(require('../.image-work/products-dump.json').map((p) => [p.slug, p]));
const FULLY = /\b(stereo|ams|fully|fs|fuel|rail|slash|wild|rise|nduro|hybe|allmtn|alltrail|alltrack|kapoho|lycan|prowler|aera fs|chacana|scarp|levo|kenevo|trance|reign|stance|xyron|trailray|hybe)\b/i;
const HARD = /\b(reaction|hardtail|talon|fathom|powerfly|ht|team|urrun|tero x|elite)\b/i;
const bad = [];
for (const [s, e] of Object.entries(prods)) {
  const sp = JSON.stringify(dump[s]?.specs || {}).toLowerCase();
  const fully = /fully|hinterbau|federweg hinten|dämpfer|dampfer|shock/.test(sp) || FULLY.test(e.name);
  const hard = !fully;
  for (const [kind, k] of [['PRIMARY', e.primary], ...(e.secondary || []).map((k) => ['sec', k]), ...(e.faq || []).map((k) => ['faq', k])]) {
    if (!k) continue;
    const w = k.keyword.toLowerCase();
    if (/\bhardtail\b/.test(w) && fully && !/\bfully\b|\bfs\b/.test(e.name.toLowerCase())) bad.push([e.brand, kind, e.name, k.keyword, k.volume, 'hardtail keyword on a full-suspension bike']);
    if (/\bfully\b|\bfull suspension\b/.test(w) && !fully && /reaction|talon|hardtail|team|elite|\bht\b/i.test(e.name)) bad.push([e.brand, kind, e.name, k.keyword, k.volume, 'fully keyword on a hardtail']);
  }
}
console.log('hardtail/fully mismatches:', bad.length);
for (const b of bad.slice(0, 30)) console.log(b.join(' | '));

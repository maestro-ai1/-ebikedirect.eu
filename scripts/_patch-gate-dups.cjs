const fs = require('fs');
const f = 'scripts/onpage-gate.mjs';
let t = fs.readFileSync(f, 'utf8');
if (!t.includes('const lgOf')) {
  const helper = String.raw`const lgOf = (u) => ((/^\/(fr|nl|it|es|pt)\//.exec(u) || [])[1] || 'de') + ':';` + '\n';
  t = t.replace("const dupTitles = new Map()", helper + "const dupTitles = new Map()");
  t = t.replace("const k = norm(v); if (k) (m.get(k) || m.set(k, []).get(k)).push(pg.url);", "const k = lgOf(pg.url) + norm(v); if (norm(v)) (m.get(k) || m.set(k, []).get(k)).push(pg.url);");
  t = t.replace("(dupTitles.get(norm(pg.title)) || []).length <= 1 && (dupDescs.get(norm(pg.desc)) || []).length <= 1 && (dupH1.get(h1t) || []).length <= 1", "(dupTitles.get(lgOf(pg.url) + norm(pg.title)) || []).length <= 1 && (dupDescs.get(lgOf(pg.url) + norm(pg.desc)) || []).length <= 1 && (dupH1.get(lgOf(pg.url) + h1t) || []).length <= 1");
}
fs.writeFileSync(f, t);
console.log(t.includes('const lgOf'), t.includes('lgOf(pg.url) + norm(pg.title)'), t.includes('lgOf(pg.url) + norm(v)'));

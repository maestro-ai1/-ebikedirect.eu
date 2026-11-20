// German M2 exceptions (Golden Keyword Rule: a Commercial primary is accepted when it has 2x or more the volume of the best Transactional keyword stored on the page).
// Measured from data/keywords/de.json for the pages listed; writes data/keywords/m2-de.json in the same shape the gate already reads for fr and en.
const fs = require('fs'); const d = JSON.parse(fs.readFileSync('data/keywords/de.json', 'utf8')).pages; const out = {};
for (const url of ['/zubehoer/regenschutz-bekleidung/']) {
  const p = d.find((x) => x.url === url); const pr = p.primary; if (pr.intent === 'T') continue;
  const bestT = [...(p.secondary || []), ...(p.faq || [])].filter((k) => k.intent === 'T').sort((a, b) => b.volume - a.volume)[0];
  if (!bestT || pr.volume >= 2 * bestT.volume) out[url.replace(/\/$/, '')] = { primary: pr.keyword, intent: pr.intent, volume: pr.volume, bestT: bestT ? bestT.keyword : null, tVolume: bestT ? bestT.volume : 0, ratio: bestT ? +(pr.volume / bestT.volume).toFixed(1) : null };
}
fs.writeFileSync('data/keywords/m2-de.json', JSON.stringify({ accepted: out, rejected: {} }, null, 1)); console.log(JSON.stringify(out));

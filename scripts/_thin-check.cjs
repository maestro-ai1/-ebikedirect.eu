// Thin / shared-text check on live English product pages (sample of every 6th product): main-text word count and the share of sentences that also appear on other products.
const slugs = Object.keys(require('../data/keywords/en-products.json').products).filter((_, i) => i % 6 === 0);
const text = async (u) => {
  const h = await (await fetch(u)).text();
  const main = (h.match(/<main[\s\S]*<\/main>/) || [h])[0].replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  return main.replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
};
const sents = (t) => t.split(/(?<=[.!?])\s+/).map((s) => s.trim().toLowerCase()).filter((s) => s.length > 40);
(async () => {
  const T = {};
  for (const s of slugs) { try { T[s] = await text(`https://ebikedirect.eu/en/shop/${s}`); } catch (e) { T[s] = ''; } }
  const freq = new Map();
  for (const s of slugs) for (const x of new Set(sents(T[s]))) freq.set(x, (freq.get(x) || 0) + 1);
  const rows = slugs.map((s) => { const a = [...new Set(sents(T[s]))]; const sh = a.filter((x) => freq.get(x) > 1).length; return { s, words: T[s].split(' ').length, n: a.length, share: a.length ? Math.round((100 * sh) / a.length) : 0 }; });
  const w = rows.map((r) => r.words).sort((a, b) => a - b), sh = rows.map((r) => r.share).sort((a, b) => a - b);
  console.log('sample', rows.length, '| words min/median/max', w[0], w[w.length >> 1], w[w.length - 1], '| under 400 words:', rows.filter((r) => r.words < 400).length);
  console.log('sentences shared with another sampled product (%) min/median/max', sh[0], sh[sh.length >> 1], sh[sh.length - 1], '| above 60%:', rows.filter((r) => r.share > 60).length);
  console.log('lowest word counts:', rows.sort((a, b) => a.words - b.words).slice(0, 5).map((r) => r.s + ' ' + r.words).join(' ; '));
  console.log('top shared sentences:'); for (const [x, c] of [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)) console.log(c, x.slice(0, 110));
})();

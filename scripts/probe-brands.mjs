// Counts how many current-season e-bike model pages the dealer source lists per brand (no photos downloaded).
// node scripts/probe-brands.mjs [slug ...]
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const ORIGIN = 'https://www.fahrrad-xxl.de';
const H = { 'user-agent': UA, 'accept-language': 'de-DE,de;q=0.9' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (u) => { try { const r = await fetch(u, { headers: H, signal: AbortSignal.timeout(30000) }); return r.ok ? (await r.text()).replace(/\\\//g, '/') : null; } catch { return null; } };
const links = (h) => [...new Set([...h.matchAll(/\/([a-z0-9-]+-m0\d{5,})/g)].map((m) => m[1]))];
const CATS = ['e-bike-trekking', 'e-bike-city', 'e-bike-mtb', 'e-bike-lastenrad', 'e-bike-speed-pedelec'];
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ['cube', 'kalkhoff', 'haibike', 'riese-und-mueller', 'specialized', 'trek', 'giant', 'gazelle', 'focus', 'winora', 'ghost', 'ktm', 'brompton', 'cannondale', 'bulls', 'fischer', 'prophete', 'conway', 'kettler', 'raymon', 'husqvarna', 'orbea', 'scott', 'merida', 'pegasus', 'hercules', 'simplon', 'bergamont', 'stevens', 'victoria', 'zuendapp', 'stromer', 'moustache', 'qwic', 'rotwild', 'm1-sporttechnik', 'babboe', 'urban-arrow', 'carqon', 'flyer', 'tenways', 'fritzbike', 'ortler', 'diamant', 'mifa', 'kreidler', 'cowboy', 'vanmoof', 'tern', 'lapierre', 'raleigh', 'batavus', 'sparta', 'koga'];
for (const s of slugs) {
  const set = new Set();
  for (const y of [2026, 2027]) { const h = await get(`${ORIGIN}/marken/${s}/saison.${y}/`); if (h) links(h).forEach((l) => set.add(l)); await sleep(200); }
  const eb = new Set();
  for (const c of CATS) { const h = await get(`${ORIGIN}/fahrraeder/e-bike/${c}/marke.${s}/`); if (h) links(h).forEach((l) => eb.add(l)); await sleep(200); }
  console.log(s.padEnd(20), 'season pages', String(set.size).padStart(3), '| e-bike category pages', String(eb.size).padStart(3));
}

// Counts dealer model pages whose address starts with the brand name (filters out unfiltered listings).
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const ORIGIN = 'https://www.fahrrad-xxl.de';
const H = { 'user-agent': UA, 'accept-language': 'de-DE,de;q=0.9' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (u) => { try { const r = await fetch(u, { headers: H, signal: AbortSignal.timeout(30000) }); return r.ok ? (await r.text()).replace(/\\\//g, '/') : null; } catch { return null; } };
const links = (h) => [...new Set([...h.matchAll(/\/([a-z0-9-]+-m0\d{5,})/g)].map((m) => m[1]))];
const CATS = ['e-bike-trekking', 'e-bike-city', 'e-bike-mtb', 'e-bike-lastenrad', 'e-bike-speed-pedelec'];
for (const s of process.argv.slice(2)) {
  const all = new Set();
  for (const y of [2026, 2027]) { const h = await get(`${ORIGIN}/marken/${s}/saison.${y}/`); if (h) links(h).forEach((l) => all.add(l)); await sleep(200); }
  for (const c of CATS) { const h = await get(`${ORIGIN}/fahrraeder/e-bike/${c}/marke.${s}/`); if (h) links(h).forEach((l) => all.add(l)); await sleep(200); }
  const own = [...all].filter((l) => l.startsWith(s.replace('-', '')) || l.startsWith(s));
  console.log(s.padEnd(18), 'all', String(all.size).padStart(3), '| own-brand model pages', String(own.length).padStart(3), own.slice(0, 2).join(' , '));
}

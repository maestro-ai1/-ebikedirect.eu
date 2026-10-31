// Generates one unique 1200x675 SVG cover per blog post from its slug (Electric Kinetic palette).
import fs from 'node:fs';
import path from 'node:path';
const dir = 'content/blog/de';
const out = 'public/blog/covers';
fs.mkdirSync(out, { recursive: true });
const PAL = [['#FF5722', '#131A22', '#00C853'], ['#131A22', '#FF5722', '#F8F9FA'], ['#00C853', '#131A22', '#FFF1EC'], ['#1D2633', '#FF5722', '#00C853']];
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rnd(seed) { let t = seed; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
let n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  const slug = (raw.match(/^slug:\s*(.+)$/m) || [])[1]?.trim() || f.replace(/^\d+-/, '').replace(/\.md$/, '');
  const r = rnd(hash(slug));
  const [bg, a, b] = PAL[Math.floor(r() * PAL.length)];
  const shapes = [];
  const cx = 180 + r() * 840, cy = 120 + r() * 440, R1 = 150 + r() * 120;
  shapes.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${R1.toFixed(0)}" fill="${a}" opacity="0.92"/>`);
  shapes.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(R1 * 0.62).toFixed(0)}" fill="none" stroke="${b}" stroke-width="14"/>`);
  for (let i = 0; i < 4; i++) {
    const x = r() * 1200, y = r() * 675, w = 120 + r() * 380, h = 10 + r() * 24, rot = (r() - 0.5) * 50;
    shapes.push(`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${i % 2 ? b : a}" opacity="0.8" transform="rotate(${rot.toFixed(1)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`);
  }
  const tx = 740 + r() * 300;
  shapes.push(`<polygon points="${tx.toFixed(0)},675 ${(tx + 160).toFixed(0)},675 ${(tx + 330).toFixed(0)},430 ${(tx + 170).toFixed(0)},430" fill="${b}" opacity="0.85"/>`);
  fs.writeFileSync(path.join(out, `${slug}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img"><rect width="1200" height="675" fill="${bg}"/>${shapes.join('')}</svg>\n`);
  n++;
}
console.log('covers written:', n);

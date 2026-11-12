import { createHash } from 'node:crypto';
import { PRODUCTS } from '@/lib/products';
import { MAPPED_PAGES, brandSlug } from '@/lib/mapped-pages';
import { getAllPosts } from '@/lib/blog-content';
import { SITE_URL } from '@/lib/seo';
import type { Product } from '@/lib/types';

// Agent-ready layer (WebForge): every URL listed here is served by this site. Nothing is advertised that does not resolve,
// and agents can read the catalogue but never pay (orders are placed by people on the checkout page).
export const SITE = SITE_URL;
export const SITE_NAME = 'ebikedirect.eu';
export const TAGLINE = 'E-Bikes, Pedelecs, Cargo-Bikes und Zubehör für Deutschland und Europa';

const eur = (n: number) => `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n)} €`;
const bikes = () => PRODUCTS.filter((p) => p.category !== 'Zubehör');
const brandCount = () => new Set(bikes().map((p) => p.brand)).size;

export const CATEGORY_LINKS: { label: string; path: string; blurb: string }[] = [
  { label: 'Alle E-Bikes', path: '/e-bikes', blurb: 'alle lieferbaren E-Bikes' },
  { label: 'E-Mountainbikes', path: '/e-bikes/e-mountainbikes', blurb: 'Hardtail und Fully mit Mittelmotor' },
  { label: 'Trekking-E-Bikes', path: '/e-bikes/trekking-e-bikes', blurb: 'Tourenräder mit großem Akku' },
  { label: 'City-E-Bikes', path: '/e-bikes/city-e-bikes', blurb: 'Stadt- und Pendlerräder, Tiefeinsteiger' },
  { label: 'S-Pedelecs', path: '/e-bikes/s-pedelec', blurb: 'schnelle Pedelecs bis 45 km/h' },
  { label: 'Cargo-E-Bikes', path: '/e-bikes/cargo-bikes', blurb: 'Lastenräder für Familie und Gewerbe' },
  { label: 'Falt-E-Bikes', path: '/e-bikes/falt-e-bikes', blurb: 'kompakte Klapp-Pedelecs' },
  { label: 'E-Rennrad und Gravel', path: '/e-bikes/e-rennrad-gravel', blurb: 'sportliche E-Rennräder und E-Gravelbikes' },
  { label: 'Kinder- und Jugend-E-Bikes', path: '/e-bikes/kinder-jugend', blurb: 'E-Bikes für Kinder und Jugendliche' },
  { label: 'Zubehör', path: '/zubehoer', blurb: 'Helme, Schlösser, Taschen, Licht und mehr' }
];

export const productUrl = (p: Product) => `${SITE}/shop/${p.slug}`;
const absImage = (src?: string) => (src ? (src.startsWith('http') ? src : `${SITE}${src}`) : '');

export function productRecord(p: Product) {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    currency: 'EUR',
    inStock: p.inStock,
    url: productUrl(p),
    image: absImage(p.image),
    batteryWh: p.batteryStandardWh > 0 ? p.batteryStandardWh : null,
    torqueNm: p.torqueNm > 0 ? p.torqueNm : null,
    motor: p.motor || null
  };
}

/** llms.txt (llmstxt.org): H1, blockquote summary, then H2 sections of markdown links. */
export function llmsTxt(): string {
  const prices = PRODUCTS.map((p) => p.price).filter((n) => n > 0);
  const brandLinks = MAPPED_PAGES.filter((m) => m.type === 'brand' && m.brand).map((m) => `- [${m.brand}](${SITE}${m.path})`);
  const posts = getAllPosts().filter((p) => !p.legacy);
  return [
    `# ${SITE_NAME}`,
    '',
    `> ${TAGLINE}. Online-Shop mit ${bikes().length} E-Bikes von ${brandCount()} Marken und ${PRODUCTS.length - bikes().length} Zubehörartikeln, Preise in Euro inklusive 19 % MwSt., Lieferung per Spedition.`,
    '',
    'Mindestbestellwert 500 €, Speditionsversand kostenfrei ab 1.000 € Bestellwert, 2 Jahre Garantie, 30 Tage Rückgaberecht. Bestellungen werden von Menschen auf der Kasse-Seite aufgegeben; Agenten können den Katalog lesen, aber nicht bezahlen.',
    '',
    '## Sortiment',
    ...CATEGORY_LINKS.map((c) => `- [${c.label}](${SITE}${c.path}): ${c.blurb}`),
    `- [Gesamtes Sortiment filtern](${SITE}/shop): nach Kategorie, Marke und Preis (${eur(Math.min(...prices))} bis ${eur(Math.max(...prices))})`,
    '',
    '## Marken',
    ...brandLinks,
    '',
    '## Ratgeber und Hilfe',
    ...posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${p.description}`),
    `- [Häufige Fragen](${SITE}/faq)`,
    `- [Lieferbedingungen](${SITE}/policies/delivery)`,
    `- [Rückgabe und Garantie](${SITE}/policies/returns)`,
    `- [Kontakt](${SITE}/contact)`,
    '',
    '## Maschinenlesbar',
    `- [Produktkatalog als JSON](${SITE}/api/products): Filter category, brand, q, maxPrice, page, limit`,
    `- [Vollständige Produktliste](${SITE}/llms-full.txt)`,
    `- [Sitemap](${SITE}/sitemap.xml)`,
    '',
    '## Optional',
    `- [API-Katalog](${SITE}/.well-known/api-catalog)`,
    `- [Agent-Skills](${SITE}/.well-known/agent-skills/index.json)`,
    `- [OpenAPI-Beschreibung](${SITE}/api/openapi.json)`,
    ''
  ].join('\n');
}

export function llmsFullTxt(): string {
  const groups = new Map<string, Product[]>();
  PRODUCTS.forEach((p) => groups.set(p.category, [...(groups.get(p.category) || []), p]));
  const out = [`# ${SITE_NAME}: vollständige Produktliste`, '', `> ${PRODUCTS.length} Produkte, Preise in Euro inklusive 19 % MwSt., Stand: letzter Build. Details und Kasse auf jeder Produktseite.`, ''];
  for (const [label, list] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
    out.push(`## ${label}`, '');
    list.forEach((p) => out.push(`- [${p.name}](${productUrl(p)}): ${p.brand}, ${eur(p.price)}${p.inStock ? '' : ', nicht lieferbar'}`));
    out.push('');
  }
  out.push('## Ratgeber', '');
  getAllPosts().filter((p) => !p.legacy).forEach((p) => out.push(`- [${p.title}](${SITE}/blog/${p.slug}): ${p.description}`));
  out.push('');
  return out.join('\n');
}

/** ARD manifest (/.well-known/ai-catalog.json). */
export function aiCatalog() {
  return {
    specVersion: '1.0',
    host: { displayName: SITE_NAME, url: SITE, description: `${TAGLINE}. Preise in Euro, Lieferung per Spedition.` },
    entries: [
      { id: 'urn:air:ebikedirect.eu:api:products', displayName: 'Produktkatalog (JSON)', type: 'application/json', url: `${SITE}/api/products`, representativeQueries: ['E-Mountainbike Bosch kaufen', 'Cargo E-Bike unter 6000 Euro', 'Trekking E-Bike mit 800 Wh Akku'] },
      { id: 'urn:air:ebikedirect.eu:api:openapi', displayName: 'OpenAPI-Beschreibung des Katalogs', type: 'application/json', url: `${SITE}/api/openapi.json`, representativeQueries: ['wie filtere ich E-Bikes nach Preis und Marke'] },
      { id: 'urn:air:ebikedirect.eu:docs:llms', displayName: 'Shop-Übersicht für Sprachmodelle (llms.txt)', type: 'text/plain', url: `${SITE}/llms.txt`, representativeQueries: ['E-Bike Kaufberatung', 'S-Pedelec Führerschein und Kennzeichen'] }
    ]
  };
}

export interface AgentSkill { name: string; type: string; description: string; body: string }

export const AGENT_SKILLS: AgentSkill[] = [
  {
    name: 'browse-catalog',
    type: 'navigation',
    description: 'Produkte als JSON auflisten und filtern (Kategorie, Marke, Suchtext, Höchstpreis).',
    body: `---\nname: browse-catalog\ndescription: Find e-bikes and accessories on ${SITE_NAME}\n---\n\n# Browse the catalogue\n\nGET ${SITE}/api/products\n\nQuery parameters: category (E-MTB, E-Trekking, E-City, Speed-Pedelec, Cargo-E-Bike, Falt-E-Bike, E-Gravel, E-Kinder, Zubehör), brand, q, maxPrice, page, limit (1 to 100).\n\nEvery record has name, brand, price in EUR (VAT included), stock flag, product URL and image URL. Read-only: orders are placed by people on ${SITE}/checkout.\n`
  },
  {
    name: 'read-guides',
    type: 'content',
    description: 'Ratgeber zu S-Pedelec-Recht, Fully, Gravel, Fahrradträger und leichten E-Bikes.',
    body: `---\nname: read-guides\ndescription: Read buying guides on ${SITE_NAME}\n---\n\n# Guides\n\n${getAllPosts().filter((p) => !p.legacy).map((p) => `- ${SITE}/blog/${p.slug}: ${p.title}`).join('\n')}\n`
  },
  {
    name: 'check-policies',
    type: 'support',
    description: 'Lieferung, Rückgabe, Garantie und Kontakt.',
    body: `---\nname: check-policies\ndescription: Delivery, returns, warranty and contact on ${SITE_NAME}\n---\n\n# Policies\n\n- Delivery: ${SITE}/policies/delivery\n- Returns and warranty: ${SITE}/policies/returns\n- Contact: ${SITE}/contact\n\nA person completes every order and payment on ${SITE}/checkout.\n`
  }
];

export const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

export function agentSkillsIndex() {
  return {
    $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
    name: SITE_NAME,
    url: SITE,
    description: TAGLINE,
    skills: AGENT_SKILLS.map((s) => ({ name: s.name, type: s.type, description: s.description, url: `${SITE}/.well-known/agent-skills/${s.name}/SKILL.md`, sha256: sha256(s.body) }))
  };
}

export function apiCatalog() {
  return {
    linkset: [
      { anchor: `${SITE}/api/products`, 'service-desc': [{ href: `${SITE}/api/openapi.json`, type: 'application/openapi+json' }], 'service-doc': [{ href: `${SITE}/llms.txt`, type: 'text/plain' }], title: `${SITE_NAME} Produktkatalog (nur lesen)` },
      { anchor: `${SITE}/shop`, type: 'text/html', title: `${SITE_NAME} Sortiment` },
      { anchor: `${SITE}/contact`, type: 'text/html', title: `${SITE_NAME} Kontakt` }
    ]
  };
}

export function openApi() {
  return {
    openapi: '3.1.0',
    info: { title: `${SITE_NAME} catalogue`, version: '1.0.0', description: 'Read-only product catalogue. Prices are in EUR including 19 % VAT.' },
    servers: [{ url: SITE }],
    paths: {
      '/api/products': {
        get: {
          operationId: 'listProducts',
          summary: 'List products',
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'brand', in: 'query', schema: { type: 'string' } },
            { name: 'q', in: 'query', schema: { type: 'string' } },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } }
          ],
          responses: { '200': { description: 'A page of products', content: { 'application/json': { schema: { type: 'object' } } } } }
        }
      }
    }
  };
}

export { brandSlug };

import fs from 'node:fs';
import path from 'node:path';
import { BLOG_POSTS } from '@/lib/blog';

export interface PostFaq {
  question: string;
  answer: string;
}

export interface Post {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  primary: string;
  volume: number;
  kd: number | null;
  category: string;
  date: string; // ISO
  updated: string; // ISO
  readTime: string;
  cover: string;
  body: string;
  faqs: PostFaq[];
  words: number;
  legacy: boolean;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog', 'de');

const GERMAN_MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

export function formatDateDe(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${GERMAN_MONTHS[m - 1]} ${y}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Cuts a long legacy title at a colon, dash or word boundary so it fits 60 characters. */
export function shortenTitle(title: string): string {
  if (title.length <= 60) return title;
  const head = title.split(/[:|–—]/)[0].trim();
  if (head.length >= 20 && head.length <= 60) return head;
  return title.slice(0, 60).replace(/\s+\S*$/, '');
}

export function countWords(text: string): number {
  return text.replace(/[#|*_>\-\[\]()`]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function parseFile(file: string): Post {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Blog file without frontmatter: ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = m[2].trim();
  const slug = meta.slug || file.replace(/^\d+-/, '').replace(/\.md$/, '');
  const words = countWords(body);
  return {
    slug,
    title: meta.title,
    seoTitle: meta.seoTitle || meta.title,
    description: meta.description,
    primary: meta.primary,
    volume: Number(meta.volume) || 0,
    kd: meta.kd ? Number(meta.kd) : null,
    category: meta.category || 'Ratgeber',
    date: meta.date,
    updated: meta.updated || meta.date,
    readTime: `${Math.max(1, Math.round(words / 220))} Min. Lesezeit`,
    cover: meta.cover || `/blog/covers/${slug}.webp`,
    body,
    faqs: extractFaqs(body),
    words,
    legacy: false,
  };
}

/** Questions are "### " headings inside the section whose H2 contains FAQ or "Häufige Fragen". */
export function extractFaqs(body: string): PostFaq[] {
  const lines = body.split('\n');
  const faqs: PostFaq[] = [];
  let inFaq = false;
  let q: string | null = null;
  let a: string[] = [];
  const flush = () => {
    if (q) faqs.push({ question: q, answer: a.join(' ').replace(/\s+/g, ' ').trim() });
    q = null;
    a = [];
  };
  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      inFaq = /faq|häufige fragen/i.test(line);
      continue;
    }
    if (!inFaq) continue;
    if (line.startsWith('### ')) {
      flush();
      q = line.replace(/^###\s+/, '').trim();
    } else if (q && line.trim()) {
      a.push(line.trim());
    }
  }
  flush();
  return faqs;
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  const files = fs.existsSync(CONTENT_DIR) ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).sort() : [];
  const fresh = files.map(parseFile);

  const legacy: Post[] = BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    seoTitle: shortenTitle(p.title),
    description: p.excerpt,
    primary: '',
    volume: 0,
    kd: null,
    category: p.category,
    date: '2026-10-24',
    updated: '2026-10-24',
    readTime: p.readTime,
    cover: p.image,
    body: p.content,
    faqs: [],
    words: countWords(p.content),
    legacy: true,
  }));

  const known = new Set([...fresh.map((p) => p.slug), ...legacy.map((p) => p.slug)]);
  // links to posts that do not exist yet are shown as plain text instead of dead links
  for (const p of fresh) {
    p.body = p.body.replace(/\[([^\]]+)\]\(\/blog\/([a-z0-9-]+)\)/g, (m, label, slug) => (slug === 'page' || known.has(slug) ? m : label));
  }
  cache = [...fresh.sort((a, b) => b.volume - a.volume), ...legacy];
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const all = getAllPosts().filter((p) => p.slug !== slug && !p.legacy);
  const self = getPost(slug);
  const same = all.filter((p) => self && p.category === self.category);
  return [...same, ...all.filter((p) => !same.includes(p))].slice(0, limit);
}

export const POSTS_PER_PAGE = 12;

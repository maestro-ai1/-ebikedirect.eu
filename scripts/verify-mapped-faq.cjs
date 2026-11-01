// Checks that every built category, brand, motor-maker and accessory page shows its FAQ keywords as FAQ questions, with FAQ markup, and that the home page has its FAQ.
const base = process.argv[2] || 'http://localhost:3100';
const de = require('../data/keywords/de.json').pages;
const pages = Array.isArray(de) ? de : Object.values(de);
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => dec(h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim().toLowerCase();
(async () => {
  let built = 0, withFaq = 0, kwTotal = 0, kwShown = 0, noFaq = [], missing = [], questions = 0;
  for (const p of pages) {
    if (p.type === 'home') continue;
    const r = await fetch(base + p.url.replace(/\/$/, ''));
    if (r.status !== 200) continue; // page not built (no stock)
    built++;
    const h = await r.text();
    const t = text(h);
    const hasFaq = h.includes('FAQPage') && /Häufige Fragen/.test(h);
    const items = (h.match(/<summary/g) || []).length;
    if (!hasFaq) { noFaq.push(`${p.url} (${p.type})`); continue; }
    withFaq++; questions += items;
    for (const k of (p.faq || []).slice(0, 5)) { kwTotal++; if (t.includes(k.keyword.toLowerCase() + ':')) kwShown++; else missing.push(`${p.url}: ${k.keyword}`); }
  }
  const home = await (await fetch(base + '/')).text();
  const homeItems = (home.match(/<summary/g) || []).length;
  console.log(JSON.stringify({ pagesBuilt: built, withFaqSection: withFaq, faqQuestionsShown: questions, faqKeywordsMapped: kwTotal, faqKeywordsShownInQuestions: kwShown, homeFaqQuestions: homeItems, homeFaqMarkup: home.includes('FAQPage') }, null, 1));
  console.log('pages without a FAQ section:', noFaq.length, noFaq.slice(0, 12).join(' | '));
  console.log('FAQ keywords not shown:', missing.length, missing.slice(0, 10).join(' | '));
})();

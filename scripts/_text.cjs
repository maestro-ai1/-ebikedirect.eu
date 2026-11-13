const https = require(process.argv[2].startsWith('https') ? 'https' : 'http');
const u = process.argv[2];
https.get(u, { headers: { 'user-agent': 'Mozilla/5.0' } }, (r) => { let s = ''; r.on('data', (d) => s += d).on('end', () => {
  const t = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<(\/?)(p|h[1-6]|li|div|section|tr|br)[^>]*>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n');
  console.log(t);
}); });

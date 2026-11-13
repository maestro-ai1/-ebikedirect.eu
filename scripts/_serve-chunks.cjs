// Serves keyword chunks to the Semrush tab (GET /chunk?f=<file>&i=<n>) so long keyword lists never pass through the chat.
const http = require('http'); const fs = require('fs');
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Private-Network': 'true', 'Content-Type': 'application/json' };
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') { res.writeHead(204, { ...cors, 'Access-Control-Allow-Headers': '*' }); return res.end(); }
  try { const d = JSON.parse(fs.readFileSync('.image-work/' + (u.searchParams.get('f') || 'en-cands-pages') + '.json', 'utf8')); const c = d.chunks[+u.searchParams.get('i') || 0] || []; res.writeHead(200, cors); res.end(JSON.stringify(c)); }
  catch (e) { res.writeHead(500, cors); res.end(String(e)); }
}).listen(8791, '127.0.0.1');

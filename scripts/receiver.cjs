// Tiny local receiver: the browser pane sends scraped product data here.
//  POST /<name>            body saved to .image-work/<name>.json
//  GET  /item?f=<name>&d=<json>   one line appended to .image-work/<name>.ndjson (works as an image request when a page blocks fetch)
// usage: node scripts/receiver.cjs   (listens on 127.0.0.1:3199, CORS open)
const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', '.image-work');
const px = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const u = new URL(req.url, 'http://x');
  if (req.method === 'GET' && u.pathname === '/item') {
    const f = (u.searchParams.get('f') || 'x').replace(/[^a-z0-9_-]/gi, '');
    const d = u.searchParams.get('d') || '';
    fs.appendFileSync(path.join(dir, f + '.ndjson'), d.replace(/\r?\n/g, ' ') + '\n');
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    return res.end(px);
  }
  if (req.method === 'GET' && u.pathname === '/collect') {
    const f = (u.searchParams.get('f') || 'x').replace(/[^a-z0-9_-]/gi, '');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end('<body><script>fetch("/' + f + '",{method:"POST",body:window.name}).then(function(r){return r.text()}).then(function(t){document.body.textContent="saved "+t+" chars="+window.name.length})</script>');
  }
  const name = u.pathname.replace(/[^a-z0-9_-]/gi, '') || 'x';
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    try { fs.writeFileSync(path.join(dir, name + '.json'), body); res.writeHead(200); res.end('ok ' + body.length); }
    catch (e) { res.writeHead(500); res.end(String(e)); }
  });
}).listen(3199, '127.0.0.1', () => console.log('receiver on 3199'));

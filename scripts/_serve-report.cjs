// serves one folder on 127.0.0.1:8099 (static, for viewing reports in the browser pane)
const http = require('http'), fs = require('fs'), path = require('path');
const dir = process.argv[2];
http.createServer((req, res) => {
  const f = path.join(dir, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('not found'); } res.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain' }); res.end(d); });
}).listen(8099, '127.0.0.1');

const http = require('http');
const fs = require('fs');
const path = require('path');
const outDir = process.argv[2];
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Private-Network': 'true',
};
http.createServer((req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  const u = new URL(req.url, 'http://x');
  const name = (u.searchParams.get('name') || 'x.csv').replace(/[^a-zA-Z0-9._äöüÄÖÜß-]/g, '_');
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    fs.writeFileSync(path.join(outDir, name), body, 'utf8');
    res.writeHead(200, cors);
    res.end('ok ' + body.split('\n').length);
  });
}).listen(8790, '127.0.0.1');

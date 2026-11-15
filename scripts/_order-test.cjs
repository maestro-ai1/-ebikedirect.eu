// Local order test without touching real mail: a fake SMTP sink (port 2525) and a fake Upstash counter (port 2526),
// the shop started on port 3101 with those settings, one order posted, mails and number printed. usage: node scripts/_order-test.cjs
const net = require('net'), http = require('http'), { spawn } = require('child_process');
const mails = [];
net.createServer((s) => {
  let data = '', inData = false, cur = '';
  s.write('220 sink ESMTP\r\n');
  s.on('data', (b) => {
    const t = b.toString();
    if (inData) { cur += t; if (/\r\n\.\r\n$/.test(cur)) { mails.push(cur); inData = false; cur = ''; s.write('250 ok\r\n'); } return; }
    for (const line of t.split('\r\n').filter(Boolean)) {
      const u = line.toUpperCase();
      if (u.startsWith('EHLO') || u.startsWith('HELO')) s.write('250-sink\r\n250 AUTH PLAIN LOGIN\r\n');
      else if (u.startsWith('AUTH')) s.write('235 ok\r\n');
      else if (u.startsWith('DATA')) { inData = true; s.write('354 go\r\n'); }
      else if (u.startsWith('QUIT')) { s.write('221 bye\r\n'); s.end(); }
      else s.write('250 ok\r\n');
    }
  });
}).listen(2525, '127.0.0.1');
let counter = 41;
http.createServer((req, res) => { counter++; res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ result: counter })); }).listen(2526, '127.0.0.1');
const env = { ...process.env, PORT: '3101', EMAIL_SERVER_HOST: '127.0.0.1', EMAIL_SERVER_PORT: '2525', EMAIL_SERVER_SECURE: 'false', EMAIL_SERVER_USER: 'sales@example.test', EMAIL_SERVER_PASSWORD: 'x', EMAIL_FROM: 'shop <sales@example.test>', ORDER_TO_EMAIL: 'sales@example.test', UPSTASH_REDIS_REST_URL: 'http://127.0.0.1:2526', UPSTASH_REDIS_REST_TOKEN: 't', NODE_TLS_REJECT_UNAUTHORIZED: '0' };
const srv = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'start', '-p', '3101'], { env, shell: true });
setTimeout(async () => {
  try {
    const slug = Object.keys(require('../data/keywords/en-products.json').products)[0];
    for (const lg of ['de', 'fr', 'nl', 'it', 'es', 'pt', 'en', 'xx']) {
      const body = { locale: lg, customer: { firstName: 'Test', lastName: 'Kunde', email: 'kunde@example.test', phone: '+49 000', street: 'Teststr.', houseNumber: '1', zip: '10115', city: 'Berlin', country: 'Frankreich' }, payment: 'bank', items: [{ slug, quantity: 1 }] };
      const r = await fetch('http://127.0.0.1:3101/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      console.log(lg, r.status, await r.text());
    }
    const bad = await fetch('http://127.0.0.1:3101/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: 'it', customer: {}, payment: 'bank', items: [] }) });
    console.log('error it:', await bad.text());
    await new Promise((x) => setTimeout(x, 1500));
    console.log('mails received', mails.length);
    for (const m of mails) console.log(m.split('\r\n').filter((l) => /^(To|Subject):/.test(l)).join(' | '));
  } catch (e) { console.log('error', e.message); }
  srv.kill(); process.exit(0);
}, 12000);

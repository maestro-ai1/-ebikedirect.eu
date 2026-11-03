#!/bin/bash
cd "/c/electric bikes europe/ebikedirect-site"
rm -f .image-work/a-done.txt
node ../02-site-architecture/classify-round1.cjs > .image-work/classify.txt 2>&1
npm run build > .image-work/build.log 2>&1
echo "BUILD-ERRORS: $(grep -ciE 'failed|error' .image-work/build.log)" > .image-work/verify-status.txt
grep "Generating static pages" .image-work/build.log | tail -1 >> .image-work/verify-status.txt
npx next start -p 3100 > .image-work/start.log 2>&1 &
sleep 10
B=http://localhost:3100
node scripts/_scan.mjs > .image-work/scan12.txt 2>&1
node .image-work/webforge-audit-local.mjs $B > .image-work/a1.txt 2>&1
node scripts/live-audit.mjs $B > .image-work/a2.txt 2>&1
node scripts/link-audit.mjs $B > .image-work/a3.txt 2>&1
node scripts/verify-product-keywords.cjs > .image-work/a4.txt 2>&1
node scripts/verify-family-pages.cjs > .image-work/a5.txt 2>&1
node scripts/verify-mapped-faq.cjs > .image-work/a6.txt 2>&1
node scripts/image-audit.mjs > .image-work/a7.txt 2>&1
echo done > .image-work/a-done.txt

#!/bin/bash
cd "/c/electric bikes europe/ebikedirect-site"
S="../02-site-architecture"
rm -f .image-work/chain-done.txt
# remember the intent split of the main keywords before the remap
node scripts/_intent-check.cjs > .image-work/intent-before.txt 2>&1
{
node scripts/dump-products.cjs | tail -1
cp .image-work/wire-backup/de.json.before-wire data/keywords/de.json
echo "--- map_products"; node $S/map_products.js | tail -2
rm -f .image-work/wire-backup/products.json.before-wire
echo "--- v2 (1)"; node $S/map_products_v2.js | tail -5
echo "--- topup"; node $S/map_brand_hubs_topup.js | tail -3
echo "--- v2 (2)"; node $S/map_products_v2.js | tail -5
echo "--- wire-keywords"; node scripts/wire-keywords.cjs | tail -4
echo "--- families"; node $S/map_families.js | tail -2
node scripts/wire-families.cjs | tail -2
echo "--- keyword-check"; node scripts/keyword-check.cjs | tail -8
echo "--- tsc"; npx tsc --noEmit 2>&1 | tail -5; echo "tsc exit done"
} > .image-work/chain12.log 2>&1
node scripts/_moto-check.cjs > .image-work/moto12.txt 2>&1
node scripts/_numcheck.cjs > .image-work/num12.txt 2>&1
node scripts/_fit-check.cjs > .image-work/fit12.txt 2>&1
node scripts/_tier3-list.cjs > .image-work/tier3-list.txt 2>&1
node scripts/_gender-check.cjs > .image-work/gender12.txt 2>&1
node scripts/_intent-check.cjs > .image-work/intent-after.txt 2>&1
echo done > .image-work/chain-done.txt

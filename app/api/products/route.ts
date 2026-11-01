import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products';
import { productRecord } from '@/lib/agent-ready';

// Read-only catalogue for agents and tools. Filters: category, brand, q, maxPrice, page, limit. No writes, no payments.
export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const u = new URL(req.url).searchParams;
  const category = u.get('category')?.toLowerCase();
  const brand = u.get('brand')?.toLowerCase();
  const q = u.get('q')?.toLowerCase();
  const maxPrice = Number(u.get('maxPrice')) || 0;
  const page = Math.max(1, Math.floor(Number(u.get('page')) || 1));
  const limit = Math.min(100, Math.max(1, Math.floor(Number(u.get('limit')) || 24)));
  let list = PRODUCTS.filter((p) => (!category || p.category.toLowerCase() === category) && (!brand || p.brand.toLowerCase() === brand) && (!q || `${p.name} ${p.brand}`.toLowerCase().includes(q)) && (!maxPrice || p.price <= maxPrice));
  const total = list.length;
  list = list.slice((page - 1) * limit, page * limit);
  return NextResponse.json({ total, page, limit, products: list.map(productRecord) }, { headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=900' } });
}

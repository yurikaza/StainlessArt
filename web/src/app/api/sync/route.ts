import { NextRequest, NextResponse } from 'next/server';
import { pushPriceInventory } from '@/lib/trendyol';
import { toMarketplacePayload } from '@/lib/priceDecoupling';
import type { StorefrontProduct } from '@/types/trendyol';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: StorefrontProduct[] = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array required' }, { status: 400 });
    }

    if (items.length > 1000) {
      return NextResponse.json({ error: 'Max 1000 items per batch' }, { status: 400 });
    }

    const payload = items.map(toMarketplacePayload);
    const result = await pushPriceInventory(payload);

    return NextResponse.json({ batchRequestId: result.batchRequestId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

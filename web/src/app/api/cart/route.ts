import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/trendyol';
import { applyStorefrontPrice } from '@/lib/priceDecoupling';

interface CartValidationItem {
  productId: number;
  barcode: string;
  quantity: number;
}

// POST — validate cart at checkout initiation, return authoritative server-side prices
export async function POST(request: NextRequest) {
  let body: { items: CartValidationItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body?.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'items array required' }, { status: 400 });
  }

  try {
    const { content } = await fetchProducts(0, 200);
    const barcodeSet = new Set(body.items.map((i) => i.barcode));
    const productMap = new Map(
      content.filter((p) => barcodeSet.has(p.barcode)).map((p) => [p.barcode, p])
    );

    const validated = body.items.map((item) => {
      const product = productMap.get(item.barcode);
      if (!product) {
        return { ...item, valid: false, error: 'Product not found' };
      }
      if (product.quantity < 1) {
        return { ...item, valid: false, error: 'Out of stock' };
      }
      const clampedQty = Math.min(item.quantity, product.quantity);
      return {
        barcode: item.barcode,
        productId: item.productId,
        quantity: clampedQty,
        storefrontPrice: applyStorefrontPrice(product.salePrice),
        marketSalePrice: product.salePrice,
        title: product.title,
        imageUrl: product.images[0]?.url ?? '',
        valid: true,
      };
    });

    const subtotal = validated
      .filter((v) => v.valid)
      .reduce((sum, v) => sum + (v.storefrontPrice ?? 0) * v.quantity, 0);

    return NextResponse.json({ items: validated, subtotal });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET — check stock availability for a list of barcodes
export async function GET(request: NextRequest) {
  const barcodes = request.nextUrl.searchParams.get('barcodes');
  if (!barcodes) {
    return NextResponse.json({ error: 'barcodes query param required' }, { status: 400 });
  }

  const barcodeList = barcodes.split(',').filter(Boolean);
  try {
    const { content } = await fetchProducts(0, 200);
    const availability = Object.fromEntries(
      barcodeList.map((barcode) => {
        const product = content.find((p) => p.barcode === barcode);
        return [barcode, product ? product.quantity > 0 : false];
      })
    );
    return NextResponse.json({ availability });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

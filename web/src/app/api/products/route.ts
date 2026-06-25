import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/trendyol';
import { applyStorefrontPrice } from '@/lib/priceDecoupling';
import type { StorefrontProduct } from '@/types/trendyol';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '0', 10);
  const size = parseInt(searchParams.get('size') ?? '50', 10);

  try {
    const data = await fetchProducts(page, size);

    const products: StorefrontProduct[] = data.content.map((p) => ({
      id: p.id,
      barcode: p.barcode,
      title: p.title,
      brandName: p.brandName,
      categoryName: p.categoryName,
      quantity: p.quantity,
      stockCode: p.stockCode,
      description: p.description,
      currencyType: p.currencyType,
      marketListPrice: p.listPrice,
      marketSalePrice: p.salePrice,
      storefrontPrice: applyStorefrontPrice(p.salePrice),
      vatRate: p.vatRate,
      images: p.images,
    }));

    return NextResponse.json({
      products,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      page: data.page,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

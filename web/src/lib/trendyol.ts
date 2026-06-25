import type {
  TrendyolProductsResponse,
  TrendyolPriceItem,
  TrendyolBatchResponse,
  TrendyolBatchResult,
} from '@/types/trendyol';
import { MOCK_PRODUCTS } from './mock-products';

const BASE_URL = 'https://api.trendyol.com/sapigw';

function buildAuthHeader(): Record<string, string> | null {
  const key = process.env.TRENDYOL_API_KEY;
  const secret = process.env.TRENDYOL_SECRET;
  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;

  if (!key || !secret || !supplierId) return null;

  const encoded = Buffer.from(`${key}:${secret}`).toString('base64');

  return {
    Authorization: `Basic ${encoded}`,
    'User-Agent': `${supplierId} - SelfIntegration`,
    'Content-Type': 'application/json',
  };
}

function mockProductsResponse(page: number, size: number): TrendyolProductsResponse {
  const start = page * size;
  return {
    content: MOCK_PRODUCTS.slice(start, start + size),
    totalElements: MOCK_PRODUCTS.length,
    totalPages: Math.ceil(MOCK_PRODUCTS.length / size),
    page,
    size,
  };
}

export async function fetchProducts(
  page = 0,
  size = 50
): Promise<TrendyolProductsResponse> {
  try {
    const headers = buildAuthHeader();
    if (!headers) {
      console.warn('[Trendyol] Missing credentials — using mock data');
      return mockProductsResponse(page, size);
    }

    const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
    const url = `${BASE_URL}/suppliers/${supplierId}/products?page=${page}&size=${size}`;

    const res = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn(`[Trendyol] fetchProducts ${res.status} — using mock data`);
      return mockProductsResponse(page, size);
    }

    return res.json();
  } catch (err) {
    console.warn('[Trendyol] fetchProducts error — using mock data:', err);
    return mockProductsResponse(page, size);
  }
}

export async function pushPriceInventory(
  items: TrendyolPriceItem[]
): Promise<TrendyolBatchResponse> {
  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  const url = `${BASE_URL}/suppliers/${supplierId}/products/price-and-inventory`;

  // API accepts max 1000 SKUs per call
  if (items.length > 1000) {
    throw new Error('pushPriceInventory: batch size must be ≤ 1000 SKUs');
  }

  const headers = buildAuthHeader();
  if (!headers) throw new Error('Missing Trendyol credentials');

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    throw new Error(`Trendyol pushPriceInventory failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function pollBatchResult(
  batchRequestId: string,
  maxAttempts = 3
): Promise<TrendyolBatchResult> {
  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  const url = `${BASE_URL}/suppliers/${supplierId}/products/batch-requests/${batchRequestId}`;
  // Decay delays: 1 min, 5 min, 15 min
  const delays = [60_000, 300_000, 900_000];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, delays[attempt] ?? delays[delays.length - 1]));

    const headers = buildAuthHeader();
    if (!headers) throw new Error('Missing Trendyol credentials');
    const res = await fetch(url, { headers });
    if (!res.ok) continue;

    const result: TrendyolBatchResult = await res.json();
    if (result.status !== 'IN_PROGRESS') return result;
  }

  throw new Error(`Trendyol batch ${batchRequestId} did not settle after ${maxAttempts} polls`);
}

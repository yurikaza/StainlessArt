import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.trendyol.com/sapigw';

function buildAuthHeader(): Record<string, string> {
  const key = process.env.TRENDYOL_API_KEY!;
  const secret = process.env.TRENDYOL_SECRET!;
  const supplierId = process.env.TRENDYOL_SUPPLIER_ID!;
  const encoded = Buffer.from(`${key}:${secret}`).toString('base64');
  return {
    Authorization: `Basic ${encoded}`,
    'User-Agent': `${supplierId} - SelfIntegration`,
  };
}

// GET — single-attempt batch status check (client polls on its own schedule)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ batchRequestId: string }> }
) {
  const { batchRequestId } = await params;
  const supplierId = process.env.TRENDYOL_SUPPLIER_ID;
  const url = `${BASE_URL}/suppliers/${supplierId}/products/batch-requests/${batchRequestId}`;

  try {
    const res = await fetch(url, { headers: buildAuthHeader() });
    if (!res.ok) {
      return NextResponse.json({ error: `Trendyol: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

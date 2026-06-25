import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require('iyzipay');

function getIyzipay() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY ?? '',
    secretKey: process.env.IYZICO_SECRET_KEY ?? '',
    uri: process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com',
  });
}

export async function POST(request: NextRequest) {
  let body: {
    conversationId: string;
    buyer: Record<string, string>;
    shippingAddress: Record<string, string>;
    billingAddress: Record<string, string>;
    basketItems: Array<{
      id: string;
      name: string;
      category1: string;
      itemType: string;
      price: string;
    }>;
    price: string;
    paidPrice: string;
    currency: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const iyzipay = getIyzipay();

  const checkoutFormRequest = {
    locale: 'tr',
    conversationId: body.conversationId,
    price: body.price,
    paidPrice: body.paidPrice,
    currency: body.currency ?? 'TRY',
    basketId: body.conversationId,
    paymentGroup: 'PRODUCT',
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/checkout/callback`,
    enabledInstallments: [2, 3, 6, 9],
    buyer: body.buyer,
    shippingAddress: body.shippingAddress,
    billingAddress: body.billingAddress,
    basketItems: body.basketItems,
  };

  return new Promise<NextResponse>((resolve) => {
    iyzipay.checkoutFormInitialize.create(
      checkoutFormRequest,
      (err: Error | null, result: Record<string, unknown>) => {
        if (err || result?.status === 'failure') {
          resolve(
            NextResponse.json(
              { error: result?.errorMessage ?? String(err) },
              { status: 500 }
            )
          );
          return;
        }
        resolve(NextResponse.json({ checkoutFormContent: result?.checkoutFormContent, token: result?.token }));
      }
    );
  });
}

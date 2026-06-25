import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

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
  const form = await request.formData();
  const token = form.get('token') as string;

  if (!token) {
    return NextResponse.redirect(new URL('/checkout?error=no_token', request.url));
  }

  const iyzipay = getIyzipay();

  return new Promise<NextResponse>((resolve) => {
    iyzipay.checkoutForm.retrieve(
      { locale: 'tr', token },
      (err: Error | null, result: Record<string, unknown>) => {
        if (err || result?.paymentStatus !== 'SUCCESS') {
          resolve(
            NextResponse.redirect(
              new URL(`/checkout?error=${encodeURIComponent(String(result?.errorMessage ?? 'payment_failed'))}`, request.url)
            )
          );
          return;
        }
        // Order confirmed — redirect to success page
        resolve(
          NextResponse.redirect(
            new URL(`/checkout/success?orderId=${result?.paymentId}`, request.url)
          )
        );
      }
    );
  });
}

// Iyzipay may also send GET for 3DS redirects
export async function GET(request: NextRequest) {
  redirect(`/checkout?error=invalid_callback`);
}

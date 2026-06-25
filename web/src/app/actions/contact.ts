'use server';

export async function sendContactMessage(formData: FormData): Promise<void> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const konu = formData.get('konu') as string;
  const mesaj = formData.get('mesaj') as string;

  if (!name || !email || !konu || !mesaj) {
    throw new Error('Tüm alanlar zorunludur.');
  }

  // Log to console — replace with email service (Resend, nodemailer) when ready
  console.log('[Contact Form Submission]', { name, email, konu, mesaj, timestamp: new Date().toISOString() });

  // TODO: integrate Resend or nodemailer
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'iletisim@stainlessart.com', to: 'info@stainlessart.com', ... });
}

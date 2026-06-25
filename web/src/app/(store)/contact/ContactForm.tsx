'use client';

import { useState } from 'react';
import { sendContactMessage } from '@/app/actions/contact';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const inputClass = `w-full bg-[var(--ink)] border border-[var(--steel-silver)]/20 text-[var(--paper)]
    text-sm py-3 px-4 body-intimate focus:border-[var(--accent-orange)] focus:outline-none transition-colors`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await sendContactMessage(data);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <div className="text-center">
          <p className="text-2xl font-bold text-[var(--paper)] mb-2">Mesajınız Alındı.</p>
          <p className="body-intimate text-[var(--steel-silver)]">En kısa sürede geri dönüş yapacağız.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] block mb-1">Ad Soyad</label>
        <input
          id="name" name="name" required className={inputClass}
          autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />
      </div>
      <div>
        <label htmlFor="email" className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] block mb-1">E-posta</label>
        <input
          id="email" name="email" type="email" required className={inputClass}
          autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />
      </div>
      <div>
        <label htmlFor="konu" className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] block mb-1">Konu</label>
        <input
          id="konu" name="konu" required className={inputClass}
          autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />
      </div>
      <div>
        <label htmlFor="mesaj" className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] block mb-1">Mesaj</label>
        <textarea
          id="mesaj" name="mesaj" required rows={5} className={`${inputClass} resize-none`}
          autoCorrect="off" spellCheck={false}
        />
      </div>
      {status === 'error' && (
        <p className="mono text-red-400 text-xs">Mesaj gönderilemedi. Lütfen tekrar deneyin.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 px-8 bg-[var(--accent-orange)] text-white text-xs font-bold tracking-widest uppercase
          hover:shadow-[0_0_24px_var(--accent-orange),0_0_48px_#a855f7]
          transition-shadow motion-reduce:transition-none
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Gönderiliyor...' : 'Gönder'}
      </button>
    </form>
  );
}

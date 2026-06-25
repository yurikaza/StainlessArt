import ContactForm from './ContactForm';

export const metadata = { title: 'İletişim — Stainless Art' };

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-3">İletişim</p>
      <h1 className="display-type text-5xl text-[var(--paper)] mb-16">Bize Ulaşın.</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <p className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-2">E-posta</p>
            <a href="mailto:info@stainlessart.com" className="text-lg font-semibold text-[var(--paper)] hover:text-[var(--accent-orange)] transition-colors">
              info@stainlessart.com
            </a>
          </div>
          <div>
            <p className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-2">Telefon</p>
            <a href="tel:+902121234567" className="text-lg font-semibold text-[var(--paper)] hover:text-[var(--accent-orange)] transition-colors">
              +90 212 123 45 67
            </a>
          </div>
          <div>
            <p className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-2">Çalışma Saatleri</p>
            <p className="body-intimate text-[var(--paper)]">Pzt – Cum: 09:00 – 18:00</p>
            <p className="body-intimate text-[var(--steel-silver)] text-sm">Cumartesi: 10:00 – 15:00</p>
          </div>
          <div>
            <p className="mono text-xs uppercase tracking-widest text-[var(--steel-silver)] mb-2">Adres</p>
            <p className="body-intimate text-[var(--paper)] leading-relaxed">
              Organize Sanayi Bölgesi<br />
              Kozyatağı Mah. Şehit Şakir Elkovan Cad.<br />
              No: 1, Kadıköy / İstanbul
            </p>
          </div>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}

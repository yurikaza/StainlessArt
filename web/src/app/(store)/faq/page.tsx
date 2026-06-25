export const metadata = { title: 'Sık Sorulan Sorular — Stainless Art' };

const faqs = {
  Kargo: [
    {
      q: 'Kargo süresi ne kadar?',
      a: 'Standart kargo 3–5 iş günü. Hızlı kargo seçeneğinde 1–2 iş günü içinde teslim.',
    },
    {
      q: 'Ücretsiz kargo var mı?',
      a: '500 TL üzeri siparişlerde kargo ücretsiz.',
    },
    {
      q: 'Yurt dışına gönderim yapıyor musunuz?',
      a: 'Evet. 23 ülkeye ihracat yapıyoruz. Uluslararası kargo süresi 7–14 iş günü.',
    },
  ],
  Ürünler: [
    {
      q: 'Ürünlerin hammadde kalitesi nedir?',
      a: 'Tüm ürünlerimiz AISI 304 ve AISI 316 paslanmaz çelik standardında üretilmektedir.',
    },
    {
      q: 'Toplu sipariş indirimi var mı?',
      a: '50 adet ve üzeri siparişlerde özel fiyat için iletişim formundan bize ulaşın.',
    },
    {
      q: 'Özel ölçüde ürün yaptırabilir miyim?',
      a: 'Evet. Kurumsal müşterilerimiz için özel ölçü ve baskı imkânı sunuyoruz.',
    },
  ],
  İade: [
    {
      q: 'İade süreci nasıl işliyor?',
      a: 'Teslimattan itibaren 14 gün içinde iade talebinde bulunabilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.',
    },
    {
      q: 'Hasarlı ürün teslim aldım, ne yapmalıyım?',
      a: 'Teslim sırasında hasar tespit edilirse kargo görevlisiyle tutanak tutun ve bize bildirin. 48 saat içinde yenisini göndeririz.',
    },
  ],
  Ödeme: [
    {
      q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      a: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. iyzico altyapısıyla güvenli ödeme.',
    },
    {
      q: 'Taksit imkânı var mı?',
      a: '2, 3, 6 ve 9 taksit seçenekleri mevcuttur (banka ve kartınıza göre değişir).',
    },
    {
      q: 'Faturamı nereden görebilirim?',
      a: 'Sipariş sonrası e-fatura otomatik olarak e-posta adresinize gönderilir.',
    },
  ],
};

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-3">Destek</p>
      <h1 className="display-type text-5xl text-[var(--paper)] mb-16">Sık Sorulan<br />Sorular.</h1>

      <div className="space-y-12">
        {Object.entries(faqs).map(([category, items]) => (
          <section key={category}>
            <h2 className="mono text-xs uppercase tracking-widest text-[var(--accent-orange)] mb-6">{category}</h2>
            <div className="space-y-2">
              {items.map(({ q, a }) => (
                <details
                  key={q}
                  className="group border border-[var(--steel-silver)]/10 bg-[var(--navy)] open:border-[var(--steel-silver)]/20"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none">
                    <span className="body-intimate text-[var(--paper)] text-sm">{q}</span>
                    <span
                      className="chevron mono text-[var(--steel-silver)] ml-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none group-open:rotate-180"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="body-intimate text-[var(--steel-silver)] text-sm leading-relaxed">{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 pt-12 border-t border-[var(--steel-silver)]/10 text-center">
        <p className="body-intimate text-[var(--steel-silver)] mb-4">Cevabını bulamadığınız bir soru mu var?</p>
        <a
          href="/contact"
          className="inline-block py-3 px-8 border border-[var(--accent-orange)] text-[var(--accent-orange)] mono text-xs uppercase tracking-widest
            hover:bg-[var(--accent-orange)] hover:text-white transition-colors"
        >
          Bize Yazın
        </a>
      </div>
    </div>
  );
}

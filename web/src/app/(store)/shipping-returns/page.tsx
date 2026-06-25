export const metadata = { title: 'Kargo & İade — Stainless Art' };

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-3">Destek</p>
      <h1 className="display-type text-5xl text-[var(--paper)] mb-16">Kargo & İade.</h1>

      <div className="space-y-16 body-intimate text-[var(--steel-silver)] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-[var(--paper)] mb-6">Teslimat Seçenekleri</h2>
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-[var(--steel-silver)]/20">
                <th className="mono text-xs uppercase tracking-widest text-left py-3 pr-4 text-[var(--steel-silver)]">Yöntem</th>
                <th className="mono text-xs uppercase tracking-widest text-left py-3 pr-4 text-[var(--steel-silver)]">Süre</th>
                <th className="mono text-xs uppercase tracking-widest text-left py-3 text-[var(--steel-silver)]">Ücret</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Standart Kargo', '3–5 İş Günü', '500 TL altı: 29,90 TL'],
                ['Hızlı Kargo', '1–2 İş Günü', '59,90 TL'],
                ['Ücretsiz Kargo', '3–5 İş Günü', '500 TL üzeri siparişlerde'],
                ['Uluslararası', '7–14 İş Günü', 'Hedefe göre değişir'],
              ].map(([method, time, price]) => (
                <tr key={method} className="border-b border-[var(--steel-silver)]/10">
                  <td className="py-3 pr-4 text-[var(--paper)]">{method}</td>
                  <td className="py-3 pr-4">{time}</td>
                  <td className="py-3">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Siparişler ödeme onayından sonra 1 iş günü içinde hazırlanır ve kargoya teslim edilir. Kargo takip numarası e-posta ile iletilir.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--paper)] mb-6">İade Politikası</h2>
          <p className="mb-4">Teslimattan itibaren <strong className="text-[var(--paper)]">14 gün</strong> içinde iade hakkınız mevcuttur.</p>
          <h3 className="mono text-xs uppercase tracking-widest text-[var(--paper)] mb-3">İade Koşulları</h3>
          <ul className="list-none space-y-2 mb-6">
            {[
              'Ürün kullanılmamış ve orijinal ambalajında olmalıdır.',
              'Fatura veya irsaliye iade paketine eklenmelidir.',
              'Özel sipariş ve ölçüye göre üretilen ürünler iade kapsamı dışındadır.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-[var(--accent-orange)] mt-0.5" aria-hidden="true">▸</span>
                {item}
              </li>
            ))}
          </ul>
          <h3 className="mono text-xs uppercase tracking-widest text-[var(--paper)] mb-3">İade Adımları</h3>
          <ol className="list-none space-y-3">
            {[
              'info@stainlessart.com adresine sipariş numaranızla iade talebini bildirin.',
              'İade kargo kodu e-posta ile gönderilir.',
              'Ürünü belirtilen kargoya teslim edin.',
              'İnceleme sonrası 5–7 iş günü içinde iade işlemi tamamlanır.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mono text-[var(--accent-orange)] text-sm font-bold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--paper)] mb-4">Hasarlı Ürün</h2>
          <p>Teslim sırasında hasar varsa kargo görevlisiyle birlikte tutanak tutun ve 48 saat içinde bize bildirin. Hasar fotoğrafıyla birlikte yeni ürün gönderilir.</p>
        </section>
      </div>
    </div>
  );
}

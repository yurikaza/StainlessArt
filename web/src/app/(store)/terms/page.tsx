export const metadata = { title: 'Kullanım Koşulları — Stainless Art' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-3">Yasal</p>
      <h1 className="display-type text-5xl text-[var(--paper)] mb-4">Kullanım Koşulları</h1>
      <p className="mono text-[var(--steel-silver)] text-xs mb-16">Son güncelleme: Haziran 2025</p>

      <div className="space-y-10 body-intimate text-[var(--steel-silver)] leading-relaxed text-sm">
        {[
          {
            title: '1. Kabulü Şartlar',
            content: 'Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız siteyi kullanmayı durdurunuz.',
          },
          {
            title: '2. Ürün ve Fiyatlandırma',
            content: 'Tüm ürün fiyatları KDV dahildir. Stainless Art, herhangi bir ürünün fiyatını önceden haber vermeksizin değiştirme hakkını saklı tutar. Stok tükenmesi veya teknik hatadan kaynaklanan fiyat farklılıklarında sipariş iptal edilebilir.',
          },
          {
            title: '3. Sipariş ve Sözleşme',
            content: 'Sipariş vererek alım teklifi sunmuş olursunuz. Sözleşme, sipariş onay e-postasının gönderilmesiyle kurulur. Stainless Art herhangi bir siparişi kabul etmeme hakkını saklı tutar.',
          },
          {
            title: '4. Fikri Mülkiyet',
            content: 'Bu sitedeki tüm içerik, logo, görsel ve metin Stainless Art\'a aittir. Önceden yazılı izin alınmaksızın kopyalanamaz, çoğaltılamaz veya dağıtılamaz.',
          },
          {
            title: '5. Sorumluluk Sınırlaması',
            content: 'Stainless Art, siteye erişim kesintileri, teknik hatalar veya kullanıcının sitedeki bilgilere dayanarak verdiği kararlardan doğan zararlardan sorumlu tutulamaz.',
          },
          {
            title: '6. Uygulanacak Hukuk',
            content: 'Bu koşullar Türk Hukuku\'na tabidir. Tüm uyuşmazlıklar İstanbul Mahkemelerinde çözüme kavuşturulur.',
          },
          {
            title: '7. Değişiklikler',
            content: 'Bu koşullar herhangi bir zamanda güncellenebilir. Güncel koşullar her zaman bu sayfada yayımlanır.',
          },
        ].map(({ title, content }) => (
          <section key={title}>
            <h2 className="text-base font-semibold text-[var(--paper)] mb-3">{title}</h2>
            <p>{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

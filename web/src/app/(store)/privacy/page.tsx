export const metadata = { title: 'Gizlilik Politikası — Stainless Art' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="mono text-[var(--accent-orange)] text-xs uppercase tracking-widest mb-3">Yasal</p>
      <h1 className="display-type text-5xl text-[var(--paper)] mb-4">Gizlilik Politikası</h1>
      <p className="mono text-[var(--steel-silver)] text-xs mb-16">Son güncelleme: Haziran 2025</p>

      <div className="space-y-10 body-intimate text-[var(--steel-silver)] leading-relaxed text-sm">
        {[
          {
            title: '1. Toplanan Veriler',
            content: 'Sitemizi ziyaret ettiğinizde ad, soyad, e-posta adresi, telefon numarası, teslimat ve fatura adresi gibi kişisel verilerinizi sipariş ve iletişim formları aracılığıyla toplarız. Ayrıca çerezler aracılığıyla teknik kullanım verileri (IP adresi, tarayıcı türü, ziyaret sayfaları) otomatik olarak kaydedilir.',
          },
          {
            title: '2. Verilerin Kullanımı',
            content: 'Toplanan veriler; sipariş işleme, kargo takibi, müşteri hizmetleri, yasal yükümlülüklerin yerine getirilmesi ve yalnızca açık izninizle pazarlama iletişimi amacıyla kullanılır. Verileriniz üçüncü şahıslarla satılmaz veya kiralanmaz.',
          },
          {
            title: '3. Veri Güvenliği',
            content: 'Tüm veri iletimi SSL/TLS şifrelemesiyle korunmaktadır. Ödeme bilgileri sunucularımızda saklanmaz; PCI DSS uyumlu iyzico altyapısıyla işlenir.',
          },
          {
            title: '4. Çerezler',
            content: 'Temel işlevsellik ve analitik için zorunlu ve analitik çerezler kullanılır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durum bazı site işlevlerini etkileyebilir.',
          },
          {
            title: '5. KVKK Haklarınız',
            content: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize erişim, düzeltme, silme, işlemenin kısıtlanması ve veri taşınabilirliği haklarına sahipsiniz. Talepleriniz için info@stainlessart.com adresine yazabilirsiniz.',
          },
          {
            title: '6. İletişim',
            content: 'Gizlilik politikamıza ilişkin sorularınız için: info@stainlessart.com',
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

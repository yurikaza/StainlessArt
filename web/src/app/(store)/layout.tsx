import SiteNav from '@/components/SiteNav';
import CartDrawer from '@/components/CartDrawer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <CartDrawer />
      <main className="pt-16 min-h-screen bg-[var(--ink)] text-[var(--paper)]">
        {children}
      </main>
      <footer className="border-t border-[var(--steel-silver)]/10 bg-[var(--ink)] px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-sm font-black tracking-[0.18em] uppercase text-[var(--paper)] mb-4">Stainless Art</p>
            <p className="body-intimate text-[var(--steel-silver)] text-sm">Endüstriyel kalite, modern tasarım.</p>
          </div>
          <div>
            <p className="mono text-[var(--steel-silver)] text-xs uppercase tracking-widest mb-4">Mağaza</p>
            <ul className="space-y-2">
              {[['/', 'Ana Sayfa'], ['/about', 'Hakkımızda'], ['/blog', 'Blog']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="body-intimate text-[var(--steel-silver)] text-sm hover:text-[var(--paper)] transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono text-[var(--steel-silver)] text-xs uppercase tracking-widest mb-4">Destek</p>
            <ul className="space-y-2">
              {[['/contact', 'İletişim'], ['/faq', 'SSS'], ['/shipping-returns', 'Kargo & İade']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="body-intimate text-[var(--steel-silver)] text-sm hover:text-[var(--paper)] transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono text-[var(--steel-silver)] text-xs uppercase tracking-widest mb-4">Yasal</p>
            <ul className="space-y-2">
              {[['/privacy', 'Gizlilik Politikası'], ['/terms', 'Kullanım Koşulları']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="body-intimate text-[var(--steel-silver)] text-sm hover:text-[var(--paper)] transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mono text-[var(--steel-silver)]/40 text-xs text-center mt-12">
          © {new Date().getFullYear()} Stainless Art. Tüm hakları saklıdır.
        </p>
      </footer>
    </>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';

type Step = 1 | 2 | 3;

interface ShippingData {
  ad: string;
  soyad: string;
  adres: string;
  sehir: string;
  postaKodu: string;
  telefon: string;
  email: string;
}

interface BillingData {
  tip: 'bireysel' | 'kurumsal';
  adSoyad: string;
  adres: string;
  sehir: string;
  postaKodu: string;
  vergiDairesi?: string;
  vergiNo?: string;
  kuponKodu?: string;
}

const SHIPPING_COST = 0;
const KDV_RATE = 0.20;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCartStore();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutFormHtml, setCheckoutFormHtml] = useState('');
  const iyzipayRef = useRef<HTMLDivElement>(null);

  const [shipping, setShipping] = useState<ShippingData>({
    ad: '', soyad: '', adres: '', sehir: '', postaKodu: '', telefon: '', email: '',
  });
  const [billing, setBilling] = useState<BillingData>({
    tip: 'bireysel', adSoyad: '', adres: '', sehir: '', postaKodu: '',
    vergiDairesi: '', vergiNo: '', kuponKodu: '',
  });

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
  }, [items.length, router]);

  if (items.length === 0) return null;

  const displaySubtotal = subtotal();
  const kdv = displaySubtotal * KDV_RATE;
  const total = displaySubtotal + kdv + SHIPPING_COST;

  async function handlePaymentInit() {
    setLoading(true);
    setError('');

    try {
      // Step 1: validate cart server-side
      const cartRes = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, barcode: i.barcode, quantity: i.quantity })),
        }),
      });
      const cartData = await cartRes.json();
      if (!cartRes.ok) throw new Error(cartData.error ?? 'Cart validation failed');

      const invalid = cartData.items?.filter((i: { valid: boolean }) => !i.valid);
      if (invalid?.length > 0) {
        throw new Error(`Bazı ürünler stokta yok: ${invalid.map((i: { barcode: string }) => i.barcode).join(', ')}`);
      }

      const validatedTotal = cartData.subtotal + cartData.subtotal * KDV_RATE;

      // Step 2: init Iyzipay checkout form
      const conversationId = `SA-${Date.now()}`;
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          price: validatedTotal.toFixed(2),
          paidPrice: validatedTotal.toFixed(2),
          currency: 'TRY',
          buyer: {
            id: conversationId,
            name: shipping.ad,
            surname: shipping.soyad,
            gsmNumber: shipping.telefon,
            email: shipping.email,
            identityNumber: '11111111111',
            registrationAddress: shipping.adres,
            city: shipping.sehir,
            country: 'Turkey',
            zipCode: shipping.postaKodu,
          },
          shippingAddress: {
            contactName: `${shipping.ad} ${shipping.soyad}`,
            city: shipping.sehir,
            country: 'Turkey',
            address: shipping.adres,
            zipCode: shipping.postaKodu,
          },
          billingAddress: {
            contactName: billing.adSoyad || `${shipping.ad} ${shipping.soyad}`,
            city: billing.sehir || shipping.sehir,
            country: 'Turkey',
            address: billing.adres || shipping.adres,
            zipCode: billing.postaKodu || shipping.postaKodu,
          },
          basketItems: cartData.items
            .filter((i: { valid: boolean }) => i.valid)
            .map((i: { barcode: string; title: string; storefrontPrice: number; quantity: number }) => ({
              id: i.barcode,
              name: i.title,
              category1: 'Endüstriyel Ürünler',
              itemType: 'PHYSICAL',
              price: (i.storefrontPrice * i.quantity).toFixed(2),
            })),
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutData.checkoutFormContent) {
        throw new Error(checkoutData.error ?? 'Ödeme başlatılamadı');
      }

      setCheckoutFormHtml(checkoutData.checkoutFormContent);
      setStep(3);

      // Inject Iyzipay form after state update
      setTimeout(() => {
        if (iyzipayRef.current) {
          iyzipayRef.current.innerHTML = checkoutData.checkoutFormContent;
          const scripts = iyzipayRef.current.querySelectorAll('script');
          scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            if (oldScript.src) newScript.src = oldScript.src;
            else newScript.textContent = oldScript.textContent;
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
        }
      }, 100);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `w-full bg-[var(--ink)] border border-[var(--steel-silver)]/20 text-[var(--paper)]
    text-sm py-3 px-4 body-intimate focus:border-[var(--accent-orange)] focus:outline-none transition-colors`;

  const labelClass = `mono text-xs uppercase tracking-widest text-[var(--steel-silver)] block mb-1`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--paper)] mb-4">Ödeme</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-12">
        {(['Kargo', 'Fatura', 'Ödeme'] as const).map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-7 h-7 flex items-center justify-center mono text-xs font-bold border ${
              step > i + 1
                ? 'bg-[var(--accent-orange)] border-[var(--accent-orange)] text-white'
                : step === i + 1
                ? 'border-[var(--accent-orange)] text-[var(--accent-orange)]'
                : 'border-[var(--steel-silver)]/30 text-[var(--steel-silver)]'
            }`}>{i + 1}</span>
            <span className={`mono text-xs uppercase tracking-widest ${
              step === i + 1 ? 'text-[var(--paper)]' : 'text-[var(--steel-silver)]'
            }`}>{label}</span>
            {i < 2 && <span className="text-[var(--steel-silver)]/30 text-xs">—</span>}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/5 mono text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-[var(--paper)] mb-6">Kargo & Teslimat</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ad" className={labelClass}>Ad</label>
                  <input id="ad" className={inputClass} value={shipping.ad}
                    onChange={(e) => setShipping((s) => ({ ...s, ad: e.target.value }))}
                    autoCorrect="off" autoCapitalize="off" spellCheck={false} />
                </div>
                <div>
                  <label htmlFor="soyad" className={labelClass}>Soyad</label>
                  <input id="soyad" className={inputClass} value={shipping.soyad}
                    onChange={(e) => setShipping((s) => ({ ...s, soyad: e.target.value }))}
                    autoCorrect="off" autoCapitalize="off" spellCheck={false} />
                </div>
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>E-posta</label>
                <input id="email" type="email" className={inputClass} value={shipping.email}
                  onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                  autoCorrect="off" autoCapitalize="off" spellCheck={false} />
              </div>
              <div>
                <label htmlFor="telefon" className={labelClass}>Telefon</label>
                <input id="telefon" type="tel" className={inputClass} value={shipping.telefon}
                  onChange={(e) => setShipping((s) => ({ ...s, telefon: e.target.value }))}
                  autoCorrect="off" />
              </div>
              <div>
                <label htmlFor="adres" className={labelClass}>Adres</label>
                <input id="adres" className={inputClass} value={shipping.adres}
                  onChange={(e) => setShipping((s) => ({ ...s, adres: e.target.value }))}
                  autoCorrect="off" autoCapitalize="off" spellCheck={false} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sehir" className={labelClass}>Şehir</label>
                  <input id="sehir" className={inputClass} value={shipping.sehir}
                    onChange={(e) => setShipping((s) => ({ ...s, sehir: e.target.value }))}
                    autoCorrect="off" autoCapitalize="off" spellCheck={false} />
                </div>
                <div>
                  <label htmlFor="postaKodu" className={labelClass}>Posta Kodu</label>
                  <input id="postaKodu" className={inputClass} value={shipping.postaKodu}
                    onChange={(e) => setShipping((s) => ({ ...s, postaKodu: e.target.value }))}
                    autoCorrect="off" />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!shipping.ad || !shipping.soyad || !shipping.adres || !shipping.sehir || !shipping.telefon || !shipping.email}
                className="mt-4 py-4 px-8 bg-[var(--accent-orange)] text-white text-xs font-bold tracking-widest uppercase
                  hover:shadow-[0_0_24px_var(--accent-orange),0_0_48px_#a855f7]
                  transition-shadow motion-reduce:transition-none
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Devam Et
              </button>
            </div>
          )}

          {/* Step 2: Billing */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-[var(--paper)] mb-6">Fatura Bilgileri</h2>
              <div className="flex gap-4 mb-4">
                {(['bireysel', 'kurumsal'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBilling((b) => ({ ...b, tip: t }))}
                    className={`py-2 px-6 mono text-xs uppercase tracking-widest border transition-colors ${
                      billing.tip === t
                        ? 'border-[var(--accent-orange)] text-[var(--accent-orange)]'
                        : 'border-[var(--steel-silver)]/30 text-[var(--steel-silver)]'
                    }`}
                  >
                    {t === 'bireysel' ? 'Bireysel' : 'Kurumsal (e-Fatura)'}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="billingName" className={labelClass}>Ad Soyad / Şirket Adı</label>
                <input id="billingName" className={inputClass} value={billing.adSoyad}
                  onChange={(e) => setBilling((b) => ({ ...b, adSoyad: e.target.value }))}
                  autoCorrect="off" autoCapitalize="off" spellCheck={false} />
              </div>
              {billing.tip === 'kurumsal' && (
                <>
                  <div>
                    <label htmlFor="vergiDairesi" className={labelClass}>Vergi Dairesi</label>
                    <input id="vergiDairesi" className={inputClass} value={billing.vergiDairesi}
                      onChange={(e) => setBilling((b) => ({ ...b, vergiDairesi: e.target.value }))}
                      autoCorrect="off" autoCapitalize="off" spellCheck={false} />
                  </div>
                  <div>
                    <label htmlFor="vergiNo" className={labelClass}>Vergi No / TC Kimlik No</label>
                    <input id="vergiNo" className={inputClass} value={billing.vergiNo}
                      onChange={(e) => setBilling((b) => ({ ...b, vergiNo: e.target.value }))}
                      autoCorrect="off" />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="kuponKodu" className={labelClass}>Kupon Kodu (opsiyonel)</label>
                <input id="kuponKodu" className={inputClass} value={billing.kuponKodu}
                  onChange={(e) => setBilling((b) => ({ ...b, kuponKodu: e.target.value }))}
                  autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="KUPON2025" />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="py-4 px-6 border border-[var(--steel-silver)]/30 text-[var(--steel-silver)] mono text-xs uppercase tracking-widest hover:text-[var(--paper)] hover:border-[var(--steel-silver)] transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handlePaymentInit}
                  disabled={loading}
                  className="flex-1 py-4 px-8 bg-[var(--accent-orange)] text-white text-xs font-bold tracking-widest uppercase
                    hover:shadow-[0_0_24px_var(--accent-orange),0_0_48px_#a855f7]
                    transition-shadow motion-reduce:transition-none
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Yükleniyor...' : 'Ödemeye Geç'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment (Iyzipay iframe) */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--paper)] mb-6">Güvenli Ödeme</h2>
              <div className="mb-4 p-3 border border-[var(--steel-silver)]/10 bg-[var(--navy)] mono text-xs text-[var(--steel-silver)] flex items-center gap-2">
                <span>🔒</span> SSL/TLS şifrelemeli güvenli ödeme · iyzico
              </div>
              <div ref={iyzipayRef} className="min-h-96" />
              <button
                onClick={() => setStep(2)}
                className="mt-6 py-2 px-6 border border-[var(--steel-silver)]/30 text-[var(--steel-silver)] mono text-xs uppercase tracking-widest hover:text-[var(--paper)] transition-colors"
              >
                Geri
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="bg-[var(--navy)] border border-[var(--steel-silver)]/10 p-6 h-fit">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[var(--paper)] mb-4">Sipariş Özeti</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.barcode} className="flex justify-between text-xs">
                <span className="body-intimate text-[var(--steel-silver)] line-clamp-1 flex-1 mr-2">
                  {item.title} ×{item.quantity}
                </span>
                <span className="mono text-[var(--paper)] shrink-0">
                  {(item.storefrontPrice * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--steel-silver)]/20 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="body-intimate text-[var(--steel-silver)]">Ara Toplam</span>
              <span className="mono text-[var(--paper)]">{displaySubtotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="body-intimate text-[var(--steel-silver)]">KDV (%20)</span>
              <span className="mono text-[var(--paper)]">{kdv.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="body-intimate text-[var(--steel-silver)]">Kargo</span>
              <span className="mono text-[var(--steel-silver)]">Kargoda hesaplanır</span>
            </div>
            <div className="flex justify-between border-t border-[var(--steel-silver)]/20 pt-3 mt-2">
              <span className="text-sm font-bold text-[var(--paper)]">Toplam</span>
              <span className="mono text-[var(--paper)] font-bold">{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

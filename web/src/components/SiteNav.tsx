'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cart-store';

const links = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'İletişim' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const count = mounted ? itemCount() : 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-4 bg-[var(--ink)]/90 backdrop-blur-sm border-b border-[var(--steel-silver)]/10">
      <Link href="/" className="text-sm font-black tracking-[0.18em] uppercase text-[var(--paper)] hover:text-[var(--accent-orange)] transition-colors">
        Stainless Art
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`mono text-xs uppercase tracking-widest transition-colors ${
                pathname === href
                  ? 'text-[var(--accent-orange)]'
                  : 'text-[var(--steel-silver)] hover:text-[var(--paper)]'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={openCart}
        aria-label={`Sepeti aç (${count} ürün)`}
        className="relative mono text-xs uppercase tracking-widest text-[var(--steel-silver)] hover:text-[var(--paper)] transition-colors"
      >
        Sepet
        {count > 0 && (
          <span className="absolute -top-2 -right-4 w-4 h-4 rounded-full bg-[var(--accent-orange)] text-white text-[10px] flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </button>
    </nav>
  );
}

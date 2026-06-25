import type { StorefrontProduct, TrendyolPriceItem } from '@/types/trendyol';

/**
 * P_web = P_market × A
 * Factor A loaded from PRICE_ADJUSTMENT_FACTOR env (default 1.0).
 * Positive A > 1 adds brand margin; A < 1 removes marketplace commission.
 */
export function applyStorefrontPrice(marketPrice: number): number {
  const factor = parseFloat(process.env.PRICE_ADJUSTMENT_FACTOR ?? '1.0');
  return parseFloat((marketPrice * factor).toFixed(2));
}

/**
 * When pushing back to Trendyol, always use P_market — never the storefront price.
 * This prevents reconciliation errors on the marketplace side.
 */
export function toMarketplacePayload(item: StorefrontProduct): TrendyolPriceItem {
  return {
    barcode: item.barcode,
    salePrice: item.marketSalePrice,
    listPrice: item.marketListPrice,
    quantity: item.quantity,
  };
}

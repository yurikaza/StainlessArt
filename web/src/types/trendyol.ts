export interface TrendyolImage {
  url: string;
}

export interface TrendyolProduct {
  id: number;
  barcode: string;
  title: string;
  productMainId: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
  stockCode: string;
  dimensionalWeight: number;
  description: string;
  currencyType: string;
  listPrice: number;
  salePrice: number;
  vatRate: number;
  images: TrendyolImage[];
  approved: boolean;
  archived: boolean;
}

export interface TrendyolProductsResponse {
  content: TrendyolProduct[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface TrendyolPriceItem {
  barcode: string;
  quantity: number;
  salePrice: number;
  listPrice?: number;
}

export interface TrendyolBatchResponse {
  batchRequestId: string;
}

export interface TrendyolBatchResult {
  batchRequestId: string;
  status: 'IN_PROGRESS' | 'DONE' | 'FAILED';
  items: Array<{
    barcode: string;
    status: 'SUCCESS' | 'ERROR';
    failureReasons?: string[];
  }>;
}

/** Storefront-shaped product: carries both market price (for sync) and web price (for display) */
export interface StorefrontProduct {
  id: number;
  barcode: string;
  title: string;
  brandName: string;
  categoryName: string;
  quantity: number;
  stockCode: string;
  description: string;
  currencyType: string;
  marketListPrice: number;
  marketSalePrice: number;
  storefrontPrice: number;
  vatRate: number;
  images: TrendyolImage[];
}

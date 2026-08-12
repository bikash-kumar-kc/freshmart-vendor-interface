
export type QuotationStatus =
  | "delivered"
  | "approved"
  | "request"
  | "rejected"
  | "rechecking";

// quotation-layout...
export interface IQuotationListItem {
  quotationId: number;
  vendorId: string;
  productListingId: number;
  productLocalName: string;
  createdAt: string;
  status: QuotationStatus;
  totalRequestedProducts: number;
}

export interface IQuotationListResponse {
  data: IQuotationListItem[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  limit: number;
  totalQuotation: number;
}

export interface IQuotationVariant {
  productListingVarientsId: number;
  size: number;
  measurementId: number;
  originalPricePerUnit: number;
  adminSuggestedPricePerUnit: number;
  totalQuantity: number;
  quotationVariantId: number;
}

export interface IQuotationDetail {
  quotationId: number;
  vendorId: string;
  productListingId: number;
  productLocalName: string;
  variants: IQuotationVariant[];
  createdAt: string;
  status: QuotationStatus;
}

export interface ICounterVariantPayload {
  quotationVariantId: number;
  vendorCounterPricePerUnit: number;
}

export interface ICounterQuotationPayload {
  variants: ICounterVariantPayload[];
}

export interface IQuotationListParams {
  page?: number;
  limit?: number;
  // search?: string;
}

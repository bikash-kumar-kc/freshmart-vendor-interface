export interface IQuotationVariant {
  id: number;
  quotationId: number;
  productListingVariantId: number;
  originalPricePerUnit: number;
  adminSuggestedPricePerUnit: number;
  vendorCounterPricePerUnit: number | null;
  quantity: number;
  createdAt: string;
}

export interface IQuotation {
  id: number;
  vendorId: string;
  adminId: string;
  productListingId: number;
  isVendorUpdatedTheQuotation: boolean;
  isApprovedByVendor: boolean;
  isApprovedByAdmin: boolean;
  isReapprovedByAdmin: boolean;
  isDelivered: boolean;
  isLived: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: IQuotationVariant[];
}

// Vendor side
export type IListMyQuotationsResponse = IQuotation[];
export type IPendingQuotationsResponse = IQuotation[];
export type IRespondedQuotationsResponse = IQuotation[];
export type IDeliveredQuotationsResponse = IQuotation[];
export type IGetQuotationResponse = IQuotation;

// PATCH /vendor/quotation/:id/accept — no body
export type IAcceptQuotationResponse = IQuotation;

export interface IVariantCounterPayload {
  quotationVariantId: number;
  vendorCounterPricePerUnit: number;
}
export interface IVendorCounterQuotationPayload {
  variants: IVariantCounterPayload[];
}
export type ICounterQuotationResponse = IQuotation;
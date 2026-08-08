export type ProductType = "inventory" | "display";

export interface ICreateVariantPayload {
  size: number;
  measurementId: number;
  quantity: number;
  pricePerUnit: number;
  sellingPrice?: number;
}

export interface ICreateProductListingPayload {
  productId: number;
  type: ProductType;
  localName?: string;
  categoryId: number;
  keywords?: string;
  description?: string;
  images?: string[];
  originCountry: string;
  farmName?: string;
  packagingTypeId: number;
  isTaxable?: boolean;
  variants: ICreateVariantPayload[];
}

export interface IProductListingVariant {
  id: number;
  productListingId: number;
  size: number;
  measurementId: number;
  quantity: number;
  pricePerUnit: number;
  sellingPrice: number | null;
  createdAt: string;
}

export interface IProductListing {
  id: number;
  vendorId: string;
  productId: number;
  type: ProductType;
  localName: string | null;
  categoryId: number;
  keywords: string | null;
  description: string | null;
  images: string[];
  originCountry: string;
  farmName: string | null;
  packagingTypeId: number;
  isTaxable: boolean;
  isAcceptedByAdmin: boolean;
  isRejectedByAdmin: boolean;
  isLived: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: IProductListingVariant[];
}


export type ICreateProductListingResponse = IProductListing;

// GET /product-listing/:id
export type IGetProductListingResponse = IProductListing;

// GET /product-listing?verified=true|false
export interface IListMyProductListingsQuery {
  verified: "true" | "false";
}

export type IListMyProductListingsResponse = IProductListing[];

// GET /product-listing/search?q=...
export interface ISearchProductListingQuery {
  q: string;
}
export type ISearchProductListingResponse = IProductListing[];

// GET /product-listing/rejected
export type IListRejectedProductListingsResponse = IProductListing[];



// PATCH /product-listing/:id
export interface IUpdateProductListingPayload {
  productId?: number;
  type?: ProductType;
  localName?: string;
  categoryId?: number;
  keywords?: string;
  description?: string;
  images?: string[];
  originCountry?: string;
  farmName?: string;
  packagingTypeId?: number;
  variants?: ICreateVariantPayload[];
}
export type IUpdateProductListingResponse = IProductListing;

// DELETE /product-listing/:id
export interface IDeleteProductListingResponse {
  message: string;
}
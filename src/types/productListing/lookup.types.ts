export interface IProductName {
  productId: number;
  productName: string;
  // isVerified: boolean;
}

export interface ICategory {
  categoryId: number;
  categoryName: string;
}

export interface IPackagingType {
  packagingId: number;
  packagingName: string;
  isVerified: boolean;
}

export interface IMeasurementType {
  measurementId: number;
  measurementName: string;
  isVerified: boolean;
}

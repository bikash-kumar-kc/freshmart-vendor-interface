export type DisplayOrderStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "cancelled";
export type WeightUnit = "g" | "kg" | "l" | "ml";

export interface IDisplayOrderItem {
  productId: string;
  productName: string;
  localName: string | null;
  slug: string;
  variantId: string;
  weightValue: number;
  weightUnit: WeightUnit;
  quantity: number;
}

export interface IDisplayOrderListItem {
  orderId: string;
  userId: string;
  email: string;
  displayOrderStatus: DisplayOrderStatus;
  type: "display";
  isPayment: boolean;
  createdAt: string;
  // items: IDisplayOrderItem[];
}

export interface IDisplayOrderListResponse {
  data: IDisplayOrderListItem[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  limit: number;
  totalOrders: number;
}

export interface IDisplayOrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: DisplayOrderStatus | "all";
}

// Detail response — separate shape per your sample
export interface IDisplayOrderDetailItem {
  price: number;
  productName: string;
  localName: string;
  id: number;
  vendorId: string | null;
  productId: string;
  productListingId: string | null;
  quantity: number;
  orderId: string;
  slug: string;
  weightValue: number;
  weightUnit: WeightUnit;
  productVariantId: string | null;
  displayOrderStatus: DisplayOrderStatus;
}

export interface IDisplayOrderDetail {
  id: string;
  createdAt: string;
  isPayment: boolean;
  type: "inventory" | "display";
  userId: string;
  displayOrderStatus: DisplayOrderStatus | null;
  items: IDisplayOrderDetailItem[];
}

export interface IUpdateOrderStatusPayload {
  status: DisplayOrderStatus;
}

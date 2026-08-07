
export type DisplayOrderStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  id: number;
  orderId: string;
  productId: string;
  productVariantId: number;
  vendorId: string;
  weightValue: number;
  weightUnit: "g" | "kg" | "ml" | "l";
  quantity: number;
  slug: string;
}

export interface IOrder {
  id: string;
  userId: string;
  type: "inventory" | "display";
  vendorId: string | null;
  displayOrderStatus: DisplayOrderStatus | null;
  vendorConfirmationDeadline: string | null;
  isOrdered: boolean;
  orderItems?: IOrderItem[];
}

export interface IOrderDisplayType {
  orderId: string;
  userId: string;
  productName: string;
  productId: string;
  variantsId: string;
  weightUnit: string;
  weightValue: number;
  DisplayOrderStatus: DisplayOrderStatus;
  type: "inventory" | "display";
  isPayment: boolean;
}

// Vendor — GET /display-order?status=...
export interface IListDisplayOrdersQuery {
  status?: DisplayOrderStatus;
}

export type IListDisplayOrdersResponse = IOrder[];

// Vendor — GET /display-order/:id
export type IGetDisplayOrderResponse = IOrder;

// Vendor — PATCH /display-order/:id/status
export interface IUpdateDisplayOrderStatusPayload {
  status: "processing" | "delivered";
}

export type IUpdateDisplayOrderStatusResponse = IOrder;

// Vendor — PATCH /display-order/:id/cancel — no body
export type ICancelDisplayOrderResponse = IOrder;

// Admin — GET /admin/display-order?status=..., GET /admin/display-order/:id
export type IAdminListDisplayOrdersResponse = IOrder[];
export type IAdminGetDisplayOrderResponse = IOrder;

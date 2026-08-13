import type { DisplayOrderStatus } from "../../types/order/display-order.types";

export const DISPLAY_ORDER_TRANSITIONS: Record<
  DisplayOrderStatus,
  DisplayOrderStatus[]
> = {
  pending: ["processing"],
  processing: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const DISPLAY_ORDER_STATUS_LABEL: Record<DisplayOrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const DISPLAY_ORDER_STATUS_STYLES: Record<DisplayOrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export const PAYMENT_STATUS_STYLES = {
  success: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export const DISPLAY_ORDER_RESPONSE_WINDOW_MS = 60 * 60 * 1000; 

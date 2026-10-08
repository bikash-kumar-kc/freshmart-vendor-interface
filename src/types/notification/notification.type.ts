export type NotificationType = "vendor" | "admin";

export type NotificationSubType =
  | "vendor_registration_filed"
  | "vendor_account_created"
  | "vendor_added_product"
  | "vendor_edited_product"
  | "vendor_suggested_product_name"
  | "vendor_replied_quotation"
  | "product_approved"
  | "product_rejected"
  | "admin_filed_quotation"
  | "display_order_request"
  | "quotation_deleted"
  | "stock_update_requested";

export interface INotification {
  id: number;
  type: NotificationType;
  subType: NotificationSubType;
  vendorId: string | null;
  referenceId: string | null;
  referenceType: string | null;
  message: string;
  content: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export type IVendorNotificationsResponse = INotification[];

export interface IUnreadCountResponse {
  unreadCount: number;
}

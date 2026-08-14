import {
  FileText, UserCheck, PackagePlus, Package, MessageSquareText,
  FileSpreadsheet, CheckCircle2, XCircle, Truck, Trash2,
  type LucideIcon,
} from 'lucide-react';
import type { NotificationSubType } from './notification.type';



export const notificationMeta: Record<NotificationSubType, { icon: LucideIcon; label: string; color: string }> = {
  vendor_registration_filed: { icon: FileText, label: 'Application', color: '#3B6D11' },
  vendor_account_created: { icon: UserCheck, label: 'Account', color: '#3B6D11' },
  vendor_added_product: { icon: PackagePlus, label: 'Product Added', color: '#3B6D11' },
  vendor_edited_product: { icon: Package, label: 'Product Edited', color: '#3B6D11' },
  vendor_suggested_product_name: { icon: MessageSquareText, label: 'Suggestion', color: '#C8742A' },
  vendor_replied_quotation: { icon: FileSpreadsheet, label: 'Quotation Reply', color: '#C8742A' },
  product_approved: { icon: CheckCircle2, label: 'Approved', color: '#3B6D11' },
  product_rejected: { icon: XCircle, label: 'Rejected', color: '#DC2626' },
  admin_filed_quotation: { icon: FileSpreadsheet, label: 'New Quotation', color: '#C8742A' },
  display_order_request: { icon: Truck, label: 'Display Order', color: '#3B6D11' },
  quotation_deleted: { icon: Trash2, label: 'Quotation Deleted', color: '#DC2626' },
};

const referenceRouteMap: Record<string, (id: string) => string> = {
  product_listing: (id) => `/product-details/${id}`,
  quotation: (id) => `/quotation-details/${id}`,
  display_order: (id) => `/order-details/${id}`,
};

export const getReferenceRoute = (referenceType: string | null, referenceId: string | null) => {
  if (!referenceType || !referenceId) return null;
  return referenceRouteMap[referenceType]?.(referenceId) ?? null;
};
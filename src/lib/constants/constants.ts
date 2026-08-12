

import type { QuotationStatus } from "../../types/quotation/types";


export const QUOTATION_STATUS_LABEL: Record<QuotationStatus, string> = {
  delivered: 'Delivered',
  approved: 'Approved',
  request: 'Request',
  rejected: 'Rejected',
  rechecking: 'Rechecking',
};


export const QUOTATION_STATUS_STYLES: Record<QuotationStatus, string> = {
  delivered: 'bg-green-50 text-green-700 border-green-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  request: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  rechecking: 'bg-blue-50 text-blue-700 border-blue-200',
};
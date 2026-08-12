// components/StatusBadge.tsx

import { QUOTATION_STATUS_LABEL, QUOTATION_STATUS_STYLES } from "@/lib/constants/constants";
import type { QuotationStatus } from "@/types/quotation/types";



export default function StatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${QUOTATION_STATUS_STYLES[status]}`}
    >
      {QUOTATION_STATUS_LABEL[status]}
    </span>
  );
}

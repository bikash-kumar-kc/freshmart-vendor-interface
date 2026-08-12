// components/DisplayOrderStatusBadge.tsx

import { DISPLAY_ORDER_STATUS_LABEL, DISPLAY_ORDER_STATUS_STYLES } from "./display-order.constants";
import type { DisplayOrderStatus } from "./display-order.types";

export default function DisplayOrderStatusBadge({ status }: { status: DisplayOrderStatus }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${DISPLAY_ORDER_STATUS_STYLES[status]}`}>
      {DISPLAY_ORDER_STATUS_LABEL[status]}
    </span>
  );
}
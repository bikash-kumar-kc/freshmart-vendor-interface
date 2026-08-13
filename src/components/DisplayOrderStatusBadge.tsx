import {
  DISPLAY_ORDER_STATUS_LABEL,
  DISPLAY_ORDER_STATUS_STYLES,
} from "../lib/constants/display-order.constants";
import type { DisplayOrderStatus } from "../types/order/display-order.types";

export default function DisplayOrderStatusBadge({
  status,
  name,
}: {
  status: DisplayOrderStatus;
  name?: string;
}) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${DISPLAY_ORDER_STATUS_STYLES[status]}`}
    >
      {name ?? ""} {DISPLAY_ORDER_STATUS_LABEL[status]}
    </span>
  );
}

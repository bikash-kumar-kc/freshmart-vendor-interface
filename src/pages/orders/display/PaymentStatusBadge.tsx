// components/PaymentStatusBadge.tsx

import { PAYMENT_STATUS_STYLES } from "./display-order.constants";
import type { DisplayOrderStatus } from "./display-order.types";


interface PaymentStatusBadgeProps {
  isPayment: boolean;
  orderStatus: DisplayOrderStatus;
}

export default function PaymentStatusBadge({ isPayment, orderStatus }: PaymentStatusBadgeProps) {
  // No payment badge once an order is cancelled — a cancelled sale has no meaningful payment state.
  if (orderStatus === 'cancelled') return null;

  const variant = isPayment ? 'success' : 'pending';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${PAYMENT_STATUS_STYLES[variant]}`}>
      {isPayment ? 'Success' : 'Pending'}
    </span>
  );
}
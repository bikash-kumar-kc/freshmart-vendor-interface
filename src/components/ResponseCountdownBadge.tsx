import { DISPLAY_ORDER_RESPONSE_WINDOW_MS } from "@/lib/constants/display-order.constants";
import type { DisplayOrderStatus } from "@/types/order/display-order.types";
import { useEffect, useState } from "react";

interface ResponseCountdownBadgeProps {
  createdAt: string;
  status: DisplayOrderStatus;
  title?: string;
}

export default function ResponseCountdownBadge({
  createdAt,
  status,
  title,
}: ResponseCountdownBadgeProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "pending") return;
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, [status]);

  if (status !== "pending") {
    return <span className="text-xs text-gray-400"></span>;
  }

  const deadline =
    new Date(createdAt).getTime() + DISPLAY_ORDER_RESPONSE_WINDOW_MS;
  const remainingMs = deadline - now;

  if (remainingMs <= 0) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
        {title ?? ""} Overdue
      </span>
    );
  }

  const minutes = Math.floor(remainingMs / 60000);
  const label =
    minutes >= 60
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m left`
      : `${minutes}m left`;

  const urgent = minutes <= 10;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${
        urgent
          ? "bg-red-50 text-red-600 border-red-200"
          : "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {title ?? ""} {label}
    </span>
  );
}

import type { IColumn } from "@/pages/products/ReuseableTable";
import { useParams, useLocation } from "react-router-dom";
import { useDisplayOrderDetail } from "../../../lib/tanstackquery/displayOrders/hook";
import type {
  DisplayOrderStatus,
  IDisplayOrderDetailItem,
} from "../../../types/order/display-order.types";
import ReusableTable from "@/pages/products/ReuseableTable";
import DisplayOrderStatusBadge from "../../../components/DisplayOrderStatusBadge";

import PageHeading from "@/components/PagingHeading";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import ResponseCountdownBadge from "@/components/ResponseCountdownBadge";

const columns: IColumn[] = [
  { id: "productName", label: "Product", align: "left" },
  { id: "variantId", label: "Variant ID", align: "left", width: "140px" },
  { id: "measurement", label: "Measurement", align: "left", width: "140px" },
  { id: "quantity", label: "Quantity", align: "right", width: "110px" },
  { id: "pricePerUnit", label: "Price / Unit", align: "right", width: "140px" },
  { id: "total", label: "Total", align: "right", width: "140px" },
];

const formatCurrency = (value: number) =>
  `Rs. ${value.toLocaleString("en-NP")}`;

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // These come through route state from the list page's "View Details" click,
  // so the heading renders immediately without waiting on the detail fetch.
  const passedState = location.state as
    | { orderId?: string; email?: string }
    | undefined;

  const { data: order, isLoading } = useDisplayOrderDetail(id!);

  if (isLoading || !order) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
        <p className="text-sm text-gray-400">Loading order...</p>
      </main>
    );
  }

  const orderTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const renderRow = (item: IDisplayOrderDetailItem) => (
    <>
      <td className="px-4 py-3">
        <p className="font-medium text-gray-800">{item.productName}</p>
        {item.localName && (
          <p className="text-xs text-gray-400">{item.localName}</p>
        )}
      </td>
      <td className="px-4 py-3 text-gray-700">
        {item.productVariantId ?? "—"}
      </td>
      <td className="px-4 py-3 text-gray-700">
        {/* {(item.weightValue + "/" + item.weightUnit) ?? "—"} */}
        {item.weightUnit && item.weightValue
          ? item.weightValue + "/" + item.weightUnit
          : "-"}
      </td>
      <td className="px-4 py-3 text-right font-medium text-gray-700">
        {item.quantity}
      </td>
      <td className="px-4 py-3 text-right text-gray-500">
        {formatCurrency(item.price)}
      </td>
      <td className="px-4 py-3 text-right font-medium text-gray-700">
        {formatCurrency(item.price * item.quantity)}
      </td>
    </>
  );

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeading
        title={`Order Details`}
        subtitle={passedState?.email ?? "Order details"}
      />

      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-sm px-5 py-4 mb-5">
        <div className="flex items-center gap-3">
          {order.displayOrderStatus && (
            <DisplayOrderStatusBadge
              status={order.displayOrderStatus}
              name={"Order Status : "}
            />
          )}
          <PaymentStatusBadge
            isPayment={order.isPayment}
            orderStatus={order.displayOrderStatus ?? "pending"}
            name={"Payment Status : "}
          />
        </div>
        <div className="flex gap-2">
          <ResponseCountdownBadge
            createdAt={order.createdAt}
            status={order.displayOrderStatus as DisplayOrderStatus}
            title={"Response Window : "}
          />
          <p className="text-sm text-gray-500">
            Placed{" "}
            {new Date(order.createdAt.replace(" ", "T")).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </p>
        </div>
      </div>

      <ReusableTable<IDisplayOrderDetailItem>
        columns={columns}
        data={order.items}
        renderRow={renderRow}
        rowKey={(item) => item.id}
        emptyMessage="No items found for this order."
      />

      <div className="flex justify-end mt-4">
        <div className="bg-white border border-gray-200 rounded-sm px-5 py-3">
          <span className="text-sm text-gray-500 mr-3">Order Total</span>
          <span className="text-lg font-semibold text-gray-800">
            {formatCurrency(orderTotal)}
          </span>
        </div>
      </div>
    </main>
  );
}

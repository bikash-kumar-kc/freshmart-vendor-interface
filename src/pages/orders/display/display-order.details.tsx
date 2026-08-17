import type { IColumn } from "@/pages/products/ReuseableTable";
import { useParams, useLocation } from "react-router-dom";
import {
  useCancelDisplayOrder,
  useDisplayOrderDetail,
  useUpdateDisplayOrderStatus,
} from "../../../lib/tanstackquery/displayOrders/hook";
import type {
  DisplayOrderStatus,
  IDisplayOrderDetailItem,
} from "../../../types/order/display-order.types";
import ReusableTable from "@/pages/products/ReuseableTable";
import DisplayOrderStatusBadge from "../../../components/DisplayOrderStatusBadge";

import PageHeading from "@/components/PagingHeading";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import ResponseCountdownBadge from "@/components/ResponseCountdownBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DISPLAY_ORDER_STATUS_LABEL,
  DISPLAY_ORDER_TRANSITIONS,
} from "@/lib/constants/display-order.constants";

const columns: IColumn[] = [
  { id: "productName", label: "Product", align: "left" },
  { id: "variantId", label: "Variant ID", align: "left", width: "140px" },
  { id: "measurement", label: "Measurement", align: "left", width: "140px" },
  { id: "quantity", label: "Quantity", align: "right", width: "110px" },
  { id: "pricePerUnit", label: "Price / Unit", align: "right", width: "140px" },
  { id: "total", label: "Total", align: "right", width: "140px" },
  { id: "action", label: "Action", align: "center", width: "150px" },
];

const formatCurrency = (value: number) =>
  `Rs. ${value.toLocaleString("en-NP")}`;

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const passedState = location.state as
    | { orderId?: string; email?: string }
    | undefined;

  const cancelMutation = useCancelDisplayOrder();
  const updateStatusMutation = useUpdateDisplayOrderStatus();

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

  const renderRow = (item: IDisplayOrderDetailItem) => {
    console.log(item);
    const nextStatuses =
      DISPLAY_ORDER_TRANSITIONS[order.displayOrderStatus as DisplayOrderStatus];
    const canCancel = item.displayOrderStatus === "pending";
    const canUpdate = nextStatuses.length > 0;

    return (
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
        <td className="px-4 py-3 text-center flex gap-2 justify-center items-center">
          {canCancel && (
            <button
              onClick={() => cancelMutation.mutate(item.orderId)}
              disabled={cancelMutation.isPending}
              className="px-1.5 py-1.5 rounded-sm text-xs font-semibold border border-red-300 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel {canCancel && canUpdate ? "" : " Order"}
            </button>
          )}
          {canUpdate && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button
                  disabled={updateStatusMutation.isPending}
                  className="px-3 py-1.5 rounded-sm text-xs font-semibold border border-green-500 text-green-700 bg-green-50 hover:bg-green-700 hover:text-white transition-colors disabled:opacity-50"
                >
                  Update {canCancel && canUpdate ? "" : " Status"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={
                  "rounded-sm bg-white shadow-lg px-3 py-2 flex flex-col gap-2"
                }
              >
                {nextStatuses.map((next) => (
                  <DropdownMenuItem
                    key={next}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        orderId: item.orderId,
                        payload: { status: next },
                      })
                    }
                  >
                    Mark as {DISPLAY_ORDER_STATUS_LABEL[next]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!canCancel && !canUpdate && (
            <span className="text-xs text-gray-400">—</span>
          )}
        </td>
      </>
    );
  };
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


import { useState, useEffect } from "react";
import { Search, Filter as FilterIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IColumn } from "@/pages/products/ReuseableTable";

import {
  useCancelDisplayOrder,
  useUpdateDisplayOrderStatus,
  useVendorDisplayOrders,
} from "../../../lib/tanstackquery/displayOrders/hook";
import {
  DISPLAY_ORDER_STATUS_LABEL,
  DISPLAY_ORDER_TRANSITIONS,
} from "../../../lib/constants/display-order.constants";
import ReusableTable from "@/pages/products/ReuseableTable";
import Pagination from "@/components/Pagination";
import type {
  DisplayOrderStatus,
  IDisplayOrderListItem,
} from "../../../types/order/display-order.types";
import DisplayOrderStatusBadge from "../../../components/DisplayOrderStatusBadge";
import PageHeading from "@/components/PagingHeading";

import Motion from "@/components/motion/Motion";
import RowExpandHint from "@/components/RowExpandHint";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import ResponseCountdownBadge from "@/components/ResponseCountdownBadge";

const columns: IColumn[] = [
  { id: "orderId", label: "Order ID", align: "left", width: "160px" },
  { id: "email", label: "User Email", align: "left" },
  { id: "status", label: "Order Status", align: "center", width: "130px" },
  { id: "payment", label: "Payment", align: "center", width: "110px" },
  { id: "createdAt", label: "Created At", align: "left", width: "130px" },
  {
    id: "countdown",
    label: "Response Window",
    align: "center",
    width: "130px",
  },
  { id: "view", label: "View", align: "center", width: "140px" },
  { id: "action", label: "Action", align: "center", width: "150px" },
];

const formatDate = (iso: string) =>
  new Date(iso.replace(" ", "T")).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function DisplayOrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<DisplayOrderStatus | "all">(
    "all",
  );
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useVendorDisplayOrders({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter,
  });

  const cancelMutation = useCancelDisplayOrder();
  const updateStatusMutation = useUpdateDisplayOrderStatus();

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  
  const availableStatuses = Array.from(
    new Set(orders.map((o) => o.displayOrderStatus)),
  );

  const handleViewDetails = (order: IDisplayOrderListItem) => {
    
    navigate(`/order-details/${order.orderId}`, {
      state: { orderId: order.orderId, email: order.email },
    });
  };

  const filterBySearchValue = search.trim()
    ? orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(search.toLowerCase()) ||
          o.email.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  const filterOrderBasedOnStatus =
    statusFilter === "all"
      ? filterBySearchValue
      : filterBySearchValue.filter(
          (o) => o.displayOrderStatus === statusFilter,
        );

  const renderRow = (item: IDisplayOrderListItem) => {
    const nextStatuses = DISPLAY_ORDER_TRANSITIONS[item.displayOrderStatus];
    const canCancel = item.displayOrderStatus === "pending";
    const canUpdate = nextStatuses.length > 0;

    return (
      <>
        <td className="px-4 py-3 font-medium text-gray-700">
          #{item.orderId.slice(0, 8)}
        </td>
        <td className="px-4 py-3 text-gray-700">{item.email}</td>
        <td className="px-4 py-3 text-center">
          <DisplayOrderStatusBadge status={item.displayOrderStatus} />
        </td>
        <td className="px-4 py-3 text-center">
          <PaymentStatusBadge
            isPayment={item.isPayment}
            orderStatus={item.displayOrderStatus}
          />
        </td>
        <td className="px-4 py-3 text-gray-500">
          {formatDate(item.createdAt)}
        </td>
        <td className="px-4 py-3 text-center">
          <ResponseCountdownBadge
            createdAt={item.createdAt}
            status={item.displayOrderStatus}
          />
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => handleViewDetails(item)}
            className="px-3 py-1.5 rounded-sm text-xs font-semibold border border-green-500 text-green-600 bg-green-50 transition-colors hover:bg-green-700 hover:text-white hover:border-green-700"
          >
            View Details
          </button>
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

  const handleFilterBySearchValue = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeading
        title="Display Orders"
        subtitle="Track and fulfill orders placed directly with your store."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => handleFilterBySearchValue(e.target.value)}
            placeholder="Search by order ID or email"
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50 hover:bg-gray-100">
              <FilterIcon className="w-4 h-4" />
              {statusFilter === "all"
                ? "Filter"
                : DISPLAY_ORDER_STATUS_LABEL[statusFilter]}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-sm bg-white shadow-lg px-3 py-2 flex flex-col gap-2"
          >
            <DropdownMenuItem
              onClick={() => {
                setStatusFilter("all");
                setPage(1);
              }}
              className={`${
                statusFilter === "all"
                  ? "bg-green-700 text-white focus:bg-green-700 focus:text-white"
                  : "hover:bg-green-100 transition-colors"
              } text-center`}
            >
              All Status
            </DropdownMenuItem>
            {availableStatuses.map((status) => {
              const isSelected = statusFilter === status;
              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={
                    isSelected
                      ? "bg-green-700 text-white focus:bg-green-700 focus:text-white"
                      : "hover:bg-green-100"
                  }
                >
                  <DisplayOrderStatusBadge status={status} />
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isError ? (
        <p className="text-sm text-red-600 text-center py-8">
          Something went wrong loading orders.
        </p>
      ) : (
        <>
          <Motion>
            <RowExpandHint
              message={
                "Update the status within the Response Window. Otherwise you loss the stock count and you products can go out of stock"
              }
            />
          </Motion>
          <ReusableTable<IDisplayOrderListItem>
            columns={columns}
            data={filterOrderBasedOnStatus}
            renderRow={renderRow}
            rowKey={(item) => item.orderId}
            loading={isLoading}
            emptyMessage="No display orders found."
          />
        </>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="flex justify-end mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </main>
  );
}

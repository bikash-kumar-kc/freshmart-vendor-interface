// pages/QuotationsPage.tsx
import { useState } from "react";
import { Search, Filter as FilterIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IColumn } from "../products/ReuseableTable";
import type { IQuotationListItem, QuotationStatus } from "../../types/quotation/types";
import { useQuotations } from "../../lib/tanstackquery/quotation/quotation.queries";

import PageHeading from "@/components/PagingHeading";
import { QUOTATION_STATUS_LABEL } from "../../lib/constants/constants";
import ReusableTable from "../products/ReuseableTable";
import Pagination from "@/components/Pagination";
import { handleFilters } from "../products/ProductPage.layout";
import StatusBadge from "@/components/StatusBadge";

const columns: IColumn[] = [
  { id: "quotationId", label: "Quotation ID", align: "left", width: "140px" },
  { id: "productName", label: "Product Name", align: "left" },
  { id: "status", label: "Status", align: "center", width: "130px" },
  {
    id: "totalRequestedProducts",
    label: "Requested Qty",
    align: "right",
    width: "150px",
  },

  { id: "createdAt", label: "Created At", align: "left", width: "180px" },

  { id: "view", label: "View", align: "center", width: "140px" },
];

const formatDate = (iso: string) =>
  new Date(iso.replace(" ", "T")).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function QuotationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "all">(
    "all",
  );
  const limit = 10;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuotations({
    page,
    limit,
  });

  const quotations = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const availableStatuses: string[] | QuotationStatus[] = [
    ...new Set(quotations.length > 0 ? quotations.map((q) => q.status) : "all"),
  ];

  const visibleQuotations = handleFilters(
    statusFilter === "all"
      ? quotations
      : quotations.filter((q) => q.status === statusFilter),
    search,
    ["quotationId", "productLocalName"],
  );

  const handlePageChange = (newPage: number) => setPage(newPage);

  const renderRow = (item: IQuotationListItem) => (
    <>
      <td className="px-4 py-3 text-center font-medium text-gray-700">
        {item.quotationId}
      </td>
      <td className="text-xs text-gray-700 font-semibold tracking-wide">
        {item.productLocalName}
      </td>
      <td className="px-4 py-3 text-center">
        <StatusBadge status={item.status} />
      </td>

      <td className="px-4 py-3 text-center font-medium text-gray-700">
        {item.totalRequestedProducts}
      </td>
      <td className="px-4 py-3 font-medium text-gray-700">
        {formatDate(item.createdAt)}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => navigate(`/quotation-details/${item.quotationId}`)}
          className="px-3 py-1.5 rounded-sm text-xs font-medium border border-green-500 text-green-600 bg-green-50 transition-colors hover:bg-green-700 hover:text-white hover:border-green-700"
        >
          View Details
        </button>
      </td>
    </>
  );

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeading
        title="Quotations"
        subtitle="Review and respond to pricing requests from admin."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by quotation ID or product"
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-primary"
          />
        </div>

        <DropdownMenu>
          {" "}
          <DropdownMenuTrigger>
            {" "}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50 hover:bg-gray-100">
              {" "}
              <FilterIcon className="w-4 h-4" />{" "}
              {statusFilter === "all"
                ? "Filter"
                : QUOTATION_STATUS_LABEL[statusFilter]}{" "}
            </button>{" "}
          </DropdownMenuTrigger>{" "}
          <DropdownMenuContent
            align="end"
            className="rounded-sm bg-white shadow-lg px-3 py-2 flex flex-col gap-2"
          >
            {" "}
            <DropdownMenuItem
              onClick={() => setStatusFilter("all")}
              className={`${
                statusFilter === "all"
                  ? "bg-green-700 text-white focus:bg-green-700 focus:text-white"
                  : "hover:bg-green-100 transition-colors"
              } text-center`}
            >
              {" "}
              All Status{" "}
            </DropdownMenuItem>{" "}
            {availableStatuses.map((status) => {
              const isSelected = statusFilter === status;
              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status as QuotationStatus)}
                  className={
                    isSelected
                      ? "bg-green-700 text-white focus:bg-green-700 focus:text-white"
                      : "hover:bg-green-100"
                  }
                >
                  {" "}
                  <StatusBadge status={status as QuotationStatus} />{" "}
                </DropdownMenuItem>
              );
            })}{" "}
          </DropdownMenuContent>{" "}
        </DropdownMenu>
      </div>

      {isError ? (
        <p className="text-sm text-red-600 text-center py-8">
          Something went wrong loading quotations.
        </p>
      ) : (
        <ReusableTable<IQuotationListItem>
          columns={columns}
          data={visibleQuotations}
          renderRow={renderRow}
          rowKey={(item) => item.quotationId}
          loading={isLoading}
          emptyMessage="No quotations found."
        />
      )}

      {!isLoading && quotations.length > 0 && (
        <div className="flex justify-end mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  );
}

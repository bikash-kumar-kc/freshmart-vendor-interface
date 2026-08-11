import { useEffect, useState } from "react";
import { Eye, Pencil, Search, Plus, PackageX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApprovedProducts, useUnapprovedProducts } from "./hooks";
import type { IProductListItem } from "./requiredUtilis";
import PageHeading from "@/components/PagingHeading";
import type { IColumn } from "./ReuseableTable";
import ReusableTable from "./ReuseableTable";
import Pagination from "@/components/Pagination";
import RowExpandHint from "@/components/RowExpandHint";
import Motion from "@/components/motion/Motion";
const columns: IColumn[] = [
  { id: "id", label: "ID", align: "center", width: "80px" },
  { id: "name", label: "Product", align: "left" },
  { id: "quantity", label: "Total Quantity", align: "right", width: "160px" },
  { id: "size", label: "Size", align: "right", width: "140px" },
  { id: "price", label: "Unit Price", align: "right", width: "140px" },
  { id: "actions", label: "Actions", align: "center", width: "120px" },
];

export const handleFilters = <T,>(
  items: T[],
  searchValue: string,
  searchFields: (keyof T)[],
) => {
  const search = searchValue.trim();

  if (!search) return items;

  const normalizedSearch = search.toLowerCase();

  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];

      if (value === null || value === undefined) return false;

      return String(value).toLowerCase().includes(normalizedSearch);
    }),
  );
};

// const filteredProducts = handleFilters(
//   products,
//   searchValue,
//   ['name', 'id', 'localName'],
// );

const formatCurrency = (value: number) => {
  if (typeof value === "undefined") return;
  return `Rs. ${value.toLocaleString("en-NP")}`;
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"approved" | "unapproved">("approved");
  const limit = 10;

  const params = { page, limit };

  const approvedQuery = useApprovedProducts(params);
  const unapprovedQuery = useUnapprovedProducts(params, view === "unapproved");

  const activeQuery = view === "approved" ? approvedQuery : unapprovedQuery;
  const products = activeQuery.data?.data ?? [];
  const totalPages = activeQuery?.data?.totalPages;
  const currentPage = activeQuery?.data?.currentPage;
  const totalProducts = activeQuery?.data?.totalProducts;
  const filteredProducts = handleFilters(products, search, [
    "name",
    "id",
    "localName",
  ]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleToggleView = () => {
    setView((prev) => (prev === "approved" ? "unapproved" : "approved"));
    setPage(1);
    setSearch("");
  };

  const renderRow = (item: IProductListItem) => {
    return (
      <>
        <td className="px-4 py-3 text-center font-medium text-gray-700">
          {item.id}
        </td>
        <td className="px-4 py-3">
          <p className="font-medium text-gray-800">{item.name}</p>
          {item.localName && (
            <p className="text-xs text-gray-700 font-semibold tracking-wide">
              {item.localName}
            </p>
          )}
          {view === "unapproved" && item.isRejectedByAdmin && (
            <span className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-red-50 text-red-600">
              Rejected
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-right font-medium text-gray-700">
          {item.variants[0].quantity}
        </td>

        <td className="px-4 py-3 text-right font-medium text-gray-700">
          {formatCurrency(item.variants[0].pricePerUnit)}
        </td>
        <td className="px-4 py-3 text-right font-medium text-gray-700">
          {item.variants[0].size}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => navigate(`/product/${item.id}`)}
              className="p-1.5 rounded-sm text-primary hover:bg-primary/10"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {!item.isAcceptedByAdmin && (
              <button
                onClick={() => navigate(`/product/${item.id}`)}
                className="p-1.5 rounded-sm text-cta hover:bg-cta/10"
                title="Edit product"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </>
    );
  };

  const renderExpanded = (item: IProductListItem) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {item.variants.map((v) => (
        <div
          key={v.id}
          className="bg-white border border-gray-200 rounded-sm p-3"
        >
          <p className="text-xs font-semibold text-gray-500">
            Size: {v.size}
            {v.measurementName}
          </p>
          <p className="text-xs font-semibold text-gray-500">
            Quantity: {v.quantity}
          </p>
          <p className="text-xs font-semibold text-gray-500">
            Price: {formatCurrency(v.pricePerUnit)}
          </p>
          {/* {v.sellingPrice && (
            <p className="text-xs text-gray-400">
              Selling: {formatCurrency(v.sellingPrice)}
            </p>
          )} */}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
    }
  }, [setPage, currentPage]);

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeading title="Products" subtitle="Manage your product catalogue." />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex w-full justify-between">
          {view === "unapproved" && (
            <button
              onClick={handleToggleView}
              className="flex items-center gap-1.5 text-sm bg-red-500 hover:bg-red-700 px-2 py-2 rounded-lg  font-medium text-white hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to approved products
            </button>
          )}

          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by product name or ID"
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {view === "approved" && (
            <button
              onClick={handleToggleView}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <PackageX className="w-4 h-4" />
              Unapproved Products
            </button>
          )}
          <button
            onClick={() => navigate("/product")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      <Motion>
        <RowExpandHint />
      </Motion>
      <Motion>
        <ReusableTable<IProductListItem>
          columns={columns}
          data={filteredProducts}
          renderRow={renderRow}
          renderExpanded={renderExpanded}
          rowKey={(item) => item.id}
          loading={activeQuery.isLoading}
          emptyMessage={
            view === "approved"
              ? "No approved products found."
              : "No unapproved products found."
          }
        />
      </Motion>

      {!activeQuery.isLoading && products.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages} · {totalProducts} total Product{" "}
            {(totalProducts as number) > 1 ? "s" : ""}
          </p>

          <Pagination
            page={page}
            totalPages={totalPages as number}
            onPageChange={(currentPage: number) => setPage(currentPage)}
            // siblingCount={2}
          />
        </div>
      )}
    </main>
  );
}

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import type { IColumn } from "../products/ReuseableTable";
import ReusableTable from "../products/ReuseableTable";
import {
  useAcceptQuotation,
  useCounterQuotation,
  useQuotationDetail,
} from "../../lib/tanstackquery/quotation/quotation.queries";
import { useMeasurementTypes } from "@/lib/tanstackquery/productlisting/lookup.queries";
import type {
  ICounterVariantPayload,
  IQuotationVariant,
} from "../../types/quotation/types";
import PageHeading from "@/components/PagingHeading";
import type { IParams } from "@/types/params.type";
import StatusBadge from "@/components/StatusBadge";
import { showToast } from "@/components/ReactToast";

const columns: IColumn[] = [
  { id: "variantId", label: "Variant ID", align: "center", width: "110px" },
  { id: "size", label: "Size", align: "left", width: "120px" },
  { id: "quantity", label: "Requested Qty", align: "right", width: "140px" },
  {
    id: "originalPrice",
    label: "Original Price/Unit",
    align: "right",
    width: "160px",
  },
  {
    id: "requestedPrice",
    label: "Requested Price/Unit",
    align: "right",
    width: "200px",
  },
];

const formatCurrency = (value: number) =>
  `Rs. ${value.toLocaleString("en-NP")}`;

interface FormValues {
  variants: { productListingVarientsId: number; price: number }[];
}

export default function QuotationDetailPage() {
  const { id: quotationId } = useParams<IParams>();
  const navigate = useNavigate();
  const id = Number(quotationId);

  const { data: quotation, isLoading } = useQuotationDetail(id);
  const { data: measurementTypes = [] } = useMeasurementTypes();
  const acceptMutation = useAcceptQuotation();
  const counterMutation = useCounterQuotation();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { variants: [] },
  });

  useEffect(() => {
    if (quotation?.variants) {
      reset({
        variants: quotation.variants.map((v) => ({
          productListingVarientsId: v.productListingVarientsId,
          price: v.adminSuggestedPricePerUnit,
        })),
      });
    }
  }, [quotation?.variants, reset]);

  const getMeasurementName = (measurementId: number) =>
    measurementTypes.find((m) => m.measurementId === measurementId)
      ?.measurementName ?? "—";

  const onSubmit = async (values: FormValues) => {
    if (!quotation) return;

    const changedVariants: ICounterVariantPayload[] = values.variants
      .map((v, idx) => {
        const original = quotation.variants[idx];
        if (v.price !== original.adminSuggestedPricePerUnit) {
          return {
            quotationVariantId: original.quotationVariantId,
            vendorCounterPricePerUnit: v.price,
          };
        }
        return null;
      })
      .filter((v): v is ICounterVariantPayload => v !== null);

    try {
      if (changedVariants.length === 0) {
        await acceptMutation.mutateAsync(id);

        showToast.success("Quotation accepted at the suggested price.");
      } else {
        await counterMutation.mutateAsync({
          quotationId: id,
          payload: { variants: changedVariants },
        });

        showToast.success("Counter offer sent to admin");
      }
      navigate("/quotation");
    } catch {
      showToast.success("Failed to submit your response. Please try again.");
    }
  };

  if (isLoading || !quotation) {
    return (
      <main className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
        <p className="text-sm text-gray-400">Loading quotation...</p>
      </main>
    );
  }

  const renderRow = (original: IQuotationVariant, idx: number) => {
    return (
      <>
        <td className="px-4 py-3 text-center font-medium text-gray-700">
          {original.productListingVarientsId}
        </td>
        <td className="px-4 py-3 text-gray-700">
          {original.size} {getMeasurementName(original.measurementId)}
        </td>
        <td className="px-4 py-3 text-right font-medium text-gray-700">
          {original.totalQuantity}
        </td>
        <td className="px-4 py-3 text-right text-gray-500">
          {formatCurrency(original.originalPricePerUnit)}
        </td>
        <td className="px-4 py-3 text-right">
          <Controller
            name={`variants.${idx}.price`}
            control={control}
            render={({ field }) => {
              const isPending = quotation.status !== "request";
              return (
                <input
                  type="number"
                  step="any"
                  readOnly={isPending}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className={`w-32 ml-auto block text-right bg-green-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-green-700/30 focus:border-green-700 ${isPending && "bg-green-50"}`}
                />
              );
            }}
          />
        </td>
      </>
    );
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeading
        title={`Quotation Details`}
        subtitle="Review pricing and respond to admin."
      />

      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-sm px-5 py-4 mb-5">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Product
          </p>
          <p className="text-base font-medium text-gray-800 mt-1">
            {quotation.productLocalName}
          </p>
        </div>
        <StatusBadge status={quotation.status} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <ReusableTable
          columns={columns}
          data={quotation.variants}
          renderRow={renderRow}
          rowKey={(item) => item.productListingVarientsId}
          emptyMessage="No variants found for this quotation."
        />

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={
              acceptMutation.isPending ||
              counterMutation.isPending ||
              quotation.status !== "request"
            }
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-800 disabled:opacity-60 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

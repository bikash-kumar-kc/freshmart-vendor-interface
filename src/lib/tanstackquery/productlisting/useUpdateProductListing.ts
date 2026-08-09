import productListingServices from "@/api/productListing/productListing.services";
import type { IUpdateProductListingPayload } from "@/types/productListing/productListing.type";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProductListing = () =>
  useMutation({
    mutationFn: (payload: IUpdateProductListingPayload) =>
      productListingServices.updateProductListing(payload),
  });

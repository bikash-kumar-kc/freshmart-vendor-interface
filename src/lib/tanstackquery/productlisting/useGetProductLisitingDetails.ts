import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../setup/queryKeys";
import type { ICreateProductListingPayload } from "@/types/productListing/productListing.type";

type getProductListing = ICreateProductListingPayload & {
  productListingId: number;
};
const productListingDetails: getProductListing = {
  productListingId: 100,
  productId: 1,
  type: "inventory",
  localName: "Organic Apple",
  categoryId: 1,
  keywords: "apple, organic, fresh",
  description: "Fresh organic apples sourced directly from local farms.",
  images: [
    {
      url: "Screenshot__232__ukSKgpdQ5.png",
      fileId: "6a77deb35c7cd75eb833d1aa",
    },
  ],
  originCountry: "Nepal",
  farmName: "Himalayan Organic Farm",
  packagingTypeId: 2,
  isTaxable: true,
  variants: [
    {
      size: 1,
      measurementId: 1,
      quantity: 100,
      pricePerUnit: 150,
      sellingPrice: 180,
    },
    {
      size: 1,
      measurementId: 1,
      quantity: 100,
      pricePerUnit: 150,
      sellingPrice: 180,
    },
    {
      size: 1,
      measurementId: 1,
      quantity: 100,
      pricePerUnit: 150,
      sellingPrice: 180,
    },
  ],
};

export const useGetProductListing = (
  id: string | undefined,
  //   isAuthenticated = false,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getproductlistingdetials, id],
    // queryFn: () =>
    //   productListingServices.getProductListingDetails(
    //     id as string,
    //     isAuthenticated,
    //   ),
    // enabled: !!id,
    queryFn: () => Promise.resolve(productListingDetails),
  });
};

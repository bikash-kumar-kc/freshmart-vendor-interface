import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../setup/queryKeys";
import productListingServices from "@/api/productListing/productListing.services";

export const useGetProductListing = (
  id: string | undefined,
  isAuthenticated = false,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getproductlistingdetials, id],
    queryFn: () =>
      productListingServices.getProductListingDetails(
        id as string,
        isAuthenticated,
      ),
    enabled: !!id,
  });
};

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { type IProductListParams } from "./requiredUtilis";
import productServices from "./service";
import { QUERY_KEYS } from "@/lib/tanstackquery/setup/queryKeys";

export const useApprovedProducts = (params: IProductListParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.getApprovedProducts, params],
    queryFn: () => productServices.getApprovedProducts(params),
    placeholderData: keepPreviousData,
  });

export const useUnapprovedProducts = (
  params: IProductListParams,
  enabled: boolean,
) =>
  useQuery({
    queryKey: [QUERY_KEYS.getUnApprovedProducts, params],
    queryFn: () => productServices.getUnapprovedProducts(params),
    placeholderData: keepPreviousData,
    enabled,
  });

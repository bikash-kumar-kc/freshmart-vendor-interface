import { useQuery, keepPreviousData } from "@tanstack/react-query";

import productServices from "./service";
import { QUERY_KEYS } from "@/lib/tanstackquery/setup/queryKeys";
import type { IProductListParams } from "./requiredUtilis";

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

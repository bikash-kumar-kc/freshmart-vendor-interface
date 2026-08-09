// queries/product.queries.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { mockApprovedProducts, mockProductResponse, mockUnapprovedProducts, type IProductListParams } from './requiredUtilis';
// import productServices from '@/services/product.services';

export const productKeys = {
  all: ['products'] as const,
  approved: (params: IProductListParams) => [...productKeys.all, 'approved', params] as const,
  unapproved: (params: IProductListParams) => [...productKeys.all, 'unapproved', params] as const,
};

export const useApprovedProducts = (params: IProductListParams) =>
  useQuery({
    queryKey: productKeys.approved(params),
    queryFn: () =>
      Promise.resolve(
        mockProductResponse(mockApprovedProducts, params.search ?? '', params.page ?? 1, params.pageSize ?? 10),
      ), // TODO: productServices.getApprovedProducts(params)
    placeholderData: keepPreviousData,
  });

export const useUnapprovedProducts = (params: IProductListParams, enabled: boolean) =>
  useQuery({
    queryKey: productKeys.unapproved(params),
    queryFn: () =>
      Promise.resolve(
        mockProductResponse(mockUnapprovedProducts, params.search ?? '', params.page ?? 1, params.pageSize ?? 10),
      ), // TODO: productServices.getUnapprovedProducts(params)
    placeholderData: keepPreviousData,
    enabled, // only fires when the user actually switches to the Unapproved view
  });
import productListingServices from '@/api/productListing/productListing.services';
import type { ICreateProductListingPayload } from '@/types/productListing/productListing.type';
import { useMutation } from '@tanstack/react-query';


export const useCreateProductListing = () =>
  useMutation({
    mutationFn: (payload: ICreateProductListingPayload) =>
      productListingServices.createProductListing(payload),
  });
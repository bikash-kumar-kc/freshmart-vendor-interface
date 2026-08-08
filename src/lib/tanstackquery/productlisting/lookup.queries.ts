import { useQuery } from '@tanstack/react-query';
import { mockProductNames, mockCategories, mockPackagingTypes, mockMeasurementTypes } from '@/mock/lookup.mock';

export const lookupKeys = {
  all: ['lookups'] as const,
  productNames: () => [...lookupKeys.all, 'product-names'] as const,
  categories: () => [...lookupKeys.all, 'categories'] as const,
  packagingTypes: () => [...lookupKeys.all, 'packaging-types'] as const,
  measurementTypes: () => [...lookupKeys.all, 'measurement-types'] as const,
};

export const useProductNames = () =>
  useQuery({
    queryKey: lookupKeys.productNames(),
    queryFn: () => Promise.resolve(mockProductNames), // TODO: lookupServices.getProductNames
  });

export const useCategories = () =>
  useQuery({
    queryKey: lookupKeys.categories(),
    queryFn: () => Promise.resolve(mockCategories), // TODO: lookupServices.getCategories
  });

export const usePackagingTypes = () =>
  useQuery({
    queryKey: lookupKeys.packagingTypes(),
    queryFn: () => Promise.resolve(mockPackagingTypes), // TODO: lookupServices.getPackagingTypes
  });

export const useMeasurementTypes = () =>
  useQuery({
    queryKey: lookupKeys.measurementTypes(),
    queryFn: () => Promise.resolve(mockMeasurementTypes), // TODO: lookupServices.getMeasurementTypes
  });
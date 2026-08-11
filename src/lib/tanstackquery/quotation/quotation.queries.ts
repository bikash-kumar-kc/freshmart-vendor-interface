import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import type { ICounterQuotationPayload, IQuotationListParams } from '../../../types/quotation/types';
import quotationServices from '@/api/quotation/quotation.services';

export const quotationKeys = {
  all: ['quotations'] as const,
  list: (params: IQuotationListParams) => [...quotationKeys.all, 'list', params] as const,
  detail: (id: number) => [...quotationKeys.all, 'detail', id] as const,
};

export const useQuotations = (params: IQuotationListParams) =>
  useQuery({
    queryKey: quotationKeys.list(params),
    queryFn: () => quotationServices.getQuotations(params),
    placeholderData: keepPreviousData,
  });

export const useQuotationDetail = (quotationId: number) =>
  useQuery({
    queryKey: quotationKeys.detail(quotationId),
    queryFn: () => quotationServices.getQuotationDetail(quotationId),
    enabled: !!quotationId,
  });

export const useAcceptQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quotationId: number) => quotationServices.acceptQuotation(quotationId),
    onSuccess: (_data, quotationId) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(quotationId) });
      queryClient.invalidateQueries({ queryKey: quotationKeys.all });
    },
  });
};

export const useCounterQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quotationId, payload }: { quotationId: number; payload: ICounterQuotationPayload }) =>
      quotationServices.counterQuotation(quotationId, payload),
    onSuccess: (_data, { quotationId }) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(quotationId) });
      queryClient.invalidateQueries({ queryKey: quotationKeys.all });
    },
  });
};
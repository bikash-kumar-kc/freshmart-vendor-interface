// queries/display-order.queries.ts — mock-backed versions

import { mockDisplayOrderResponse } from "./display-order.mock";
import type { IDisplayOrderListParams } from "./display-order.types";
import { displayOrderKeys } from "./hook";


export const useVendorDisplayOrders = (params: IDisplayOrderListParams) =>
  useQuery({
    queryKey: displayOrderKeys.list(params),
    queryFn: () =>
      Promise.resolve(
        mockDisplayOrderResponse(params.search ?? '', params.status ?? 'all', params.page ?? 1, params.limit ?? 10),
      ), // TODO: displayOrderServices.getVendorOrders(params)
    placeholderData: keepPreviousData,
  });

export const useDisplayOrderDetail = (orderId: string) =>
  useQuery({
    queryKey: displayOrderKeys.detail(orderId),
    queryFn: () => {
      const detail = mockDisplayOrderDetails[orderId];
      if (!detail) throw new Error('Order not found');
      return Promise.resolve(detail);
    }, // TODO: displayOrderServices.getOrderDetail(orderId)
    enabled: !!orderId,
  });
// queries/display-order.queries.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  IDisplayOrderListParams,
  IUpdateOrderStatusPayload,
} from "./display-order.types";
import displayOrderServices from "./service";
import { showToast } from "@/components/ReactToast";
import { mockDisplayOrderDetails, mockDisplayOrderResponse } from "./display-order.mock";

export const displayOrderKeys = {
  all: ["display-orders"] as const,
  list: (params: IDisplayOrderListParams) =>
    [...displayOrderKeys.all, "list", params] as const,
  detail: (id: string) => [...displayOrderKeys.all, "detail", id] as const,
};

// export const useVendorDisplayOrders = (params: IDisplayOrderListParams) =>
//   useQuery({
//     queryKey: displayOrderKeys.list(params),
//     queryFn: () => displayOrderServices.getVendorOrders(params),
//     placeholderData: keepPreviousData,
//   });

// export const useDisplayOrderDetail = (orderId: string) =>
//   useQuery({
//     queryKey: displayOrderKeys.detail(orderId),
//     queryFn: () => displayOrderServices.getOrderDetail(orderId),
//     enabled: !!orderId,
//   });

// queries/display-order.queries.ts — mock-backed versions


export const useVendorDisplayOrders = (params: IDisplayOrderListParams) =>
  useQuery({
    queryKey: displayOrderKeys.list(params),
    queryFn: () =>
      Promise.resolve(
        mockDisplayOrderResponse(
          params.search ?? "",
          params.status ?? "all",
          params.page ?? 1,
          params.limit ?? 10,
        ),
      ), // TODO: displayOrderServices.getVendorOrders(params)
    placeholderData: keepPreviousData,
  });

export const useDisplayOrderDetail = (orderId: string) =>
  useQuery({
    queryKey: displayOrderKeys.detail(orderId),
    queryFn: () => {
      const detail = mockDisplayOrderDetails[orderId];
      if (!detail) throw new Error("Order not found");
      return Promise.resolve(detail);
    }, // TODO: displayOrderServices.getOrderDetail(orderId)
    enabled: !!orderId,
  });

export const useCancelDisplayOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => displayOrderServices.cancelOrder(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: displayOrderKeys.all });
      showToast.success(
        "Order cancelled",
        "The order has been cancelled and stock released.",
      );
    },
    onError: () => {
      showToast.error("Failed to cancel order", "Please try again.");
    },
  });
};

export const useUpdateDisplayOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: IUpdateOrderStatusPayload;
    }) => displayOrderServices.updateOrderStatus(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: displayOrderKeys.all });
      showToast.success("Order status updated");
    },
    onError: () => {
      showToast.error("Failed to update status", "Please try again.");
    },
  });
};

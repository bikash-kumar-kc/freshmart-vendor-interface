
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  IDisplayOrderListParams,
  IUpdateOrderStatusPayload,
} from "../../../types/order/display-order.types";
import displayOrderServices from "../../../api/orders/service";
import { showToast } from "@/components/ReactToast";

export const displayOrderKeys = {
  all: ["display-orders"] as const,
  list: (params: IDisplayOrderListParams) =>
    [...displayOrderKeys.all, "list", params] as const,
  detail: (id: string) => [...displayOrderKeys.all, "detail", id] as const,
};

export const useVendorDisplayOrders = (params: IDisplayOrderListParams) =>
  useQuery({
    queryKey: displayOrderKeys.list(params),
    queryFn: () => displayOrderServices.getVendorOrders(params),
    placeholderData: keepPreviousData,
  });

export const useDisplayOrderDetail = (orderId: string) =>
  useQuery({
    queryKey: displayOrderKeys.detail(orderId),
    queryFn: () => displayOrderServices.getOrderDetail(orderId),
    enabled: !!orderId,
  });


export const useCancelDisplayOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => displayOrderServices.cancelOrder(orderId),
    onSuccess: () => {
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

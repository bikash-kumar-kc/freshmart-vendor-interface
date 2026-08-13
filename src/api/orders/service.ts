

import { api } from "@/api/axios";
import type {
  IDisplayOrderDetail,
  IDisplayOrderListParams,
  IDisplayOrderListResponse,
  IUpdateOrderStatusPayload,
} from "../../types/order/display-order.types";

class DisplayOrderServices {
  async getVendorOrders(params: IDisplayOrderListParams) {
    const { data } = await api.get<IDisplayOrderListResponse>(
      "/display-order/vendor",
      {
        params: {
          page: params.page,
          limit: params.limit,
        },
      },
    );
    return data;
  }

  async getOrderDetail(orderId: string) {
    const { data } = await api.get<IDisplayOrderDetail>(
      `/display-order/vendor/${orderId}`,
    );
    return data;
  }

  async cancelOrder(orderId: string) {
    const { data } = await api.patch(`/display-order/vendor/${orderId}/cancel`);
    return data;
  }

  async updateOrderStatus(orderId: string, payload: IUpdateOrderStatusPayload) {
    const { data } = await api.patch(
      `/display-order/vendor/${orderId}/status`,
      payload,
    );
    return data;
  }
}

const displayOrderServices = new DisplayOrderServices();
export default displayOrderServices;

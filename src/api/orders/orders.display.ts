import type {
  DisplayOrderStatus,
  IOrderDisplayType,
} from "@/types/order/order.type";
import { api } from "../axios";

class OrderDisplayServices {
  async getAllVendorDisplayOrders() {
    const { data } = await api.get<IOrderDisplayType[]>(
      "/display-order/vendor",
    );

    const displayOrderSegregation = new Map<
      DisplayOrderStatus,
      IOrderDisplayType[]
    >();

    for (const order of data) {
      if (!displayOrderSegregation.has(order.DisplayOrderStatus)) {
        displayOrderSegregation.set(order.DisplayOrderStatus, []);
      }

      displayOrderSegregation.get(order.DisplayOrderStatus)!.push(order);
    }

    return displayOrderSegregation;
  }
}

const orderdisplatservices = new OrderDisplayServices();

export default orderdisplatservices;

import { api } from "@/api/axios";
import { vendor } from "@/lib/openapi-op/endpoints";
import type { IDashboardStats } from "@/types/dashboardState.type";
import type { INotification } from "@/types/notification/notification.type";

class VendorDashboardServices {
  async getStats() {
    const { data } = await api.get<IDashboardStats>("/vendor/stats/dashboard");
    const res = await vendor.vendorCreatesANewProductListingWithOneOrMoreVariants()
    return data;
  }
  async getLatestNotifications(): Promise<INotification[]> {
    const { data } = await api.get("/notifications/vendor/latest");
    return data;
  }
}

const vendorDashboardServices = new VendorDashboardServices();
export default vendorDashboardServices;

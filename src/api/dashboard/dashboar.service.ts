import { api } from "@/api/axios";
import type { IDashboardStats } from "@/types/dashboardState.type";
import type { INotification } from "@/types/notification/notification.type";

class VendorDashboardServices {
  async getStats() {
    const { data } = await api.get<IDashboardStats>("/vendor/stats/dashboard");
    return data;
  }
  async getLatestNotifications(): Promise<INotification[]> {
    const { data } = await api.get("/notifications/vendor/latest");
    return data;
  }
}

const vendorDashboardServices = new VendorDashboardServices();
export default vendorDashboardServices;

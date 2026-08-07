import { api } from "@/api/axios";
import type { IDashboardStats, INotification } from "../../pages/dashboard/notification.types";


class VendorDashboardServices {
  async getStats(): Promise<IDashboardStats> {
    const { data } = await api.get('/vendor/stats/dashboard');
    return data;
  }
  async getLatestNotifications(): Promise<INotification[]> {
    const { data } = await api.get('/notifications/vendor/latest');
    return data;
  }
  async markNotificationRead(id: number, isRead = true): Promise<INotification> {
    const { data } = await api.patch(`/notifications/${id}/read`, { isRead });
    return data;
  }
}

const vendorDashboardServices = new VendorDashboardServices();
export default vendorDashboardServices;
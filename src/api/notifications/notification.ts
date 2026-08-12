import type {
  INotification,
  IUnreadCountResponse,
} from "@/types/notification/notification.type";
import { api } from "../axios";

class NotificationServices {
  async getAllNotification() {
    const { data } = await api.get<INotification[]>(`/notifications/vendor`);
    return data;
  }

  async markNotificationRead(id: number): Promise<INotification> {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  }

  async unreadnotifications() {
    const { data } = await api.get<IUnreadCountResponse>(
      `/notifications/vendor/unread-count`,
    );
    return data;
  }
}

const notificationservice = new NotificationServices();

export default notificationservice;

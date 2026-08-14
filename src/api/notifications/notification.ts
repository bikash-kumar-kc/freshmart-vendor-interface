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

  async toggleNotification(id: number) {
    const { data } = await api.patch<{ message: string }>(
      `/notifications/${id}`,
    );
    return data;
  }

  async unreadnotifications() {
    const { data } = await api.get<IUnreadCountResponse>(
      `/notifications/vendor/unread-count`,
    );
    return data;
  }

  async getLatestNofitication() {
    const { data } = await api.get<INotification[]>(
      "/notifications/vendor/latest",
    );
    return data;
  }
}

const notificationservice = new NotificationServices();

export default notificationservice;

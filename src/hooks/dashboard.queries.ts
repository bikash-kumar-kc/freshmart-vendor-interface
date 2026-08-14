import { showToast } from "./../components/ReactToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import notificationservice from "@/api/notifications/notification";
import vendorDashboardServices from "@/api/dashboard/dashboar.service";
import { queryClient } from "@/lib/tanstackquery/setup/queryClient";
import { QUERY_KEYS } from "@/lib/tanstackquery/setup/queryKeys";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  notifications: () => [...dashboardKeys.all, "notifications"] as const,
};

export const useDashboardStats = () =>
  useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: vendorDashboardServices.getStats,
  });


export const useToggleNotification = () => {
  return useMutation({
    mutationFn: ({ id }: { id: number; isRead?: boolean }) =>
      notificationservice.toggleNotification(id),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.getUnreadCount],
      });
      showToast.success(data.message);
    },
  });
};



export const useLatestNotifications = () =>
  useQuery({
    queryKey: dashboardKeys.notifications(),
    queryFn: notificationservice.getLatestNofitication,
  });

export const useRefetchLatestNotification = () =>
  useQuery({
    queryKey: [QUERY_KEYS.getUnreadCount],
    queryFn: notificationservice.unreadnotifications,
    refetchInterval: (query) => {
      const notification = query.state.data;
      if (!notification) return false;
      return notification.unreadCount > 0 ? 5000 : false;
    },
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

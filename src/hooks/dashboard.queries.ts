import { useMutation, useQuery } from "@tanstack/react-query";
import { mockNotifications, mockStats } from "../seed/notification.seed";
import notificationservice from "@/api/notifications/notification";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  notifications: () => [...dashboardKeys.all, "notifications"] as const,
};

// export const useDashboardStats = () =>
//   useQuery({ queryKey: dashboardKeys.stats(), queryFn: vendorDashboardServices.getStats });

// export const useLatestNotifications = () =>
//   useQuery({ queryKey: dashboardKeys.notifications(), queryFn: vendorDashboardServices.getLatestNotifications });

export const useMarkNotificationRead = () =>
  useMutation({
    mutationFn: ({ id }: { id: number; isRead?: boolean }) =>
      notificationservice.markNotificationRead(id),
  });

export const useDashboardStats = () =>
  useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => Promise.resolve(mockStats), // TODO: revert to vendorDashboardServices.getStats
  });

export const useLatestNotifications = () =>
  useQuery({
    queryKey: dashboardKeys.notifications(),
    queryFn: () => Promise.resolve(mockNotifications), // TODO: revert to vendorDashboardServices.getLatestNotifications
  });

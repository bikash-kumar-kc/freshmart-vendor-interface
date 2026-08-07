import { useMutation, useQuery } from '@tanstack/react-query';
import vendorDashboardServices from '../api/dashboard/dashboar.service';
import { mockNotifications, mockStats } from '../seed/notification.seed';


export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  notifications: () => [...dashboardKeys.all, 'notifications'] as const,
};

// export const useDashboardStats = () =>
//   useQuery({ queryKey: dashboardKeys.stats(), queryFn: vendorDashboardServices.getStats });

// export const useLatestNotifications = () =>
//   useQuery({ queryKey: dashboardKeys.notifications(), queryFn: vendorDashboardServices.getLatestNotifications });

export const useMarkNotificationRead = () =>
  useMutation({
    mutationFn: ({ id, isRead }: { id: number; isRead?: boolean }) =>
      vendorDashboardServices.markNotificationRead(id, isRead),
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
import notificationservice from '@/api/notifications/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

export const useNotifications = () =>
  useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationservice.getAllNotification,
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationservice.unreadnotifications,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationservice.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
};
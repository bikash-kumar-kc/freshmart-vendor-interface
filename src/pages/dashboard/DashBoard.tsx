import { useState } from 'react';
import { Package, FileSpreadsheet, Truck, ShoppingCart } from 'lucide-react';

import StatCard from './StatCard';
import NotificationCard from './NotificationCard';
import { useDashboardStats, useLatestNotifications, useMarkNotificationRead } from './dashboard.queries';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: notifications = [], isLoading: notifLoading } = useLatestNotifications();
  const markRead = useMarkNotificationRead();

  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [localRead, setLocalRead] = useState<Record<number, boolean>>({});

  const visibleNotifications = notifications.filter((n) => !hiddenIds.includes(n.id));

  const handleToggleRead = (id: number, isRead: boolean) => {
    setLocalRead((prev) => ({ ...prev, [id]: isRead }));
    markRead.mutate({ id, isRead });
  };

  const handleRemove = (id: number) => {
    markRead.mutate({ id, isRead: true });
    setHiddenIds((prev) => [...prev, id]);
  };

  return (
    <main className="p-5 sm:p-8 space-y-6 bg-background min-h-screen">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={statsLoading ? '—' : stats?.totalProducts ?? 0}
          text="Across all listings"
          icon={<Package className="w-4 h-4" />}
          accent="#3B6D11"
        />
        <StatCard
          label="Live Products"
          value={statsLoading ? '—' : stats?.liveProducts ?? 0}
          text="Currently orderable"
          icon={<ShoppingCart className="w-4 h-4" />}
          accent="#3B6D11"
        />
        <StatCard
          label="Pending Quotations"
          value={statsLoading ? '—' : stats?.pendingQuotations ?? 0}
          text="Awaiting your response"
          icon={<FileSpreadsheet className="w-4 h-4" />}
          accent="#C8742A"
        />
        <StatCard
          label="Active Display Orders"
          value={statsLoading ? '—' : stats?.activeDisplayOrders ?? 0}
          text="Pending or processing"
          icon={<Truck className="w-4 h-4" />}
          accent="#C8742A"
        />
      </div>

      {/* Recent notifications */}
      <div className="bg-slate-100/60 rounded-sm p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Recent Notifications</h2>

        {notifLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : visibleNotifications.length === 0 ? (
          <p className="text-sm text-slate-400">No notifications in the last 24 hours.</p>
        ) : (
          <div className="space-y-3">
            {visibleNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={{ ...n, isRead: localRead[n.id] ?? n.isRead }}
                onToggleRead={handleToggleRead}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
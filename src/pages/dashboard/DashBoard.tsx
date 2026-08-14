import { useState } from "react";
import { Package, FileSpreadsheet, Truck, ShoppingCart, type LucideProps } from "lucide-react";

import StatCard from "../../components/StatCard";
import NotificationCard from "../../components/NotificationCard";
import {
  useDashboardStats,
  useLatestNotifications,
  useToggleNotification,
} from "../../hooks/dashboard.queries";
import { useAuthContext } from "@/context/AuthContext";
import MotionStagger from "@/components/motion/MotionStagger";
import Motion from "@/components/motion/Motion";
import { statCards } from "./constant";

const iconMap:Record<string,React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>> = { Package, ShoppingCart, FileSpreadsheet, Truck };

export default function Dashboard() {
  const { user } = useAuthContext();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: notifications = [], isLoading: notifLoading } =
    useLatestNotifications();
  const markRead = useToggleNotification();

  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [localRead, setLocalRead] = useState<Record<number, boolean>>({});

  const visibleNotifications = notifications.filter(
    (n) => !hiddenIds.includes(n.id),
  );

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
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-700">
          Dashboard
        </h1>

        <p className="max-w-2xl text-sm text-gray-600 leading-6 tracking-wide">
          Welcome back,
          <span className="font-medium text-green-500"> {user?.email}</span>!
          This is your dashboard. Track your products, monitor orders, and stay
          updated with the latest notifications.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
        {statCards.map((card) => {
          const Icon = iconMap[card.iconName];
          return (
            <Motion key={card.key}>
              <StatCard
                label={card.label}
                value={statsLoading ? "—" : (stats?.[card.key] ?? 0)}
                text={card.text}
                icon={<Icon className="w-4 h-4" />}
                accent={card.accent}
              />
            </Motion>
          );
        })}
      </div>

      {/* Recent notifications */}
      <div className="bg-white rounded-sm p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-black mb-4">
          Recent Notifications
        </h2>

        {notifLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : visibleNotifications.length === 0 ? (
          <p className="text-sm text-slate-400">
            No notifications in the last 24 hours.
          </p>
        ) : (
          <div className="space-y-3">
            {visibleNotifications.map((n, idx) => (
              <MotionStagger key={n.id} idx={idx}>
                <NotificationCard
                  key={n.id}
                  notification={{ ...n, isRead: localRead[n.id] ?? n.isRead }}
                  onToggleRead={handleToggleRead}
                  onRemove={handleRemove}
                />
              </MotionStagger>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

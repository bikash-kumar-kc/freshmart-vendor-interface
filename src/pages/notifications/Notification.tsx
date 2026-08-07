import MotionStagger from "@/components/motion/MotionStagger";
import NotificationCard from "@/components/NotificationCard";
import PageHeading from "@/components/PagingHeading";
import ReusablePills from "@/components/ReuseablePills";
import { useMarkNotificationRead } from "@/hooks/dashboard.queries";

import { mockNotifications } from "@/seed/notification.seed";
import { notificationMeta } from "@/types/notification/notification.meta";
import type {
  INotification,
  NotificationSubType,
} from "@/types/notification/notification.type";
import { useMemo, useState } from "react";

type FilterValue = "all" | "unread" | NotificationSubType;

export default function NotificationsPage() {
  // const { data: notifications = [], isLoading } = useNotifications();
  // const notifications = mockNotifications;
  const markRead = useMarkNotificationRead();
  const [activePill, setActivePill] = useState<FilterValue>("all");
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  const [notifications, setNotification] =
    useState<INotification[]>(mockNotifications);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pillsItems = useMemo(() => {
    const presentSubTypes = Array.from(
      new Set(notifications.map((n) => n.subType)),
    );

    return [
      { label: "All", value: "all" as FilterValue },
      { label: "Unread", value: "unread" as FilterValue },
      ...presentSubTypes.map((st) => ({
        label: notificationMeta[st].label,
        value: st as FilterValue,
      })),
    ];
  }, [notifications]);

  const visible = notifications
    .filter((n) => !hiddenIds.includes(n.id))
    .filter((n) => {
      if (activePill === "all") return true;
      if (activePill === "unread") return !n.isRead;
      return n.subType === activePill;
    });

  const handleToggleRead = (id: number) => {
    markRead.mutate({ id });
    setNotification((prevs) =>
      prevs.map((p) => (p.id === id ? { ...p, isRead: !p.isRead } : p)),
    );
  };

  const handleRemove = (id: number) => {
    markRead.mutate({ id });
    setHiddenIds((prev) => [...prev, id]);
  };

  return (
    <main className="p-5 sm:p-8 bg-background min-h-screen">
      <PageHeading
        title="Notifications"
        subtitle="Stay on top of quotations, orders, and product updates."
      />

      <div className="mb-5">
        <ReusablePills
          pillsItems={pillsItems}
          activePill={activePill}
          onSelectPill={setActivePill}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-slate-400 ml-2 h-100 flex justify-center items-center">No notifications here.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((n, idx) => (
            <MotionStagger key={n.id} idx={idx}>
              <NotificationCard
                notification={n}
                onToggleRead={handleToggleRead}
                onRemove={handleRemove}
              />
            </MotionStagger>
          ))}
        </div>
      )}
    </main>
  );
}

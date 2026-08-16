import MotionStagger from "@/components/motion/MotionStagger";
import NotificationCard from "@/components/NotificationCard";
import PageHeading from "@/components/PagingHeading";
import ReusablePills from "@/components/ReuseablePills";
import { useToggleNotification } from "@/hooks/dashboard.queries";
import { useNotifications } from "@/hooks/notification.queries";

import { notificationMeta } from "@/types/notification/notification.meta";
import type {
  INotification,
  NotificationSubType,
} from "@/types/notification/notification.type";
import { useEffect, useMemo, useState } from "react";

type FilterValue = "all" | "unread" | NotificationSubType;

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();

  const markRead = useToggleNotification();
  const [activePill, setActivePill] = useState<FilterValue>("all");

  const [clientNotification, setClientNotification] =
    useState<INotification[]>(notifications);

  const pillsItems = useMemo(() => {
    const presentSubTypes = Array.from(
      new Set(clientNotification.map((n) => n.subType)),
    );

    return [
      { label: "All", value: "all" as FilterValue },
      { label: "Unread", value: "unread" as FilterValue },
      ...presentSubTypes.map((st) => ({
        label: notificationMeta[st].label,
        value: st as FilterValue,
      })),
    ];
  }, [clientNotification]);

  const visible = clientNotification.filter((n) => {
    if (activePill === "all") return true;
    if (activePill === "unread") {
      return !n.isRead;
    }
    return n.subType === activePill;
  });

  const handleToggleRead = (id: number) => {
    markRead.mutate(
      { id },
      {
        onError: () => {
          setClientNotification((prevs) =>
            prevs.map((p) => (p.id === id ? { ...p, isRead: !p.isRead } : p)),
          );
        },
      },
    );

    setClientNotification((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isRead: !i.isRead } : i)),
    );
  };

  const handleRemove = (id: number) => {
    console.log("sdf");
    console.log(id);
    setClientNotification((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (notifications) {
      setClientNotification(notifications);
    }
  }, [notifications]);

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
        <p className="text-sm text-slate-400 ml-2 h-100 flex justify-center items-center">
          No notifications here.
        </p>
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

import { useRefetchLatestNotification } from "@/hooks/dashboard.queries";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const navigate = useNavigate();

  const { data } = useRefetchLatestNotification();

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <button
      onClick={() => navigate("/notification")}
      className="relative flex items-center justify-center rounded-md bg-green-700 p-2 transition-colors hover:bg-green-800"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-white" />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}

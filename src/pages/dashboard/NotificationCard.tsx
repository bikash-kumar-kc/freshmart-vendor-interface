import { Clock, X, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import type { INotification } from "./notification.types";
import { getReferenceRoute, notificationMeta } from "./notification.meta";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
  notification: INotification;
  onToggleRead: (id: number, isRead: boolean) => void;
  onRemove: (id: number) => void;
}

export default function NotificationCard({
  notification,
  onToggleRead,
  onRemove,
}: NotificationCardProps) {
  const meta = notificationMeta[notification.subType];
  const Icon = meta.icon;
  const viewRoute = getReferenceRoute(
    notification.referenceType,
    notification.referenceId,
  );
  const isRead = notification.isRead;

  return (
    <div
      className={`rounded-sm px-4 py-3.5 flex items-start gap-3 border transition-colors ${isRead ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200"}`}
    >
      <div
        className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <p
              className={`text-sm truncate ${isRead ? "font-medium text-slate-500" : "font-semibold text-slate-800"}`}
            >
              {notification.message}
            </p>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shrink-0"
              style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-slate-300 hover:text-slate-500 shrink-0"
            aria-label="Remove notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {notification.content && (
          <p className="text-sm text-slate-500 mt-0.5 truncate">
            {notification.content}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2">
          {viewRoute && (
            <Link
              to={viewRoute}
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              View
            </Link>
          )}
          <button
            onClick={() => onToggleRead(notification.id, !isRead)}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            <Circle
              className={`w-2 h-2 ${isRead ? "" : "fill-cta text-cta"}`}
            />
            {isRead ? "Mark as unread" : "Mark as read"}
          </button>
          <span className="ml-auto flex items-center gap-1 text-xs text-slate-400 shrink-0">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

import { Clock, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getReferenceRoute,
  notificationMeta,
} from "../types/notification/notification.meta";
import type { INotification } from "@/types/notification/notification.type";
import { calculateRelativeTime } from "@/lib/calculateRelativeTime";

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
      className={`rounded-lg px-4 py-3.5 flex items-start gap-3 border shadow-sm transition-colors ${isRead ? "bg-white border-slate-100" : " bg-slate-50 border-slate-200"} transition-transform duration-300 ease-in-out hover:scale-102`}
      onClick={() => onToggleRead(notification.id, !isRead)}
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(notification.id);
            }}
            className="text-slate-300 hover:text-red-500 shrink-0"
            aria-label="Remove notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {notification.content && (
          <p className="text-[10px] text-slate-500 mt-0.5 truncate tracking-wide">
            {notification.content}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2">
          {viewRoute && (
            <Link
              to={viewRoute}
              className="text-xs font-medium px-2 py-1 rounded-sm text-white bg-green-700 hover:bg-green-500"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </Link>
          )}

          <span className="ml-auto flex items-center gap-1 text-xs text-slate-400 shrink-0">
            <Clock className="w-3 h-3" />
            {/* {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })} */}

            {calculateRelativeTime(notification.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { MousePointerClick, X } from "lucide-react";

interface RowExpandHintProps {
  message?: string;
  storageKey?: string;
}

export default function RowExpandHint({
  message = "Click on a row to view all variants",
  storageKey = "row-expand-hint",
}: RowExpandHintProps) {
  const dismissedPermanently = () =>
    localStorage.getItem(storageKey) === "dismissed";

  const [visible, setVisible] = useState(() => !dismissedPermanently());

  if (!visible) return null;

  const handleCancel = () => {
    // Session-only dismiss — hides now, but comes back next time this page/table mounts.
    setVisible(false);
  };

  const handleNeverShow = () => {
    // Persisted dismiss — hides now and on every future mount, until localStorage is cleared.
    localStorage.setItem(storageKey, "dismissed");
    setVisible(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-500 text-white border border-primary/10 rounded-sm text-xs  mb-3">
      <div className="flex items-center gap-2">
        <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleNeverShow}
          className="font-medium underline decoration-primary/40 hover:text-red-500 transition-colors"
        >
          Don't show again
        </button>
        <button
          onClick={handleCancel}
          className="text-primary/60 hover:text-green-500 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

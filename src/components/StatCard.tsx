import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  text: string;
  icon: ReactNode;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  text,
  icon,
  accent = "#3B6D11",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 pl-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <span
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 mt-2 leading-tight">
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1">{text}</p>
    </div>
  );
}

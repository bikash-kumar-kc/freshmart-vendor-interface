import type { ReactNode } from "react";

interface IPageHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeading({
  title,
  subtitle,
  action,
}: IPageHeadingProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

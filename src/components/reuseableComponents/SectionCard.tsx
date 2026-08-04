export function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-green-500 text-primary text-xs text-white font-semibold flex items-center justify-center shrink-0 mt-0.5">
          {step}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          {description && (
            <p className="text-xs text-slate-500 mt-0.1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
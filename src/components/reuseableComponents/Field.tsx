import { vendorFieldHelp } from "@/lib/constants/vendorHelp";
import Motion from "../motion/Motion";

export function Field({
  name,
  label,
  required,
  error,
  activeField,
  setActiveField,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  activeField?: string | null;
  setActiveField?: (name: string | null) => void;
  children: React.ReactNode;
}) {
  const isActive = activeField === name;
  const helpText = vendorFieldHelp[name];

  return (
    <Motion>
      <div
        onFocus={() => setActiveField(name)}
        onBlur={() => setActiveField(null)}
      >
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {children}
        {error ? (
          <p className="text-xs text-rose-500 mt-1">{error}</p>
        ) : isActive && helpText ? (
          <p className="text-xs text-gray-400 mt-1">{helpText}</p>
        ) : null}
      </div>
    </Motion>
  );
}

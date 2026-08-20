export const inputBaseClass =
  "w-full bg-green-50 border border-slate-200 rounded-sm px-3 py-2.5 text-sm text-slate-800 tracking-wider outline-none transition-colors placeholder:text-slate-400 placeholder:tracking-wider focus:ring-1 focus:ring-green-600";

export const inputErrorClass =
  "w-full bg-white border border-rose-300 rounded-sm px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400";
export function getInputClass(hasError: boolean) {
  return hasError ? inputErrorClass : inputBaseClass;
}

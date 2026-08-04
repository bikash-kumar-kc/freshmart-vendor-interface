import { FileText, UploadCloud, X } from "lucide-react";

export function FileUploadBox({
  label,
  previewUrl,
  onSelect,
  onRemove,
  accept = "application/pdf,image/*",
}: {
  label: string;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  accept?: string;
}) {
  if (previewUrl) {
    return (
      <div className="border border-slate-200 rounded-sm p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={"pan/vat certificate"}
                className="w-14 h-14 object-cover rounded-sm border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            )}
            <span className="text-sm text-slate-700 truncate">
              pan/vat certificate
            </span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-300 hover:text-rose-500 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-sm px-3 py-8 cursor-pointer transition-colors border-slate-300 text-slate-400 hover:text-primary hover:border-primary/50">
      <UploadCloud className="w-6 h-6" />
      <span className="text-sm">{label}</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}

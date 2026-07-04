import { RotateCcw, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadActionsProps = {
  onUpload: () => void;
  onReset: () => void;
  canUpload: boolean;
  isUploading: boolean;
};

export function UploadActions({
  onUpload,
  onReset,
  canUpload,
  isUploading,
}: UploadActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={onReset}
        disabled={isUploading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition",
          "hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>

      <button
        type="button"
        onClick={onUpload}
        disabled={!canUpload || isUploading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition",
          canUpload && !isUploading
            ? "bg-gradient-to-r from-indigo-500 to-violet-600 shadow-indigo-500/25 hover:opacity-90"
            : "cursor-not-allowed bg-white/10 text-slate-500 shadow-none",
        )}
      >
        <Upload className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload Dataset"}
      </button>
    </div>
  );
}

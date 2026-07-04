import { FileSpreadsheet, FolderUp } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadEmptyStateProps = {
  className?: string;
};

export function UploadEmptyState({ className }: UploadEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-10 text-center",
        className,
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-2xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
          <FolderUp className="h-8 w-8 text-indigo-400" />
        </div>
      </div>
      <h3 className="text-base font-medium text-slate-200">No dataset selected</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
        Upload a CSV file to start your AI analysis.
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
        <FileSpreadsheet className="h-3.5 w-3.5" />
        <span>CSV files up to 100 MB</span>
      </div>
    </div>
  );
}

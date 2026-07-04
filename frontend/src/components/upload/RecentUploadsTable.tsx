import { CheckCircle2, Clock, Eye, RotateCcw, Trash2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { UploadHistoryRecord } from "@/lib/upload-data";
import { cn } from "@/lib/utils";

type RecentUploadsTableProps = {
  uploads: UploadHistoryRecord[];
  isLoading?: boolean;
};

const statusConfig = {
  Processed: {
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-400",
  },
  Processing: {
    icon: Clock,
    className: "bg-amber-500/15 text-amber-400",
  },
  Failed: {
    icon: XCircle,
    className: "bg-rose-500/15 text-rose-400",
  },
} as const;

export function RecentUploadsTable({ uploads, isLoading = false }: RecentUploadsTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-white">Recent Uploads</h3>
        <p className="mt-1 text-sm text-slate-400">Previously uploaded datasets and their status</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium sm:px-6">Dataset</th>
              <th className="px-5 py-3 font-medium sm:px-6">Upload Date</th>
              <th className="px-5 py-3 font-medium sm:px-6">Rows</th>
              <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              <th className="px-5 py-3 font-medium sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-b border-white/5">
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-5 py-4 sm:px-6">
                        <div className="h-4 animate-pulse rounded-md bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              : uploads.map((upload) => {
                  const config = statusConfig[upload.status];
                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={upload.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4 font-medium text-slate-200 sm:px-6">
                        {upload.dataset}
                      </td>
                      <td className="px-5 py-4 text-slate-400 sm:px-6">{upload.uploadDate}</td>
                      <td className="px-5 py-4 text-slate-400 sm:px-6">{upload.rows}</td>
                      <td className="px-5 py-4 sm:px-6">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            config.className,
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {upload.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-indigo-400"
                            aria-label={`View ${upload.dataset}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-amber-400"
                            aria-label={`Retry ${upload.dataset}`}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-rose-400"
                            aria-label={`Delete ${upload.dataset}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

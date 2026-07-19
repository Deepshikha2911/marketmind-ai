import { CheckCircle2, Clock, FileSpreadsheet, XCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import type { UploadRecord } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

type RecentUploadsProps = {
  uploads: UploadRecord[];
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

export function RecentUploads({ uploads }: RecentUploadsProps) {
  const hasData = uploads.length > 0;

  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-white">Recent Uploads</h3>
        <p className="mt-1 text-sm text-slate-400">Latest datasets added to the platform</p>
      </div>

      {hasData ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium sm:px-6">File</th>
                <th className="px-5 py-3 font-medium sm:px-6">Uploaded</th>
                <th className="px-5 py-3 font-medium sm:px-6">Size</th>
                <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => {
                const config = statusConfig[upload.status] ?? statusConfig.Processed;
                const StatusIcon = config.icon;

                return (
                  <tr
                    key={upload.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                          <FileSpreadsheet className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-slate-200">{upload.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 sm:px-6">{upload.uploadedAt}</td>
                    <td className="px-5 py-4 text-slate-400 sm:px-6">{upload.size}</td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-6 sm:px-6">
          <EmptyState />
        </div>
      )}
    </GlassCard>
  );
}

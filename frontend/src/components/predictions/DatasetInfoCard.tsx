import { CheckCircle2, Clock, Database, FileSpreadsheet, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PredictionDatasetInfo, PredictionStatus } from "@/lib/predictions-data";
import { cn, formatNumber } from "@/lib/utils";

type DatasetInfoCardProps = {
  dataset: PredictionDatasetInfo;
};

const statusConfig: Record<
  PredictionStatus,
  { icon: typeof CheckCircle2; className: string }
> = {
  Ready: { icon: CheckCircle2, className: "bg-emerald-500/15 text-emerald-400" },
  Processing: { icon: Clock, className: "bg-amber-500/15 text-amber-400" },
  Failed: { icon: XCircle, className: "bg-rose-500/15 text-rose-400" },
  Pending: { icon: Clock, className: "bg-slate-500/15 text-slate-400" },
};

export function DatasetInfoCard({ dataset }: DatasetInfoCardProps) {
  const status = statusConfig[dataset.predictionStatus];
  const StatusIcon = status.icon;

  const items = [
    {
      label: "Selected Dataset",
      value: dataset.selectedDataset,
      icon: FileSpreadsheet,
    },
    {
      label: "Upload Time",
      value: dataset.uploadTime,
      icon: Clock,
    },
    {
      label: "Rows Processed",
      value: formatNumber(dataset.rowsProcessed),
      icon: Database,
    },
    {
      label: "Prediction Status",
      value: dataset.predictionStatus,
      icon: StatusIcon,
      isStatus: true,
    },
  ];

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ label, value, icon: Icon, isStatus }) => (
          <div
            key={label}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-indigo-500/20 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  isStatus ? status.className : "bg-indigo-500/15 text-indigo-400",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">{label}</p>
                {isStatus ? (
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                      status.className,
                    )}
                  >
                    {value}
                  </span>
                ) : (
                  <p className="mt-0.5 truncate text-sm font-semibold text-white">{value}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

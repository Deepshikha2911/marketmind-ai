import { CheckCircle2, AlertTriangle, MinusCircle, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { CampaignPerformance, CampaignStatus } from "@/lib/insights-data";
import { cn, formatCurrency } from "@/lib/utils";

type CampaignPerformanceTableProps = {
  campaigns: CampaignPerformance[];
};

const statusConfig: Record<
  CampaignStatus,
  { icon: typeof CheckCircle2; className: string }
> = {
  Performing: {
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
  },
  Stable: {
    icon: MinusCircle,
    className: "bg-slate-500/15 text-slate-300 ring-slate-500/25",
  },
  Underperforming: {
    icon: AlertTriangle,
    className: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
  },
  "At Risk": {
    icon: XCircle,
    className: "bg-rose-500/15 text-rose-400 ring-rose-500/25",
  },
};

export function CampaignPerformanceTable({ campaigns }: CampaignPerformanceTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-white">Campaign Performance</h3>
        <p className="mt-1 text-sm text-slate-400">
          Revenue, spend, and efficiency metrics by campaign
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium sm:px-6">Campaign</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Revenue</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Spend</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">ROI</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">ROAS</th>
              <th className="px-4 py-3 font-medium sm:px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((row, index) => {
              const config = statusConfig[row.status];
              const StatusIcon = config.icon;

              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-white/5 transition-all duration-200",
                    index % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent",
                    "hover:bg-indigo-500/[0.07] hover:shadow-[inset_3px_0_0_0_rgba(99,102,241,0.6)]",
                  )}
                >
                  <td className="px-4 py-3.5 font-medium text-slate-200 sm:px-6 sm:py-4">
                    {row.campaign}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-300 sm:px-6 sm:py-4">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-400 sm:px-6 sm:py-4">
                    {formatCurrency(row.spend)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-300 sm:px-6 sm:py-4">
                    {row.roi}%
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-indigo-300 sm:px-6 sm:py-4">
                    {row.roas.toFixed(1)}x
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                        config.className,
                      )}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {row.status}
                    </span>
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

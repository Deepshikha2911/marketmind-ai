import { CheckCircle2, AlertTriangle, Minus, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { CampaignLeaderboardRow, CampaignStatus } from "@/lib/analysis-data";
import { cn, formatCurrency } from "@/lib/utils";

type CampaignLeaderboardTableProps = {
  campaigns: CampaignLeaderboardRow[];
};

const statusConfig: Record<
  CampaignStatus,
  { variant: "success" | "high" | "medium" | "low"; icon: typeof CheckCircle2 }
> = {
  Performing: { variant: "success", icon: CheckCircle2 },
  Underperforming: { variant: "high", icon: TrendingDown },
  "At Risk": { variant: "low", icon: AlertTriangle },
  Stable: { variant: "medium", icon: Minus },
};

export function CampaignLeaderboardTable({ campaigns }: CampaignLeaderboardTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-white">Campaign Leaderboard</h3>
        <p className="mt-1 text-sm text-slate-400">
          Ranked campaign performance with AI predictions and recommendations
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium sm:px-6">Campaign</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Revenue</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Spend</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">ROI</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Predicted Revenue</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Forecast Revenue</th>
              <th className="px-4 py-3 font-medium sm:px-6">Recommendation</th>
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
                    "hover:bg-cyan-500/[0.06] hover:shadow-[inset_3px_0_0_0_rgba(34,211,238,0.5)]",
                  )}
                >
                  <td className="px-4 py-3.5 font-medium text-slate-200 sm:px-6 sm:py-4">
                    {row.campaign}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-emerald-300 sm:px-6 sm:py-4">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-400 sm:px-6 sm:py-4">
                    {formatCurrency(row.spend)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-cyan-300 sm:px-6 sm:py-4">
                    {row.roi}%
                  </td>
                  <td className="px-4 py-3.5 text-right text-indigo-300 sm:px-6 sm:py-4">
                    {formatCurrency(row.predictedRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-violet-300 sm:px-6 sm:py-4">
                    {formatCurrency(row.forecastRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 sm:px-6 sm:py-4">
                    {row.recommendation}
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                    <Badge variant={config.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {row.status}
                    </Badge>
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

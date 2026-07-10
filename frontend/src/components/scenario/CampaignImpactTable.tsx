"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, PauseCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { CampaignImpactRow, CampaignImpactStatus } from "@/lib/scenario-data";
import { cn, formatCurrency } from "@/lib/utils";

type CampaignImpactTableProps = {
  campaigns: CampaignImpactRow[];
};

const statusConfig: Record<
  CampaignImpactStatus,
  { variant: "success" | "high" | "medium" | "low"; icon: typeof ArrowUpRight }
> = {
  Increase: { variant: "success", icon: ArrowUpRight },
  Decrease: { variant: "high", icon: ArrowDownRight },
  Maintain: { variant: "medium", icon: Minus },
  Pause: { variant: "low", icon: PauseCircle },
};

export function CampaignImpactTable({ campaigns }: CampaignImpactTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <GlassCard className="overflow-hidden transition-all duration-300 hover:border-cyan-500/20">
        <div className="border-b border-white/10 px-4 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-white">Campaign Impact</h3>
          <p className="mt-1 text-sm text-slate-400">
            Per-campaign revenue projections and AI recommendations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium sm:px-6">Campaign</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">Current Revenue</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">Simulated Revenue</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">Difference</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">ROI</th>
                <th className="px-4 py-3 font-medium sm:px-6">Recommendation</th>
                <th className="px-4 py-3 font-medium sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((row, index) => {
                const config = statusConfig[row.status];
                const StatusIcon = config.icon;
                const isPositive = row.difference > 0;

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
                    <td className="px-4 py-3.5 text-right text-slate-400 sm:px-6 sm:py-4">
                      {formatCurrency(row.currentRevenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-cyan-300 sm:px-6 sm:py-4">
                      {formatCurrency(row.simulatedRevenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-6 sm:py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          isPositive
                            ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25"
                            : row.difference < 0
                              ? "bg-rose-500/15 text-rose-400 ring-rose-500/25"
                              : "bg-slate-500/15 text-slate-400 ring-slate-500/25",
                        )}
                      >
                        {row.difference > 0 ? "+" : ""}
                        {formatCurrency(row.difference)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-300 sm:px-6 sm:py-4">
                      {row.roi > 0 ? `${row.roi}%` : "—"}
                    </td>
                    <td className="max-w-[200px] px-4 py-3.5 text-slate-400 sm:px-6 sm:py-4">
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
    </motion.div>
  );
}

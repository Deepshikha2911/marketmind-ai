"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { DailyForecastRow, ForecastTrend } from "@/lib/forecast-data";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type DailyForecastTableProps = {
  rows: DailyForecastRow[];
};

const trendConfig: Record<
  ForecastTrend,
  { label: string; icon: typeof ArrowUp; className: string }
> = {
  up: {
    label: "Up",
    icon: ArrowUp,
    className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
  },
  down: {
    label: "Down",
    icon: ArrowDown,
    className: "bg-rose-500/15 text-rose-400 ring-rose-500/25",
  },
  stable: {
    label: "Stable",
    icon: Minus,
    className: "bg-slate-500/15 text-slate-300 ring-slate-500/25",
  },
};

export function DailyForecastTable({ rows }: DailyForecastTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-white">Daily Forecast</h3>
        <p className="mt-1 text-sm text-slate-400">
          Day-by-day revenue, spend, and profit projections
        </p>
      </div>

      <div className="predictions-table-scroll overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium sm:px-6">Date</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Predicted Revenue</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Predicted Spend</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Predicted Profit</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Confidence</th>
              <th className="px-4 py-3 text-right font-medium sm:px-6">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const trend = trendConfig[row.trend];
              const TrendIcon = trend.icon;

              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-white/5 transition-all duration-200",
                    index % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent",
                    "hover:bg-cyan-500/[0.07] hover:shadow-[inset_3px_0_0_0_rgba(34,211,238,0.6)]",
                  )}
                >
                  <td className="px-4 py-3.5 font-medium text-slate-200 sm:px-6 sm:py-4">
                    {row.label}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-indigo-300 sm:px-6 sm:py-4">
                    {formatCurrency(row.predictedRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-400 sm:px-6 sm:py-4">
                    {formatCurrency(row.predictedSpend)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-emerald-400 sm:px-6 sm:py-4">
                    {formatCurrency(row.predictedProfit)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-300 sm:px-6 sm:py-4">
                    {formatPercent(row.confidence, 0)}
                  </td>
                  <td className="px-4 py-3.5 text-right sm:px-6 sm:py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                        trend.className,
                      )}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {trend.label}
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

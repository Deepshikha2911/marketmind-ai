"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import type { RevenueOverviewPoint } from "@/lib/analysis-data";
import { formatCurrency } from "@/lib/utils";

type RevenueOverviewChartProps = {
  data: RevenueOverviewPoint[];
};

export function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  return (
    <GlassCard className="flex min-h-[26rem] flex-col p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[28rem] sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">Revenue Overview</h3>
        <p className="mt-1 text-sm text-slate-400">
          Actual, predicted, and forecast revenue across months
        </p>
      </div>

      <div className="min-h-[18rem] flex-1 w-full sm:min-h-[20rem]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={44}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                    <p className="mb-2 text-xs text-slate-400">{label}</p>
                    {payload.map((entry) => (
                      <p key={entry.name} className="text-sm text-white">
                        <span className="text-slate-400">{entry.name}: </span>
                        {formatCurrency(entry.value as number)}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Revenue"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ fill: "#34d399", r: 3, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted Revenue"
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={{ fill: "#818cf8", r: 3, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast Revenue"
              stroke="#22d3ee"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={{ fill: "#22d3ee", r: 3, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

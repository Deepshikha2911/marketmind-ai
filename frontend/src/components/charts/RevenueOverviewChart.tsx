"use client";

import {
  Area,
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
import { formatCurrency } from "@/lib/utils";

type RevenueOverviewChartProps = {
  data: Array<{ month: string; actual: number; predicted: number; forecast: number }>;
};

export function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  return (
    <GlassCard className="flex h-[420px] flex-col overflow-hidden p-4 transition-all duration-300 hover:border-cyan-500/20 sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">Revenue Overview</h3>
        <p className="mt-1 text-sm text-slate-400">
          Actual, predicted, and forecast revenue across the last 12 months
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.04} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={50}
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
              stroke="#a78bfa"
              strokeWidth={2.8}
              dot={{ fill: "#a78bfa", r: 3, strokeWidth: 0 }}
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted Revenue"
              stroke="#60a5fa"
              strokeWidth={2.8}
              dot={{ fill: "#60a5fa", r: 3, strokeWidth: 0 }}
              animationDuration={900}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              name="Forecast Revenue"
              stroke="#22d3ee"
              strokeWidth={2.8}
              fill="url(#forecastFill)"
              dot={{ fill: "#22d3ee", r: 3, strokeWidth: 0 }}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

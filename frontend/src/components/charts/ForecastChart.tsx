"use client";

import {
  Area,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency } from "@/lib/utils";

type ForecastChartProps = {
  data: Array<{ day: string; revenue: number; lower: number; upper: number }>;
};

export function ForecastChart({ data }: ForecastChartProps) {
  return (
    <GlassCard className="flex h-[420px] flex-col overflow-hidden p-4 transition-all duration-300 hover:border-cyan-500/20 sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">30-Day Revenue Forecast</h3>
        <p className="mt-1 text-sm text-slate-400">Predicted revenue with upper and lower confidence bounds</p>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              interval={4}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0]?.payload as (typeof data)[0];
                return (
                  <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                    <p className="mb-2 text-xs text-slate-400">{label}</p>
                    <p className="text-sm text-white">Predicted: {formatCurrency(point.revenue)}</p>
                    <p className="mt-1 text-xs text-cyan-300">Lower: {formatCurrency(point.lower)}</p>
                    <p className="mt-1 text-xs text-violet-300">Upper: {formatCurrency(point.upper)}</p>
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }} />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#confidenceBand)"
              fillOpacity={0.35}
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="transparent"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="upper"
              name="Upper Bound"
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="lower"
              name="Lower Bound"
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Predicted Revenue"
              stroke="#a78bfa"
              strokeWidth={2.8}
              dot={{ fill: "#a78bfa", r: 3, strokeWidth: 0 }}
              animationDuration={900}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

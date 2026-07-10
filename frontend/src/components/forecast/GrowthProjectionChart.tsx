"use client";

import {
  Area,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import type { GrowthProjectionPoint } from "@/lib/forecast-data";
import { formatCurrency } from "@/lib/utils";

type GrowthProjectionChartProps = {
  data: GrowthProjectionPoint[];
};

export function GrowthProjectionChart({ data }: GrowthProjectionChartProps) {
  return (
    <GlassCard className="flex h-full min-h-[22rem] flex-col p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[24rem] sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">Growth Projection</h3>
        <p className="mt-1 text-sm text-slate-400">
          Current trajectory vs AI forecasted growth
        </p>
      </div>

      <div className="min-h-[16rem] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="currentGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
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
              width={48}
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
            <Area
              type="monotone"
              dataKey="current"
              name="Current"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#currentGrowthGradient)"
            />
            <Area
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#forecastGrowthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

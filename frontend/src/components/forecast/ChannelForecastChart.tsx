"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ChannelForecast } from "@/lib/forecast-data";
import { formatCurrency } from "@/lib/utils";

type ChannelForecastChartProps = {
  data: ChannelForecast[];
};

const BAR_COLORS = ["#818cf8", "#22d3ee", "#a78bfa", "#34d399", "#f472b6", "#38bdf8"];

export function ChannelForecastChart({ data }: ChannelForecastChartProps) {
  return (
    <GlassCard className="flex h-full min-h-[22rem] flex-col p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[24rem] sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">Channel Forecast</h3>
        <p className="mt-1 text-sm text-slate-400">
          Forecast revenue by marketing channel
        </p>
      </div>

      <div className="min-h-[16rem] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="channel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              dy={8}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={56}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                    <p className="text-xs text-slate-400">{payload[0].payload.channel}</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(payload[0].value as number)}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="forecastRevenue" radius={[6, 6, 0, 0]} barSize={36}>
              {data.map((entry, index) => (
                <Cell key={entry.channel} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ChannelRoi } from "@/lib/budget-data";
import { formatNumber } from "@/lib/utils";

type ROIComparisonChartProps = {
  data: ChannelRoi[];
};

export function ROIComparisonChart({ data }: ROIComparisonChartProps) {
  return (
    <GlassCard className="flex h-full min-h-[22rem] flex-col p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[24rem] sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">ROI Comparison</h3>
        <p className="mt-1 text-sm text-slate-400">
          Current vs optimized ROI by channel
        </p>
      </div>

      <div className="min-h-[16rem] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="channel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
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
                        {formatNumber(entry.value as number)}%
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 8 }} />
            <Bar
              dataKey="currentRoi"
              name="Current ROI"
              fill="#818cf8"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="optimizedRoi"
              name="Optimized ROI"
              fill="#22d3ee"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

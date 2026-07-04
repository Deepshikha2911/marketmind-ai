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
import type { ChannelAllocation } from "@/lib/budget-data";
import { formatCurrency } from "@/lib/utils";

type BudgetAllocationChartProps = {
  data: ChannelAllocation[];
};

export function BudgetAllocationChart({ data }: BudgetAllocationChartProps) {
  return (
    <GlassCard className="flex h-full min-h-[22rem] flex-col p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[24rem] sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">Budget Allocation</h3>
        <p className="mt-1 text-sm text-slate-400">
          Current vs recommended budget by channel
        </p>
      </div>

      <div className="min-h-[16rem] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="channel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              width={100}
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
            <Bar
              dataKey="currentBudget"
              name="Current Budget"
              fill="#818cf8"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
            <Bar
              dataKey="recommendedBudget"
              name="Recommended Budget"
              fill="#22d3ee"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

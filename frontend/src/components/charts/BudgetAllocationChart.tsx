"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency } from "@/lib/utils";

type BudgetAllocationChartProps = {
  data: Array<{
    channel: string;
    current?: number;
    currentBudget?: number;
    optimized?: number;
    optimizedBudget?: number;
  }>;
};

export function BudgetAllocationChart({ data }: BudgetAllocationChartProps) {
  const chartData = data.map((item) => ({
    channel: item.channel,
    current: item.current ?? item.currentBudget ?? 0,
    optimized: item.optimized ?? item.optimizedBudget ?? 0,
  }));

  const pieData = chartData.map((item) => ({
    name: item.channel,
    value: item.optimized,
  }));

  return (
    <GlassCard className="flex min-h-[460px] flex-col overflow-hidden p-4 transition-all duration-300 hover:border-cyan-500/20 sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">Current vs Optimized Budget</h3>
        <p className="mt-1 text-sm text-slate-400">Grouped channels with optimized allocation mix</p>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="channel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
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
              <Bar dataKey="current" name="Current Budget" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="optimized" name="Optimized Budget" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={92}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={index % 2 === 0 ? "#8b5cf6" : "#60a5fa"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value ?? 0))}
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

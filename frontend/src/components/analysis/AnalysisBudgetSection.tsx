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
import { PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BudgetOptimizationData } from "@/lib/analysis-data";
import { formatCurrency } from "@/lib/utils";

type AnalysisBudgetSectionProps = {
  budget: BudgetOptimizationData;
};

export function AnalysisBudgetSection({ budget }: AnalysisBudgetSectionProps) {
  const chartData = budget.allocation.map((a) => ({
    channel: a.channel,
    current: a.currentBudget,
    optimized: a.optimizedBudget,
  }));

  const summaryTiles = [
    {
      label: "Current Budget",
      value: formatCurrency(budget.currentBudget),
      icon: Wallet,
      accent: "text-indigo-400 bg-indigo-500/15",
    },
    {
      label: "Recommended Budget",
      value: formatCurrency(budget.recommendedBudget),
      icon: TrendingUp,
      accent: "text-cyan-400 bg-cyan-500/15",
    },
    {
      label: "Revenue Increase",
      value: `+${formatCurrency(budget.revenueIncrease)}`,
      icon: TrendingUp,
      accent: "text-emerald-400 bg-emerald-500/15",
    },
    {
      label: "Savings",
      value: formatCurrency(budget.savings),
      icon: PiggyBank,
      accent: "text-violet-400 bg-violet-500/15",
    },
  ];

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Budget Optimization</h2>
        <p className="mt-1 text-sm text-slate-400">
          AI-recommended budget allocation across channels
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryTiles.map(({ label, value, icon: Icon, accent }) => (
          <GlassCard
            key={label}
            className="p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/25 sm:p-5"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white sm:text-xl">{value}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-6 flex min-h-[22rem] flex-col p-4 sm:min-h-[24rem] sm:p-6">
        <div className="mb-4 shrink-0 sm:mb-6">
          <h3 className="text-base font-semibold text-white">Current vs Optimized Budget</h3>
          <p className="mt-1 text-sm text-slate-400">Channel-level budget reallocation</p>
        </div>

        <div className="min-h-[16rem] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                horizontal={false}
              />
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
                width={80}
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
                dataKey="current"
                name="Current Budget"
                fill="#818cf8"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
              <Bar
                dataKey="optimized"
                name="Optimized Budget"
                fill="#22d3ee"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </section>
  );
}

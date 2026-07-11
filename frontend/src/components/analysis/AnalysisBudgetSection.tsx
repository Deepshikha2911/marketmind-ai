"use client";

import { PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { BudgetAllocationChart } from "@/components/charts/BudgetAllocationChart";
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

      <div className="mt-6">
        <BudgetAllocationChart data={chartData} />
      </div>
    </section>
  );
}

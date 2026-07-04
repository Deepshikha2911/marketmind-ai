import {
  DollarSign,
  PiggyBank,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BudgetSummary } from "@/lib/budget-data";
import { formatCurrency, formatNumber } from "@/lib/utils";

type BudgetSummaryCardsProps = {
  summary: BudgetSummary;
};

const kpiConfig = [
  {
    key: "recommendedBudget" as const,
    title: "Recommended Budget",
    icon: Wallet,
    format: (s: BudgetSummary) => formatCurrency(s.recommendedBudget),
    accent: "text-indigo-400 bg-indigo-500/15",
  },
  {
    key: "estimatedRevenueIncrease" as const,
    title: "Estimated Revenue Increase",
    icon: TrendingUp,
    format: (s: BudgetSummary) => `+${formatCurrency(s.estimatedRevenueIncrease)}`,
    accent: "text-cyan-400 bg-cyan-500/15",
  },
  {
    key: "budgetSaved" as const,
    title: "Budget Saved",
    icon: PiggyBank,
    format: (s: BudgetSummary) => formatCurrency(s.budgetSaved),
    accent: "text-emerald-400 bg-emerald-500/15",
  },
  {
    key: "averageRoas" as const,
    title: "Average ROAS",
    icon: Target,
    format: (s: BudgetSummary) => `${s.averageRoas.toFixed(1)}x`,
    accent: "text-violet-400 bg-violet-500/15",
  },
  {
    key: "optimizationScore" as const,
    title: "Optimization Score",
    icon: Sparkles,
    format: (s: BudgetSummary) => `${s.optimizationScore}/100`,
    accent: "text-indigo-400 bg-indigo-500/15",
  },
  {
    key: "campaignsOptimized" as const,
    title: "Campaigns Optimized",
    icon: DollarSign,
    format: (s: BudgetSummary) => formatNumber(s.campaignsOptimized),
    accent: "text-cyan-400 bg-cyan-500/15",
  },
];

export function BudgetSummaryCards({ summary }: BudgetSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiConfig.map(({ key, title, icon: Icon, format, accent }) => (
        <GlassCard
          key={key}
          className="group flex h-full flex-col p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 sm:p-5"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${accent}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="mt-3 flex flex-1 flex-col">
            <p className="text-xs text-slate-400 sm:text-sm">{title}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              {format(summary)}
            </p>
          </div>
        </GlassCard>
      ))}
    </section>
  );
}

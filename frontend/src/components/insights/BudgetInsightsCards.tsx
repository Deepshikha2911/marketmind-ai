import { AlertCircle, PiggyBank, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BudgetInsights } from "@/lib/insights-data";

type BudgetInsightsCardsProps = {
  budget: BudgetInsights;
};

export function BudgetInsightsCards({ budget }: BudgetInsightsCardsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Budget Insights</h2>
        <p className="mt-1 text-sm text-slate-400">Spend efficiency and allocation opportunities</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <GlassCard className="flex h-full flex-col border-rose-500/15 p-5 transition-all duration-300 hover:border-rose-500/30 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">Overspending Campaigns</h3>
          <ul className="mt-3 flex-1 space-y-2">
            {budget.overspendingCampaigns.map((campaign) => (
              <li
                key={campaign}
                className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                {campaign}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="flex h-full flex-col border-emerald-500/15 p-5 transition-all duration-300 hover:border-emerald-500/30 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <PiggyBank className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">Underutilized Budget</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
            {budget.underutilizedBudget}
          </p>
        </GlassCard>

        <GlassCard className="flex h-full flex-col border-indigo-500/15 p-5 transition-all duration-300 hover:border-indigo-500/30 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">Budget Efficiency Score</h3>
          <p className="mt-3 text-3xl font-bold text-white">{budget.budgetEfficiencyScore}/100</p>
          <progress
            value={budget.budgetEfficiencyScore}
            max={100}
            className="upload-progress mt-4 h-2 w-full"
          />
          <p className="mt-3 text-xs text-slate-500">
            Measures how effectively spend converts to revenue across channels
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

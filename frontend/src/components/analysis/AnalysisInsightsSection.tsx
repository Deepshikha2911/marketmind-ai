import { ArrowRight, Lightbulb, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AnalysisInsight } from "@/lib/analysis-data";
import { cn, formatCurrency } from "@/lib/utils";

type AnalysisInsightsSectionProps = {
  insights: AnalysisInsight[];
};

const priorityStyles = {
  High: {
    badge: "bg-rose-500/15 text-rose-400 ring-rose-500/25",
    border: "border-rose-500/20 hover:border-rose-500/35",
    icon: Zap,
  },
  Medium: {
    badge: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
    border: "border-amber-500/15 hover:border-amber-500/30",
    icon: Lightbulb,
  },
  Low: {
    badge: "bg-slate-500/15 text-slate-300 ring-slate-500/25",
    border: "border-white/10 hover:border-white/20",
    icon: ArrowRight,
  },
};

export function AnalysisInsightsSection({ insights }: AnalysisInsightsSectionProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">AI Insights</h2>
        <p className="mt-1 text-sm text-slate-400">
          Prioritized recommendations from the AI insights engine
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {insights.map((insight) => {
          const style = priorityStyles[insight.priority];
          const PriorityIcon = style.icon;

          return (
            <GlassCard
              key={insight.id}
              className={cn(
                "group flex h-full flex-col border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 sm:p-6",
                style.border,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                    style.badge,
                  )}
                >
                  <PriorityIcon className="h-3 w-3" />
                  {insight.priority}
                </span>
                <span className="shrink-0 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                  {insight.category}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">{insight.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                {insight.explanation}
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Business Impact
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{insight.businessImpact}</p>
                </div>
                <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-indigo-300/80">
                    Recommended Action
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{insight.recommendedAction}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs text-slate-500">Revenue Opportunity</span>
                <span className="text-sm font-semibold text-emerald-400">
                  +{formatCurrency(insight.estimatedRevenueGain)}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

import { ArrowRight, Lightbulb, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AIRecommendation, RecommendationPriority } from "@/lib/insights-data";
import { cn, formatCurrency } from "@/lib/utils";

type AIRecommendationsProps = {
  recommendations: AIRecommendation[];
};

const priorityStyles: Record<
  RecommendationPriority,
  { badge: string; border: string; icon: typeof Zap }
> = {
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

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
        <p className="mt-1 text-sm text-slate-400">
          Actionable insights prioritized by business impact
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {recommendations.map((rec) => {
          const style = priorityStyles[rec.priority];
          const PriorityIcon = style.icon;

          return (
            <GlassCard
              key={rec.id}
              className={cn(
                "group flex h-full flex-col border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 sm:p-6",
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
                  {rec.priority} Priority
                </span>
                <span className="shrink-0 text-xs font-medium text-emerald-400">
                  +{formatCurrency(rec.estimatedRevenueGain)}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">{rec.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{rec.explanation}</p>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Business Impact
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{rec.businessImpact}</p>
                </div>
                <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-indigo-300/80">
                    Recommended Action
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{rec.recommendedAction}</p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs text-slate-500">Estimated Revenue Gain</span>
                <span className="text-sm font-semibold text-emerald-400">
                  {formatCurrency(rec.estimatedRevenueGain)}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

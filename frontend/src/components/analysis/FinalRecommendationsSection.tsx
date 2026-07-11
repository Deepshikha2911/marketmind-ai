import { ArrowRight, Lightbulb, Sparkles, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FinalRecommendation, RecommendationPriority } from "@/lib/analysis-data";
import { cn, formatCurrency } from "@/lib/utils";

type FinalRecommendationsSectionProps = {
  recommendations: FinalRecommendation[];
};

const priorityStyles: Record<
  RecommendationPriority,
  { badge: string; border: string; icon: typeof Zap }
> = {
  High: {
    badge: "bg-rose-500/15 text-rose-400 ring-rose-500/25",
    border: "border-rose-500/15 hover:border-rose-500/30",
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

export function FinalRecommendationsSection({
  recommendations,
}: FinalRecommendationsSectionProps) {
  return (
    <GlassCard className="relative overflow-hidden border-indigo-500/25 p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              AI Final Recommendations
            </h2>
            <p className="text-sm text-slate-400">
              Top 10 executive actions synthesized from all AI modules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {recommendations.map((rec, index) => {
            const style = priorityStyles[rec.priority];
            const PriorityIcon = style.icon;

            return (
              <div
                key={rec.id}
                className={cn(
                  "group rounded-xl border bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-indigo-500/5 sm:p-6",
                  style.border,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                        style.badge,
                      )}
                    >
                      <PriorityIcon className="h-3 w-3" />
                      {rec.priority}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-emerald-400">
                    +{formatCurrency(rec.estimatedRevenueGain)}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">{rec.title}</h3>

                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Expected Business Impact
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{rec.businessImpact}</p>
                  </div>
                  <div className="rounded-lg border border-indigo-500/15 bg-indigo-500/5 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-indigo-300/80">
                      Recommended Action
                    </p>
                    <p className="mt-1 text-sm text-slate-200">{rec.recommendedAction}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs text-slate-500">Estimated Revenue Gain</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {formatCurrency(rec.estimatedRevenueGain)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

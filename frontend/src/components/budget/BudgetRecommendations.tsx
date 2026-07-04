import { ArrowRight, Lightbulb, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BudgetPriority, BudgetRecommendation } from "@/lib/budget-data";
import { cn, formatCurrency } from "@/lib/utils";

type BudgetRecommendationsProps = {
  recommendations: BudgetRecommendation[];
};

const priorityConfig: Record<
  BudgetPriority,
  { variant: "high" | "medium" | "low"; border: string; icon: typeof Zap }
> = {
  High: { variant: "high", border: "border-rose-500/20 hover:border-rose-500/35", icon: Zap },
  Medium: {
    variant: "medium",
    border: "border-amber-500/15 hover:border-amber-500/30",
    icon: Lightbulb,
  },
  Low: { variant: "low", border: "border-white/10 hover:border-white/20", icon: ArrowRight },
};

export function BudgetRecommendations({ recommendations }: BudgetRecommendationsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">AI Recommendation Panel</h2>
        <p className="mt-1 text-sm text-slate-400">
          Prioritized budget allocation actions powered by MarketMind AI
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((rec, index) => {
          const config = priorityConfig[rec.priority];
          const PriorityIcon = config.icon;

          return (
            <GlassCard
              key={rec.id}
              className={cn(
                "flex h-full flex-col border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 sm:p-6",
                config.border,
                index === 0 && "xl:col-span-1 ring-1 ring-cyan-500/20",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <Badge variant={config.variant} className="gap-1">
                  <PriorityIcon className="h-3 w-3" />
                  {rec.priority}
                </Badge>
                <span className="text-xs font-semibold text-cyan-400">
                  +{formatCurrency(rec.estimatedGain)}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">{rec.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                {rec.explanation}
              </p>

              <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Estimated Gain
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">
                    +{formatCurrency(rec.estimatedGain)}
                  </p>
                </div>
                <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-cyan-300/80">
                    Suggested Action
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{rec.suggestedAction}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

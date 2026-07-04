import { Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { OptimizationInsight } from "@/lib/budget-data";

type OptimizationInsightsProps = {
  insights: OptimizationInsight[];
};

export function OptimizationInsights({ insights }: OptimizationInsightsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Optimization Insights</h2>
        <p className="mt-1 text-sm text-slate-400">
          Key findings from AI budget analysis
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {insights.map((insight) => (
          <GlassCard
            key={insight.id}
            className="flex h-full gap-4 border border-white/5 p-5 transition-all duration-300 hover:border-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/5 sm:p-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {insight.description}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

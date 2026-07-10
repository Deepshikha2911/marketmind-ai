import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastInsight } from "@/lib/forecast-data";

type ForecastInsightsProps = {
  insights: ForecastInsight[];
};

export function ForecastInsights({ insights }: ForecastInsightsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Forecast Insights</h2>
        <p className="mt-1 text-sm text-slate-400">
          AI-generated predictions from campaign performance analysis
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <GlassCard
            key={insight.id}
            className={`flex h-full gap-4 border border-white/5 p-5 transition-all duration-300 hover:border-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/5 sm:p-6 ${
              index === 0 ? "ring-1 ring-cyan-500/15" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-cyan-400">
              <Sparkles className="h-5 w-5" />
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

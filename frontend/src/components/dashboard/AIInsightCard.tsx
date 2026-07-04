import { ArrowRight, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AIInsight } from "@/lib/dashboard-data";

type AIInsightCardProps = {
  insights: AIInsight[];
};

export function AIInsightCard({ insights }: AIInsightCardProps) {
  const hasData = insights.length > 0;
  const primary = insights[0];

  return (
    <GlassCard className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">AI Insights</h3>
            <p className="text-sm text-slate-400">Powered by MarketMind AI</p>
          </div>
        </div>

        {hasData ? (
          <>
            {primary && (
              <div className="mb-5 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                    {primary.tag}
                  </span>
                  <span className="text-xs text-slate-500">{primary.confidence}% confidence</span>
                </div>
                <h4 className="font-medium text-white">{primary.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{primary.description}</p>
              </div>
            )}

            <div className="space-y-3">
              {insights.slice(1).map((insight) => (
                <div
                  key={insight.id}
                  className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200">{insight.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{insight.description}</p>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-indigo-400" />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white"
            >
              View all insights
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </GlassCard>
  );
}

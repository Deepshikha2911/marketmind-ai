import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AnalysisBottomSummary } from "@/lib/analysis-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

type AnalysisBottomSummaryCardProps = {
  summary: AnalysisBottomSummary;
};

export function AnalysisBottomSummaryCard({ summary }: AnalysisBottomSummaryCardProps) {
  const metrics = [
    {
      label: "Overall Score",
      value: `${summary.overallScore}/100`,
      highlight: true,
    },
    {
      label: "Predicted Revenue",
      value: formatCurrency(summary.predictedRevenue),
    },
    {
      label: "Optimization Gain",
      value: `+${formatCurrency(summary.optimizationGain)}`,
    },
    {
      label: "Forecast Growth",
      value: `+${formatPercent(summary.forecastGrowth)}`,
    },
    {
      label: "Best Scenario",
      value: summary.bestScenario,
    },
    {
      label: "Confidence",
      value: formatPercent(summary.confidence, 0),
    },
  ];

  return (
    <GlassCard className="relative overflow-hidden border-indigo-500/30 p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-cyan-500/8 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-300">
                MarketMind AI Executive Summary
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                Complete Analysis Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Unified intelligence from predictions, insights, budget, forecast, and scenarios
              </p>
            </div>
          </div>

          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center self-center sm:self-auto">
            <div
              className="insights-score-ring absolute inset-0 rounded-full"
              style={{ ["--score" as string]: summary.overallScore }}
            />
            <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-[#0f0f14]">
              <span className="text-2xl font-bold text-white">{summary.overallScore}</span>
              <span className="text-[10px] text-slate-500">Score</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`rounded-xl border p-5 transition-colors hover:bg-white/[0.05] ${
                highlight
                  ? "border-indigo-500/25 bg-indigo-500/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p
                className={`mt-2 text-xl font-bold tracking-tight sm:text-2xl ${
                  highlight ? "text-indigo-300" : "text-white"
                }`}
              >
                {value}
              </p>
              {highlight && (
                <progress
                  value={summary.overallScore}
                  max={100}
                  className="upload-progress mt-4 h-2 w-full"
                />
              )}
              {label === "Confidence" && (
                <progress
                  value={summary.confidence}
                  max={100}
                  className="upload-progress mt-4 h-2 w-full"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-cyan-300/80">
            Final Recommendation
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
            {summary.finalRecommendation}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

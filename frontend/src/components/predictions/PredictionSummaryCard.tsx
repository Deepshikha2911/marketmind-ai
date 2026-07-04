import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PredictionSummary } from "@/lib/predictions-data";
import { cn, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

type PredictionSummaryCardProps = {
  summary: PredictionSummary;
  className?: string;
};

const summaryItems = [
  { key: "totalPredictions" as const, label: "Total Predictions", format: formatNumber },
  { key: "averagePrediction" as const, label: "Average Prediction", format: formatCurrency },
  { key: "highestPrediction" as const, label: "Highest Prediction", format: formatCurrency },
  { key: "lowestPrediction" as const, label: "Lowest Prediction", format: formatCurrency },
];

export function PredictionSummaryCard({ summary, className }: PredictionSummaryCardProps) {
  return (
    <GlassCard
      className={cn(
        "relative flex h-full min-h-[22rem] flex-col overflow-hidden p-4 transition-all duration-300 hover:border-indigo-500/20 sm:min-h-[24rem] sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative flex flex-1 flex-col">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Prediction Summary</h3>
            <p className="text-sm text-slate-400">Model output overview</p>
          </div>
        </div>

        <div className="space-y-3">
          {summaryItems.map(({ key, label, format }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
            >
              <span className="text-sm text-slate-400">{label}</span>
              <span className="text-sm font-semibold text-white">{format(summary[key])}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Confidence Score</span>
            <span className="text-lg font-semibold text-indigo-300">
              {formatPercent(summary.confidenceScore)}
            </span>
          </div>
          <progress
            value={summary.confidenceScore}
            max={100}
            className="upload-progress mt-3 h-2 w-full"
          />
          <p className="mt-2 text-xs text-slate-500">
            Model confidence based on data quality and feature completeness
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

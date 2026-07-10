import { LineChart, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastSummary } from "@/lib/forecast-data";
import { cn, formatPercent } from "@/lib/utils";

type ForecastSummaryCardProps = {
  summary: ForecastSummary;
  className?: string;
};

const summaryItems = [
  { key: "currentTrend" as const, label: "Current Trend" },
  { key: "expectedGrowth" as const, label: "Expected Growth" },
  { key: "businessOutlook" as const, label: "Business Outlook" },
];

export function ForecastSummaryCard({ summary, className }: ForecastSummaryCardProps) {
  return (
    <GlassCard
      className={cn(
        "relative flex h-full min-h-[22rem] flex-col overflow-hidden p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[24rem] sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative flex flex-1 flex-col">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
            <LineChart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Forecast Summary</h3>
            <p className="text-sm text-slate-400">AI model outlook overview</p>
          </div>
        </div>

        <div className="space-y-3">
          {summaryItems.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
            >
              <span className="text-sm text-slate-400">{label}</span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  key === "expectedGrowth" ? "text-cyan-400" : "text-white",
                )}
              >
                {summary[key]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Confidence</span>
            <span className="text-lg font-semibold text-cyan-300">
              {formatPercent(summary.confidence, 0)}
            </span>
          </div>
          <progress
            value={summary.confidence}
            max={100}
            className="upload-progress mt-3 h-2 w-full"
          />
          <div className="mt-3 flex items-start gap-2">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
            <p className="text-xs leading-relaxed text-slate-500">
              Forecast derived from 90-day campaign history, seasonality patterns, and channel
              performance signals
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

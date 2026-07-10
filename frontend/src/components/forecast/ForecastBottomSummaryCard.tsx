import { LineChart } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastBottomSummary } from "@/lib/forecast-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

type ForecastBottomSummaryCardProps = {
  summary: ForecastBottomSummary;
};

export function ForecastBottomSummaryCard({ summary }: ForecastBottomSummaryCardProps) {
  const metrics = [
    {
      label: "Overall Forecast Score",
      value: `${summary.overallScore}/100`,
      highlight: true,
    },
    {
      label: "Expected Revenue",
      value: formatCurrency(summary.expectedRevenue),
    },
    {
      label: "Expected Growth",
      value: formatPercent(summary.expectedGrowth),
    },
    {
      label: "Confidence",
      value: formatPercent(summary.confidence, 0),
    },
  ];

  return (
    <GlassCard className="relative overflow-hidden border-cyan-500/20 p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
            <LineChart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Executive Summary
            </h2>
            <p className="text-sm text-slate-400">AI revenue forecast at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, highlight }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-500/25 hover:bg-white/[0.05]"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p
                className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${
                  highlight ? "text-cyan-400" : "text-white"
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
      </div>
    </GlassCard>
  );
}

import { BarChart3, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AnalysisExecutiveSummary as ExecutiveSummaryData } from "@/lib/analysis-data";
import { formatCurrency } from "@/lib/utils";

type AnalysisExecutiveSummaryProps = {
  summary: ExecutiveSummaryData;
};

const metrics = [
  { key: "totalRevenue" as const, label: "Total Revenue", highlight: false },
  { key: "totalSpend" as const, label: "Total Spend", highlight: false },
  { key: "profit" as const, label: "Profit", highlight: true },
  { key: "averageRoi" as const, label: "Average ROI", format: (v: number) => `${v}%` },
  { key: "averageRoas" as const, label: "Average ROAS", format: (v: number) => `${v.toFixed(2)}x` },
  { key: "predictedRevenue" as const, label: "Predicted Revenue", highlight: true },
  { key: "forecastRevenue" as const, label: "Forecast Revenue", highlight: true },
  { key: "optimizationGain" as const, label: "Optimization Gain", prefix: "+", highlight: true },
  { key: "scenarioGain" as const, label: "Scenario Gain", prefix: "+", highlight: true },
];

export function AnalysisExecutiveSummary({ summary }: AnalysisExecutiveSummaryProps) {
  return (
    <GlassCard className="relative overflow-hidden border-cyan-500/20 p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Executive Summary</h2>
            <p className="text-sm text-slate-400">
              Unified performance metrics across all AI modules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map(({ key, label, format, prefix, highlight }) => {
            const value = summary[key];
            const display = format
              ? format(value as number)
              : `${prefix ?? ""}${formatCurrency(value as number)}`;

            return (
              <div
                key={key}
                className={`rounded-xl border p-4 transition-colors hover:bg-white/[0.05] ${
                  highlight
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <p className="text-xs text-slate-500">{label}</p>
                <p
                  className={`mt-2 text-xl font-bold tracking-tight sm:text-2xl ${
                    highlight ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {display}
                </p>
                {highlight && (
                  <TrendingUp className="mt-2 h-4 w-4 text-emerald-400/60" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

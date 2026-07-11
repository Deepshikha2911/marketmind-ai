"use client";

import { LineChart, ShieldCheck, TrendingUp } from "lucide-react";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastSummaryData } from "@/lib/analysis-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

type AnalysisForecastSectionProps = {
  forecast: ForecastSummaryData;
};

export function AnalysisForecastSection({ forecast }: AnalysisForecastSectionProps) {
  const summaryTiles = [
    {
      label: "Expected Revenue",
      value: formatCurrency(forecast.expectedRevenue),
      icon: TrendingUp,
      accent: "text-emerald-400 bg-emerald-500/15",
    },
    {
      label: "Expected Growth",
      value: `+${formatPercent(forecast.expectedGrowth)}`,
      icon: LineChart,
      accent: "text-cyan-400 bg-cyan-500/15",
    },
    {
      label: "Confidence",
      value: formatPercent(forecast.confidence, 0),
      icon: ShieldCheck,
      accent: "text-violet-400 bg-violet-500/15",
    },
  ];

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Forecast Summary</h2>
        <p className="mt-1 text-sm text-slate-400">
          30-day AI revenue forecast with confidence interval
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryTiles.map(({ label, value, icon: Icon, accent }) => (
          <GlassCard
            key={label}
            className="p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/25 sm:p-5"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white sm:text-xl">{value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6">
        <ForecastChart data={forecast.dailyForecast} />
      </div>
    </section>
  );
}

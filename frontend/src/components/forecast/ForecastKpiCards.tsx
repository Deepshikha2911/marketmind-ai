import {
  Calendar,
  CalendarX,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastKpis } from "@/lib/forecast-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

type ForecastKpiCardsProps = {
  kpis: ForecastKpis;
};

const kpiConfig = [
  {
    key: "forecastedRevenue" as const,
    title: "Forecasted Revenue",
    icon: DollarSign,
    format: (k: ForecastKpis) => formatCurrency(k.forecastedRevenue),
    accent: "text-indigo-400 bg-indigo-500/15",
  },
  {
    key: "forecastGrowth" as const,
    title: "Forecast Growth",
    icon: TrendingUp,
    format: (k: ForecastKpis) => `+${formatPercent(k.forecastGrowth)}`,
    accent: "text-cyan-400 bg-cyan-500/15",
  },
  {
    key: "forecastConfidence" as const,
    title: "Forecast Confidence",
    icon: ShieldCheck,
    format: (k: ForecastKpis) => formatPercent(k.forecastConfidence, 0),
    accent: "text-violet-400 bg-violet-500/15",
  },
  {
    key: "forecastPeriod" as const,
    title: "Forecast Period",
    icon: Calendar,
    format: (k: ForecastKpis) => k.forecastPeriod,
    accent: "text-indigo-400 bg-indigo-500/15",
  },
  {
    key: "bestForecastDay" as const,
    title: "Best Forecast Day",
    icon: CalendarCheck,
    format: (k: ForecastKpis) => k.bestForecastDay,
    accent: "text-emerald-400 bg-emerald-500/15",
  },
  {
    key: "worstForecastDay" as const,
    title: "Worst Forecast Day",
    icon: CalendarX,
    format: (k: ForecastKpis) => k.worstForecastDay,
    accent: "text-rose-400 bg-rose-500/15",
  },
];

export function ForecastKpiCards({ kpis }: ForecastKpiCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiConfig.map(({ key, title, icon: Icon, format, accent }) => (
        <GlassCard
          key={key}
          className="group flex h-full flex-col p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 sm:p-5"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${accent}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="mt-3 flex flex-1 flex-col">
            <p className="text-xs text-slate-400 sm:text-sm">{title}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              {format(kpis)}
            </p>
          </div>
        </GlassCard>
      ))}
    </section>
  );
}

import { BarChart3, DollarSign, Hash, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PredictionKpis } from "@/lib/predictions-data";

type PredictionKpiCardsProps = {
  kpis: PredictionKpis;
};

const kpiConfig = [
  {
    key: "rowsProcessed" as const,
    title: "Rows Processed",
    icon: Hash,
    format: (v: number) => v.toLocaleString("en-US"),
    description: "Total rows analyzed",
  },
  {
    key: "predictionsGenerated" as const,
    title: "Predictions Generated",
    icon: BarChart3,
    format: (v: number) => v.toLocaleString("en-US"),
    description: "Campaign-level forecasts",
  },
  {
    key: "averagePredictedRevenue" as const,
    title: "Average Predicted Revenue",
    icon: DollarSign,
    format: (v: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(v),
    description: "Mean predicted revenue",
  },
  {
    key: "highestPredictedRevenue" as const,
    title: "Highest Predicted Revenue",
    icon: TrendingUp,
    format: (v: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(v),
    description: "Top campaign forecast",
  },
];

export function PredictionKpiCards({ kpis }: PredictionKpiCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map(({ key, title, icon: Icon, format, description }) => (
        <GlassCard
          key={key}
          className="group flex h-full flex-col p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500/25">
            <Icon className="h-5 w-5" />
          </div>
          <div className="mt-4 flex flex-1 flex-col">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {format(kpis[key])}
            </p>
            <p className="mt-auto pt-2 text-xs text-slate-500">{description}</p>
          </div>
        </GlassCard>
      ))}
    </section>
  );
}

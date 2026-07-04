import {
  DollarSign,
  MousePointerClick,
  Percent,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { InsightsKpis } from "@/lib/insights-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

type InsightsKpiCardsProps = {
  kpis: InsightsKpis;
};

const kpiConfig = [
  {
    key: "totalRevenue" as const,
    title: "Total Revenue",
    icon: DollarSign,
    format: (v: number) => formatCurrency(v),
    description: "Aggregate campaign revenue",
  },
  {
    key: "totalSpend" as const,
    title: "Total Spend",
    icon: Wallet,
    format: (v: number) => formatCurrency(v),
    description: "Total ad investment",
  },
  {
    key: "averageRoi" as const,
    title: "Average ROI",
    icon: TrendingUp,
    format: (v: number) => `${formatNumber(v)}%`,
    description: "Return on investment",
  },
  {
    key: "averageRoas" as const,
    title: "Average ROAS",
    icon: Target,
    format: (v: number) => `${v.toFixed(1)}x`,
    description: "Return on ad spend",
  },
  {
    key: "ctr" as const,
    title: "CTR",
    icon: MousePointerClick,
    format: (v: number) => formatPercent(v, 2),
    description: "Click-through rate",
  },
  {
    key: "conversionRate" as const,
    title: "Conversion Rate",
    icon: Percent,
    format: (v: number) => formatPercent(v, 2),
    description: "Session conversion rate",
  },
];

export function InsightsKpiCards({ kpis }: InsightsKpiCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiConfig.map(({ key, title, icon: Icon, format, description }) => (
        <GlassCard
          key={key}
          className="group flex h-full flex-col p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 sm:p-5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500/25">
            <Icon className="h-4 w-4" />
          </div>
          <div className="mt-3 flex flex-1 flex-col">
            <p className="text-xs text-slate-400 sm:text-sm">{title}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              {format(kpis[key])}
            </p>
            <p className="mt-auto pt-2 text-[11px] text-slate-500">{description}</p>
          </div>
        </GlassCard>
      ))}
    </section>
  );
}

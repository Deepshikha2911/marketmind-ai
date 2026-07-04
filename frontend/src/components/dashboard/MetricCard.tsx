import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  MousePointerClick,
  Target,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PLACEHOLDER, type KpiMetric } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const iconMap = {
  revenue: DollarSign,
  spend: Target,
  roas: TrendingUp,
  conversions: MousePointerClick,
} as const;

type MetricCardProps = {
  metric: KpiMetric;
};

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = iconMap[metric.id as keyof typeof iconMap] ?? TrendingUp;
  const hasData = metric.value !== null;
  const displayValue = metric.value ?? PLACEHOLDER;
  const isPositive = metric.trend === "up";
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <GlassCard className="group p-5 transition hover:border-indigo-500/30 hover:shadow-indigo-500/5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 transition group-hover:bg-indigo-500/25">
          <Icon className="h-5 w-5" />
        </div>
        {hasData && metric.change && metric.trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              isPositive
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-rose-500/15 text-rose-400",
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {metric.change}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-400">{metric.title}</p>
        <p
          className={cn(
            "mt-1 text-2xl font-semibold tracking-tight",
            hasData ? "text-white" : "text-slate-500",
          )}
        >
          {displayValue}
        </p>
        <p className="mt-1 text-xs text-slate-500">{metric.description}</p>
      </div>
    </GlassCard>
  );
}

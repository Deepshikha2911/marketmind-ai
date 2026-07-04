"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import type { TrendCharts, TrendPoint } from "@/lib/insights-data";
import { cn, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

type TrendAnalysisChartsProps = {
  trends: TrendCharts;
};

function ChartShell({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <GlassCard
      className={cn(
        "flex h-full min-h-[18rem] flex-col p-4 transition-all duration-300 hover:border-indigo-500/20 sm:min-h-[20rem] sm:p-5",
        className,
      )}
    >
      <h3 className="mb-4 shrink-0 text-sm font-semibold text-white">{title}</h3>
      <div className="min-h-[12rem] flex-1">{children}</div>
    </GlassCard>
  );
}

function TrendTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  formatter: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-white">{formatter(payload[0].value)}</p>
    </div>
  );
}

function RevenueTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="insightsRevenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={44}
        />
        <Tooltip content={<TrendTooltip formatter={formatCurrency} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#818cf8"
          strokeWidth={2}
          fill="url(#insightsRevenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function LineTrendChart({
  data,
  color,
  formatter,
}: {
  data: TrendPoint[];
  color: string;
  formatter: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={(v) => (v >= 100 ? formatNumber(v) : `${v}%`)}
          width={44}
        />
        <Tooltip content={<TrendTooltip formatter={formatter} />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 3, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TrendAnalysisCharts({ trends }: TrendAnalysisChartsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Trend Analysis</h2>
        <p className="mt-1 text-sm text-slate-400">Performance trajectories over the reporting period</p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-6">
        <ChartShell title="Revenue Trend">
          <RevenueTrendChart data={trends.revenue} />
        </ChartShell>
        <ChartShell title="ROI Trend">
          <LineTrendChart
            data={trends.roi}
            color="#34d399"
            formatter={(v) => `${formatNumber(v)}%`}
          />
        </ChartShell>
        <ChartShell title="CTR Trend">
          <LineTrendChart
            data={trends.ctr}
            color="#a78bfa"
            formatter={(v) => formatPercent(v, 2)}
          />
        </ChartShell>
        <ChartShell title="Conversion Trend">
          <LineTrendChart
            data={trends.conversion}
            color="#38bdf8"
            formatter={(v) => formatPercent(v, 2)}
          />
        </ChartShell>
      </div>
    </section>
  );
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import type {
  ActualVsPredictedPoint,
  RevenueDistributionPoint,
  TopCampaignPoint,
} from "@/lib/predictions-data";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const CHART_COLORS = ["#818cf8", "#34d399", "#a78bfa", "#f472b6", "#38bdf8", "#fbbf24"];

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <GlassCard
      className={cn(
        "flex h-full min-h-[22rem] flex-col p-4 transition-all duration-300 hover:border-indigo-500/20 sm:min-h-[24rem] sm:p-6",
        className,
      )}
    >
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="min-h-[14rem] flex-1 w-full sm:min-h-[16rem]">{children}</div>
    </GlassCard>
  );
}

type ActualVsPredictedChartProps = {
  data: ActualVsPredictedPoint[];
};

export function ActualVsPredictedChart({ data }: ActualVsPredictedChartProps) {
  return (
    <ChartCard
      title="Actual vs Predicted Revenue"
      subtitle="Aggregated revenue comparison across date ranges"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={44}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                  <p className="mb-2 text-xs text-slate-400">{label}</p>
                  {payload.map((entry) => (
                    <p key={entry.name} className="text-sm text-white">
                      <span className="capitalize text-slate-400">{entry.name}: </span>
                      {formatCurrency(entry.value as number)}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ fill: "#34d399", r: 3, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ fill: "#818cf8", r: 3, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

type RevenueDistributionChartProps = {
  data: RevenueDistributionPoint[];
};

export function RevenueDistributionChart({ data }: RevenueDistributionChartProps) {
  return (
    <ChartCard
      title="Revenue Distribution"
      subtitle="Distribution of predicted revenue across campaigns"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="range"
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="72%"
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.range} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload as RevenueDistributionPoint;
              return (
                <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                  <p className="text-xs text-slate-400">{item.range}</p>
                  <p className="text-sm font-semibold text-white">
                    {formatNumber(item.count)} campaigns
                  </p>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

type TopPredictedCampaignsChartProps = {
  data: TopCampaignPoint[];
};

export function TopPredictedCampaignsChart({ data }: TopPredictedCampaignsChartProps) {
  return (
    <ChartCard
      title="Top Predicted Campaigns"
      subtitle="Highest revenue forecasts by campaign"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="campaign"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            width={96}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                  <p className="text-xs text-slate-400">{payload[0].payload.campaign}</p>
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(payload[0].value as number)}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="predictedRevenue" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

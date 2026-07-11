"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart, ShieldCheck, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastSummaryData } from "@/lib/analysis-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

type AnalysisForecastSectionProps = {
  forecast: ForecastSummaryData;
};

export function AnalysisForecastSection({ forecast }: AnalysisForecastSectionProps) {
  const chartData = forecast.dailyForecast.map((d) => ({
    ...d,
    bandBase: d.lower,
    bandRange: d.upper - d.lower,
  }));

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

      <GlassCard className="mt-6 flex min-h-[22rem] flex-col p-4 sm:min-h-[24rem] sm:p-6">
        <div className="mb-4 shrink-0 sm:mb-6">
          <h3 className="text-base font-semibold text-white">30-Day Revenue Forecast</h3>
          <p className="mt-1 text-sm text-slate-400">
            Projected daily revenue with confidence band
          </p>
        </div>

        <div className="min-h-[16rem] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="analysisForecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                dy={8}
                interval={4}
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
                  const point = payload[0]?.payload as (typeof chartData)[0];
                  return (
                    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                      <p className="mb-2 text-xs text-slate-400">{label}</p>
                      <p className="text-sm text-white">
                        Revenue: {formatCurrency(point.revenue)}
                      </p>
                      <p className="mt-1 text-xs text-indigo-300">
                        CI: {formatCurrency(point.lower)} – {formatCurrency(point.upper)}
                      </p>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }} />
              <Area
                type="monotone"
                dataKey="bandBase"
                stackId="confidence"
                stroke="none"
                fill="transparent"
                legendType="none"
              />
              <Area
                type="monotone"
                dataKey="bandRange"
                stackId="confidence"
                name="Confidence Interval"
                stroke="none"
                fill="url(#analysisForecastGradient)"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Forecast Revenue"
                stroke="#818cf8"
                strokeWidth={2.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </section>
  );
}

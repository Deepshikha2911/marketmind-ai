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
import { GlassCard } from "@/components/ui/GlassCard";
import type { RevenueForecastPoint } from "@/lib/forecast-data";
import { formatCurrency } from "@/lib/utils";

type RevenueForecastChartProps = {
  data: RevenueForecastPoint[];
};

export function RevenueForecastChart({ data }: RevenueForecastChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    bandBase: point.confidenceLower,
    bandRange: point.confidenceUpper != null && point.confidenceLower != null
      ? point.confidenceUpper - point.confidenceLower
      : undefined,
  }));

  return (
    <GlassCard className="flex h-full min-h-[26rem] flex-col p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[28rem] sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <h3 className="text-base font-semibold text-white">Revenue Forecast</h3>
        <p className="mt-1 text-sm text-slate-400">
          Actual vs forecast revenue with 30-day confidence interval
        </p>
      </div>

      <div className="min-h-[18rem] flex-1 w-full sm:min-h-[20rem]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              dy={8}
              interval="preserveStartEnd"
              minTickGap={24}
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
                const point = payload[0]?.payload as RevenueForecastPoint;
                return (
                  <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                    <p className="mb-2 text-xs text-slate-400">{label}</p>
                    {point.actual != null && (
                      <p className="text-sm text-white">
                        <span className="text-slate-400">Actual Revenue: </span>
                        {formatCurrency(point.actual)}
                      </p>
                    )}
                    {point.forecast != null && (
                      <p className="text-sm text-white">
                        <span className="text-slate-400">Forecast Revenue: </span>
                        {formatCurrency(point.forecast)}
                      </p>
                    )}
                    {point.confidenceLower != null && point.confidenceUpper != null && (
                      <p className="mt-1 text-xs text-indigo-300">
                        CI: {formatCurrency(point.confidenceLower)} –{" "}
                        {formatCurrency(point.confidenceUpper)}
                      </p>
                    )}
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
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="bandRange"
              stackId="confidence"
              name="Confidence Interval"
              stroke="none"
              fill="url(#confidenceGradient)"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Revenue"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={{ fill: "#34d399", r: 2.5, strokeWidth: 0 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast Revenue"
              stroke="#818cf8"
              strokeWidth={2.5}
              strokeDasharray="0"
              dot={{ fill: "#818cf8", r: 2.5, strokeWidth: 0 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

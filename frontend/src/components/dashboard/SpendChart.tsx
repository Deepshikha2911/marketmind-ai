"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SpendRevenuePoint } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/utils";

type SpendChartProps = {
  data: SpendRevenuePoint[];
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="mb-2 text-xs text-slate-400">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="capitalize text-slate-300">{entry.name}:</span>
            <span className="font-medium text-white">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpendChart({ data }: SpendChartProps) {
  const hasData = data.length > 0;

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white">Spend vs Revenue</h3>
        <p className="mt-1 text-sm text-slate-400">Compare ad spend against revenue generated</p>
      </div>

      <div className="h-72 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={48}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 16, fontSize: 12, color: "#94a3b8" }}
              />
              <Bar dataKey="spend" name="Spend" fill="#a78bfa" radius={[4, 4, 0, 0]} barSize={20} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ fill: "#34d399", r: 3, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </div>
    </GlassCard>
  );
}

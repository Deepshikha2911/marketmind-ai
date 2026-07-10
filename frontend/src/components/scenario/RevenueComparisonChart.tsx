"use client";

import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import type { RevenueComparisonPoint } from "@/lib/scenario-data";
import { formatCurrency } from "@/lib/utils";

type RevenueComparisonChartProps = {
  data: RevenueComparisonPoint[];
};

export function RevenueComparisonChart({ data }: RevenueComparisonChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <GlassCard className="flex h-full min-h-[26rem] flex-col p-4 transition-all duration-300 hover:border-cyan-500/20 sm:min-h-[28rem] sm:p-6">
        <div className="mb-4 shrink-0 sm:mb-6">
          <h3 className="text-base font-semibold text-white">Revenue Comparison</h3>
          <p className="mt-1 text-sm text-slate-400">
            Current vs simulated revenue across 12 months
          </p>
        </div>

        <div className="min-h-[18rem] flex-1 w-full sm:min-h-[20rem]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
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
                width={48}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
                      <p className="mb-2 text-xs text-slate-400">{label}</p>
                      {payload.map((entry) => (
                        <p key={entry.name} className="text-sm text-white">
                          <span className="text-slate-400">{entry.name}: </span>
                          {formatCurrency(entry.value as number)}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }} />
              <Line
                type="monotone"
                dataKey="current"
                name="Current Revenue"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ fill: "#34d399", r: 3, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="simulated"
                name="Simulated Revenue"
                stroke="#818cf8"
                strokeWidth={2.5}
                dot={{ fill: "#818cf8", r: 3, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}

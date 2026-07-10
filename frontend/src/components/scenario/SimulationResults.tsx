"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SimulationMetric } from "@/lib/scenario-data";
import { cn, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

type SimulationResultsProps = {
  metrics: SimulationMetric[];
};

function formatMetricValue(value: number, format: SimulationMetric["format"]) {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "percent":
      return formatPercent(value, 0);
    case "multiplier":
      return `${value.toFixed(1)}x`;
    case "number":
      return formatNumber(value);
    default:
      return String(value);
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function SimulationResults({ metrics }: SimulationResultsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Simulation Results</h2>
        <p className="mt-1 text-sm text-slate-400">
          Compare current performance against simulated scenario outcomes
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={metrics.map((m) => m.simulated).join("-")}
      >
        {metrics.map((metric) => {
          const diff = metric.simulated - metric.current;
          const isPositive = diff > 0;
          const isNeutral = diff === 0;
          const DiffIcon = isNeutral ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;

          return (
            <motion.div key={metric.key} variants={itemVariants}>
              <GlassCard className="group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {metric.label}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Current</p>
                    <p className="mt-1 text-lg font-semibold text-slate-300">
                      {formatMetricValue(metric.current, metric.format)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400/80">Simulated</p>
                    <p className="mt-1 text-lg font-semibold text-cyan-300">
                      {formatMetricValue(metric.simulated, metric.format)}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-4 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ring-1",
                    isNeutral && "bg-slate-500/10 text-slate-400 ring-slate-500/20",
                    isPositive && "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
                    !isPositive && !isNeutral && "bg-rose-500/10 text-rose-400 ring-rose-500/20",
                  )}
                >
                  <DiffIcon className="h-3.5 w-3.5" />
                  {isPositive ? "+" : ""}
                  {metric.format === "currency"
                    ? formatCurrency(diff)
                    : metric.format === "percent"
                      ? formatPercent(diff, 0)
                      : metric.format === "multiplier"
                        ? `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}x`
                        : formatNumber(diff)}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

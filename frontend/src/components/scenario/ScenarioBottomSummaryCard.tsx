"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ScenarioBottomSummary } from "@/lib/scenario-data";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type ScenarioBottomSummaryCardProps = {
  summary: ScenarioBottomSummary;
};

export function ScenarioBottomSummaryCard({ summary }: ScenarioBottomSummaryCardProps) {
  const isPositive = summary.revenueIncrease >= 0;

  const metrics = [
    { label: "Scenario Selected", value: summary.scenarioSelected, highlight: true },
    { label: "Expected Revenue", value: formatCurrency(summary.expectedRevenue) },
    {
      label: "Revenue Increase",
      value: `${isPositive ? "+" : ""}${formatCurrency(summary.revenueIncrease)}`,
      positive: isPositive,
      negative: !isPositive,
    },
    { label: "Expected ROI", value: formatPercent(summary.expectedRoi, 0) },
    { label: "Confidence Score", value: formatPercent(summary.confidenceScore, 0), progress: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <GlassCard className="relative overflow-hidden border-cyan-500/20 p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Executive Summary
              </h2>
              <p className="text-sm text-slate-400">Scenario simulation at a glance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {metrics.map(({ label, value, highlight, positive, negative, progress }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-500/25 hover:bg-white/[0.05]"
              >
                <p className="text-xs text-slate-500">{label}</p>
                <p
                  className={cn(
                    "mt-2 text-xl font-bold tracking-tight sm:text-2xl",
                    highlight && "text-cyan-400",
                    positive && "text-emerald-400",
                    negative && "text-rose-400",
                    !highlight && !positive && !negative && "text-white",
                  )}
                >
                  {value}
                </p>
                {progress && (
                  <progress
                    value={summary.confidenceScore}
                    max={100}
                    className="upload-progress mt-4 h-2 w-full"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-300/80">
              Business Recommendation
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
              {summary.businessRecommendation}
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

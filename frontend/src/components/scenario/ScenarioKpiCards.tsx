"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ScenarioKpis } from "@/lib/scenario-data";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type ScenarioKpiCardsProps = {
  kpis: ScenarioKpis;
};

const kpiConfig = [
  {
    key: "currentRevenue" as const,
    title: "Current Revenue",
    icon: DollarSign,
    format: (k: ScenarioKpis) => formatCurrency(k.currentRevenue),
    accent: "text-indigo-400 bg-indigo-500/15",
  },
  {
    key: "simulatedRevenue" as const,
    title: "Simulated Revenue",
    icon: TrendingUp,
    format: (k: ScenarioKpis) => formatCurrency(k.simulatedRevenue),
    accent: "text-cyan-400 bg-cyan-500/15",
  },
  {
    key: "revenueIncrease" as const,
    title: "Revenue Increase",
    icon: TrendingUp,
    format: (k: ScenarioKpis) =>
      `${k.revenueIncrease >= 0 ? "+" : ""}${formatCurrency(k.revenueIncrease)}`,
    accent: "text-emerald-400 bg-emerald-500/15",
    dynamic: true,
  },
  {
    key: "expectedRoi" as const,
    title: "Expected ROI",
    icon: Target,
    format: (k: ScenarioKpis) => formatPercent(k.expectedRoi, 0),
    accent: "text-violet-400 bg-violet-500/15",
  },
  {
    key: "winningScenario" as const,
    title: "Winning Scenario",
    icon: Sparkles,
    format: (k: ScenarioKpis) => k.winningScenario,
    accent: "text-indigo-400 bg-indigo-500/15",
    small: true,
  },
  {
    key: "confidence" as const,
    title: "Confidence",
    icon: ShieldCheck,
    format: (k: ScenarioKpis) => formatPercent(k.confidence, 0),
    accent: "text-cyan-400 bg-cyan-500/15",
  },
];

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

export function ScenarioKpiCards({ kpis }: ScenarioKpiCardsProps) {
  return (
    <motion.section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {kpiConfig.map(({ key, title, icon: Icon, format, accent, dynamic, small }) => {
        const isNegative = dynamic && kpis.revenueIncrease < 0;

        return (
          <motion.div key={key} variants={itemVariants}>
            <GlassCard className="group flex h-full flex-col p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 sm:p-5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                  isNegative ? "text-rose-400 bg-rose-500/15" : accent,
                )}
              >
                {isNegative && key === "revenueIncrease" ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="mt-3 flex flex-1 flex-col">
                <p className="text-xs text-slate-400 sm:text-sm">{title}</p>
                <p
                  className={cn(
                    "mt-1 font-semibold tracking-tight text-white",
                    small ? "text-sm sm:text-base" : "text-lg sm:text-xl",
                    isNegative && "text-rose-400",
                    !isNegative && dynamic && "text-emerald-400",
                  )}
                >
                  {format(kpis)}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.section>
  );
}

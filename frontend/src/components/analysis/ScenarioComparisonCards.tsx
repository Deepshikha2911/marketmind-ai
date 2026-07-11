"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ScenarioComparison } from "@/lib/analysis-data";
import { cn, formatCurrency } from "@/lib/utils";

type ScenarioComparisonCardsProps = {
  scenarios: ScenarioComparison[];
};

export function ScenarioComparisonCards({ scenarios }: ScenarioComparisonCardsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Scenario Comparison</h2>
        <p className="mt-1 text-sm text-slate-400">
          Simulated outcomes across strategic marketing scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario, index) => {
          const isPositive = scenario.revenueImpact >= 0;

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <GlassCard
                className={cn(
                  "relative flex h-full flex-col p-5 transition-all duration-300 sm:p-6",
                  scenario.isBest
                    ? "border-emerald-500/40 bg-emerald-500/[0.04] shadow-lg shadow-emerald-500/10 hover:border-emerald-500/50"
                    : "hover:-translate-y-1 hover:border-indigo-500/25",
                )}
              >
                {scenario.isBest && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Best Scenario
                    </Badge>
                  </div>
                )}

                <h3 className="text-base font-semibold text-white">{scenario.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {scenario.description}
                </p>

                <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Revenue Impact</span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-sm font-semibold",
                        isPositive ? "text-emerald-400" : "text-rose-400",
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {isPositive ? "+" : ""}
                      {formatCurrency(scenario.revenueImpact)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">ROI Change</span>
                    <span className="text-sm font-semibold text-cyan-400">
                      +{scenario.roiImpact}%
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

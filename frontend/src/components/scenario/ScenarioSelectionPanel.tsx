"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ScenarioId, ScenarioOption } from "@/lib/scenario-data";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type ScenarioSelectionPanelProps = {
  options: ScenarioOption[];
  selectedId: ScenarioId;
  onSelect: (id: ScenarioId) => void;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function ScenarioSelectionPanel({
  options,
  selectedId,
  onSelect,
}: ScenarioSelectionPanelProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Scenario Selection</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose a marketing strategy to simulate and compare projected outcomes
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          const isPositive = option.expectedRevenueImpact >= 0;

          return (
            <motion.button
              key={option.id}
              type="button"
              variants={itemVariants}
              onClick={() => onSelect(option.id)}
              className="text-left"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassCard
                className={cn(
                  "relative flex h-full cursor-pointer flex-col border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 sm:p-6",
                  isSelected
                    ? "border-cyan-500/40 ring-2 ring-cyan-500/25 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 hover:border-cyan-500/25",
                )}
              >
                {isSelected && (
                  <div className="absolute right-4 top-4">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                  </div>
                )}

                <h3 className="pr-8 text-base font-semibold text-white">{option.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {option.explanation}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Expected Revenue Impact
                    </p>
                    <p
                      className={cn(
                        "mt-1 flex items-center gap-1 text-sm font-semibold",
                        isPositive ? "text-emerald-400" : "text-rose-400",
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {isPositive ? "+" : ""}
                      {formatCurrency(option.expectedRevenueImpact)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Est. ROI
                    </p>
                    <p className="mt-1 text-sm font-semibold text-violet-300">
                      {formatPercent(option.estimatedRoi, 0)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}

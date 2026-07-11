"use client";

import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency, formatNumber } from "@/lib/utils";

type MarketingFunnelProps = {
  stages: Array<{ stage: string; value: number; label: string }>;
};

const stageColors = [
  "from-indigo-500/30 to-indigo-600/20 border-indigo-500/30",
  "from-violet-500/30 to-violet-600/20 border-violet-500/30",
  "from-cyan-500/30 to-cyan-600/20 border-cyan-500/30",
  "from-emerald-500/30 to-emerald-600/20 border-emerald-500/30",
];

function formatStageValue(stage: { stage: string; value: number; label: string }): string {
  if (stage.stage === "Revenue") return formatCurrency(stage.value);
  return formatNumber(stage.value);
}

export function MarketingFunnel({ stages }: MarketingFunnelProps) {
  return (
    <GlassCard className="flex min-h-[520px] flex-col overflow-visible p-4 transition-all duration-300 hover:border-indigo-500/20 sm:p-6">
      <div className="mb-4 shrink-0 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Marketing Funnel</h3>
            <p className="mt-0.5 text-sm text-slate-400">Conversion flow from impressions to revenue</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {stages.map((stage, index) => {
          const conversionRate =
            index > 0 && index < stages.length - 1
              ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
              : null;
          const showConversion = conversionRate !== null;

          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="w-full flex-shrink-0"
            >
              <div className={`rounded-2xl border bg-gradient-to-r px-5 py-5 sm:px-6 sm:py-5 ${stageColors[index]}`}>
                {showConversion ? (
                  <div className="flex flex-row items-start justify-between gap-8">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-400">
                        {stage.stage}
                      </p>
                      <p className="mt-3 whitespace-nowrap text-2xl font-semibold text-white">
                        {formatStageValue(stage)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end text-right">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">Conversion</p>
                      <p className="mt-2 whitespace-nowrap text-lg font-semibold text-cyan-400">
                        {conversionRate}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-400">
                      {stage.stage}
                    </p>
                    <p className="mt-3 whitespace-nowrap text-2xl font-semibold text-white">
                      {formatStageValue(stage)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

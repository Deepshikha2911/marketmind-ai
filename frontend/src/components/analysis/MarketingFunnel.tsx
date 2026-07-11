"use client";

import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FunnelStage } from "@/lib/analysis-data";
import { formatCurrency, formatNumber } from "@/lib/utils";

type MarketingFunnelProps = {
  stages: FunnelStage[];
};

const stageColors = [
  "from-indigo-500/30 to-indigo-600/20 border-indigo-500/30",
  "from-violet-500/30 to-violet-600/20 border-violet-500/30",
  "from-cyan-500/30 to-cyan-600/20 border-cyan-500/30",
  "from-emerald-500/30 to-emerald-600/20 border-emerald-500/30",
];

function formatStageValue(stage: FunnelStage): string {
  if (stage.stage === "Revenue") return formatCurrency(stage.value);
  return formatNumber(stage.value);
}

export function MarketingFunnel({ stages }: MarketingFunnelProps) {
  const maxValue = stages[0]?.value ?? 1;

  return (
    <GlassCard className="flex min-h-[26rem] flex-col p-4 transition-all duration-300 hover:border-indigo-500/20 sm:min-h-[28rem] sm:p-6">
      <div className="mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Marketing Funnel</h3>
            <p className="mt-0.5 text-sm text-slate-400">
              Conversion flow from impressions to revenue
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-2">
        {stages.map((stage, index) => {
          const widthPercent = 100 - index * 18;
          const conversionRate =
            index > 0
              ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
              : null;

          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="w-full"
              style={{ maxWidth: `${widthPercent}%` }}
            >
              <div
                className={`relative overflow-hidden rounded-xl border bg-gradient-to-r px-4 py-4 sm:px-6 sm:py-5 ${stageColors[index]}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      {stage.stage}
                    </p>
                    <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                      {formatStageValue(stage)}
                    </p>
                  </div>
                  {conversionRate && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Conversion</p>
                      <p className="text-sm font-semibold text-cyan-400">{conversionRate}%</p>
                    </div>
                  )}
                </div>
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{ width: `${(stage.value / maxValue) * 100}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

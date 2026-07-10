"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ScenarioInsight } from "@/lib/scenario-data";

type ScenarioInsightsProps = {
  insights: ScenarioInsight[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function ScenarioInsights({ insights }: ScenarioInsightsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Scenario Insights</h2>
        <p className="mt-1 text-sm text-slate-400">
          AI-generated insights from scenario simulation analysis
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {insights.map((insight, index) => (
          <motion.div key={insight.id} variants={itemVariants}>
            <GlassCard
              className={`flex h-full gap-4 border border-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/5 sm:p-6 ${
                index === 0 ? "ring-1 ring-cyan-500/15" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-cyan-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {insight.description}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

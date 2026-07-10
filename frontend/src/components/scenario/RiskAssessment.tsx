"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { RiskStatus, ScenarioRisk } from "@/lib/scenario-data";
import { cn } from "@/lib/utils";

type RiskAssessmentProps = {
  risks: ScenarioRisk[];
};

const riskConfig: Record<
  RiskStatus,
  { variant: "high" | "medium" | "low"; border: string; icon: typeof ShieldAlert }
> = {
  High: {
    variant: "high",
    border: "border-rose-500/20 hover:border-rose-500/35",
    icon: AlertTriangle,
  },
  Medium: {
    variant: "medium",
    border: "border-amber-500/15 hover:border-amber-500/30",
    icon: ShieldAlert,
  },
  Low: {
    variant: "low",
    border: "border-emerald-500/15 hover:border-emerald-500/30",
    icon: ShieldCheck,
  },
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

export function RiskAssessment({ risks }: RiskAssessmentProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Risk Assessment</h2>
        <p className="mt-1 text-sm text-slate-400">
          Evaluated risks associated with the selected scenario
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {risks.map((risk) => {
          const config = riskConfig[risk.status];
          const RiskIcon = config.icon;

          return (
            <motion.div key={risk.id} variants={itemVariants}>
              <GlassCard
                className={cn(
                  "flex h-full flex-col border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6",
                  config.border,
                )}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={config.variant} className="gap-1">
                    <RiskIcon className="h-3 w-3" />
                    {risk.status}
                  </Badge>
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">{risk.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {risk.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

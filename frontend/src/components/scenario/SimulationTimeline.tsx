"use client";

import { motion } from "framer-motion";
import { Brain, Check, Database, LineChart, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Current Data", icon: Database },
  { id: 2, label: "Apply Scenario", icon: LineChart },
  { id: 3, label: "AI Processing", icon: Brain },
  { id: 4, label: "Forecast", icon: LineChart },
  { id: 5, label: "Business Recommendation", icon: Lightbulb },
];

type SimulationTimelineProps = {
  activeStep?: number;
  isProcessing?: boolean;
};

export function SimulationTimeline({
  activeStep = 5,
  isProcessing = false,
}: SimulationTimelineProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Simulation Timeline</h2>
        <p className="mt-1 text-sm text-slate-400">
          Step-by-step process of scenario simulation and analysis
        </p>
      </div>

      <GlassCard className="overflow-hidden p-5 transition-all duration-300 hover:border-cyan-500/20 sm:p-6">
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-white/10 sm:block" />
          <motion.div
            className="absolute left-0 top-5 hidden h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 sm:block"
            initial={{ width: "0%" }}
            animate={{ width: isProcessing ? "60%" : "100%" }}
            transition={{ duration: isProcessing ? 0.8 : 1.2, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-2">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isComplete = index < activeStep;
              const isCurrent = index === activeStep - 1;
              const isActive = isComplete || isCurrent;

              return (
                <motion.div
                  key={step.id}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isActive
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "border-white/10 bg-white/5 text-slate-500",
                      isCurrent && isProcessing && "animate-pulse",
                    )}
                  >
                    {isComplete && !isProcessing ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-xs font-medium sm:text-sm",
                      isActive ? "text-white" : "text-slate-500",
                    )}
                  >
                    {step.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

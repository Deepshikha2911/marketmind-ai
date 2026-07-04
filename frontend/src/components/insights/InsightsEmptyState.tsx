import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function InsightsEmptyState() {
  return (
    <GlassCard className="flex min-h-[24rem] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-3xl bg-violet-500/20 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/25 bg-violet-500/10">
          <Sparkles className="h-10 w-10 text-violet-400" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-white">No insights generated yet</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        Upload a marketing dataset and run predictions to generate AI-powered business insights
        and recommendations.
      </p>
    </GlassCard>
  );
}

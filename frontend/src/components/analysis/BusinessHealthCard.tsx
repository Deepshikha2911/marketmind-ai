import { HeartPulse } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BusinessHealthData } from "@/lib/analysis-data";

type BusinessHealthCardProps = {
  health: BusinessHealthData;
};

export function BusinessHealthCard({ health }: BusinessHealthCardProps) {
  return (
    <GlassCard className="relative overflow-hidden border-emerald-500/20 p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg shadow-emerald-500/25">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Business Health</h2>
            <p className="text-sm text-slate-400">
              Composite health score across data, forecast, and campaign quality
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex flex-col items-center">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <div
                className="insights-score-ring absolute inset-0 rounded-full"
                style={{ ["--score" as string]: health.overallHealth }}
              />
              <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[#0f0f14]">
                <span className="text-3xl font-bold text-white">{health.overallHealth}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium text-emerald-400">Overall Health</p>
            <p className="text-xs text-slate-500">Excellent performance</p>
          </div>

          <div className="w-full flex-1 space-y-4">
            {health.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-slate-400">{metric.label}</span>
                  <span className="text-sm font-semibold text-white">{metric.score}/100</span>
                </div>
                <progress
                  value={metric.score}
                  max={100}
                  className="upload-progress h-2 w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

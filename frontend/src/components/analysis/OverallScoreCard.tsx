import { Activity, Clock, Database, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { OverallScore } from "@/lib/analysis-data";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

type OverallScoreCardProps = {
  score: OverallScore;
};

const healthStyles = {
  Excellent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  Strong: "text-cyan-400 bg-cyan-500/15 border-cyan-500/25",
  Moderate: "text-amber-400 bg-amber-500/15 border-amber-500/25",
  "At Risk": "text-rose-400 bg-rose-500/15 border-rose-500/25",
};

export function OverallScoreCard({ score }: OverallScoreCardProps) {
  return (
    <GlassCard className="relative overflow-hidden border-indigo-500/25 p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-cyan-500/8 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-300">
                Overall AI Score
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white sm:text-5xl">
                  {score.overallAiScore}
                </span>
                <span className="text-xl text-slate-500">/ 100</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Comprehensive AI analysis across all marketing modules
              </p>
            </div>
          </div>

          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center self-center lg:self-auto">
            <div
              className="insights-score-ring absolute inset-0 rounded-full"
              style={{ ["--score" as string]: score.overallAiScore }}
            />
            <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-[#0f0f14]">
              <span className="text-2xl font-bold text-white">{score.overallAiScore}</span>
              <span className="text-[10px] text-slate-500">Score</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">Overall Campaign Health</p>
            <span
              className={cn(
                "mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold",
                healthStyles[score.overallCampaignHealth],
              )}
            >
              {score.overallCampaignHealth}
            </span>
          </div>

          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <p className="text-xs text-slate-500">Confidence</p>
            <p className="mt-2 text-2xl font-bold text-indigo-300">
              {formatPercent(score.confidence, 0)}
            </p>
            <progress
              value={score.confidence}
              max={100}
              className="upload-progress mt-3 h-2 w-full"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-400" />
              <p className="text-xs text-slate-500">Dataset</p>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-white">{score.dataset}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <p className="text-xs text-slate-500">Rows Processed</p>
            </div>
            <p className="mt-2 text-xl font-bold text-white">
              {formatNumber(score.rowsProcessed)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet-400" />
              <p className="text-xs text-slate-500">Analysis Time</p>
            </div>
            <p className="mt-2 text-xl font-bold text-white">
              {score.analysisTimeSeconds} seconds
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

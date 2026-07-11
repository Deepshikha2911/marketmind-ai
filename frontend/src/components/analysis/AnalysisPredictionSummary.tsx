"use client";

import { FileDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AnalysisApiResponse, PredictionSummaryData } from "@/lib/analysis-data";
import { downloadFile, exportPredictionCsv } from "@/lib/analysis-utils";
import { formatCurrency, formatNumber } from "@/lib/utils";

type AnalysisPredictionSummaryProps = {
  summary: PredictionSummaryData;
  data: AnalysisApiResponse;
};

const summaryItems = [
  { key: "rowsProcessed" as const, label: "Rows Processed", format: formatNumber },
  { key: "predictionsGenerated" as const, label: "Predictions Generated", format: formatNumber },
  { key: "highestPrediction" as const, label: "Highest Prediction", format: formatCurrency },
  { key: "averagePrediction" as const, label: "Average Prediction", format: formatCurrency },
];

export function AnalysisPredictionSummary({ summary, data }: AnalysisPredictionSummaryProps) {
  return (
    <GlassCard className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Prediction Summary</h3>
              <p className="text-sm text-slate-400">AI revenue prediction module output</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              downloadFile(
                exportPredictionCsv(data),
                "predictions.csv",
                "text/csv;charset=utf-8;",
              );
            }}
          >
            <FileDown className="h-4 w-4" />
            Download Prediction CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map(({ key, label, format }) => (
            <div
              key={key}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 transition-colors hover:border-indigo-500/20 hover:bg-white/[0.05]"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{format(summary[key])}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

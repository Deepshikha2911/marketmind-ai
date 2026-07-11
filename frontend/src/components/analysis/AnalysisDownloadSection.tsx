"use client";

import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AnalysisApiResponse } from "@/lib/analysis-data";
import {
  downloadFile,
  exportExecutiveReport,
  exportForecastCsv,
  exportOptimizationCsv,
  exportPdfReport,
  exportPredictionCsv,
  exportScenarioReport,
} from "@/lib/analysis-utils";

type AnalysisDownloadSectionProps = {
  data: AnalysisApiResponse;
};

export function AnalysisDownloadSection({ data }: AnalysisDownloadSectionProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-base font-semibold text-white">Download Center</h3>
          <p className="mt-1 text-sm text-slate-400">
            Export analysis outputs, reports, and executive summaries
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="secondary"
            className="justify-start"
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

          <Button
            variant="secondary"
            className="justify-start"
            onClick={() => {
              downloadFile(
                exportForecastCsv(data),
                "forecast.csv",
                "text/csv;charset=utf-8;",
              );
            }}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download Forecast CSV
          </Button>

          <Button
            variant="secondary"
            className="justify-start"
            onClick={() => {
              downloadFile(
                exportOptimizationCsv(data),
                "optimization.csv",
                "text/csv;charset=utf-8;",
              );
            }}
          >
            <FileDown className="h-4 w-4" />
            Download Optimization CSV
          </Button>

          <Button
            variant="secondary"
            className="justify-start"
            onClick={() => {
              downloadFile(
                exportScenarioReport(data),
                "scenario-report.txt",
                "text/plain;charset=utf-8;",
              );
            }}
          >
            <FileText className="h-4 w-4" />
            Download Scenario Report
          </Button>

          <Button
            variant="secondary"
            className="justify-start"
            onClick={() => {
              downloadFile(
                exportExecutiveReport(data),
                "executive-report.txt",
                "text/plain;charset=utf-8;",
              );
            }}
          >
            <FileText className="h-4 w-4" />
            Export Executive Report
          </Button>

          <Button
            variant="default"
            className="justify-start"
            onClick={() => {
              downloadFile(
                exportPdfReport(data),
                "marketmind-executive-report.txt",
                "text/plain;charset=utf-8;",
              );
            }}
          >
            <FileText className="h-4 w-4" />
            Generate PDF Report
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

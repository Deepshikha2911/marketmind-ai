"use client";

import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastApiResponse } from "@/lib/forecast-data";
import {
  downloadFile,
  exportForecastCsv,
  exportForecastExcel,
  exportForecastReport,
} from "@/lib/forecast-utils";

type ForecastDownloadSectionProps = {
  data: ForecastApiResponse;
};

export function ForecastDownloadSection({ data }: ForecastDownloadSectionProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Download Forecast</h3>
          <p className="mt-1 text-sm text-slate-400">
            Export forecast data and AI-generated reports
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="secondary"
            onClick={() => {
              downloadFile(
                exportForecastCsv(data),
                "revenue-forecast.csv",
                "text/csv;charset=utf-8;",
              );
            }}
          >
            <FileDown className="h-4 w-4" />
            Download CSV
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              downloadFile(
                exportForecastExcel(data),
                "revenue-forecast.xls",
                "application/vnd.ms-excel",
              );
            }}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download Excel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              downloadFile(
                exportForecastReport(data),
                "revenue-forecast-report.txt",
                "text/plain;charset=utf-8;",
              );
            }}
          >
            <FileText className="h-4 w-4" />
            Export Forecast
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

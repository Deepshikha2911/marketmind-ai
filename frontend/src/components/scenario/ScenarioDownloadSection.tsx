"use client";

import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ScenarioApiResponse } from "@/lib/scenario-data";
import {
  downloadFile,
  exportScenarioCsv,
  exportScenarioExcel,
  exportScenarioReport,
} from "@/lib/scenario-utils";

type ScenarioDownloadSectionProps = {
  data: ScenarioApiResponse;
};

export function ScenarioDownloadSection({ data }: ScenarioDownloadSectionProps) {
  const slug = data.bottomSummary.scenarioSelected.toLowerCase().replace(/\s+/g, "-");

  return (
    <GlassCard className="p-5 transition-all duration-300 hover:border-cyan-500/20 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Download Simulation</h3>
          <p className="mt-1 text-sm text-slate-400">
            Export scenario data and AI-generated simulation reports
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="secondary"
            onClick={() => {
              downloadFile(
                exportScenarioCsv(data),
                `scenario-${slug}.csv`,
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
                exportScenarioExcel(data),
                `scenario-${slug}.xls`,
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
                exportScenarioReport(data),
                `scenario-${slug}-report.txt`,
                "text/plain;charset=utf-8;",
              );
            }}
          >
            <FileText className="h-4 w-4" />
            Export Simulation Report
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

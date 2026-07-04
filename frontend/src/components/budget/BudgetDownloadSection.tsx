"use client";

import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BudgetApiResponse } from "@/lib/budget-data";
import {
  downloadFile,
  exportBudgetCsv,
  exportBudgetExcel,
  exportBudgetReport,
} from "@/lib/budget-utils";

type BudgetDownloadSectionProps = {
  data: BudgetApiResponse;
};

export function BudgetDownloadSection({ data }: BudgetDownloadSectionProps) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Download Reports</h3>
          <p className="mt-1 text-sm text-slate-400">
            Export optimization data and recommendations
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="secondary"
            onClick={() => {
              downloadFile(
                exportBudgetCsv(data),
                "budget-optimizer.csv",
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
                exportBudgetExcel(data),
                "budget-optimizer.xls",
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
                exportBudgetReport(data),
                "budget-optimizer-report.txt",
                "text/plain;charset=utf-8;",
              );
            }}
          >
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

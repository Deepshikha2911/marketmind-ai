"use client";

import { FileDown, FileSpreadsheet } from "lucide-react";
import type { PredictionRow } from "@/lib/predictions-data";
import {
  downloadFile,
  exportPredictionsCsv,
  exportPredictionsExcel,
} from "@/lib/predictions-utils";
import { cn } from "@/lib/utils";

type ExportActionsProps = {
  rows: PredictionRow[];
};

export function ExportActions({ rows }: ExportActionsProps) {
  const handleCsvExport = () => {
    const content = exportPredictionsCsv(rows);
    downloadFile(content, "predictions.csv", "text/csv;charset=utf-8;");
  };

  const handleExcelExport = () => {
    const content = exportPredictionsExcel(rows);
    downloadFile(content, "predictions.xls", "application/vnd.ms-excel");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="button"
        onClick={handleCsvExport}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition",
          "hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white",
        )}
      >
        <FileDown className="h-4 w-4" />
        Download CSV
      </button>
      <button
        type="button"
        onClick={handleExcelExport}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition",
          "hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-white",
        )}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Download Excel
      </button>
    </div>
  );
}

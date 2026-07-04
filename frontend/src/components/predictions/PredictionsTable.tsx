"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PredictionRow } from "@/lib/predictions-data";
import {
  DEFAULT_PREDICTION_FILTERS,
  filterPredictions,
  getUniqueCampaigns,
  getUniqueDates,
  paginateRows,
  sortPredictions,
  type PredictionSortField,
  type SortDirection,
} from "@/lib/predictions-utils";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { PaginationControls, PredictionsFilters } from "@/components/predictions/PredictionsFilters";

type PredictionsTableProps = {
  rows: PredictionRow[];
  pageSize?: number;
};

const SORTABLE_COLUMNS: { field: PredictionSortField; label: string; align?: "right" }[] = [
  { field: "campaignName", label: "Campaign Name" },
  { field: "spend", label: "Spend", align: "right" },
  { field: "clicks", label: "Clicks", align: "right" },
  { field: "conversions", label: "Conversions", align: "right" },
  { field: "actualRevenue", label: "Actual Revenue", align: "right" },
  { field: "predictedRevenue", label: "Predicted Revenue", align: "right" },
  { field: "difference", label: "Difference", align: "right" },
];

function SortIcon({
  field,
  activeField,
  direction,
}: {
  field: PredictionSortField;
  activeField: PredictionSortField | null;
  direction: SortDirection;
}) {
  if (activeField !== field) {
    return <ArrowUpDown className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-slate-400" />;
  }

  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-indigo-400" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-indigo-400" />
  );
}

export function PredictionsTable({ rows, pageSize = 8 }: PredictionsTableProps) {
  const [filters, setFilters] = useState(DEFAULT_PREDICTION_FILTERS);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<PredictionSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const campaigns = useMemo(() => getUniqueCampaigns(rows), [rows]);
  const dates = useMemo(() => getUniqueDates(rows), [rows]);

  const filteredRows = useMemo(
    () => filterPredictions(rows, filters),
    [rows, filters],
  );

  const sortedRows = useMemo(
    () => sortPredictions(filteredRows, sortField, sortDirection),
    [filteredRows, sortField, sortDirection],
  );

  const { rows: paginatedRows, totalPages, currentPage, totalRows } = useMemo(
    () => paginateRows(sortedRows, page, pageSize),
    [sortedRows, page, pageSize],
  );

  const handleFilterChange = (next: typeof filters) => {
    setFilters(next);
    setPage(1);
  };

  const handleSort = (field: PredictionSortField) => {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <PredictionsFilters
        filters={filters}
        campaigns={campaigns}
        dates={dates}
        onChange={handleFilterChange}
        resultCount={filteredRows.length}
      />

      <GlassCard className="overflow-hidden">
        <div className="border-b border-white/10 px-4 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-white">Prediction Results</h3>
          <p className="mt-1 text-sm text-slate-400">
            Campaign-level actual vs predicted revenue comparison
          </p>
        </div>

        <div className="predictions-table-scroll overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                {SORTABLE_COLUMNS.map(({ field, label, align }) => (
                  <th key={field} className="px-4 py-3 font-medium sm:px-6">
                    <button
                      type="button"
                      onClick={() => handleSort(field)}
                      className={cn(
                        "group inline-flex w-full items-center gap-1.5 transition-colors hover:text-slate-300",
                        align === "right" && "justify-end",
                      )}
                    >
                      {label}
                      <SortIcon
                        field={field}
                        activeField={sortField}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-white/5 transition-all duration-200",
                      index % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent",
                      "hover:bg-indigo-500/[0.07] hover:shadow-[inset_3px_0_0_0_rgba(99,102,241,0.6)]",
                    )}
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-200 sm:px-6 sm:py-4">
                      {row.campaignName}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400 sm:px-6 sm:py-4">
                      {formatCurrency(row.spend)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400 sm:px-6 sm:py-4">
                      {formatNumber(row.clicks)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400 sm:px-6 sm:py-4">
                      {formatNumber(row.conversions)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-300 sm:px-6 sm:py-4">
                      {formatCurrency(row.actualRevenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-indigo-300 sm:px-6 sm:py-4">
                      {formatCurrency(row.predictedRevenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-6 sm:py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          row.difference >= 0
                            ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25"
                            : "bg-rose-500/15 text-rose-400 ring-rose-500/25",
                        )}
                      >
                        {row.difference >= 0 ? "+" : "−"}
                        {formatCurrency(Math.abs(row.difference))}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6">
                    No predictions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </GlassCard>
    </div>
  );
}

"use client";

import { Calendar, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PredictionFilters } from "@/lib/predictions-utils";
import { cn } from "@/lib/utils";

type PredictionsFiltersProps = {
  filters: PredictionFilters;
  campaigns: string[];
  dates: string[];
  onChange: (filters: PredictionFilters) => void;
  resultCount: number;
};

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20";

const selectClassName =
  "w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20";

export function PredictionsFilters({
  filters,
  campaigns,
  dates,
  onChange,
  resultCount,
}: PredictionsFiltersProps) {
  const update = (partial: Partial<PredictionFilters>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Filters</h3>
        </div>
        <p className="text-sm text-slate-500">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="relative xl:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search campaigns..."
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            className={inputClassName}
          />
        </div>

        <div>
          <select
            value={filters.campaign}
            onChange={(event) => update({ campaign: event.target.value })}
            className={selectClassName}
          >
            <option value="all">All Campaigns</option>
            {campaigns.map((campaign) => (
              <option key={campaign} value={campaign}>
                {campaign}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <select
            value={filters.date}
            onChange={(event) => update({ date: event.target.value })}
            className={cn(selectClassName, "pl-10")}
          >
            <option value="all">All Dates</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="number"
            placeholder="Min predicted revenue"
            value={filters.revenueMin}
            onChange={(event) => update({ revenueMin: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Max predicted revenue"
            value={filters.revenueMax}
            onChange={(event) => update({ revenueMax: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              onChange({
                search: "",
                campaign: "all",
                date: "all",
                revenueMin: "",
                revenueMax: "",
              })
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const start = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalRows);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-300">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-300">{totalRows}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-400 transition",
            "hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "min-w-[2.25rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition",
                pageNumber === currentPage
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-white/10 hover:text-white",
              )}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-400 transition",
            "hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40",
          )}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

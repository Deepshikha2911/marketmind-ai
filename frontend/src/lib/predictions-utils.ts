import type { PredictionRow } from "@/lib/predictions-data";

export type PredictionFilters = {
  search: string;
  campaign: string;
  date: string;
  revenueMin: string;
  revenueMax: string;
};

export const DEFAULT_PREDICTION_FILTERS: PredictionFilters = {
  search: "",
  campaign: "all",
  date: "all",
  revenueMin: "",
  revenueMax: "",
};

export function getUniqueCampaigns(rows: PredictionRow[]) {
  return [...new Set(rows.map((row) => row.campaignName))].sort();
}

export function getUniqueDates(rows: PredictionRow[]) {
  return [...new Set(rows.map((row) => row.date))].sort();
}

export function filterPredictions(
  rows: PredictionRow[],
  filters: PredictionFilters,
): PredictionRow[] {
  return rows.filter((row) => {
    const matchesSearch =
      !filters.search ||
      row.campaignName.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCampaign =
      filters.campaign === "all" || row.campaignName === filters.campaign;

    const matchesDate = filters.date === "all" || row.date === filters.date;

    const min = filters.revenueMin ? Number(filters.revenueMin) : null;
    const max = filters.revenueMax ? Number(filters.revenueMax) : null;
    const matchesMin = min === null || row.predictedRevenue >= min;
    const matchesMax = max === null || row.predictedRevenue <= max;

    return matchesSearch && matchesCampaign && matchesDate && matchesMin && matchesMax;
  });
}

export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    rows: rows.slice(start, start + pageSize),
    totalPages,
    currentPage: safePage,
    totalRows: rows.length,
  };
}

export function exportPredictionsCsv(rows: PredictionRow[]) {
  const headers = [
    "Campaign Name",
    "Date",
    "Spend",
    "Clicks",
    "Conversions",
    "Actual Revenue",
    "Predicted Revenue",
    "Difference",
  ];

  const lines = rows.map((row) =>
    [
      row.campaignName,
      row.date,
      row.spend,
      row.clicks,
      row.conversions,
      row.actualRevenue,
      row.predictedRevenue,
      row.difference,
    ].join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportPredictionsExcel(rows: PredictionRow[]) {
  const headers = [
    "Campaign Name",
    "Date",
    "Spend",
    "Clicks",
    "Conversions",
    "Actual Revenue",
    "Predicted Revenue",
    "Difference",
  ];

  const lines = rows.map((row) =>
    [
      row.campaignName,
      row.date,
      row.spend,
      row.clicks,
      row.conversions,
      row.actualRevenue,
      row.predictedRevenue,
      row.difference,
    ].join("\t"),
  );

  return [headers.join("\t"), ...lines].join("\n");
}

export type PredictionSortField =
  | "campaignName"
  | "spend"
  | "clicks"
  | "conversions"
  | "actualRevenue"
  | "predictedRevenue"
  | "difference";

export type SortDirection = "asc" | "desc";

export function sortPredictions(
  rows: PredictionRow[],
  field: PredictionSortField | null,
  direction: SortDirection,
): PredictionRow[] {
  if (!field) return rows;

  return [...rows].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    const cmp =
      typeof aVal === "string"
        ? aVal.localeCompare(bVal as string)
        : (aVal as number) - (bVal as number);

    return direction === "asc" ? cmp : -cmp;
  });
}

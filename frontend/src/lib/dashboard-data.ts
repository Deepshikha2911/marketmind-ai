export const PLACEHOLDER = "--";

export type KpiMetric = {
  id: string;
  title: string;
  value: string | null;
  change: string | null;
  trend: "up" | "down" | null;
  description: string;
};

export type RevenuePoint = {
  month: string;
  revenue: number;
};

export type SpendRevenuePoint = {
  month: string;
  revenue: number;
  spend: number;
};

export type UploadRecord = {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  status: "Processed" | "Processing" | "Failed";
};

export type AIInsight = {
  id: string;
  title: string;
  description: string;
  tag: string;
  confidence: number;
};

/** Default KPI structure — values populated when backend data is available. */
export const kpiMetrics: KpiMetric[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: null,
    change: null,
    trend: null,
    description: "Awaiting data from backend",
  },
  {
    id: "spend",
    title: "Ad Spend",
    value: null,
    change: null,
    trend: null,
    description: "Awaiting data from backend",
  },
  {
    id: "roas",
    title: "ROAS",
    value: null,
    change: null,
    trend: null,
    description: "Awaiting data from backend",
  },
  {
    id: "conversions",
    title: "Conversions",
    value: null,
    change: null,
    trend: null,
    description: "Awaiting data from backend",
  },
];

/** Populated via backend API. */
export const revenueTrend: RevenuePoint[] = [];

/** Populated via backend API. */
export const spendVsRevenue: SpendRevenuePoint[] = [];

/** Populated via backend API. */
export const recentUploads: UploadRecord[] = [];

/** Populated via backend API. */
export const aiInsights: AIInsight[] = [];

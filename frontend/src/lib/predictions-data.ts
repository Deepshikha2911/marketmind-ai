/**
 * Types aligned with the future FastAPI `/api/v1/predict` response.
 * Replace `mockPredictResponse` with the API payload when integrating.
 */

export type PredictionStatus = "Ready" | "Processing" | "Failed" | "Pending";

export type PredictionDatasetInfo = {
  selectedDataset: string;
  uploadTime: string;
  rowsProcessed: number;
  predictionStatus: PredictionStatus;
};

export type PredictionKpis = {
  rowsProcessed: number;
  predictionsGenerated: number;
  averagePredictedRevenue: number;
  highestPredictedRevenue: number;
};

export type PredictionRow = {
  id: string;
  campaignName: string;
  date: string;
  spend: number;
  clicks: number;
  conversions: number;
  actualRevenue: number;
  predictedRevenue: number;
  difference: number;
};

export type PredictionSummary = {
  totalPredictions: number;
  averagePrediction: number;
  highestPrediction: number;
  lowestPrediction: number;
  confidenceScore: number;
};

export type ActualVsPredictedPoint = {
  label: string;
  actual: number;
  predicted: number;
};

export type RevenueDistributionPoint = {
  range: string;
  count: number;
};

export type TopCampaignPoint = {
  campaign: string;
  predictedRevenue: number;
};

export type PredictionCharts = {
  actualVsPredicted: ActualVsPredictedPoint[];
  revenueDistribution: RevenueDistributionPoint[];
  topCampaigns: TopCampaignPoint[];
};

export type PredictApiResponse = {
  dataset: PredictionDatasetInfo;
  kpis: PredictionKpis;
  predictions: PredictionRow[];
  summary: PredictionSummary;
  charts: PredictionCharts;
};

export const mockPredictResponse: PredictApiResponse = {
  dataset: {
    selectedDataset: "google_ads_export.csv",
    uploadTime: "Jun 28, 2026 · 2:34 PM",
    rowsProcessed: 12450,
    predictionStatus: "Ready",
  },
  kpis: {
    rowsProcessed: 12450,
    predictionsGenerated: 847,
    averagePredictedRevenue: 4280,
    highestPredictedRevenue: 28450,
  },
  predictions: [
    { id: "1", campaignName: "Brand Search — US", date: "2026-06-01", spend: 4200, clicks: 1840, conversions: 92, actualRevenue: 18400, predictedRevenue: 19250, difference: 850 },
    { id: "2", campaignName: "Performance Max — Retail", date: "2026-06-02", spend: 6800, clicks: 3210, conversions: 145, actualRevenue: 24200, predictedRevenue: 23800, difference: -400 },
    { id: "3", campaignName: "Meta Prospecting — Q2", date: "2026-06-03", spend: 5100, clicks: 8920, conversions: 118, actualRevenue: 15600, predictedRevenue: 17100, difference: 1500 },
    { id: "4", campaignName: "YouTube Awareness", date: "2026-06-04", spend: 3400, clicks: 12400, conversions: 64, actualRevenue: 8200, predictedRevenue: 9100, difference: 900 },
    { id: "5", campaignName: "Shopping — High Intent", date: "2026-06-05", spend: 7200, clicks: 2840, conversions: 210, actualRevenue: 28450, predictedRevenue: 27900, difference: -550 },
    { id: "6", campaignName: "Retargeting — Cart Abandoners", date: "2026-06-06", spend: 2800, clicks: 1560, conversions: 88, actualRevenue: 14200, predictedRevenue: 14800, difference: 600 },
    { id: "7", campaignName: "LinkedIn B2B Leads", date: "2026-06-07", spend: 4500, clicks: 980, conversions: 42, actualRevenue: 9800, predictedRevenue: 10200, difference: 400 },
    { id: "8", campaignName: "Email — Promo Blast", date: "2026-06-08", spend: 1200, clicks: 4200, conversions: 156, actualRevenue: 12400, predictedRevenue: 13100, difference: 700 },
    { id: "9", campaignName: "TikTok Spark Ads", date: "2026-06-09", spend: 3900, clicks: 18400, conversions: 72, actualRevenue: 7600, predictedRevenue: 8400, difference: 800 },
    { id: "10", campaignName: "Display — Contextual", date: "2026-06-10", spend: 2100, clicks: 6400, conversions: 38, actualRevenue: 4200, predictedRevenue: 4800, difference: 600 },
    { id: "11", campaignName: "Brand Search — UK", date: "2026-06-11", spend: 3600, clicks: 1420, conversions: 78, actualRevenue: 14800, predictedRevenue: 15200, difference: 400 },
    { id: "12", campaignName: "Meta Retargeting — DPA", date: "2026-06-12", spend: 5400, clicks: 4100, conversions: 132, actualRevenue: 19800, predictedRevenue: 20500, difference: 700 },
    { id: "13", campaignName: "Google Demand Gen", date: "2026-06-13", spend: 4800, clicks: 5600, conversions: 96, actualRevenue: 13400, predictedRevenue: 12800, difference: -600 },
    { id: "14", campaignName: "Affiliate — Partner Network", date: "2026-06-14", spend: 1800, clicks: 2200, conversions: 84, actualRevenue: 11200, predictedRevenue: 11800, difference: 600 },
    { id: "15", campaignName: "Search — Competitor Terms", date: "2026-06-15", spend: 6200, clicks: 1980, conversions: 68, actualRevenue: 10800, predictedRevenue: 11400, difference: 600 },
    { id: "16", campaignName: "Instagram Stories — Promo", date: "2026-06-16", spend: 3200, clicks: 7200, conversions: 54, actualRevenue: 6400, predictedRevenue: 7100, difference: 700 },
    { id: "17", campaignName: "Performance Max — Travel", date: "2026-06-17", spend: 8100, clicks: 3640, conversions: 178, actualRevenue: 22100, predictedRevenue: 23400, difference: 1300 },
    { id: "18", campaignName: "CTV — Streaming Bundle", date: "2026-06-18", spend: 5600, clicks: 890, conversions: 48, actualRevenue: 9200, predictedRevenue: 8800, difference: -400 },
    { id: "19", campaignName: "Search — Non-Brand", date: "2026-06-19", spend: 7400, clicks: 2680, conversions: 124, actualRevenue: 17600, predictedRevenue: 18200, difference: 600 },
    { id: "20", campaignName: "Meta Lookalike — 1%", date: "2026-06-20", spend: 4600, clicks: 6200, conversions: 98, actualRevenue: 13800, predictedRevenue: 14500, difference: 700 },
    { id: "21", campaignName: "YouTube Action — Conversions", date: "2026-06-21", spend: 3800, clicks: 5400, conversions: 86, actualRevenue: 12400, predictedRevenue: 12900, difference: 500 },
    { id: "22", campaignName: "Shopping — Low Margin SKUs", date: "2026-06-22", spend: 2900, clicks: 1980, conversions: 112, actualRevenue: 9800, predictedRevenue: 10400, difference: 600 },
    { id: "23", campaignName: "Brand Search — CA", date: "2026-06-23", spend: 3100, clicks: 1280, conversions: 66, actualRevenue: 11200, predictedRevenue: 11600, difference: 400 },
    { id: "24", campaignName: "Display — Remarketing", date: "2026-06-24", spend: 2400, clicks: 4800, conversions: 52, actualRevenue: 7800, predictedRevenue: 8200, difference: 400 },
  ],
  summary: {
    totalPredictions: 847,
    averagePrediction: 4280,
    highestPrediction: 28450,
    lowestPrediction: 4800,
    confidenceScore: 91.4,
  },
  charts: {
    actualVsPredicted: [
      { label: "Jun 1–5", actual: 94850, predicted: 97150 },
      { label: "Jun 6–10", actual: 46200, predicted: 49400 },
      { label: "Jun 11–15", actual: 57000, predicted: 58700 },
      { label: "Jun 16–20", actual: 69100, predicted: 71200 },
      { label: "Jun 21–24", actual: 41200, predicted: 43100 },
    ],
    revenueDistribution: [
      { range: "$0–5K", count: 42 },
      { range: "$5–10K", count: 128 },
      { range: "$10–15K", count: 214 },
      { range: "$15–20K", count: 186 },
      { range: "$20–25K", count: 142 },
      { range: "$25K+", count: 135 },
    ],
    topCampaigns: [
      { campaign: "Shopping — High Intent", predictedRevenue: 27900 },
      { campaign: "Performance Max — Retail", predictedRevenue: 23800 },
      { campaign: "Performance Max — Travel", predictedRevenue: 23400 },
      { campaign: "Meta Retargeting — DPA", predictedRevenue: 20500 },
      { campaign: "Brand Search — US", predictedRevenue: 19250 },
    ],
  },
};

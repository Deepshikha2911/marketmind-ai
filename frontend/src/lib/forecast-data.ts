export type ForecastTrend = "up" | "down" | "stable";

export type ForecastKpis = {
  forecastedRevenue: number;
  forecastGrowth: number;
  forecastConfidence: number;
  forecastPeriod: string;
  bestForecastDay: string;
  worstForecastDay: string;
};

export type ForecastSummary = {
  currentTrend: string;
  expectedGrowth: string;
  confidence: number;
  businessOutlook: string;
};

export type RevenueForecastPoint = {
  date: string;
  label: string;
  actual?: number;
  forecast?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
};

export type DailyForecastRow = {
  id: string;
  date: string;
  label: string;
  predictedRevenue: number;
  predictedSpend: number;
  predictedProfit: number;
  confidence: number;
  trend: ForecastTrend;
};

export type GrowthProjectionPoint = {
  label: string;
  current: number;
  forecast: number;
};

export type ChannelForecast = {
  channel: string;
  forecastRevenue: number;
};

export type ForecastInsight = {
  id: string;
  title: string;
  description: string;
};

export type RiskLevel = "High" | "Medium" | "Low";

export type ForecastRisk = {
  id: string;
  level: RiskLevel;
  title: string;
  explanation: string;
};

export type ForecastBottomSummary = {
  overallScore: number;
  expectedRevenue: number;
  expectedGrowth: number;
  confidence: number;
};

export type ForecastApiResponse = {
  kpis: ForecastKpis;
  summary: ForecastSummary;
  revenueChart: RevenueForecastPoint[];
  dailyForecast: DailyForecastRow[];
  growthProjection: GrowthProjectionPoint[];
  channelForecast: ChannelForecast[];
  insights: ForecastInsight[];
  risks: ForecastRisk[];
  bottomSummary: ForecastBottomSummary;
};

export const EMPTY_FORECAST_RESPONSE: ForecastApiResponse = {
  kpis: {
    forecastedRevenue: 0,
    forecastGrowth: 0,
    forecastConfidence: 0,
    forecastPeriod: "—",
    bestForecastDay: "—",
    worstForecastDay: "—",
  },
  summary: {
    currentTrend: "Stable",
    expectedGrowth: "0%",
    confidence: 0,
    businessOutlook: "Neutral",
  },
  revenueChart: [],
  dailyForecast: [],
  growthProjection: [],
  channelForecast: [],
  insights: [],
  risks: [],
  bottomSummary: {
    overallScore: 0,
    expectedRevenue: 0,
    expectedGrowth: 0,
    confidence: 0,
  },
};

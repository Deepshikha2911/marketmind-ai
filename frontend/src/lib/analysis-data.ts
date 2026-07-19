/**
 * Types aligned with the FastAPI `/api/v1/analysis` response.
 */

export type CampaignHealthLabel = "Excellent" | "Strong" | "Moderate" | "At Risk";
export type RecommendationPriority = "High" | "Medium" | "Low";
export type CampaignStatus = "Performing" | "Underperforming" | "At Risk" | "Stable";

export type OverallScore = {
  overallAiScore: number;
  overallCampaignHealth: CampaignHealthLabel;
  confidence: number;
  dataset: string;
  rowsProcessed: number;
  analysisTimeSeconds: number;
};

export type AnalysisExecutiveSummary = {
  totalRevenue: number;
  totalSpend: number;
  profit: number;
  averageRoi: number;
  averageRoas: number;
  predictedRevenue: number;
  forecastRevenue: number;
  optimizationGain: number;
  scenarioGain: number;
};

export type AnalysisKpis = {
  revenue: number;
  spend: number;
  roi: number;
  roas: number;
  ctr: number;
  conversions: number;
  cpc: number;
  cpm: number;
  predictionAccuracy: number;
  forecastConfidence: number;
  optimizationScore: number;
  businessHealthScore: number;
};

export type RevenueOverviewPoint = {
  month: string;
  actual: number;
  predicted: number;
  forecast: number;
};

export type FunnelStage = {
  stage: string;
  value: number;
  label: string;
};

export type PredictionSummaryData = {
  rowsProcessed: number;
  predictionsGenerated: number;
  highestPrediction: number;
  averagePrediction: number;
};

export type AnalysisInsight = {
  id: string;
  priority: RecommendationPriority;
  category: string;
  title: string;
  explanation: string;
  businessImpact: string;
  recommendedAction: string;
  estimatedRevenueGain: number;
};

export type BudgetOptimizationData = {
  currentBudget: number;
  recommendedBudget: number;
  revenueIncrease: number;
  savings: number;
  allocation: {
    channel: string;
    currentBudget: number;
    optimizedBudget: number;
  }[];
};

export type ForecastSummaryData = {
  expectedRevenue: number;
  expectedGrowth: number;
  confidence: number;
  dailyForecast: {
    day: string;
    revenue: number;
    lower: number;
    upper: number;
  }[];
};

export type ScenarioComparison = {
  id: string;
  name: string;
  description: string;
  revenueImpact: number;
  roiImpact: number;
  isBest: boolean;
};

export type CampaignLeaderboardRow = {
  id: string;
  campaign: string;
  revenue: number;
  spend: number;
  roi: number;
  predictedRevenue: number;
  forecastRevenue: number;
  recommendation: string;
  status: CampaignStatus;
};

export type BusinessHealthMetric = {
  label: string;
  score: number;
};

export type BusinessHealthData = {
  overallHealth: number;
  metrics: BusinessHealthMetric[];
};

export type FinalRecommendation = {
  id: string;
  priority: RecommendationPriority;
  title: string;
  businessImpact: string;
  estimatedRevenueGain: number;
  recommendedAction: string;
};

export type AnalysisBottomSummary = {
  overallScore: number;
  predictedRevenue: number;
  optimizationGain: number;
  forecastGrowth: number;
  bestScenario: string;
  confidence: number;
  finalRecommendation: string;
};

export type AnalysisApiResponse = {
  overallScore: OverallScore;
  executiveSummary: AnalysisExecutiveSummary;
  kpis: AnalysisKpis;
  revenueOverview: RevenueOverviewPoint[];
  funnel: FunnelStage[];
  predictionSummary: PredictionSummaryData;
  insights: AnalysisInsight[];
  budget: BudgetOptimizationData;
  forecast: ForecastSummaryData;
  scenarios: ScenarioComparison[];
  campaigns: CampaignLeaderboardRow[];
  businessHealth: BusinessHealthData;
  finalRecommendations: FinalRecommendation[];
  bottomSummary: AnalysisBottomSummary;
};

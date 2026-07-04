/**
 * Types aligned with the future FastAPI `/api/v1/insights` response.
 * Replace `mockInsightsResponse` with the API payload when integrating.
 */

export type TrendDirection = "up" | "down" | "stable";
export type RecommendationPriority = "High" | "Medium" | "Low";
export type CampaignHealth = "Strong" | "Moderate" | "At Risk";
export type CampaignStatus = "Performing" | "Underperforming" | "At Risk" | "Stable";

export type ExecutiveSummary = {
  overallCampaignHealth: CampaignHealth;
  overallScore: number;
  revenueTrend: string;
  revenueTrendDirection: TrendDirection;
  profitTrend: string;
  profitTrendDirection: TrendDirection;
  bestPerformingChannel: string;
  worstPerformingChannel: string;
};

export type InsightsKpis = {
  totalRevenue: number;
  totalSpend: number;
  averageRoi: number;
  averageRoas: number;
  ctr: number;
  conversionRate: number;
};

export type AIRecommendation = {
  id: string;
  priority: RecommendationPriority;
  title: string;
  explanation: string;
  businessImpact: string;
  recommendedAction: string;
  estimatedRevenueGain: number;
};

export type CampaignPerformance = {
  id: string;
  campaign: string;
  revenue: number;
  spend: number;
  roi: number;
  roas: number;
  status: CampaignStatus;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type TrendCharts = {
  revenue: TrendPoint[];
  roi: TrendPoint[];
  ctr: TrendPoint[];
  conversion: TrendPoint[];
};

export type BudgetInsights = {
  overspendingCampaigns: string[];
  underutilizedBudget: string;
  budgetEfficiencyScore: number;
};

export type PredictionInsights = {
  averagePredictedRevenue: number;
  predictionAccuracy: number;
  confidence: number;
  forecastSummary: string;
};

export type InsightsApiResponse = {
  hasInsights: boolean;
  executiveSummary: ExecutiveSummary;
  kpis: InsightsKpis;
  recommendations: AIRecommendation[];
  campaigns: CampaignPerformance[];
  trends: TrendCharts;
  budget: BudgetInsights;
  prediction: PredictionInsights;
  aiSummary: string;
};

export const mockInsightsResponse: InsightsApiResponse = {
  hasInsights: true,
  executiveSummary: {
    overallCampaignHealth: "Strong",
    overallScore: 82,
    revenueTrend: "+14.2%",
    revenueTrendDirection: "up",
    profitTrend: "+9.8%",
    profitTrendDirection: "up",
    bestPerformingChannel: "Google Search",
    worstPerformingChannel: "Display Network",
  },
  kpis: {
    totalRevenue: 284500,
    totalSpend: 48200,
    averageRoi: 490,
    averageRoas: 5.9,
    ctr: 3.42,
    conversionRate: 4.18,
  },
  recommendations: [
    {
      id: "1",
      priority: "High",
      title: "Increase Search campaign budget by 15%",
      explanation:
        "Search campaigns deliver 2.4× higher ROAS than display. Current impression share is capped at 68%, leaving measurable revenue on the table.",
      businessImpact: "High — directly affects top-performing acquisition channel",
      recommendedAction: "Reallocate 15% of display spend to high-intent search ad groups over the next 2 weeks.",
      estimatedRevenueGain: 18500,
    },
    {
      id: "2",
      priority: "High",
      title: "Refresh fatigued Meta ad creatives",
      explanation:
        "Top-spend Meta ad sets show a 22% CTR decline over 14 days. Creative fatigue is increasing CPA without volume gains.",
      businessImpact: "High — prevents efficiency erosion on largest social channel",
      recommendedAction: "Launch 3–5 new creative variants and pause ads with CTR below portfolio average.",
      estimatedRevenueGain: 9200,
    },
    {
      id: "3",
      priority: "Medium",
      title: "Apply weekend bid modifiers",
      explanation:
        "Weekend sessions convert 34% better than weekday average, but bid adjustments remain flat across all days.",
      businessImpact: "Medium — captures existing demand more efficiently",
      recommendedAction: "Increase weekend bid modifiers by 10–15% and monitor CPA for 7 days.",
      estimatedRevenueGain: 6400,
    },
    {
      id: "4",
      priority: "Medium",
      title: "Consolidate underperforming ad groups",
      explanation:
        "12 ad groups spend below break-even ROAS while consuming 18% of total budget with minimal incremental reach.",
      businessImpact: "Medium — improves budget concentration on winners",
      recommendedAction: "Pause or merge low-ROAS ad groups and redirect budget to top quartile performers.",
      estimatedRevenueGain: 5100,
    },
    {
      id: "5",
      priority: "Low",
      title: "Expand lookalike audience testing",
      explanation:
        "1% lookalike audiences outperform broad targeting by 19% on conversion rate with similar CPM.",
      businessImpact: "Low — incremental scale opportunity with controlled risk",
      recommendedAction: "Test 2–3% lookalike segments with 10% of prospecting budget.",
      estimatedRevenueGain: 3800,
    },
  ],
  campaigns: [
    { id: "1", campaign: "Brand Search — US", revenue: 68400, spend: 12400, roi: 452, roas: 5.5, status: "Performing" },
    { id: "2", campaign: "Performance Max — Retail", revenue: 52800, spend: 9800, roi: 439, roas: 5.4, status: "Performing" },
    { id: "3", campaign: "Meta Prospecting — Q2", revenue: 34200, spend: 8600, roi: 298, roas: 4.0, status: "Stable" },
    { id: "4", campaign: "Display — Contextual", revenue: 12400, spend: 5200, roi: 138, roas: 2.4, status: "Underperforming" },
    { id: "5", campaign: "YouTube Awareness", revenue: 18600, spend: 4800, roi: 288, roas: 3.9, status: "Stable" },
    { id: "6", campaign: "Shopping — High Intent", revenue: 45600, spend: 7400, roi: 516, roas: 6.2, status: "Performing" },
    { id: "7", campaign: "LinkedIn B2B Leads", revenue: 22800, spend: 6200, roi: 268, roas: 3.7, status: "At Risk" },
    { id: "8", campaign: "Retargeting — Cart", revenue: 30700, spend: 3800, roi: 708, roas: 8.1, status: "Performing" },
  ],
  trends: {
    revenue: [
      { label: "Jan", value: 182000 },
      { label: "Feb", value: 195000 },
      { label: "Mar", value: 208000 },
      { label: "Apr", value: 221000 },
      { label: "May", value: 245000 },
      { label: "Jun", value: 284500 },
    ],
    roi: [
      { label: "Jan", value: 380 },
      { label: "Feb", value: 410 },
      { label: "Mar", value: 425 },
      { label: "Apr", value: 448 },
      { label: "May", value: 462 },
      { label: "Jun", value: 490 },
    ],
    ctr: [
      { label: "Jan", value: 2.84 },
      { label: "Feb", value: 2.96 },
      { label: "Mar", value: 3.08 },
      { label: "Apr", value: 3.18 },
      { label: "May", value: 3.32 },
      { label: "Jun", value: 3.42 },
    ],
    conversion: [
      { label: "Jan", value: 3.42 },
      { label: "Feb", value: 3.58 },
      { label: "Mar", value: 3.72 },
      { label: "Apr", value: 3.89 },
      { label: "May", value: 4.02 },
      { label: "Jun", value: 4.18 },
    ],
  },
  budget: {
    overspendingCampaigns: [
      "Display — Contextual",
      "LinkedIn B2B Leads",
      "Meta Prospecting — Q2",
    ],
    underutilizedBudget: "$12,400 available in high-ROAS Search and Shopping campaigns",
    budgetEfficiencyScore: 78,
  },
  prediction: {
    averagePredictedRevenue: 4280,
    predictionAccuracy: 91.4,
    confidence: 87,
    forecastSummary:
      "Next-month revenue forecast projects 8–12% growth if recommended budget shifts are applied.",
  },
  aiSummary:
    "MarketMind AI recommends increasing Search campaign budget by approximately 15% while reducing spend on low-performing Display campaigns. Weekend conversion rates remain significantly higher than weekdays. Overall campaign health is strong with an score of 82/100. Prioritize creative refresh on Meta and implement weekend bid modifiers to capture an estimated $18.5K in additional revenue.",
};

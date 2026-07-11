import {
  budgetAllocationChartData,
  forecastChartData,
  marketingFunnelChartData,
  revenueOverviewChartData,
} from "@/lib/analytics-chart-data";

/**
 * Types aligned with the future FastAPI `/api/v1/analysis` response.
 * Replace `mockAnalysisResponse` with the API payload when integrating.
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

export const mockAnalysisResponse: AnalysisApiResponse = {
  overallScore: {
    overallAiScore: 92,
    overallCampaignHealth: "Excellent",
    confidence: 94,
    dataset: "google_ads_campaign_stats.csv",
    rowsProcessed: 19272,
    analysisTimeSeconds: 3.8,
  },
  executiveSummary: {
    totalRevenue: 298400,
    totalSpend: 52800,
    profit: 245600,
    averageRoi: 465,
    averageRoas: 5.65,
    predictedRevenue: 326800,
    forecastRevenue: 338200,
    optimizationGain: 18500,
    scenarioGain: 24200,
  },
  kpis: {
    revenue: 298400,
    spend: 52800,
    roi: 465,
    roas: 5.65,
    ctr: 3.58,
    conversions: 12842,
    cpc: 1.24,
    cpm: 18.6,
    predictionAccuracy: 91.4,
    forecastConfidence: 94,
    optimizationScore: 91,
    businessHealthScore: 92,
  },
  revenueOverview: revenueOverviewChartData,
  funnel: marketingFunnelChartData,
  predictionSummary: {
    rowsProcessed: 19272,
    predictionsGenerated: 19272,
    highestPrediction: 18420,
    averagePrediction: 4280,
  },
  insights: [
    {
      id: "1",
      priority: "High",
      category: "Revenue Opportunity",
      title: "Capture untapped Search impression share",
      explanation:
        "Search campaigns are capped at 68% impression share while delivering 6.8× ROAS. Incremental budget would convert high-intent traffic at minimal marginal cost.",
      businessImpact: "High — unlocks $12,400+ in incremental monthly revenue from existing keyword coverage",
      recommendedAction: "Increase Search daily budget by 18% and expand top-performing ad groups by 12 keywords.",
      estimatedRevenueGain: 12400,
    },
    {
      id: "2",
      priority: "High",
      category: "Budget Opportunity",
      title: "Reallocate Display spend to Shopping",
      explanation:
        "Display campaigns consume 22% of budget at 2.1× ROAS while Shopping delivers 6.4× ROAS with only 14% allocation.",
      businessImpact: "High — improves portfolio ROAS by 0.8× without increasing total spend",
      recommendedAction: "Shift $3,200/month from Display retargeting to Shopping product groups.",
      estimatedRevenueGain: 9200,
    },
    {
      id: "3",
      priority: "Medium",
      category: "Creative Improvement",
      title: "Refresh Meta ad creatives showing fatigue",
      explanation:
        "Top Meta ad sets show 34% CTR decline over 21 days. Creative refresh typically restores engagement within one week.",
      businessImpact: "Medium — restores CTR to baseline and reduces CPC by an estimated 12%",
      recommendedAction: "Launch 4 new video variants and 6 static carousel formats for top 3 ad sets.",
      estimatedRevenueGain: 5800,
    },
    {
      id: "4",
      priority: "High",
      category: "Campaign Optimization",
      title: "Pause underperforming Display placements",
      explanation:
        "14 Display placements generate less than 0.5× ROAS while consuming $1,840/month. Pausing them frees budget for high-ROI channels.",
      businessImpact: "High — immediate savings with no revenue loss on converting traffic",
      recommendedAction: "Pause 14 placements and redirect $1,840/month to Search and Shopping.",
      estimatedRevenueGain: 7400,
    },
    {
      id: "5",
      priority: "Medium",
      category: "Weekend Strategy",
      title: "Increase weekend bid adjustments",
      explanation:
        "Weekend conversion rates are 28% higher than weekdays but receive equal bid weighting. Targeted bid boosts capture peak demand.",
      businessImpact: "Medium — captures high-converting weekend traffic at 15% lower effective CPC",
      recommendedAction: "Apply +20% bid modifier on Saturdays and +15% on Sundays for Search campaigns.",
      estimatedRevenueGain: 4600,
    },
    {
      id: "6",
      priority: "Low",
      category: "Audience Expansion",
      title: "Expand lookalike audiences on Meta",
      explanation:
        "Current 1% lookalike audiences are saturated. 2–3% lookalikes show 82% of 1% performance at 40% lower CPM.",
      businessImpact: "Low — incremental reach with acceptable efficiency trade-off",
      recommendedAction: "Test 2% and 3% lookalike audiences with $800/month test budget.",
      estimatedRevenueGain: 3200,
    },
  ],
  budget: {
    currentBudget: 52800,
    recommendedBudget: 52400,
    revenueIncrease: 18500,
    savings: 6200,
    allocation: budgetAllocationChartData.map((item) => ({
      channel: item.channel,
      currentBudget: item.current,
      optimizedBudget: item.optimized,
    })),
  },
  forecast: {
    expectedRevenue: 338200,
    expectedGrowth: 14.8,
    confidence: 94,
    dailyForecast: forecastChartData,
  },
  scenarios: [
    {
      id: "increase-budget",
      name: "Increase Search Budget",
      description: "Increase Search budget by 20% and reallocate from Display",
      revenueImpact: 24200,
      roiImpact: 12.4,
      isBest: true,
    },
    {
      id: "reduce-budget",
      name: "Reduce Budget",
      description: "Cut total spend by 15% focusing on lowest ROAS channels",
      revenueImpact: -8400,
      roiImpact: 8.2,
      isBest: false,
    },
    {
      id: "pause-campaign",
      name: "Pause Campaign",
      description: "Pause all Display campaigns and redirect budget to Search",
      revenueImpact: 6800,
      roiImpact: 18.6,
      isBest: false,
    },
    {
      id: "increase-ctr",
      name: "Increase CTR",
      description: "Refresh creatives and improve ad relevance scores by 15%",
      revenueImpact: 11200,
      roiImpact: 9.8,
      isBest: false,
    },
    {
      id: "improve-conversion",
      name: "Improve Conversion",
      description: "Optimize landing pages and checkout flow for +10% CVR",
      revenueImpact: 18600,
      roiImpact: 14.2,
      isBest: false,
    },
    {
      id: "boost-revenue",
      name: "Boost Revenue",
      description: "Combined strategy: budget shift + creative refresh + weekend bids",
      revenueImpact: 28400,
      roiImpact: 16.8,
      isBest: false,
    },
  ],
  campaigns: [
    {
      id: "1",
      campaign: "Brand Search — Core",
      revenue: 68400,
      spend: 8200,
      roi: 734,
      predictedRevenue: 72800,
      forecastRevenue: 75200,
      recommendation: "Increase budget +15%",
      status: "Performing",
    },
    {
      id: "2",
      campaign: "Shopping — Best Sellers",
      revenue: 54200,
      spend: 6800,
      roi: 697,
      predictedRevenue: 58600,
      forecastRevenue: 61200,
      recommendation: "Scale allocation +20%",
      status: "Performing",
    },
    {
      id: "3",
      campaign: "Non-Brand Search — High Intent",
      revenue: 42800,
      spend: 9200,
      roi: 365,
      predictedRevenue: 48200,
      forecastRevenue: 49800,
      recommendation: "Expand keywords",
      status: "Performing",
    },
    {
      id: "4",
      campaign: "Meta — Prospecting",
      revenue: 38400,
      spend: 8400,
      roi: 357,
      predictedRevenue: 36800,
      forecastRevenue: 37200,
      recommendation: "Refresh creatives",
      status: "Stable",
    },
    {
      id: "5",
      campaign: "Display — Retargeting",
      revenue: 18200,
      spend: 9600,
      roi: 90,
      predictedRevenue: 14200,
      forecastRevenue: 12800,
      recommendation: "Reduce budget -40%",
      status: "Underperforming",
    },
    {
      id: "6",
      campaign: "YouTube — Awareness",
      revenue: 12400,
      spend: 6600,
      roi: 88,
      predictedRevenue: 9800,
      forecastRevenue: 8600,
      recommendation: "Pause or restructure",
      status: "At Risk",
    },
    {
      id: "7",
      campaign: "Display — Prospecting",
      revenue: 8600,
      spend: 4200,
      roi: 105,
      predictedRevenue: 6200,
      forecastRevenue: 5400,
      recommendation: "Pause campaign",
      status: "At Risk",
    },
    {
      id: "8",
      campaign: "Meta — Retargeting",
      revenue: 35400,
      spend: 4400,
      roi: 705,
      predictedRevenue: 38200,
      forecastRevenue: 39600,
      recommendation: "Maintain budget",
      status: "Performing",
    },
  ],
  businessHealth: {
    overallHealth: 92,
    metrics: [
      { label: "Data Quality", score: 96 },
      { label: "Forecast Reliability", score: 94 },
      { label: "Prediction Confidence", score: 91 },
      { label: "Budget Efficiency", score: 88 },
      { label: "Campaign Health", score: 90 },
    ],
  },
  finalRecommendations: [
    {
      id: "1",
      priority: "High",
      title: "Reallocate budget toward Search and Shopping campaigns",
      businessImpact: "Highest ROI channels are under-funded relative to performance potential",
      estimatedRevenueGain: 18500,
      recommendedAction: "Shift $4,800/month from Display and YouTube to Search (+$2,800) and Shopping (+$2,000).",
    },
    {
      id: "2",
      priority: "High",
      title: "Pause underperforming Display campaigns immediately",
      businessImpact: "Display prospecting and retargeting deliver sub-1.5× ROAS, dragging portfolio efficiency",
      estimatedRevenueGain: 7400,
      recommendedAction: "Pause Display — Prospecting and reduce Display — Retargeting budget by 40%.",
    },
    {
      id: "3",
      priority: "High",
      title: "Increase Search budget to capture impression share",
      businessImpact: "Search impression share capped at 68% with 6.8× ROAS — highest in portfolio",
      estimatedRevenueGain: 12400,
      recommendedAction: "Increase Brand and Non-Brand Search daily budgets by 15–18%.",
    },
    {
      id: "4",
      priority: "High",
      title: "Refresh Meta ad creatives showing engagement decline",
      businessImpact: "CTR dropped 34% over 21 days on top ad sets, increasing CPC and reducing reach",
      estimatedRevenueGain: 5800,
      recommendedAction: "Launch 4 video and 6 carousel variants for top 3 Meta ad sets within 7 days.",
    },
    {
      id: "5",
      priority: "Medium",
      title: "Implement weekend bid modifiers for peak conversion periods",
      businessImpact: "Weekend CVR is 28% higher than weekdays with equal bid weighting",
      estimatedRevenueGain: 4600,
      recommendedAction: "Apply +20% Saturday and +15% Sunday bid adjustments on Search campaigns.",
    },
    {
      id: "6",
      priority: "Medium",
      title: "Scale Shopping campaigns with proven 6.4× ROAS",
      businessImpact: "Shopping receives only 14% of budget despite highest conversion efficiency",
      estimatedRevenueGain: 9200,
      recommendedAction: "Increase Shopping — Best Sellers budget by $2,400/month.",
    },
    {
      id: "7",
      priority: "Medium",
      title: "Restructure or pause YouTube awareness campaigns",
      businessImpact: "YouTube delivers 1.9× ROAS vs portfolio average of 5.65×",
      estimatedRevenueGain: 4200,
      recommendedAction: "Reduce YouTube spend by 55% and test performance-max video formats.",
    },
    {
      id: "8",
      priority: "Low",
      title: "Expand Meta lookalike audiences to 2–3% tiers",
      businessImpact: "1% lookalikes saturated; broader tiers offer 82% efficiency at lower CPM",
      estimatedRevenueGain: 3200,
      recommendedAction: "Allocate $800/month test budget to 2% and 3% lookalike audiences.",
    },
    {
      id: "9",
      priority: "Medium",
      title: "Optimize landing pages for Non-Brand Search traffic",
      businessImpact: "Non-Brand Search CVR is 22% below Brand Search despite high intent keywords",
      estimatedRevenueGain: 6800,
      recommendedAction: "A/B test 3 landing page variants with improved above-fold messaging.",
    },
    {
      id: "10",
      priority: "High",
      title: "Establish weekly AI-driven budget review cadence",
      businessImpact: "Dynamic reallocation based on AI insights maintains 91+ optimization score",
      estimatedRevenueGain: 8400,
      recommendedAction: "Schedule weekly MarketMind AI analysis runs and implement top 3 recommendations.",
    },
  ],
  bottomSummary: {
    overallScore: 92,
    predictedRevenue: 326800,
    optimizationGain: 18500,
    forecastGrowth: 14.8,
    bestScenario: "Increase Search Budget",
    confidence: 94,
    finalRecommendation:
      "MarketMind AI recommends reallocating budget toward Search and Shopping campaigns, refreshing Meta creatives, increasing weekend bids, and pausing underperforming Display campaigns to maximize ROI and projected revenue.",
  },
};

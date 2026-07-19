export type BudgetPriority = "High" | "Medium" | "Low";
export type OptimizationStatus = "Increase" | "Decrease" | "Maintain" | "Pause";

export type BudgetSummary = {
  recommendedBudget: number;
  estimatedRevenueIncrease: number;
  budgetSaved: number;
  averageRoas: number;
  optimizationScore: number;
  campaignsOptimized: number;
};

export type BudgetRecommendation = {
  id: string;
  priority: BudgetPriority;
  title: string;
  explanation: string;
  estimatedGain: number;
  suggestedAction: string;
};

export type ChannelAllocation = {
  channel: string;
  currentBudget: number;
  recommendedBudget: number;
};

export type ChannelRoi = {
  channel: string;
  currentRoi: number;
  optimizedRoi: number;
};

export type CampaignBudgetRow = {
  id: string;
  campaign: string;
  currentBudget: number;
  recommendedBudget: number;
  currentRoas: number;
  expectedRoas: number;
  budgetChange: number;
  expectedRevenue: number;
  status: OptimizationStatus;
};

export type OptimizationInsight = {
  id: string;
  title: string;
  description: string;
};

export type BudgetBottomSummary = {
  optimizationScore: number;
  estimatedMonthlyRevenueIncrease: number;
  budgetSavings: number;
  confidence: number;
};

export type BudgetApiResponse = {
  summary: BudgetSummary;
  recommendations: BudgetRecommendation[];
  allocation: ChannelAllocation[];
  roiComparison: ChannelRoi[];
  campaigns: CampaignBudgetRow[];
  insights: OptimizationInsight[];
  bottomSummary: BudgetBottomSummary;
};

export const EMPTY_BUDGET_RESPONSE: BudgetApiResponse = {
  summary: {
    recommendedBudget: 0,
    estimatedRevenueIncrease: 0,
    budgetSaved: 0,
    averageRoas: 0,
    optimizationScore: 0,
    campaignsOptimized: 0,
  },
  recommendations: [],
  allocation: [],
  roiComparison: [],
  campaigns: [],
  insights: [],
  bottomSummary: {
    optimizationScore: 0,
    estimatedMonthlyRevenueIncrease: 0,
    budgetSavings: 0,
    confidence: 0,
  },
};

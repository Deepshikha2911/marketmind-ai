/**
 * Types aligned with the future FastAPI budget optimizer endpoint.
 * Replace `mockBudgetResponse` with the API payload when integrating.
 */

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

export const mockBudgetResponse: BudgetApiResponse = {
  summary: {
    recommendedBudget: 52400,
    estimatedRevenueIncrease: 18500,
    budgetSaved: 6200,
    averageRoas: 6.4,
    optimizationScore: 91,
    campaignsOptimized: 24,
  },
  recommendations: [
    {
      id: "1",
      priority: "High",
      title: "Increase Search Budget by 15%",
      explanation:
        "Display campaigns are underperforming while Search campaigns achieve 2.3× higher ROAS with impression share capped at 68%.",
      estimatedGain: 18500,
      suggestedAction: "Shift 15% budget from Display to Search.",
    },
    {
      id: "2",
      priority: "High",
      title: "Scale Shopping Campaign Allocation",
      explanation:
        "Shopping campaigns deliver 6.2× ROAS — the highest in the portfolio — yet receive only 14% of total spend.",
      estimatedGain: 9200,
      suggestedAction: "Increase Shopping budget by $2,400/month.",
    },
    {
      id: "3",
      priority: "Medium",
      title: "Apply Weekend Bid Modifiers",
      explanation:
        "Weekend conversion rates are 34% higher than weekdays, but budget distribution remains flat across all days.",
      estimatedGain: 6400,
      suggestedAction: "Increase weekend bids by 12% across Search and Shopping.",
    },
    {
      id: "4",
      priority: "Medium",
      title: "Reduce Meta Prospecting Spend",
      explanation:
        "Meta prospecting CPA has risen 18% over 30 days while conversion volume plateaued. ROAS dropped below portfolio average.",
      estimatedGain: 5100,
      suggestedAction: "Reduce Meta prospecting budget by $1,800 and reallocate to retargeting.",
    },
    {
      id: "5",
      priority: "Low",
      title: "Pause Break-Even Display Campaigns",
      explanation:
        "Three display ad groups operate below 2.0× ROAS break-even threshold, consuming $1,400/month with minimal incremental reach.",
      estimatedGain: 2800,
      suggestedAction: "Pause underperforming display ad groups and consolidate audiences.",
    },
  ],
  allocation: [
    { channel: "Google Search", currentBudget: 14200, recommendedBudget: 18600 },
    { channel: "Meta Ads", currentBudget: 11800, recommendedBudget: 10200 },
    { channel: "Shopping", currentBudget: 6800, recommendedBudget: 9200 },
    { channel: "Display", currentBudget: 8400, recommendedBudget: 5200 },
    { channel: "Email", currentBudget: 3200, recommendedBudget: 3800 },
    { channel: "YouTube", currentBudget: 4800, recommendedBudget: 5400 },
  ],
  roiComparison: [
    { channel: "Google Search", currentRoi: 420, optimizedRoi: 485 },
    { channel: "Meta Ads", currentRoi: 310, optimizedRoi: 358 },
    { channel: "Shopping", currentRoi: 516, optimizedRoi: 548 },
    { channel: "Display", currentRoi: 138, optimizedRoi: 192 },
    { channel: "Email", currentRoi: 680, optimizedRoi: 720 },
    { channel: "YouTube", currentRoi: 288, optimizedRoi: 324 },
  ],
  campaigns: [
    { id: "1", campaign: "Brand Search — US", currentBudget: 6200, recommendedBudget: 7800, currentRoas: 5.5, expectedRoas: 6.1, budgetChange: 1600, expectedRevenue: 42800, status: "Increase" },
    { id: "2", campaign: "Performance Max — Retail", currentBudget: 4800, recommendedBudget: 5200, currentRoas: 5.4, expectedRoas: 5.8, budgetChange: 400, expectedRevenue: 30100, status: "Increase" },
    { id: "3", campaign: "Shopping — High Intent", currentBudget: 4200, recommendedBudget: 5800, currentRoas: 6.2, expectedRoas: 6.8, budgetChange: 1600, expectedRevenue: 39400, status: "Increase" },
    { id: "4", campaign: "Display — Contextual", currentBudget: 3600, recommendedBudget: 1800, currentRoas: 2.4, expectedRoas: 2.8, budgetChange: -1800, expectedRevenue: 5040, status: "Decrease" },
    { id: "5", campaign: "Meta Prospecting — Q2", currentBudget: 5400, recommendedBudget: 3600, currentRoas: 4.0, expectedRoas: 4.6, budgetChange: -1800, expectedRevenue: 16560, status: "Decrease" },
    { id: "6", campaign: "Meta Retargeting — DPA", currentBudget: 3200, recommendedBudget: 4200, currentRoas: 6.4, expectedRoas: 7.0, budgetChange: 1000, expectedRevenue: 29400, status: "Increase" },
    { id: "7", campaign: "YouTube Action", currentBudget: 2800, recommendedBudget: 3200, currentRoas: 3.9, expectedRoas: 4.3, budgetChange: 400, expectedRevenue: 13760, status: "Increase" },
    { id: "8", campaign: "Email — Promo", currentBudget: 1800, recommendedBudget: 2200, currentRoas: 8.1, expectedRoas: 8.6, budgetChange: 400, expectedRevenue: 18920, status: "Increase" },
    { id: "9", campaign: "LinkedIn B2B", currentBudget: 2400, recommendedBudget: 1600, currentRoas: 3.7, expectedRoas: 4.1, budgetChange: -800, expectedRevenue: 6560, status: "Decrease" },
    { id: "10", campaign: "Display — Remarketing", currentBudget: 1200, recommendedBudget: 0, currentRoas: 1.8, expectedRoas: 0, budgetChange: -1200, expectedRevenue: 0, status: "Pause" },
  ],
  insights: [
    {
      id: "1",
      title: "Display spend imbalance",
      description:
        "Display campaigns are consuming 22% of spend but generating only 9% of revenue.",
    },
    {
      id: "2",
      title: "Shopping under-allocation",
      description:
        "Shopping campaigns deserve higher allocation based on 6.2× portfolio-leading ROAS.",
    },
    {
      id: "3",
      title: "Weekend opportunity",
      description:
        "Weekend campaigns should receive additional budget — conversion rates are 34% higher.",
    },
    {
      id: "4",
      title: "Break-even pauses",
      description:
        "Pause campaigns below break-even ROAS to redirect $3,800/month to top performers.",
    },
  ],
  bottomSummary: {
    optimizationScore: 91,
    estimatedMonthlyRevenueIncrease: 18500,
    budgetSavings: 6200,
    confidence: 94,
  },
};

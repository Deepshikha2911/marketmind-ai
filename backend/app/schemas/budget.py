from pydantic import BaseModel


class BudgetSummary(BaseModel):
    recommendedBudget: float
    estimatedRevenueIncrease: float
    budgetSaved: float
    averageRoas: float
    optimizationScore: int
    campaignsOptimized: int


class BudgetRecommendationItem(BaseModel):
    id: str
    priority: str
    title: str
    explanation: str
    estimatedGain: float
    suggestedAction: str


class ChannelAllocation(BaseModel):
    channel: str
    currentBudget: float
    recommendedBudget: float


class ChannelRoi(BaseModel):
    channel: str
    currentRoi: float
    optimizedRoi: float


class CampaignBudgetRow(BaseModel):
    id: str
    campaign: str
    currentBudget: float
    recommendedBudget: float
    currentRoas: float
    expectedRoas: float
    budgetChange: float
    expectedRevenue: float
    status: str


class OptimizationInsight(BaseModel):
    id: str
    title: str
    description: str


class BudgetBottomSummary(BaseModel):
    optimizationScore: int
    estimatedMonthlyRevenueIncrease: float
    budgetSavings: float
    confidence: float


class BudgetResponse(BaseModel):
    success: bool
    message: str
    rows_processed: int
    recommendations_generated: int
    output_file: str
    summary: BudgetSummary
    recommendations: list[BudgetRecommendationItem]
    allocation: list[ChannelAllocation]
    roiComparison: list[ChannelRoi]
    campaigns: list[CampaignBudgetRow]
    insights: list[OptimizationInsight]
    bottomSummary: BudgetBottomSummary
    budget_allocation: list[dict]
    roi_comparison: list[dict]
    campaign_table: list[dict]
    optimization_insights: list[dict]
    optimization_score: int
    downloads: dict[str, str]
from typing import Any

from pydantic import BaseModel


class TrendAnalysis(BaseModel):
    series: list[dict[str, Any]]
    roi_series: list[dict[str, Any]]
    ctr_series: list[dict[str, Any]]
    conversion_series: list[dict[str, Any]]


class BudgetInsightItem(BaseModel):
    campaign: str
    spend: float
    revenue: float
    roi: float
    status: str
    reason: str


class BudgetInsights(BaseModel):
    total_spend: float
    total_revenue: float
    average_roi: float
    average_roas: float
    average_ctr: float
    average_conversion_rate: float
    overspending_campaigns: list[BudgetInsightItem]
    underutilized_budget: dict[str, Any]
    budget_efficiency_score: int


class PredictionMetrics(BaseModel):
    average_predicted_revenue: float
    highest_prediction: float
    prediction_accuracy: float
    confidence_score: float


class ForecastSummary(BaseModel):
    headline: str
    details: list[str]


class AISummary(BaseModel):
    summary: str
    recommendations: list[str]
    strengths: list[str]
    risks: list[str]
    opportunities: list[str]


class DashboardInsightsResponse(BaseModel):
    trend_analysis: TrendAnalysis
    budget_insights: BudgetInsights
    at_risk_campaigns: list[dict[str, Any]]
    prediction_metrics: PredictionMetrics
    forecast_summary: ForecastSummary
    ai_summary: AISummary
from pydantic import BaseModel


class ForecastSummary(BaseModel):
    currentTrend: str
    expectedGrowth: str
    confidence: int
    businessOutlook: str


class ForecastMetrics(BaseModel):
    forecastedRevenue: float
    forecastGrowth: float
    forecastConfidence: int
    forecastPeriod: str
    bestForecastDay: str
    worstForecastDay: str


class ForecastChartPoint(BaseModel):
    date: str
    label: str
    actual: float | None = None
    forecast: float | None = None
    confidenceLower: float | None = None
    confidenceUpper: float | None = None


class DailyForecastRow(BaseModel):
    id: str
    date: str
    label: str
    predictedRevenue: float
    predictedSpend: float
    predictedProfit: float
    confidence: int
    trend: str


class GrowthProjectionPoint(BaseModel):
    label: str
    current: float
    forecast: float


class ChannelForecast(BaseModel):
    channel: str
    forecastRevenue: float


class ForecastInsight(BaseModel):
    id: str
    title: str
    description: str


class ForecastRisk(BaseModel):
    id: str
    level: str
    title: str
    explanation: str


class ExecutiveSummary(BaseModel):
    forecastScore: int
    expectedRevenue: float
    expectedGrowth: float
    forecastConfidence: int
    businessOutlook: str
    topOpportunity: str
    topRisk: str


class ForecastBottomSummary(BaseModel):
    overallScore: int
    expectedRevenue: float
    expectedGrowth: float
    confidence: int


class ForecastResponse(BaseModel):
    success: bool
    message: str
    rows_processed: int
    forecast_rows: int
    output_file: str
    summary: ForecastSummary
    metrics: ForecastMetrics
    kpis: ForecastMetrics | None = None
    forecast_chart: list[ForecastChartPoint]
    daily_forecast: list[DailyForecastRow]
    growth_projection: list[GrowthProjectionPoint]
    channel_forecast: list[ChannelForecast]
    insights: list[ForecastInsight]
    risks: list[ForecastRisk]
    executive_summary: ExecutiveSummary
    bottomSummary: ForecastBottomSummary | None = None
from typing import Any, List

from pydantic import BaseModel


class DatasetInfo(BaseModel):
    id: str
    originalFilename: str
    storedFilename: str
    uploadTimestamp: str
    uploadDate: str
    fileSize: int
    rows: int
    columns: int
    status: str


class RevenuePoint(BaseModel):
    month: str
    revenue: float


class SpendRevenuePoint(BaseModel):
    month: str
    revenue: float
    spend: float


class InsightItem(BaseModel):
    id: str
    priority: str | None = None
    title: str
    description: str | None = None
    impact: float | None = None


class DashboardResponse(BaseModel):
    dataset: dict[str, Any] | None
    summary: dict[str, Any]
    revenueTrend: List[RevenuePoint]
    spendRevenue: List[SpendRevenuePoint]
    recentUploads: List[DatasetInfo]
    topInsights: List[InsightItem]

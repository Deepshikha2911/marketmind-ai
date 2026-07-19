from typing import Any

from pydantic import BaseModel


class ScenarioResponse(BaseModel):
    success: bool
    message: str
    scenarios_generated: int
    files: dict[str, str]
    scenarioId: str | None = None
    kpis: dict[str, Any] | None = None
    simulationResults: list[dict[str, Any]] | None = None
    revenueChart: list[dict[str, Any]] | None = None
    channelImpact: list[dict[str, Any]] | None = None
    campaigns: list[dict[str, Any]] | None = None
    insights: list[dict[str, Any]] | None = None
    risks: list[dict[str, Any]] | None = None
    bottomSummary: dict[str, Any] | None = None
    options: list[dict[str, Any]] | None = None
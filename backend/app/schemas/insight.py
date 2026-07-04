from typing import Any

from pydantic import BaseModel


class InsightResponse(BaseModel):
    insights: dict[str, Any]
    summary: list[str]
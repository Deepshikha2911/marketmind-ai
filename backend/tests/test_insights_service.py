from pathlib import Path

import pandas as pd

from backend.app.services.insight_service import InsightService


def test_insight_service_generates_dashboard_payload(tmp_path: Path):
    csv_path = tmp_path / "marketing.csv"
    pd.DataFrame(
        [
            {
                "date": "2024-01-01",
                "campaign_name": "Search",
                "spend": 100,
                "revenue": 250,
                "clicks": 100,
                "impressions": 1000,
                "conversions": 5,
                "daily_budget": 200,
            },
            {
                "date": "2024-01-02",
                "campaign_name": "Search",
                "spend": 120,
                "revenue": 300,
                "clicks": 110,
                "impressions": 1100,
                "conversions": 6,
                "daily_budget": 200,
            },
            {
                "date": "2024-01-03",
                "campaign_name": "Display",
                "spend": 180,
                "revenue": 220,
                "clicks": 80,
                "impressions": 1200,
                "conversions": 3,
                "daily_budget": 200,
            },
        ]
    ).to_csv(csv_path, index=False)

    result = InsightService().generate(str(csv_path))

    assert "trend_analysis" in result
    assert "budget_insights" in result
    assert "at_risk_campaigns" in result
    assert "prediction_metrics" in result
    assert "forecast_summary" in result
    assert "ai_summary" in result
    assert result["trend_analysis"]["series"][0]["label"]

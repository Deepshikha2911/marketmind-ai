from pathlib import Path

import pandas as pd

from backend.app.services.budget_service import BudgetService


def test_budget_service_builds_dashboard_payload(tmp_path: Path):
    csv_path = tmp_path / "marketing.csv"
    pd.DataFrame(
        [
            {
                "date": "2024-01-01",
                "campaign_name": "Search",
                "channel": "Search",
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
                "channel": "Search",
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
                "channel": "Display",
                "spend": 180,
                "revenue": 220,
                "clicks": 80,
                "impressions": 1200,
                "conversions": 3,
                "daily_budget": 200,
            },
        ]
    ).to_csv(csv_path, index=False)

    payload, recommendations = BudgetService().optimize(str(csv_path))

    assert payload["summary"]["recommendedBudget"] >= 0
    assert payload["summary"]["optimizationScore"] >= 0
    assert payload["recommendations"]
    assert payload["recommendations"][0]["title"]
    assert payload["recommendations"][0]["suggestedAction"]
    assert payload["allocation"]
    assert payload["roiComparison"]
    assert payload["campaigns"]
    assert payload["insights"]
    assert payload["bottomSummary"]["confidence"] >= 0
    assert isinstance(recommendations, pd.DataFrame)
    assert len(recommendations) >= 1

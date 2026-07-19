from pathlib import Path

import pandas as pd

from backend.app.services.scenario_service import ScenarioService


def test_scenario_service_builds_dynamic_payload(tmp_path: Path):
    csv_path = tmp_path / "marketing.csv"
    pd.DataFrame(
        [
            {
                "date": "2024-01-01",
                "campaign_name": "Search",
                "channel": "Search",
                "campaign_type": "Brand",
                "spend": 100,
                "revenue": 250,
                "clicks": 100,
                "impressions": 1000,
                "conversions": 5,
            },
            {
                "date": "2024-01-02",
                "campaign_name": "Search",
                "channel": "Search",
                "campaign_type": "Brand",
                "spend": 120,
                "revenue": 300,
                "clicks": 110,
                "impressions": 1100,
                "conversions": 6,
            },
            {
                "date": "2024-01-03",
                "campaign_name": "Display",
                "channel": "Display",
                "campaign_type": "Awareness",
                "spend": 180,
                "revenue": 220,
                "clicks": 80,
                "impressions": 1200,
                "conversions": 3,
            },
        ]
    ).to_csv(csv_path, index=False)

    payload = ScenarioService().simulate(str(csv_path), "increase-budget")

    assert payload["success"] is True
    assert payload["kpis"]["currentRevenue"] >= 0
    assert payload["kpis"]["simulatedRevenue"] >= 0
    assert payload["simulationResults"]
    assert payload["revenueChart"]
    assert payload["channelImpact"]
    assert payload["campaigns"]
    assert payload["insights"]
    assert payload["risks"]
    assert payload["bottomSummary"]["businessRecommendation"]
    assert payload["options"]

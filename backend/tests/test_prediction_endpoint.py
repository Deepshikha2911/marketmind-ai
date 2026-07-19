import pandas as pd
from fastapi.testclient import TestClient

from backend.app.api.endpoints.prediction import _build_prediction_payload
from backend.app.main import app


client = TestClient(app)


def test_predict_returns_empty_state_when_no_dataset_exists(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    response = client.get("/api/v1/predict")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["message"] == "No dataset uploaded"


def test_build_prediction_payload_returns_empty_distribution_for_empty_revenue():
    df = pd.DataFrame({"predicted_revenue": []})

    payload = _build_prediction_payload(df)

    assert payload["charts"]["revenueDistribution"] == []

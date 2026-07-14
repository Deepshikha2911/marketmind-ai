from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_upload_csv_returns_success(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    response = client.post(
        "/api/v1/upload",
        files={"file": ("campaigns.csv", b"campaign,revenue\nA,100\n", "text/csv")},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Upload successful"
    assert data["filename"].endswith(".csv")
    assert Path("uploads", data["filename"]).exists()


def test_upload_rejects_non_csv(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    response = client.post(
        "/api/v1/upload",
        files={"file": ("campaigns.txt", b"not a csv", "text/plain")},
    )

    assert response.status_code == 400

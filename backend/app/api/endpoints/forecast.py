from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.forecast import ForecastResponse
from backend.app.services.forecast_service import ForecastService
from backend.app.services.upload_service import UploadService

router = APIRouter()

service = ForecastService()
upload_service = UploadService()


@router.post(
    "/forecast",
    response_model=ForecastResponse,
)
async def forecast(file: UploadFile | None = File(None)):
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    if file is not None:
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        record = upload_service.save_upload(file)
        file_path = upload_dir / record.storedFilename
    else:
        current = upload_service.get_current()
        if not current:
            raise HTTPException(status_code=404, detail="No dataset has been uploaded yet.")
        file_path = upload_dir / current.storedFilename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Uploaded dataset not found.")

    payload = service.forecast(str(file_path))

    # Ensure bottomSummary present for frontend (derive from executive_summary or metrics)
    executive = payload.get("executive_summary") or {}
    metrics = payload.get("metrics") or payload.get("kpis") or {}
    bottom_summary = payload.get("bottomSummary") or {
        "overallScore": executive.get("forecastScore", 0) if isinstance(executive, dict) else 0,
        "expectedRevenue": executive.get("expectedRevenue", metrics.get("forecastedRevenue", 0.0)) if isinstance(executive, dict) else metrics.get("forecastedRevenue", 0.0),
        "expectedGrowth": executive.get("expectedGrowth", metrics.get("forecastGrowth", 0.0)) if isinstance(executive, dict) else metrics.get("forecastGrowth", 0.0),
        "confidence": executive.get("forecastConfidence", metrics.get("forecastConfidence", 0)) if isinstance(executive, dict) else metrics.get("forecastConfidence", 0),
    }

    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    output_file = output_dir / "revenue_forecast.csv"

    return {
        "success": True,
        "message": "Revenue forecast generated successfully.",
        "rows_processed": len(payload.get("daily_forecast", [])),
        "forecast_rows": len(payload.get("daily_forecast", [])),
        "output_file": str(output_file),
        **payload,
        "bottomSummary": bottom_summary,
    }
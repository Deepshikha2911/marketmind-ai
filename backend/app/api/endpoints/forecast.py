import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.forecast import ForecastResponse
from backend.app.services.forecast_service import ForecastService

router = APIRouter()

service = ForecastService()


@router.post(
    "/forecast",
    response_model=ForecastResponse
)
async def forecast(
    file: UploadFile = File(...)
):

    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    file_path = upload_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    forecast_df = service.forecast(str(file_path))

    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    output_file = output_dir / "revenue_forecast.csv"

    forecast_df.to_csv(
        output_file,
        index=False
    )

    return {
        "success": True,
        "message": "Revenue forecast generated successfully.",
        "rows_processed": len(forecast_df),
        "forecast_rows": len(forecast_df),
        "output_file": str(output_file),
    }
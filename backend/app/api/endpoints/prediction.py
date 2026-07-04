import shutil
from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException

from backend.app.services.prediction_service import PredictionService
from backend.app.schemas.prediction import PredictionResponse

router = APIRouter()

service = PredictionService()


@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict campaign revenue",
    description="Upload a marketing campaign CSV file to generate revenue predictions.",
)
async def predict(
    file: UploadFile = File(...)
):
    
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

    df = service.predict(str(file_path))

    output_path = Path("output")
    output_path.mkdir(exist_ok=True)

    prediction_file = output_path / "predictions.csv"

    df.to_csv(
        prediction_file,
        index=False
    )

    return {
        "success": True,
        "message": "Prediction completed successfully.",
        "rows_processed": len(df),
        "predictions_generated": len(df),
        "output_file": str(prediction_file),
    }
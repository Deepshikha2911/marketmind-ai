import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.insight import DashboardInsightsResponse
from backend.app.services.insight_service import InsightService
from backend.app.services.upload_service import UploadService
from backend.app.services.prediction_service import PredictionService

router = APIRouter()

service = InsightService()
upload_service = UploadService()
prediction_service = PredictionService()


@router.post(
    "/insights",
    response_model=DashboardInsightsResponse,
)
async def generate_insights(file: UploadFile | None = File(None)):
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    if file is not None:
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are supported.")

        file_path = upload_dir / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    else:
        current = upload_service.get_current()
        if not current:
            raise HTTPException(status_code=404, detail="No dataset has been uploaded yet.")
        file_path = upload_dir / current.storedFilename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Uploaded dataset not found.")

    # If predictions were previously generated and saved to output/predictions.csv, prefer that
    # Otherwise attempt to run the prediction pipeline once to attach `predicted_revenue` prior to insights
    try:
        predictions_file = Path("output") / "predictions.csv"
        if predictions_file.exists():
            # Load predictions CSV and dedupe columns before passing to insights generator
            try:
                import pandas as _pd

                _df = _pd.read_csv(predictions_file)
                if _df.columns.duplicated().any():
                    _df = _df.loc[:, ~_df.columns.duplicated()]
                result = service.generate(_df)
            except Exception:
                # fallback to using the CSV path directly
                result = service.generate(str(predictions_file))
        else:
            # Run prediction service to produce predicted_revenue in-memory, then pass df to insights
            try:
                pred_result = prediction_service.predict(str(file_path))
                if isinstance(pred_result, dict) and "df" in pred_result:
                    _df = pred_result["df"]
                    if hasattr(_df, "columns") and _df.columns.duplicated().any():
                        _df = _df.loc[:, ~_df.columns.duplicated()]
                    result = service.generate(_df)
                else:
                    # fallback to generating from original CSV
                    result = service.generate(str(file_path))
            except Exception:
                result = service.generate(str(file_path))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {exc}")

    return DashboardInsightsResponse(**result["insights"])

import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.budget import BudgetResponse
from backend.app.services.budget_service import BudgetService
from backend.app.services.upload_service import UploadService

router = APIRouter()

service = BudgetService()
upload_service = UploadService()


@router.post(
    "/optimize-budget",
    response_model=BudgetResponse,
)
async def optimize_budget(file: UploadFile | None = File(None)):
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

    payload, recommendations = service.optimize(str(file_path))

    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    output_file = output_dir / "budget_recommendations.csv"
    recommendations.to_csv(output_file, index=False)

    return {
        "success": True,
        "message": "Budget optimization completed successfully.",
        "rows_processed": len(recommendations),
        "recommendations_generated": len(recommendations),
        "output_file": str(output_file),
        **payload,
    }
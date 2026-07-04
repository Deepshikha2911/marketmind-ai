import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.budget import BudgetResponse
from backend.app.services.budget_service import BudgetService

router = APIRouter()

service = BudgetService()


@router.post(
    "/optimize-budget",
    response_model=BudgetResponse
)
async def optimize_budget(
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

    recommendations = service.optimize(str(file_path))

    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    output_file = output_dir / "budget_recommendations.csv"

    recommendations.to_csv(
        output_file,
        index=False
    )

    return {
        "success": True,
        "message": "Budget optimization completed successfully.",
        "rows_processed": len(recommendations),
        "recommendations_generated": len(recommendations),
        "output_file": str(output_file),
    }
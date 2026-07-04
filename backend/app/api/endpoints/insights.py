import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.insight import InsightResponse
from backend.app.services.insight_service import InsightService

router = APIRouter()

service = InsightService()


@router.post(
    "/insights",
    response_model=InsightResponse
)
async def generate_insights(
    file: UploadFile = File(...)
):

    # Allow only CSV files
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

    result = service.generate(str(file_path))

    return InsightResponse(
        insights=result["insights"],
        summary=result["summary"]
    )
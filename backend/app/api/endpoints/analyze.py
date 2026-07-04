import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.analyze import AnalyzeResponse
from backend.app.services.analyze_service import AnalyzeService

router = APIRouter()

service = AnalyzeService()


@router.post(
    "/analyze",
    response_model=AnalyzeResponse
)
async def analyze(
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

    result = service.analyze(str(file_path))

    return AnalyzeResponse(**result)
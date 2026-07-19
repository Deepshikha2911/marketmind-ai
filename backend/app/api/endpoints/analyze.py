from pathlib import Path

from fastapi import APIRouter, HTTPException

from backend.app.schemas.analyze import AnalyzeResponse
from backend.app.services.analyze_service import AnalyzeService
from backend.app.services.upload_service import UploadService

router = APIRouter()

service = AnalyzeService()
upload_service = UploadService()


@router.get(
    "/analysis",
    response_model=AnalyzeResponse,
)
def get_analysis():
    current = upload_service.get_current()
    if current is None:
        raise HTTPException(status_code=404, detail="No dataset has been uploaded yet.")

    file_path = Path("uploads") / current.storedFilename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded dataset not found.")

    result = service.analyze(str(file_path))
    return AnalyzeResponse(**result)

from pathlib import Path

from fastapi import APIRouter, File, Path as PathParam, UploadFile

from backend.app.schemas.upload import CurrentUploadResponse, UploadHistoryItem, UploadResponse
from backend.app.services.upload_service import UploadService

router = APIRouter()
service = UploadService()


@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Upload a CSV dataset",
    description="Upload a CSV dataset and persist upload history with inspection metadata.",
)
async def upload_file(file: UploadFile = File(...)):
    upload_record = service.save_upload(file)
    return {
        "success": True,
        "message": "Upload successful",
        "upload": upload_record,
    }


@router.get(
    "/upload/history",
    response_model=list[UploadHistoryItem],
    summary="Get upload history",
)
def get_upload_history():
    return service.get_history()


@router.get(
    "/upload/current",
    response_model=CurrentUploadResponse,
    summary="Get current uploaded dataset",
)
def get_current_upload():
    current = service.get_current()
    return {"success": True, "current": current}


@router.delete(
    "/upload/{filename}",
    summary="Delete a previously uploaded dataset",
)
def delete_upload(filename: str = PathParam(..., description="Stored filename to delete")):
    service.delete_upload(filename)
    return {"success": True, "message": "Upload deleted successfully."}

from pathlib import Path
from fastapi import APIRouter, HTTPException

from backend.app.services.upload_service import UploadService
from backend.app.services.insight_service import InsightService

router = APIRouter()


@router.post("/admin/generate-metadata")
def generate_metadata_for_current():
    upload_service = UploadService()
    insight_service = InsightService()
    current = upload_service.get_current()
    if current is None:
        raise HTTPException(status_code=404, detail="No current upload found")

    stored = current.storedFilename
    uploads_dir = Path("uploads")
    file_path = uploads_dir / stored
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Upload file not found: {file_path}")

    try:
        insights_payload = insight_service.generate(str(file_path))
        insights = insights_payload.get("insights", []) if isinstance(insights_payload, dict) else []
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Insight generation failed: {exc}")

    meta = {"insights": insights}
    meta_file = uploads_dir / f"{stored}.meta.json"
    with meta_file.open("w", encoding="utf-8") as mh:
        import json

        json.dump(meta, mh, indent=2)

    return {"success": True, "metaFile": str(meta_file), "insightsCount": len(insights)}

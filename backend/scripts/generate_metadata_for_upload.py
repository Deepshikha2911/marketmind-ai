from backend.app.services.upload_service import UploadService
from backend.app.services.insight_service import InsightService
from pathlib import Path
import json


def main():
    upload_service = UploadService()
    insight_service = InsightService()
    current = upload_service.get_current()
    if current is None:
        print("No current upload found")
        return

    stored = current.storedFilename
    uploads_dir = Path("uploads")
    file_path = uploads_dir / stored
    if not file_path.exists():
        print("Upload file not found:", file_path)
        return

    print("Generating metadata for:", file_path)
    try:
        insights_payload = insight_service.generate(str(file_path))
        insights = insights_payload.get("insights", []) if isinstance(insights_payload, dict) else []
    except Exception as exc:
        print("Insight generation failed:", exc)
        insights = []

    meta = {"insights": insights}
    meta_file = uploads_dir / f"{stored}.meta.json"
    with meta_file.open("w", encoding="utf-8") as mh:
        json.dump(meta, mh, indent=2)

    print("Wrote metadata to:", meta_file)


if __name__ == "__main__":
    main()

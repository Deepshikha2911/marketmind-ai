import json
import shutil
import uuid
from datetime import datetime
from pathlib import Path

import pandas as pd
from fastapi import HTTPException, UploadFile

from backend.app.schemas.upload import UploadHistoryItem
from backend.app.services.insight_service import InsightService


UPLOAD_DIR = Path("uploads")
HISTORY_FILE = UPLOAD_DIR / "upload_history.json"
MAX_UPLOAD_SIZE = 50 * 1024 * 1024


class UploadService:

    def __init__(self) -> None:
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        if not HISTORY_FILE.exists():
            self._write_history([])

    def _read_history(self) -> list[UploadHistoryItem]:
        try:
            with HISTORY_FILE.open("r", encoding="utf-8") as handle:
                records = json.load(handle)
            return [UploadHistoryItem(**item) for item in records]
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def _write_history(self, records: list[UploadHistoryItem]) -> None:
        with HISTORY_FILE.open("w", encoding="utf-8") as handle:
            json.dump([record.model_dump() for record in records], handle, indent=2)

    def _set_current(self, stored_filename: str) -> None:
        records = self._read_history()
        for record in records:
            record.isCurrent = record.storedFilename == stored_filename
        self._write_history(records)

    def get_history(self) -> list[UploadHistoryItem]:
        return self._read_history()

    def get_current(self) -> UploadHistoryItem | None:
        records = self._read_history()
        return next((record for record in records if record.isCurrent), None)

    def delete_upload(self, stored_filename: str) -> None:
        records = self._read_history()
        record = next((record for record in records if record.storedFilename == stored_filename), None)
        if not record:
            raise HTTPException(status_code=404, detail="Upload not found")

        path = UPLOAD_DIR / stored_filename
        if path.exists():
            path.unlink()

        records = [item for item in records if item.storedFilename != stored_filename]
        if record.isCurrent and records:
            records[0].isCurrent = True

        self._write_history(records)

    def validate_file(self, file: UploadFile) -> None:
        if file.filename is None or not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are supported.")

        content = file.file.read(5)
        file.file.seek(0)
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        if file.size is not None and file.size > MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=400, detail="File size must be 50MB or less.")

    def save_upload(self, file: UploadFile) -> UploadHistoryItem:
        self.validate_file(file)

        stored_filename = f"{uuid.uuid4().hex}{Path(file.filename).suffix.lower()}"
        stored_path = UPLOAD_DIR / stored_filename

        total_size = 0
        with stored_path.open("wb") as buffer:
            while True:
                chunk = file.file.read(65536)
                if not chunk:
                    break
                total_size += len(chunk)
                if total_size > MAX_UPLOAD_SIZE:
                    buffer.close()
                    stored_path.unlink(missing_ok=True)
                    raise HTTPException(status_code=400, detail="File size must be 50MB or less.")
                buffer.write(chunk)

        try:
            df = pd.read_csv(stored_path)
        except Exception as exc:
            stored_path.unlink(missing_ok=True)
            raise HTTPException(status_code=400, detail=f"Unable to parse CSV file: {exc}")

        # Persist a processed copy (pickle) for faster reuse by backend services
        try:
            processed_path = UPLOAD_DIR / f"{stored_filename}.pkl"
            df.to_pickle(processed_path)
        except Exception:
            # non-fatal: continue without processed cache
            processed_path = None

        # Compute simple aggregates and persist metadata for dashboard reuse
        revenue_cols = [c for c in ["conversion_value", "revenue", "revenue_value", "value"] if c in df.columns]
        spend_cols = [c for c in ["cost", "spend", "ad_spend", "amount"] if c in df.columns]
        conv_cols = [c for c in ["conversions", "conversion", "orders"] if c in df.columns]

        total_revenue = float(df[revenue_cols[0]].sum()) if revenue_cols else (float(df[conv_cols[0]].sum()) if conv_cols else 0.0)
        total_spend = float(df[spend_cols[0]].sum()) if spend_cols else 0.0
        total_conversions = int(df[conv_cols[0]].sum()) if conv_cols else 0

        metadata = {
            "summary": {
                "totalRevenue": total_revenue,
                "totalSpend": total_spend,
                "conversions": total_conversions,
            }
        }

        # Generate and persist insights at upload time so Dashboard can reuse them
        try:
            insight_service = InsightService()
            insights_payload = insight_service.generate(str(stored_path))
            metadata["insights"] = insights_payload.get("insights", []) if isinstance(insights_payload, dict) else []
        except Exception:
            metadata["insights"] = []

        try:
            meta_file = UPLOAD_DIR / f"{stored_filename}.meta.json"
            with meta_file.open("w", encoding="utf-8") as mh:
                json.dump(metadata, mh, indent=2)
        except Exception:
            pass

        upload_timestamp = datetime.utcnow().isoformat() + "Z"
        upload_date = datetime.utcnow().strftime("%b %d, %Y")

        record = UploadHistoryItem(
            id=str(uuid.uuid4()),
            originalFilename=file.filename,
            storedFilename=stored_filename,
            uploadTimestamp=upload_timestamp,
            uploadDate=upload_date,
            fileSize=stored_path.stat().st_size,
            rows=int(df.shape[0]),
            columns=int(df.shape[1]),
            columnNames=list(df.columns.astype(str)),
            status="Processed",
            isCurrent=True,
        )

        records = self._read_history()
        for existing in records:
            existing.isCurrent = False
        records.insert(0, record)
        self._write_history(records)

        return record

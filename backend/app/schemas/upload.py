from pydantic import BaseModel


class UploadHistoryItem(BaseModel):
    id: str
    originalFilename: str
    storedFilename: str
    uploadTimestamp: str
    uploadDate: str
    fileSize: int
    rows: int
    columns: int
    columnNames: list[str]
    status: str
    isCurrent: bool = False


class UploadResponse(BaseModel):
    success: bool
    message: str
    upload: UploadHistoryItem


class CurrentUploadResponse(BaseModel):
    success: bool
    current: UploadHistoryItem | None

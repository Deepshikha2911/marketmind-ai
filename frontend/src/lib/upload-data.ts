export type UploadHistoryRecord = {
  id: string;
  originalFilename: string;
  storedFilename: string;
  uploadTimestamp: string;
  uploadDate: string;
  fileSize: number;
  rows: number;
  columns: number;
  columnNames: string[];
  status: "Processed" | "Processing" | "Failed";
  isCurrent: boolean;
};

export const UPLOAD_MAX_BYTES = 50 * 1024 * 1024;

export const UPLOAD_PROGRESS_STEPS = [
  { label: "Uploading...", threshold: 20 },
  { label: "Preparing Dataset...", threshold: 40 },
  { label: "Validating Columns...", threshold: 60 },
  { label: "Generating Features...", threshold: 80 },
  { label: "Ready for Prediction", threshold: 100 },
] as const;

export type UploadHistoryRecord = {
  id: string;
  dataset: string;
  uploadDate: string;
  rows: string;
  status: "Processed" | "Processing" | "Failed";
};

/** Placeholder rows — replaced when backend upload history is connected. */
export const uploadHistory: UploadHistoryRecord[] = [
  {
    id: "1",
    dataset: "google_ads_export.csv",
    uploadDate: "Jun 28, 2026",
    rows: "12,450",
    status: "Processed",
  },
  {
    id: "2",
    dataset: "meta_campaigns_q2.csv",
    uploadDate: "Jun 25, 2026",
    rows: "8,320",
    status: "Processing",
  },
  {
    id: "3",
    dataset: "email_attribution.csv",
    uploadDate: "Jun 22, 2026",
    rows: "5,108",
    status: "Processed",
  },
  {
    id: "4",
    dataset: "legacy_import.csv",
    uploadDate: "Jun 18, 2026",
    rows: "—",
    status: "Failed",
  },
];

export const UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

export const UPLOAD_PROGRESS_STEPS = [
  { label: "Uploading...", threshold: 20 },
  { label: "Preparing Dataset...", threshold: 40 },
  { label: "Validating Columns...", threshold: 60 },
  { label: "Generating Features...", threshold: 80 },
  { label: "Ready for Prediction", threshold: 100 },
] as const;

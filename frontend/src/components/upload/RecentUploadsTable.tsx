import { useState } from "react";
import { CheckCircle2, Clock, Eye, RotateCcw, Trash2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { UploadHistoryRecord } from "@/lib/upload-data";
import { cn } from "@/lib/utils";

type RecentUploadsTableProps = {
  uploads: UploadHistoryRecord[];
  currentUploadId?: string | null;
  isLoading?: boolean;
  onDeleteUpload?: (upload: UploadHistoryRecord) => Promise<void> | void;
};

const statusConfig = {
  Processed: {
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-400",
  },
  Processing: {
    icon: Clock,
    className: "bg-amber-500/15 text-amber-400",
  },
  Failed: {
    icon: XCircle,
    className: "bg-rose-500/15 text-rose-400",
  },
} as const;

export function RecentUploadsTable({ uploads, currentUploadId, isLoading = false, onDeleteUpload }: RecentUploadsTableProps) {
  const [selectedUpload, setSelectedUpload] = useState<UploadHistoryRecord | null>(null);
  const [uploadToDelete, setUploadToDelete] = useState<UploadHistoryRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!uploadToDelete || !onDeleteUpload) return;

    setIsDeleting(true);
    try {
      await onDeleteUpload(uploadToDelete);
      setUploadToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-white">Recent Uploads</h3>
        <p className="mt-1 text-sm text-slate-400">Previously uploaded datasets and their status</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium sm:px-6">Dataset</th>
              <th className="px-5 py-3 font-medium sm:px-6">Upload Date</th>
              <th className="px-5 py-3 font-medium sm:px-6">Rows</th>
              <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              <th className="px-5 py-3 font-medium sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-b border-white/5">
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-5 py-4 sm:px-6">
                        <div className="h-4 animate-pulse rounded-md bg-white/10" />
                      </td>
                    ))}
                  </tr>
                ))
              : uploads.map((upload) => {
                  const config = statusConfig[upload.status];
                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={upload.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4 font-medium text-slate-200 sm:px-6">
                        {upload.originalFilename}
                        {upload.isCurrent || upload.id === currentUploadId ? (
                          <span className="ml-2 rounded-full bg-slate-700/70 px-2 py-1 text-[11px] uppercase tracking-wide text-slate-300">
                            Current
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-slate-400 sm:px-6">{upload.uploadDate}</td>
                      <td className="px-5 py-4 text-slate-400 sm:px-6">{upload.rows}</td>
                      <td className="px-5 py-4 sm:px-6">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            config.className,
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {upload.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-indigo-400"
                            aria-label={`View ${upload.originalFilename}`}
                            onClick={() => setSelectedUpload(upload)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Current ${upload.originalFilename}`}
                            disabled
                            title="Current dataset switching will be implemented later."
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Delete ${upload.originalFilename}`}
                            onClick={() => setUploadToDelete(upload)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {selectedUpload ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                  Dataset details
                </p>
                <h4 className="mt-2 text-lg font-semibold text-white">{selectedUpload.originalFilename}</h4>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close details"
                onClick={() => setSelectedUpload(null)}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Filename</p>
                  <p className="mt-1 text-slate-200">{selectedUpload.originalFilename}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Upload date</p>
                  <p className="mt-1 text-slate-200">{selectedUpload.uploadDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rows</p>
                  <p className="mt-1 text-slate-200">{selectedUpload.rows}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Columns</p>
                  <p className="mt-1 text-slate-200">{selectedUpload.columns}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Column names</p>
                <p className="mt-2 rounded-lg border border-white/10 bg-white/5 p-3 text-slate-200">
                  {selectedUpload.columnNames?.length ? selectedUpload.columnNames.join(", ") : "No column names available"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
                  Status: {selectedUpload.status}
                </span>
                {(selectedUpload.isCurrent || selectedUpload.id === currentUploadId) ? (
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-400">
                    Current dataset
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {uploadToDelete ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">Confirm delete</p>
            <h4 className="mt-2 text-lg font-semibold text-white">Delete this dataset?</h4>
            <p className="mt-2 text-sm text-slate-400">
              This will remove {uploadToDelete.originalFilename} from the upload history and cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                onClick={() => setUploadToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/25"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </GlassCard>
  );
}

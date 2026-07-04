"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { UploadEmptyState } from "@/components/upload/UploadEmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import { UPLOAD_MAX_BYTES } from "@/lib/upload-data";
import { cn, formatFileSize } from "@/lib/utils";

type UploadZoneProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string | null;
};

export function UploadZone({ file, onFileChange, disabled = false, error }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const nextFile = acceptedFiles[0] ?? null;
      onFileChange(nextFile);
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive, open, fileRejections } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    maxSize: UPLOAD_MAX_BYTES,
    disabled,
    noClick: !!file,
    noKeyboard: !!file,
  });

  const rejectionMessage = fileRejections[0]?.errors[0]?.message;
  const displayError = error ?? rejectionMessage;

  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-white">Upload Dataset</h2>
        <p className="mt-1 text-sm text-slate-400">
          Drag and drop your marketing campaign CSV or browse to select a file
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {!file ? (
          <div
            {...getRootProps()}
            className={cn(
              "group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300",
              isDragActive
                ? "scale-[1.01] border-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                : "border-white/10 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/5",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <input {...getInputProps()} />
            {isDragActive && (
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10" />
            )}
            <UploadEmptyState />
            <div className="border-t border-white/5 px-6 pb-8 pt-2">
              <p className="text-center text-sm text-slate-400">
                Drag &amp; Drop your CSV file here
              </p>
              <p className="mt-2 text-center text-xs text-slate-600">or</p>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    open();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
                >
                  <Upload className="h-4 w-4" />
                  Browse Files
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "relative rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 transition-all duration-300",
              "shadow-lg shadow-emerald-500/5",
            )}
          >
            <button
              type="button"
              onClick={() => onFileChange(null)}
              disabled={disabled}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <FileSpreadsheet className="h-7 w-7" />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-5 sm:pr-8">
                <p className="text-sm font-medium text-emerald-300">File selected</p>
                <p className="mt-1 break-all text-base font-semibold text-white">{file.name}</p>
                <p className="mt-1 text-sm text-slate-400">{formatFileSize(file.size)}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={open}
                disabled={disabled}
                className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300 disabled:opacity-50"
              >
                Replace file
              </button>
            </div>
          </div>
        )}

        {displayError && (
          <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {displayError}
          </p>
        )}
      </div>
    </GlassCard>
  );
}

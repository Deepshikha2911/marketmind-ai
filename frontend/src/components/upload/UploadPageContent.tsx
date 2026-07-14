"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RecentUploadsTable } from "@/components/upload/RecentUploadsTable";
import { RequirementsCard } from "@/components/upload/RequirementsCard";
import { TipsCard } from "@/components/upload/TipsCard";
import { UploadActions } from "@/components/upload/UploadActions";
import { UploadPageSkeleton } from "@/components/upload/UploadSkeleton";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { UploadZone } from "@/components/upload/UploadZone";
import type { UploadHistoryRecord } from "@/lib/upload-data";

export function UploadPageContent() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [history, setHistory] = useState<UploadHistoryRecord[]>([]);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const loadUploadHistory = useCallback(async () => {
    setIsTableLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/upload/history");
      const historyData = await response.json();
      setHistory(historyData);
    } catch {
      setHistory([]);
    } finally {
      setIsTableLoading(false);
    }
  }, []);

  const loadCurrentUpload = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/upload/current");
      const data = await response.json();
      setCurrentUploadId(data.current?.id ?? null);
    } catch {
      setCurrentUploadId(null);
    }
  }, []);

  useEffect(() => {
    loadUploadHistory();
    loadCurrentUpload();
  }, [loadUploadHistory, loadCurrentUpload]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFile(null);
    setProgress(0);
    setIsUploading(false);
    setIsTableLoading(false);
    setUploadError(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setIsTableLoading(true);
    setProgress(0);
    setUploadError(null);
    setToastMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      setProgress(100);
      setToastType("success");
      setToastMessage(data.message || "Upload successful");
      await loadUploadHistory();
      await loadCurrentUpload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setUploadError(message);
      setToastType("error");
      setToastMessage(message);
    } finally {
      setIsUploading(false);
      setIsTableLoading(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [file, isUploading, loadUploadHistory, loadCurrentUpload]);

  const handleDeleteUpload = useCallback(async (upload: UploadHistoryRecord) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/upload/${encodeURIComponent(upload.storedFilename)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Delete failed");
      }

      const data = await response.json().catch(() => ({}));
      await loadUploadHistory();
      await loadCurrentUpload();
      setToastType("success");
      setToastMessage(data.message || "Upload deleted successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed";
      setToastType("error");
      setToastMessage(message);
      throw error;
    }
  }, [loadCurrentUpload, loadUploadHistory]);

  if (isPageLoading) {
    return <UploadPageSkeleton />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {toastMessage ? (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toastType === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {toastMessage}
        </div>
      ) : null}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <UploadZone
            file={file}
            onFileChange={setFile}
            disabled={isUploading}
          />

          <UploadProgress progress={progress} isActive={isUploading} />

          {uploadError ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {uploadError}
            </div>
          ) : null}

          <UploadActions
            onUpload={handleUpload}
            onReset={handleReset}
            canUpload={!!file}
            isUploading={isUploading}
          />
        </div>

        <div className="space-y-6">
          <RequirementsCard />
          <TipsCard />
        </div>
      </section>

      <RecentUploadsTable
        uploads={history}
        isLoading={isTableLoading}
        currentUploadId={currentUploadId}
        onDeleteUpload={handleDeleteUpload}
      />
    </div>
  );
}

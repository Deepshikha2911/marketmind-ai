"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RecentUploadsTable } from "@/components/upload/RecentUploadsTable";
import { RequirementsCard } from "@/components/upload/RequirementsCard";
import { TipsCard } from "@/components/upload/TipsCard";
import { UploadActions } from "@/components/upload/UploadActions";
import { UploadPageSkeleton } from "@/components/upload/UploadSkeleton";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { UploadZone } from "@/components/upload/UploadZone";
import { uploadHistory } from "@/lib/upload-data";

export function UploadPageContent() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFile(null);
    setProgress(0);
    setIsUploading(false);
    setIsTableLoading(false);
  }, []);

  const handleUpload = useCallback(() => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setIsTableLoading(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 2, 100);

        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsUploading(false);
          setTimeout(() => setIsTableLoading(false), 400);
        }

        return next;
      });
    }, 80);
  }, [file, isUploading]);

  if (isPageLoading) {
    return <UploadPageSkeleton />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <UploadZone
            file={file}
            onFileChange={setFile}
            disabled={isUploading}
          />

          <UploadProgress progress={progress} isActive={isUploading} />

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

      <RecentUploadsTable uploads={uploadHistory} isLoading={isTableLoading} />
    </div>
  );
}

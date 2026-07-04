import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UploadPageContent } from "@/components/upload/UploadPageContent";

export default function UploadPage() {
  return (
    <DashboardLayout
      title="Upload Dataset"
      subtitle="Upload your marketing campaign dataset to begin AI-powered analysis."
    >
      <UploadPageContent />
    </DashboardLayout>
  );
}

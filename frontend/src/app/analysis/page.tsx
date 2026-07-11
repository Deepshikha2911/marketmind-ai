import { AnalysisPageContent } from "@/components/analysis/AnalysisPageContent";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AnalysisPage() {
  return (
    <DashboardLayout
      title="Complete AI Analysis"
      subtitle="Comprehensive AI-powered marketing performance report generated from your uploaded dataset."
    >
      <AnalysisPageContent />
    </DashboardLayout>
  );
}

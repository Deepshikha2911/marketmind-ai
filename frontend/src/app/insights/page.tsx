import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InsightsPageContent } from "@/components/insights/InsightsPageContent";

export default function InsightsPage() {
  return (
    <DashboardLayout
      title="AI Insights"
      subtitle="AI-powered analysis of your marketing performance with actionable business recommendations."
    >
      <InsightsPageContent />
    </DashboardLayout>
  );
}

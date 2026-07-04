import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PredictionsPageContent } from "@/components/predictions/PredictionsPageContent";

export default function PredictionsPage() {
  return (
    <DashboardLayout
      title="Revenue Prediction"
      subtitle="Generate AI-powered revenue predictions from uploaded marketing datasets."
    >
      <PredictionsPageContent />
    </DashboardLayout>
  );
}

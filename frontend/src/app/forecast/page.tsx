import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ForecastPageContent } from "@/components/forecast/ForecastPageContent";

export default function ForecastPage() {
  return (
    <DashboardLayout
      title="Revenue Forecast"
      subtitle="AI-powered future revenue forecasting using historical campaign performance."
    >
      <ForecastPageContent />
    </DashboardLayout>
  );
}

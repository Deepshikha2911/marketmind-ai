import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ScenarioPageContent } from "@/components/scenario/ScenarioPageContent";

export default function ScenarioPage() {
  return (
    <DashboardLayout
      title="Scenario Simulator"
      subtitle="Simulate different marketing strategies and instantly compare their projected business impact using AI."
    >
      <ScenarioPageContent />
    </DashboardLayout>
  );
}

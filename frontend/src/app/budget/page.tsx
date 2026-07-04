import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BudgetPageContent } from "@/components/budget/BudgetPageContent";

export default function BudgetPage() {
  return (
    <DashboardLayout
      title="Budget Optimizer"
      subtitle="AI-powered budget allocation recommendations to maximize ROI and revenue."
    >
      <BudgetPageContent />
    </DashboardLayout>
  );
}

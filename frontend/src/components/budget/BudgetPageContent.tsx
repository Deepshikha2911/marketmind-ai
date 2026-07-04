"use client";

import { BudgetAllocationChart } from "@/components/budget/BudgetAllocationChart";
import { BudgetBottomSummaryCard } from "@/components/budget/BudgetBottomSummaryCard";
import { BudgetDownloadSection } from "@/components/budget/BudgetDownloadSection";
import { BudgetRecommendations } from "@/components/budget/BudgetRecommendations";
import { BudgetSummaryCards } from "@/components/budget/BudgetSummaryCards";
import { CampaignRecommendationTable } from "@/components/budget/CampaignRecommendationTable";
import { OptimizationInsights } from "@/components/budget/OptimizationInsights";
import { ROIComparisonChart } from "@/components/budget/ROIComparisonChart";
import { mockBudgetResponse } from "@/lib/budget-data";

/**
 * Replace `mockBudgetResponse` with:
 *   const data = await fetch('/api/v1/budget/optimize').then(r => r.json())
 * when connecting to FastAPI.
 */
export function BudgetPageContent() {
  const data = mockBudgetResponse;

  return (
    <div className="space-y-8 lg:space-y-10">
      <BudgetSummaryCards summary={data.summary} />

      <BudgetRecommendations recommendations={data.recommendations} />

      <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2 xl:gap-8">
        <BudgetAllocationChart data={data.allocation} />
        <ROIComparisonChart data={data.roiComparison} />
      </section>

      <CampaignRecommendationTable campaigns={data.campaigns} />

      <OptimizationInsights insights={data.insights} />

      <BudgetDownloadSection data={data} />

      <BudgetBottomSummaryCard summary={data.bottomSummary} />
    </div>
  );
}

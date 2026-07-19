"use client";

import { useEffect, useState } from "react";
import { BudgetAllocationChart } from "@/components/budget/BudgetAllocationChart";
import { BudgetBottomSummaryCard } from "@/components/budget/BudgetBottomSummaryCard";
import { BudgetDownloadSection } from "@/components/budget/BudgetDownloadSection";
import { BudgetRecommendations } from "@/components/budget/BudgetRecommendations";
import { BudgetSummaryCards } from "@/components/budget/BudgetSummaryCards";
import { CampaignRecommendationTable } from "@/components/budget/CampaignRecommendationTable";
import { OptimizationInsights } from "@/components/budget/OptimizationInsights";
import { ROIComparisonChart } from "@/components/budget/ROIComparisonChart";
import { EMPTY_BUDGET_RESPONSE, type BudgetApiResponse } from "@/lib/budget-data";

export function BudgetPageContent() {
  const [data, setData] = useState<BudgetApiResponse>(EMPTY_BUDGET_RESPONSE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadBudgetData() {
      try {
        const response = await fetch("http://localhost:8000/api/v1/optimize-budget", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Unable to load budget analysis");
        }

        const payload = await response.json();
        if (!ignore) {
          setData(payload);
        }
      } catch (error) {
        if (!ignore) {
          setData(EMPTY_BUDGET_RESPONSE);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadBudgetData();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-slate-400">Loading budget recommendations…</div>;
  }

  if (!data.recommendations.length && !data.campaigns.length) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-slate-400">Upload a CSV dataset to generate fresh budget recommendations.</div>;
  }

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

"use client";

import { AIRecommendations } from "@/components/insights/AIRecommendations";
import { AISummaryCard } from "@/components/insights/AISummaryCard";
import { BudgetInsightsCards } from "@/components/insights/BudgetInsightsCards";
import { CampaignPerformanceTable } from "@/components/insights/CampaignPerformanceTable";
import { ExecutiveSummaryCard } from "@/components/insights/ExecutiveSummaryCard";
import { InsightsEmptyState } from "@/components/insights/InsightsEmptyState";
import { InsightsKpiCards } from "@/components/insights/InsightsKpiCards";
import { PredictionInsightsCards } from "@/components/insights/PredictionInsightsCards";
import { TrendAnalysisCharts } from "@/components/insights/TrendAnalysisCharts";
import { mockInsightsResponse } from "@/lib/insights-data";

/**
 * Replace `mockInsightsResponse` with:
 *   const data = await fetch('/api/v1/insights').then(r => r.json())
 * when connecting to FastAPI.
 */
export function InsightsPageContent() {
  const data = mockInsightsResponse;

  if (!data.hasInsights) {
    return <InsightsEmptyState />;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <ExecutiveSummaryCard summary={data.executiveSummary} />

      <InsightsKpiCards kpis={data.kpis} />

      <AIRecommendations recommendations={data.recommendations} />

      <CampaignPerformanceTable campaigns={data.campaigns} />

      <TrendAnalysisCharts trends={data.trends} />

      <BudgetInsightsCards budget={data.budget} />

      <PredictionInsightsCards prediction={data.prediction} />

      <AISummaryCard summary={data.aiSummary} />
    </div>
  );
}

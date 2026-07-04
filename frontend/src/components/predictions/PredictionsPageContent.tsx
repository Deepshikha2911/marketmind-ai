"use client";

import {
  ActualVsPredictedChart,
  RevenueDistributionChart,
  TopPredictedCampaignsChart,
} from "@/components/predictions/PredictionCharts";
import { DatasetInfoCard } from "@/components/predictions/DatasetInfoCard";
import { ExportActions } from "@/components/predictions/ExportActions";
import { PredictionKpiCards } from "@/components/predictions/PredictionKpiCards";
import { PredictionSummaryCard } from "@/components/predictions/PredictionSummaryCard";
import { PredictionsTable } from "@/components/predictions/PredictionsTable";
import { mockPredictResponse } from "@/lib/predictions-data";

/**
 * Replace `mockPredictResponse` with:
 *   const data = await fetch('/api/v1/predict').then(r => r.json())
 * when connecting to FastAPI.
 */
export function PredictionsPageContent() {
  const data = mockPredictResponse;

  return (
    <div className="space-y-6 lg:space-y-8">
      <DatasetInfoCard dataset={data.dataset} />

      <PredictionKpiCards kpis={data.kpis} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Campaign Predictions</h2>
          <p className="mt-1 text-sm text-slate-400">
            Review, filter, and export AI-generated revenue forecasts
          </p>
        </div>
        <ExportActions rows={data.predictions} />
      </div>

      <PredictionsTable rows={data.predictions} />

      <section className="grid grid-cols-1 items-stretch gap-8 xl:grid-cols-3">
        <div className="flex flex-col gap-8 xl:col-span-2">
          <ActualVsPredictedChart data={data.charts.actualVsPredicted} />
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
            <RevenueDistributionChart data={data.charts.revenueDistribution} />
            <TopPredictedCampaignsChart data={data.charts.topCampaigns} />
          </div>
        </div>
        <PredictionSummaryCard summary={data.summary} className="xl:min-h-full" />
      </section>
    </div>
  );
}

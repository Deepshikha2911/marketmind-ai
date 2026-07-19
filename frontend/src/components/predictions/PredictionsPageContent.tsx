"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { PredictApiResponse, PredictionDatasetInfo, PredictionKpis, PredictionRow, PredictionSummary, PredictionCharts } from "@/lib/predictions-data";

function mapPayload(payload: any): PredictApiResponse {
  const data = payload?.data ?? payload;
  return {
    dataset: {
      selectedDataset: data?.dataset?.selectedDataset ?? "",
      uploadTime: data?.dataset?.uploadTime ?? "",
      rowsProcessed: Number(data?.dataset?.rowsProcessed ?? 0),
      predictionStatus: (data?.dataset?.predictionStatus ?? "Pending") as PredictionDatasetInfo["predictionStatus"],
    },
    kpis: {
      rowsProcessed: Number(data?.kpis?.rowsProcessed ?? 0),
      predictionsGenerated: Number(data?.kpis?.predictionsGenerated ?? 0),
      averagePredictedRevenue: Number(data?.kpis?.averagePredictedRevenue ?? 0),
      highestPredictedRevenue: Number(data?.kpis?.highestPredictedRevenue ?? 0),
    },
    predictions: Array.isArray(data?.predictions)
      ? data.predictions.map((row: any, index: number) => ({
          id: row?.id ?? `${index + 1}`,
          campaignName: row?.campaignName ?? "",
          date: row?.date ?? "",
          spend: Number(row?.spend ?? 0),
          clicks: Number(row?.clicks ?? 0),
          conversions: Number(row?.conversions ?? 0),
          actualRevenue: Number(row?.actualRevenue ?? 0),
          predictedRevenue: Number(row?.predictedRevenue ?? 0),
          difference: Number(row?.difference ?? 0),
        }))
      : [],
    summary: {
      totalPredictions: Number(data?.summary?.totalPredictions ?? 0),
      averagePrediction: Number(data?.summary?.averagePrediction ?? 0),
      highestPrediction: Number(data?.summary?.highestPrediction ?? 0),
      lowestPrediction: Number(data?.summary?.lowestPrediction ?? 0),
      confidenceScore: Number(data?.summary?.confidenceScore ?? 0),
    },
    charts: {
      actualVsPredicted: Array.isArray(data?.charts?.actualVsPredicted)
        ? data.charts.actualVsPredicted.map((item: any) => ({
            label: item?.label ?? "",
            actual: Number(item?.actual ?? 0),
            predicted: Number(item?.predicted ?? 0),
          }))
        : [],
      revenueDistribution: Array.isArray(data?.charts?.revenueDistribution)
        ? data.charts.revenueDistribution.map((item: any) => ({
            range: item?.range ?? "",
            count: Number(item?.count ?? 0),
          }))
        : [],
      topCampaigns: Array.isArray(data?.charts?.topCampaigns)
        ? data.charts.topCampaigns.map((item: any) => ({
            campaign: item?.campaign ?? "",
            predictedRevenue: Number(item?.predictedRevenue ?? 0),
          }))
        : [],
    },
  };
}

export function PredictionsPageContent() {
  const [data, setData] = useState<PredictApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPredictionData() {
      try {
        const response = await fetch("http://localhost:8000/api/v1/predict");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (!isMounted) return;

        if (!payload?.success) {
          setData(null);
          setError(payload?.message ?? "No dataset uploaded");
        } else {
          setData(mapPayload(payload));
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setData(null);
        setError(err instanceof Error ? err.message : "Unable to load predictions.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPredictionData();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasData = Boolean(data && data.predictions.length > 0);

  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
      </div>
    );
  }

  if (error || !hasData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-300">
        <h3 className="text-lg font-semibold text-white">No dataset uploaded</h3>
        <p className="mt-2 text-sm text-slate-400">
          {error ?? "No dataset uploaded. Please upload a CSV first."}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

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

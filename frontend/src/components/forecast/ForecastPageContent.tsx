"use client";

import { useEffect, useState } from "react";
import { ChannelForecastChart } from "@/components/forecast/ChannelForecastChart";
import { DailyForecastTable } from "@/components/forecast/DailyForecastTable";
import { ForecastBottomSummaryCard } from "@/components/forecast/ForecastBottomSummaryCard";
import { ForecastDownloadSection } from "@/components/forecast/ForecastDownloadSection";
import { ForecastInsights } from "@/components/forecast/ForecastInsights";
import { ForecastKpiCards } from "@/components/forecast/ForecastKpiCards";
import { ForecastSummaryCard } from "@/components/forecast/ForecastSummaryCard";
import { GrowthProjectionChart } from "@/components/forecast/GrowthProjectionChart";
import { RevenueForecastChart } from "@/components/forecast/RevenueForecastChart";
import { RiskAnalysis } from "@/components/forecast/RiskAnalysis";
import { EMPTY_FORECAST_RESPONSE, type ForecastApiResponse } from "@/lib/forecast-data";

function normalizeForecastPayload(payload: Partial<ForecastApiResponse> | Record<string, unknown> | null | undefined): ForecastApiResponse {
  const source = (payload ?? {}) as Record<string, unknown>;

  const kpis = (source.kpis as ForecastApiResponse["kpis"] | undefined) ?? (source.metrics as ForecastApiResponse["kpis"] | undefined) ?? EMPTY_FORECAST_RESPONSE.kpis;
  const summary = (source.summary as ForecastApiResponse["summary"] | undefined) ?? EMPTY_FORECAST_RESPONSE.summary;
  const revenueChart = Array.isArray(source.revenueChart) ? (source.revenueChart as ForecastApiResponse["revenueChart"]) : Array.isArray(source.forecast_chart) ? (source.forecast_chart as ForecastApiResponse["revenueChart"]) : EMPTY_FORECAST_RESPONSE.revenueChart;
  const dailyForecast = Array.isArray(source.dailyForecast) ? (source.dailyForecast as ForecastApiResponse["dailyForecast"]) : Array.isArray(source.daily_forecast) ? (source.daily_forecast as ForecastApiResponse["dailyForecast"]) : EMPTY_FORECAST_RESPONSE.dailyForecast;
  const growthProjection = Array.isArray(source.growthProjection) ? (source.growthProjection as ForecastApiResponse["growthProjection"]) : Array.isArray(source.growth_projection) ? (source.growth_projection as ForecastApiResponse["growthProjection"]) : EMPTY_FORECAST_RESPONSE.growthProjection;
  const channelForecast = Array.isArray(source.channelForecast) ? (source.channelForecast as ForecastApiResponse["channelForecast"]) : Array.isArray(source.channel_forecast) ? (source.channel_forecast as ForecastApiResponse["channelForecast"]) : EMPTY_FORECAST_RESPONSE.channelForecast;
  const insights = Array.isArray(source.insights) ? (source.insights as ForecastApiResponse["insights"]) : EMPTY_FORECAST_RESPONSE.insights;
  const risks = Array.isArray(source.risks) ? (source.risks as ForecastApiResponse["risks"]) : EMPTY_FORECAST_RESPONSE.risks;
  const bottomSummary = (source.bottomSummary as ForecastApiResponse["bottomSummary"] | undefined) ?? EMPTY_FORECAST_RESPONSE.bottomSummary;

  return {
    kpis,
    summary,
    revenueChart,
    dailyForecast,
    growthProjection,
    channelForecast,
    insights,
    risks,
    bottomSummary,
  };
}

export function ForecastPageContent() {
  const [data, setData] = useState<ForecastApiResponse>(EMPTY_FORECAST_RESPONSE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadForecastData() {
      try {
        const response = await fetch("http://localhost:8000/api/v1/forecast", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Unable to load forecast analysis");
        }

        const payload = await response.json();
        if (!ignore) {
          setData(normalizeForecastPayload(payload));
        }
      } catch (error) {
        if (!ignore) {
          setData(EMPTY_FORECAST_RESPONSE);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadForecastData();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-slate-400">Loading revenue forecast…</div>;
  }

  if (!data.dailyForecast.length) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-slate-400">Upload a CSV dataset to generate a revenue forecast.</div>;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <ForecastKpiCards kpis={data.kpis} />

      <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="xl:col-span-2">
          <RevenueForecastChart data={data.revenueChart} />
        </div>
        <ForecastSummaryCard summary={data.summary} className="xl:min-h-full" />
      </section>

      <DailyForecastTable rows={data.dailyForecast} />

      <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2 xl:gap-8">
        <GrowthProjectionChart data={data.growthProjection} />
        <ChannelForecastChart data={data.channelForecast} />
      </section>

      <ForecastInsights insights={data.insights} />

      <RiskAnalysis risks={data.risks} />

      <ForecastDownloadSection data={data} />

      <ForecastBottomSummaryCard summary={data.bottomSummary} />
    </div>
  );
}

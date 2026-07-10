"use client";

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
import { mockForecastResponse } from "@/lib/forecast-data";

/**
 * Replace `mockForecastResponse` with:
 *   const data = await fetch('/api/v1/forecast').then(r => r.json())
 * when connecting to FastAPI.
 */
export function ForecastPageContent() {
  const data = mockForecastResponse;

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

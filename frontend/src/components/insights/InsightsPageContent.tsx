"use client";

import { useEffect, useState } from "react";
import { AIRecommendations } from "@/components/insights/AIRecommendations";
import { AISummaryCard } from "@/components/insights/AISummaryCard";
import { BudgetInsightsCards } from "@/components/insights/BudgetInsightsCards";
import { CampaignPerformanceTable } from "@/components/insights/CampaignPerformanceTable";
import { ExecutiveSummaryCard } from "@/components/insights/ExecutiveSummaryCard";
import { InsightsEmptyState } from "@/components/insights/InsightsEmptyState";
import { InsightsKpiCards } from "@/components/insights/InsightsKpiCards";
import { PredictionInsightsCards } from "@/components/insights/PredictionInsightsCards";
import { TrendAnalysisCharts } from "@/components/insights/TrendAnalysisCharts";
import type { InsightsApiResponse } from "@/lib/insights-data";

const EMPTY_RESPONSE: InsightsApiResponse = {
  hasInsights: false,
  executiveSummary: {
    overallCampaignHealth: "Moderate",
    overallScore: 0,
    revenueTrend: "0%",
    revenueTrendDirection: "stable",
    profitTrend: "0%",
    profitTrendDirection: "stable",
    bestPerformingChannel: "N/A",
    worstPerformingChannel: "N/A",
  },
  kpis: {
    totalRevenue: 0,
    totalSpend: 0,
    averageRoi: 0,
    averageRoas: 0,
    ctr: 0,
    conversionRate: 0,
  },
  recommendations: [],
  campaigns: [],
  trends: { revenue: [], roi: [], ctr: [], conversion: [] },
  budget: {
    overspendingCampaigns: [],
    underutilizedBudget: "",
    budgetEfficiencyScore: 0,
  },
  prediction: {
    averagePredictedRevenue: 0,
    predictionAccuracy: 0,
    confidence: 0,
    forecastSummary: "",
  },
  aiSummary: "",
};

export function InsightsPageContent() {
  const [data, setData] = useState<InsightsApiResponse>(EMPTY_RESPONSE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadInsights() {
      try {
        const response = await fetch("http://localhost:8000/api/v1/insights", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Unable to load insights");
        }

        const payload = await response.json();
        if (!ignore) {
          setData({
            hasInsights: true,
            executiveSummary: (() => {
              const series = payload.trend_analysis?.series ?? [];
              let revenueTrend = "0%";
              let revenueTrendDirection: "up" | "down" | "stable" = "stable";
              if (series && series.length >= 2) {
                const first = Number(series[0].actual_revenue ?? 0);
                const last = Number(series[series.length - 1].actual_revenue ?? 0);
                if (first > 0) {
                  const pct = ((last - first) / first) * 100;
                  const sign = pct > 0 ? "+" : pct < 0 ? "" : "";
                  revenueTrend = `${sign}${pct.toFixed(1)}%`;
                  revenueTrendDirection = pct > 0 ? "up" : pct < 0 ? "down" : "stable";
                }
              }

              const avgRoi = payload.budget_insights?.average_roi ?? 0;
              const profitTrend = `${avgRoi >= 0 ? "+" : ""}${Number(avgRoi).toFixed(1)}%`;

              const bestFromBudget = payload.budget_insights?.overspending_campaigns?.[0]?.campaign;
              const worstFromBudget = payload.budget_insights?.overspending_campaigns?.slice(-1)[0]?.campaign;

              return {
                overallCampaignHealth: series.length ? "Strong" : "Moderate",
                overallScore: Math.max(0, Math.min(100, payload.budget_insights?.budget_efficiency_score ?? 0)),
                revenueTrend,
                revenueTrendDirection,
                profitTrend,
                profitTrendDirection: avgRoi > 0 ? "up" : avgRoi < 0 ? "down" : "stable",
                bestPerformingChannel: bestFromBudget ?? payload.at_risk_campaigns?.[0]?.campaign ?? "N/A",
                worstPerformingChannel: worstFromBudget ?? payload.at_risk_campaigns?.slice(-1)?.[0]?.campaign ?? "N/A",
              };
            })(),
            kpis: {
              totalRevenue: payload.budget_insights?.total_revenue ?? 0,
              totalSpend: payload.budget_insights?.total_spend ?? 0,
              averageRoi: payload.budget_insights?.average_roi ?? 0,
              averageRoas: payload.budget_insights?.average_roas ?? 0,
              ctr: payload.budget_insights?.average_ctr ?? 0,
              conversionRate: payload.budget_insights?.average_conversion_rate ?? 0,
            },
            recommendations: payload.ai_summary?.recommendations?.map((item: string, index: number) => ({
              id: String(index + 1),
              priority: index === 0 ? "High" : "Medium",
              title: item,
              explanation: item,
              businessImpact: item,
              recommendedAction: item,
              estimatedRevenueGain: payload.budget_insights?.total_revenue ? payload.budget_insights.total_revenue * 0.05 : 0,
            })) ?? [],
            campaigns: payload.at_risk_campaigns?.map((item: any, index: number) => ({
              id: String(index + 1),
              campaign: item.campaign,
              revenue: item.revenue,
              spend: item.spend,
              roi: item.roi,
              roas: item.roi + 1,
              status: item.status === "At Risk" ? "At Risk" : "Stable",
            })) ?? [],
            trends: {
              revenue: payload.trend_analysis?.series?.map((item: any) => ({ label: item.label, value: item.actual_revenue })) ?? [],
              roi: payload.trend_analysis?.roi_series?.map((item: any) => ({ label: item.label, value: item.value })) ?? [],
              ctr: payload.trend_analysis?.ctr_series?.map((item: any) => ({ label: item.label, value: item.value })) ?? [],
              conversion: payload.trend_analysis?.conversion_series?.map((item: any) => ({ label: item.label, value: item.value })) ?? [],
            },
            budget: {
              overspendingCampaigns: payload.budget_insights?.overspending_campaigns?.map((item: any) => item.campaign) ?? [],
              underutilizedBudget: `${payload.budget_insights?.underutilized_budget?.campaign ?? "N/A"} • recommended increase ${payload.budget_insights?.underutilized_budget?.recommended_budget_increase ?? 0}`,
              budgetEfficiencyScore: payload.budget_insights?.budget_efficiency_score ?? 0,
            },
            prediction: (() => {
              const avg = payload.prediction_metrics?.average_predicted_revenue ?? 0;
              const accuracy = payload.prediction_metrics?.prediction_accuracy ?? 0;
              let conf = payload.prediction_metrics?.confidence_score ?? 0;
              // Some backends return confidence as fraction (0-1); scale to percentage when appropriate
              if (conf > 0 && conf <= 1) conf = conf * 100;
              return {
                averagePredictedRevenue: avg,
                predictionAccuracy: accuracy,
                confidence: conf,
                forecastSummary: payload.forecast_summary?.headline ?? "",
              };
            })(),
            aiSummary: payload.ai_summary?.summary ?? "",
          });
        }
      } catch (error) {
        if (!ignore) {
          setData(EMPTY_RESPONSE);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInsights();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <InsightsEmptyState />;
  }

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

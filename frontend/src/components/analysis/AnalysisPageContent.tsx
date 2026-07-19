"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnalysisBottomSummaryCard } from "@/components/analysis/AnalysisBottomSummaryCard";
import { AnalysisBudgetSection } from "@/components/analysis/AnalysisBudgetSection";
import { AnalysisDownloadSection } from "@/components/analysis/AnalysisDownloadSection";
import { AnalysisExecutiveSummary } from "@/components/analysis/AnalysisExecutiveSummary";
import { AnalysisForecastSection } from "@/components/analysis/AnalysisForecastSection";
import { AnalysisInsightsSection } from "@/components/analysis/AnalysisInsightsSection";
import { AnalysisKpiCards } from "@/components/analysis/AnalysisKpiCards";
import { AnalysisPredictionSummary } from "@/components/analysis/AnalysisPredictionSummary";
import { BusinessHealthCard } from "@/components/analysis/BusinessHealthCard";
import { CampaignLeaderboardTable } from "@/components/analysis/CampaignLeaderboardTable";
import { FinalRecommendationsSection } from "@/components/analysis/FinalRecommendationsSection";
import { MarketingFunnel } from "@/components/analysis/MarketingFunnel";
import { OverallScoreCard } from "@/components/analysis/OverallScoreCard";
import { RevenueOverviewChart } from "@/components/analysis/RevenueOverviewChart";
import { ScenarioComparisonCards } from "@/components/analysis/ScenarioComparisonCards";
import type { AnalysisApiResponse } from "@/lib/analysis-data";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

export function AnalysisPageContent() {
  const [data, setData] = useState<AnalysisApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalysis() {
      try {
        const response = await fetch(`${backendUrl}/api/v1/analysis`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.detail || payload.message || "Unable to load analysis data.");
        }

        if (isMounted) {
          setData(payload.data ?? payload);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load analysis data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 lg:space-y-10">
        <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-white/[0.04]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 text-white">
        <h2 className="text-xl font-semibold">Analysis unavailable</h2>
        <p className="mt-3 text-sm text-rose-100">{error ?? "No analysis data returned from the backend."}</p>
      </div>
    );
  }

  const sectionMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: "easeOut" as const },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 lg:space-y-10"
    >
      <motion.div {...sectionMotion}>
        <OverallScoreCard score={data.overallScore} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.05 }}>
        <AnalysisExecutiveSummary summary={data.executiveSummary} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.08 }}>
        <AnalysisKpiCards kpis={data.kpis} />
      </motion.div>

      <motion.section
        {...sectionMotion}
        transition={{ ...sectionMotion.transition, delay: 0.1 }}
        className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[1.5fr_1fr] xl:gap-8"
      >
        <div className="min-w-0">
          <RevenueOverviewChart data={data.revenueOverview} />
        </div>
        <MarketingFunnel stages={data.funnel} />
      </motion.section>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.12 }}>
        <AnalysisPredictionSummary summary={data.predictionSummary} data={data} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.14 }}>
        <AnalysisInsightsSection insights={data.insights} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.16 }}>
        <AnalysisBudgetSection budget={data.budget} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.18 }}>
        <AnalysisForecastSection forecast={data.forecast} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.2 }}>
        <ScenarioComparisonCards scenarios={data.scenarios} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.22 }}>
        <CampaignLeaderboardTable campaigns={data.campaigns} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.24 }}>
        <BusinessHealthCard health={data.businessHealth} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.26 }}>
        <FinalRecommendationsSection recommendations={data.finalRecommendations} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.28 }}>
        <AnalysisDownloadSection data={data} />
      </motion.div>

      <motion.div {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.3 }}>
        <AnalysisBottomSummaryCard summary={data.bottomSummary} />
      </motion.div>
    </motion.div>
  );
}

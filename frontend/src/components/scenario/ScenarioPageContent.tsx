"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CampaignImpactTable } from "@/components/scenario/CampaignImpactTable";
import { ChannelImpactChart } from "@/components/scenario/ChannelImpactChart";
import { RevenueComparisonChart } from "@/components/scenario/RevenueComparisonChart";
import { RiskAssessment } from "@/components/scenario/RiskAssessment";
import { ScenarioBottomSummaryCard } from "@/components/scenario/ScenarioBottomSummaryCard";
import { ScenarioDownloadSection } from "@/components/scenario/ScenarioDownloadSection";
import { ScenarioInsights } from "@/components/scenario/ScenarioInsights";
import { ScenarioKpiCards } from "@/components/scenario/ScenarioKpiCards";
import { ScenarioPageSkeleton, ScenarioResultsSkeleton } from "@/components/scenario/ScenarioSkeleton";
import { ScenarioSelectionPanel } from "@/components/scenario/ScenarioSelectionPanel";
import { SimulationResults } from "@/components/scenario/SimulationResults";
import { SimulationTimeline } from "@/components/scenario/SimulationTimeline";
import { defaultScenarioId, type ScenarioApiResponse, type ScenarioId, type ScenarioOption } from "@/lib/scenario-data";

const fallbackOptions: ScenarioOption[] = [
  { id: "increase-budget", name: "Increase Budget", explanation: "Increase investment in the strongest performing channels.", expectedRevenueImpact: 0, estimatedRoi: 0 },
  { id: "reduce-budget", name: "Reduce Budget", explanation: "Trim spend in lower-efficiency areas while protecting core demand.", expectedRevenueImpact: 0, estimatedRoi: 0 },
  { id: "pause-campaigns", name: "Pause Campaigns", explanation: "Pause underperforming campaigns and preserve budget for better opportunities.", expectedRevenueImpact: 0, estimatedRoi: 0 },
  { id: "increase-ctr", name: "Increase CTR", explanation: "Improve click-through performance through better targeting and creative.", expectedRevenueImpact: 0, estimatedRoi: 0 },
  { id: "improve-conversion", name: "Improve Conversion", explanation: "Lift conversion quality with stronger landing pages and offers.", expectedRevenueImpact: 0, estimatedRoi: 0 },
  { id: "boost-revenue", name: "Boost Revenue", explanation: "Scale the portfolio to drive more revenue from the current demand mix.", expectedRevenueImpact: 0, estimatedRoi: 0 },
];

function createEmptyScenarioResponse(id: ScenarioId): ScenarioApiResponse {
  return {
    id,
    kpis: {
      currentRevenue: 0,
      simulatedRevenue: 0,
      revenueIncrease: 0,
      expectedRoi: 0,
      winningScenario: "Waiting for data",
      confidence: 0,
    },
    simulationResults: [],
    revenueChart: [],
    channelImpact: [],
    campaigns: [],
    insights: [],
    risks: [],
    bottomSummary: {
      scenarioSelected: "Waiting for data",
      expectedRevenue: 0,
      revenueIncrease: 0,
      expectedRoi: 0,
      confidenceScore: 0,
      businessRecommendation: "Upload a CSV to generate a live simulation payload.",
    },
    options: fallbackOptions,
  };
}

export function ScenarioPageContent() {
  const [selectedId, setSelectedId] = useState<ScenarioId>(defaultScenarioId);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScenarioApiResponse | null>(null);

  const loadScenario = useCallback(async (id: ScenarioId) => {
    setIsProcessing(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";
      const response = await fetch(
        `${backendUrl}/api/v1/scenario/simulate?scenario_id=${encodeURIComponent(id)}`,
        { method: "POST" },
      );

      if (!response.ok) {
        throw new Error(`Scenario request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as Partial<ScenarioApiResponse> & { scenarioId?: string };
      const normalizedData: ScenarioApiResponse = {
        ...(createEmptyScenarioResponse(id)),
        ...payload,
        id: (payload.scenarioId as ScenarioId | undefined) ?? id,
        options: payload.options ?? fallbackOptions,
        kpis: payload.kpis ?? createEmptyScenarioResponse(id).kpis,
        simulationResults: payload.simulationResults ?? [],
        revenueChart: payload.revenueChart ?? [],
        channelImpact: payload.channelImpact ?? [],
        campaigns: payload.campaigns ?? [],
        insights: payload.insights ?? [],
        risks: payload.risks ?? [],
        bottomSummary: payload.bottomSummary ?? createEmptyScenarioResponse(id).bottomSummary,
      };

      setData(normalizedData);
    } catch (err) {
      setData(createEmptyScenarioResponse(id));
      setError(err instanceof Error ? err.message : "Could not load scenario data.");
    } finally {
      setIsProcessing(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    void loadScenario(selectedId);
  }, [loadScenario, selectedId]);

  const handleSelectScenario = useCallback((id: ScenarioId) => {
    if (id === selectedId) return;
    setSelectedId(id);
  }, [selectedId]);

  if (isInitialLoad || !data) {
    return <ScenarioPageSkeleton />;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ScenarioKpiCards kpis={data.kpis} />
        </motion.div>
      </AnimatePresence>

      <ScenarioSelectionPanel
        options={data.options}
        selectedId={selectedId}
        onSelect={handleSelectScenario}
      />

      {isProcessing ? (
        <>
          <SimulationTimeline isProcessing />
          <ScenarioResultsSkeleton />
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8 lg:space-y-10"
          >
            <SimulationResults metrics={data.simulationResults} />

            <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2 xl:gap-8">
              <RevenueComparisonChart data={data.revenueChart} />
              <ChannelImpactChart data={data.channelImpact} />
            </section>

            <CampaignImpactTable campaigns={data.campaigns} />

            <ScenarioInsights insights={data.insights} />

            <RiskAssessment risks={data.risks} />

            <SimulationTimeline isProcessing={false} />

            <ScenarioDownloadSection data={data} />

            <ScenarioBottomSummaryCard summary={data.bottomSummary} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

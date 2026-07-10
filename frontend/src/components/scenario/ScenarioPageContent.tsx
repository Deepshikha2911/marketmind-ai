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
import {
  defaultScenarioId,
  getScenarioApiResponse,
  scenarioOptions,
  type ScenarioId,
} from "@/lib/scenario-data";

/**
 * Replace mock data with:
 *   const data = await fetch('/api/v1/scenario/simulate').then(r => r.json())
 * when connecting to FastAPI.
 */
export function ScenarioPageContent() {
  const [selectedId, setSelectedId] = useState<ScenarioId>(defaultScenarioId);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const data = getScenarioApiResponse(selectedId);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectScenario = useCallback((id: ScenarioId) => {
    if (id === selectedId) return;
    setIsProcessing(true);
    setSelectedId(id);

    setTimeout(() => {
      setIsProcessing(false);
    }, 800);
  }, [selectedId]);

  if (isInitialLoad) {
    return <ScenarioPageSkeleton />;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
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
        options={scenarioOptions}
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

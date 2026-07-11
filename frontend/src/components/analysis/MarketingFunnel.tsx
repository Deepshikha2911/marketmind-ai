"use client";

import type { FunnelStage } from "@/lib/analysis-data";
import { MarketingFunnel as SharedMarketingFunnel } from "@/components/charts/MarketingFunnel";

type MarketingFunnelProps = {
  stages: FunnelStage[];
};

export function MarketingFunnel({ stages }: MarketingFunnelProps) {
  return <SharedMarketingFunnel stages={stages} />;
}

"use client";

import type { RevenueOverviewPoint } from "@/lib/analysis-data";
import { RevenueOverviewChart as SharedRevenueOverviewChart } from "@/components/charts/RevenueOverviewChart";

type RevenueOverviewChartProps = {
  data: RevenueOverviewPoint[];
};

export function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  return <SharedRevenueOverviewChart data={data} />;
}

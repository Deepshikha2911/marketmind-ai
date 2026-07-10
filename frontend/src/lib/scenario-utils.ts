import type { CampaignImpactRow, ScenarioApiResponse } from "@/lib/scenario-data";

export function exportScenarioCsv(data: ScenarioApiResponse) {
  const headers = [
    "Campaign",
    "Current Revenue",
    "Simulated Revenue",
    "Difference",
    "ROI",
    "Recommendation",
    "Status",
  ];

  const lines = data.campaigns.map((row: CampaignImpactRow) =>
    [
      `"${row.campaign}"`,
      row.currentRevenue,
      row.simulatedRevenue,
      row.difference,
      row.roi,
      `"${row.recommendation}"`,
      row.status,
    ].join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function exportScenarioExcel(data: ScenarioApiResponse) {
  const headers = [
    "Campaign",
    "Current Revenue",
    "Simulated Revenue",
    "Difference",
    "ROI",
    "Recommendation",
    "Status",
  ];

  const lines = data.campaigns.map((row: CampaignImpactRow) =>
    [
      row.campaign,
      row.currentRevenue,
      row.simulatedRevenue,
      row.difference,
      row.roi,
      row.recommendation,
      row.status,
    ].join("\t"),
  );

  return [headers.join("\t"), ...lines].join("\n");
}

export function exportScenarioReport(data: ScenarioApiResponse) {
  const { kpis, bottomSummary } = data;
  const lines = [
    "MarketMind AI — Scenario Simulator Report",
    "",
    "SCENARIO SUMMARY",
    `Scenario,${bottomSummary.scenarioSelected}`,
    `Current Revenue,${kpis.currentRevenue}`,
    `Simulated Revenue,${kpis.simulatedRevenue}`,
    `Revenue Increase,${kpis.revenueIncrease}`,
    `Expected ROI,${kpis.expectedRoi}%`,
    `Confidence,${kpis.confidence}%`,
    "",
    "BUSINESS RECOMMENDATION",
    bottomSummary.businessRecommendation,
    "",
    "CAMPAIGN IMPACT",
    "Campaign,Current Revenue,Simulated Revenue,Difference,ROI,Recommendation,Status",
    ...data.campaigns.map((row: CampaignImpactRow) =>
      [
        row.campaign,
        row.currentRevenue,
        row.simulatedRevenue,
        row.difference,
        row.roi,
        row.recommendation,
        row.status,
      ].join(","),
    ),
    "",
    "CHANNEL IMPACT",
    "Channel,Current,Simulated",
    ...data.channelImpact.map((ch) => [ch.channel, ch.current, ch.simulated].join(",")),
  ];

  return lines.join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

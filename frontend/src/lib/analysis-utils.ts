import type { AnalysisApiResponse } from "@/lib/analysis-data";

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportPredictionCsv(data: AnalysisApiResponse) {
  const headers = ["Campaign", "Revenue", "Spend", "ROI", "Predicted Revenue", "Forecast Revenue"];
  const lines = data.campaigns.map((c) =>
    [c.campaign, c.revenue, c.spend, c.roi, c.predictedRevenue, c.forecastRevenue].join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

export function exportForecastCsv(data: AnalysisApiResponse) {
  const headers = ["Day", "Revenue", "Lower Bound", "Upper Bound"];
  const lines = data.forecast.dailyForecast.map((d) =>
    [d.day, d.revenue, d.lower, d.upper].join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

export function exportOptimizationCsv(data: AnalysisApiResponse) {
  const headers = ["Channel", "Current Budget", "Optimized Budget"];
  const lines = data.budget.allocation.map((a) =>
    [a.channel, a.currentBudget, a.optimizedBudget].join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

export function exportScenarioReport(data: AnalysisApiResponse) {
  const lines = [
    "MARKETMIND AI — SCENARIO COMPARISON REPORT",
    "",
    ...data.scenarios.map(
      (s) =>
        `${s.name}${s.isBest ? " (BEST)" : ""}\n  Impact: $${s.revenueImpact.toLocaleString()}\n  ROI Change: +${s.roiImpact}%\n  ${s.description}`,
    ),
  ];
  return lines.join("\n");
}

export function exportExecutiveReport(data: AnalysisApiResponse) {
  const s = data.bottomSummary;
  return [
    "MARKETMIND AI — EXECUTIVE ANALYSIS REPORT",
    "",
    `Overall AI Score: ${data.overallScore.overallAiScore}/100`,
    `Campaign Health: ${data.overallScore.overallCampaignHealth}`,
    `Confidence: ${data.overallScore.confidence}%`,
    `Dataset: ${data.overallScore.dataset}`,
    `Rows Processed: ${data.overallScore.rowsProcessed.toLocaleString()}`,
    "",
    "EXECUTIVE SUMMARY",
    `Total Revenue: $${data.executiveSummary.totalRevenue.toLocaleString()}`,
    `Total Spend: $${data.executiveSummary.totalSpend.toLocaleString()}`,
    `Profit: $${data.executiveSummary.profit.toLocaleString()}`,
    `Predicted Revenue: $${data.executiveSummary.predictedRevenue.toLocaleString()}`,
    `Forecast Revenue: $${data.executiveSummary.forecastRevenue.toLocaleString()}`,
    `Optimization Gain: +$${data.executiveSummary.optimizationGain.toLocaleString()}`,
    "",
    "BOTTOM LINE",
    `Overall Score: ${s.overallScore}/100`,
    `Predicted Revenue: $${s.predictedRevenue.toLocaleString()}`,
    `Optimization Gain: +$${s.optimizationGain.toLocaleString()}`,
    `Forecast Growth: ${s.forecastGrowth}%`,
    `Best Scenario: ${s.bestScenario}`,
    `Confidence: ${s.confidence}%`,
    "",
    "FINAL RECOMMENDATION",
    s.finalRecommendation,
  ].join("\n");
}

export function exportPdfReport(data: AnalysisApiResponse) {
  return exportExecutiveReport(data);
}

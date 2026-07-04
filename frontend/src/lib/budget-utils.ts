import type { BudgetApiResponse, CampaignBudgetRow } from "@/lib/budget-data";

export function exportBudgetCsv(data: BudgetApiResponse) {
  const headers = [
    "Campaign",
    "Current Budget",
    "Recommended Budget",
    "Current ROAS",
    "Expected ROAS",
    "Budget Change",
    "Expected Revenue",
    "Status",
  ];

  const lines = data.campaigns.map((row) =>
    [
      row.campaign,
      row.currentBudget,
      row.recommendedBudget,
      row.currentRoas,
      row.expectedRoas,
      row.budgetChange,
      row.expectedRevenue,
      row.status,
    ].join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function exportBudgetExcel(data: BudgetApiResponse) {
  const headers = [
    "Campaign",
    "Current Budget",
    "Recommended Budget",
    "Current ROAS",
    "Expected ROAS",
    "Budget Change",
    "Expected Revenue",
    "Status",
  ];

  const lines = data.campaigns.map((row) =>
    [
      row.campaign,
      row.currentBudget,
      row.recommendedBudget,
      row.currentRoas,
      row.expectedRoas,
      row.budgetChange,
      row.expectedRevenue,
      row.status,
    ].join("\t"),
  );

  return [headers.join("\t"), ...lines].join("\n");
}

export function exportBudgetReport(data: BudgetApiResponse) {
  const lines = [
    "MarketMind AI — Budget Optimizer Report",
    "",
    "SUMMARY",
    `Recommended Budget,${data.summary.recommendedBudget}`,
    `Estimated Revenue Increase,${data.summary.estimatedRevenueIncrease}`,
    `Budget Saved,${data.summary.budgetSaved}`,
    `Average ROAS,${data.summary.averageRoas}`,
    `Optimization Score,${data.summary.optimizationScore}`,
    `Campaigns Optimized,${data.summary.campaignsOptimized}`,
    "",
    "CAMPAIGN RECOMMENDATIONS",
    "Campaign,Current Budget,Recommended Budget,Current ROAS,Expected ROAS,Budget Change,Expected Revenue,Status",
    ...data.campaigns.map((row: CampaignBudgetRow) =>
      [
        row.campaign,
        row.currentBudget,
        row.recommendedBudget,
        row.currentRoas,
        row.expectedRoas,
        row.budgetChange,
        row.expectedRevenue,
        row.status,
      ].join(","),
    ),
    "",
    "OPTIMIZATION SUMMARY",
    `Overall Score,${data.bottomSummary.optimizationScore}`,
    `Monthly Revenue Increase,${data.bottomSummary.estimatedMonthlyRevenueIncrease}`,
    `Budget Savings,${data.bottomSummary.budgetSavings}`,
    `Confidence,${data.bottomSummary.confidence}%`,
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

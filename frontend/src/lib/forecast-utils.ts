import type { DailyForecastRow, ForecastApiResponse } from "@/lib/forecast-data";

export function exportForecastCsv(data: ForecastApiResponse) {
  const headers = [
    "Date",
    "Predicted Revenue",
    "Predicted Spend",
    "Predicted Profit",
    "Confidence",
    "Trend",
  ];

  const lines = data.dailyForecast.map((row: DailyForecastRow) =>
    [
      row.date,
      row.predictedRevenue,
      row.predictedSpend,
      row.predictedProfit,
      row.confidence,
      row.trend,
    ].join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function exportForecastExcel(data: ForecastApiResponse) {
  const headers = [
    "Date",
    "Predicted Revenue",
    "Predicted Spend",
    "Predicted Profit",
    "Confidence",
    "Trend",
  ];

  const lines = data.dailyForecast.map((row: DailyForecastRow) =>
    [
      row.date,
      row.predictedRevenue,
      row.predictedSpend,
      row.predictedProfit,
      row.confidence,
      row.trend,
    ].join("\t"),
  );

  return [headers.join("\t"), ...lines].join("\n");
}

export function exportForecastReport(data: ForecastApiResponse) {
  const lines = [
    "MarketMind AI — Revenue Forecast Report",
    "",
    "FORECAST KPIs",
    `Forecasted Revenue,${data.kpis.forecastedRevenue}`,
    `Forecast Growth,${data.kpis.forecastGrowth}%`,
    `Forecast Confidence,${data.kpis.forecastConfidence}%`,
    `Forecast Period,${data.kpis.forecastPeriod}`,
    `Best Forecast Day,${data.kpis.bestForecastDay}`,
    `Worst Forecast Day,${data.kpis.worstForecastDay}`,
    "",
    "FORECAST SUMMARY",
    `Current Trend,${data.summary.currentTrend}`,
    `Expected Growth,${data.summary.expectedGrowth}`,
    `Confidence,${data.summary.confidence}%`,
    `Business Outlook,${data.summary.businessOutlook}`,
    "",
    "DAILY FORECAST",
    "Date,Predicted Revenue,Predicted Spend,Predicted Profit,Confidence,Trend",
    ...data.dailyForecast.map((row) =>
      [
        row.date,
        row.predictedRevenue,
        row.predictedSpend,
        row.predictedProfit,
        row.confidence,
        row.trend,
      ].join(","),
    ),
    "",
    "CHANNEL FORECAST",
    "Channel,Forecast Revenue",
    ...data.channelForecast.map((c) => `${c.channel},${c.forecastRevenue}`),
    "",
    "EXECUTIVE SUMMARY",
    `Overall Forecast Score,${data.bottomSummary.overallScore}/100`,
    `Expected Revenue,${data.bottomSummary.expectedRevenue}`,
    `Expected Growth,${data.bottomSummary.expectedGrowth}%`,
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

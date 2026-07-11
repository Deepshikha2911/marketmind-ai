export const revenueOverviewChartData = [
  { month: "Jan", actual: 382000, predicted: 394000, forecast: 401000 },
  { month: "Feb", actual: 421000, predicted: 432000, forecast: 448000 },
  { month: "Mar", actual: 398000, predicted: 411000, forecast: 425000 },
  { month: "Apr", actual: 445000, predicted: 458000, forecast: 472000 },
  { month: "May", actual: 472000, predicted: 486000, forecast: 501000 },
  { month: "Jun", actual: 456000, predicted: 471000, forecast: 488000 },
  { month: "Jul", actual: 410000, predicted: 426000, forecast: 442000 },
  { month: "Aug", actual: 468000, predicted: 481000, forecast: 497000 },
  { month: "Sep", actual: 492000, predicted: 506000, forecast: 523000 },
  { month: "Oct", actual: 518000, predicted: 534000, forecast: 551000 },
  { month: "Nov", actual: 546000, predicted: 562000, forecast: 579000 },
  { month: "Dec", actual: 574000, predicted: 589000, forecast: 608000 },
];

export const budgetAllocationChartData = [
  { channel: "Google Search", current: 18400, optimized: 21200 },
  { channel: "Meta Ads", current: 12800, optimized: 11600 },
  { channel: "Shopping", current: 7400, optimized: 9800 },
  { channel: "Display", current: 11600, optimized: 6800 },
  { channel: "Email", current: 4200, optimized: 5600 },
  { channel: "YouTube", current: 6600, optimized: 3000 },
];

export const forecastChartData = Array.from({ length: 30 }, (_, index) => {
  const base = 9800 + index * 120 + Math.sin(index / 3) * 400;
  return {
    day: `Day ${index + 1}`,
    revenue: Math.round(base),
    lower: Math.round(base * 0.92),
    upper: Math.round(base * 1.08),
  };
});

export const marketingFunnelChartData = [
  { stage: "Impressions", value: 4280000, label: "4.28M" },
  { stage: "Clicks", value: 153240, label: "153.2K" },
  { stage: "Conversions", value: 12842, label: "12,842" },
  { stage: "Revenue", value: 298400, label: "$298.4K" },
];

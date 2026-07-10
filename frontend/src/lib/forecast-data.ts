/**
 * Types aligned with the future FastAPI forecast endpoint.
 * Replace `mockForecastResponse` with the API payload when integrating.
 */

export type ForecastTrend = "up" | "down" | "stable";

export type ForecastKpis = {
  forecastedRevenue: number;
  forecastGrowth: number;
  forecastConfidence: number;
  forecastPeriod: string;
  bestForecastDay: string;
  worstForecastDay: string;
};

export type ForecastSummary = {
  currentTrend: string;
  expectedGrowth: string;
  confidence: number;
  businessOutlook: string;
};

export type RevenueForecastPoint = {
  date: string;
  label: string;
  actual?: number;
  forecast?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
};

export type DailyForecastRow = {
  id: string;
  date: string;
  label: string;
  predictedRevenue: number;
  predictedSpend: number;
  predictedProfit: number;
  confidence: number;
  trend: ForecastTrend;
};

export type GrowthProjectionPoint = {
  label: string;
  current: number;
  forecast: number;
};

export type ChannelForecast = {
  channel: string;
  forecastRevenue: number;
};

export type ForecastInsight = {
  id: string;
  title: string;
  description: string;
};

export type RiskLevel = "High" | "Medium" | "Low";

export type ForecastRisk = {
  id: string;
  level: RiskLevel;
  title: string;
  explanation: string;
};

export type ForecastBottomSummary = {
  overallScore: number;
  expectedRevenue: number;
  expectedGrowth: number;
  confidence: number;
};

export type ForecastApiResponse = {
  kpis: ForecastKpis;
  summary: ForecastSummary;
  revenueChart: RevenueForecastPoint[];
  dailyForecast: DailyForecastRow[];
  growthProjection: GrowthProjectionPoint[];
  channelForecast: ChannelForecast[];
  insights: ForecastInsight[];
  risks: ForecastRisk[];
  bottomSummary: ForecastBottomSummary;
};

function buildRevenueChart(): RevenueForecastPoint[] {
  const points: RevenueForecastPoint[] = [];

  const historical = [
    { day: 26, month: 6, actual: 8420 },
    { day: 27, month: 6, actual: 9180 },
    { day: 28, month: 6, actual: 8890 },
    { day: 29, month: 6, actual: 9340 },
    { day: 30, month: 6, actual: 9720 },
    { day: 1, month: 7, actual: 8950 },
    { day: 2, month: 7, actual: 9120 },
    { day: 3, month: 7, actual: 9480 },
    { day: 4, month: 7, actual: 10240 },
    { day: 5, month: 7, actual: 9860 },
    { day: 6, month: 7, actual: 9340 },
    { day: 7, month: 7, actual: 7680 },
    { day: 8, month: 7, actual: 8920 },
    { day: 9, month: 7, actual: 9580 },
  ];

  const forecastDays = [
    { day: 10, forecast: 9840, lower: 9120, upper: 10560 },
    { day: 11, forecast: 10120, lower: 9380, upper: 10860 },
    { day: 12, forecast: 10480, lower: 9720, upper: 11240 },
    { day: 13, forecast: 11240, lower: 10480, upper: 12000 },
    { day: 14, forecast: 11860, lower: 11080, upper: 12640 },
    { day: 15, forecast: 10920, lower: 10160, upper: 11680 },
    { day: 16, forecast: 10680, lower: 9920, upper: 11440 },
    { day: 17, forecast: 11420, lower: 10640, upper: 12200 },
    { day: 18, forecast: 12840, lower: 11980, upper: 13700 },
    { day: 19, forecast: 12160, lower: 11340, upper: 12980 },
    { day: 20, forecast: 11740, lower: 10920, upper: 12560 },
    { day: 21, forecast: 12280, lower: 11440, upper: 13120 },
    { day: 22, forecast: 11920, lower: 11100, upper: 12740 },
    { day: 23, forecast: 11580, lower: 10780, upper: 12380 },
    { day: 24, forecast: 12100, lower: 11280, upper: 12920 },
    { day: 25, forecast: 12460, lower: 11620, upper: 13300 },
    { day: 26, forecast: 11880, lower: 11060, upper: 12700 },
    { day: 27, forecast: 11620, lower: 10820, upper: 12420 },
    { day: 28, forecast: 12040, lower: 11220, upper: 12860 },
    { day: 29, forecast: 12380, lower: 11540, upper: 13220 },
    { day: 30, forecast: 12620, lower: 11780, upper: 13460 },
    { day: 31, forecast: 11980, lower: 11160, upper: 12800 },
    { day: 1, month: 8, forecast: 11420, lower: 10640, upper: 12200 },
    { day: 2, month: 8, forecast: 11760, lower: 10960, upper: 12560 },
    { day: 3, month: 8, forecast: 12080, lower: 11260, upper: 12900 },
    { day: 4, month: 8, forecast: 12420, lower: 11580, upper: 13260 },
    { day: 5, month: 8, forecast: 12140, lower: 11320, upper: 12960 },
    { day: 6, month: 8, forecast: 11860, lower: 11040, upper: 12680 },
    { day: 7, month: 8, forecast: 12200, lower: 11380, upper: 13020 },
    { day: 8, month: 8, forecast: 12540, lower: 11700, upper: 13380 },
  ];

  for (const h of historical) {
    const month = h.month ?? 6;
    const day = h.day;
    const dateStr = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    points.push({
      date: dateStr,
      label: month === 6 ? `Jun ${day}` : `Jul ${day}`,
      actual: h.actual,
    });
  }

  for (const f of forecastDays) {
    const month = f.month ?? 7;
    const dateStr = `2026-${String(month).padStart(2, "0")}-${String(f.day).padStart(2, "0")}`;
    points.push({
      date: dateStr,
      label: month === 7 ? `Jul ${f.day}` : `Aug ${f.day}`,
      forecast: f.forecast,
      confidenceLower: f.lower,
      confidenceUpper: f.upper,
    });
  }

  return points;
}

function buildDailyForecast(): DailyForecastRow[] {
  const rows: DailyForecastRow[] = [
    { id: "d1", date: "2026-07-10", label: "Jul 10", predictedRevenue: 9840, predictedSpend: 2180, predictedProfit: 7660, confidence: 94, trend: "up" },
    { id: "d2", date: "2026-07-11", label: "Jul 11", predictedRevenue: 10120, predictedSpend: 2240, predictedProfit: 7880, confidence: 93, trend: "up" },
    { id: "d3", date: "2026-07-12", label: "Jul 12", predictedRevenue: 10480, predictedSpend: 2310, predictedProfit: 8170, confidence: 93, trend: "up" },
    { id: "d4", date: "2026-07-13", label: "Jul 13", predictedRevenue: 11240, predictedSpend: 2480, predictedProfit: 8760, confidence: 92, trend: "up" },
    { id: "d5", date: "2026-07-14", label: "Jul 14", predictedRevenue: 11860, predictedSpend: 2620, predictedProfit: 9240, confidence: 92, trend: "up" },
    { id: "d6", date: "2026-07-15", label: "Jul 15", predictedRevenue: 10920, predictedSpend: 2410, predictedProfit: 8510, confidence: 91, trend: "down" },
    { id: "d7", date: "2026-07-16", label: "Jul 16", predictedRevenue: 10680, predictedSpend: 2360, predictedProfit: 8320, confidence: 91, trend: "down" },
    { id: "d8", date: "2026-07-17", label: "Jul 17", predictedRevenue: 11420, predictedSpend: 2520, predictedProfit: 8900, confidence: 92, trend: "up" },
    { id: "d9", date: "2026-07-18", label: "Jul 18", predictedRevenue: 12840, predictedSpend: 2840, predictedProfit: 10000, confidence: 94, trend: "up" },
    { id: "d10", date: "2026-07-19", label: "Jul 19", predictedRevenue: 12160, predictedSpend: 2690, predictedProfit: 9470, confidence: 93, trend: "down" },
    { id: "d11", date: "2026-07-20", label: "Jul 20", predictedRevenue: 11740, predictedSpend: 2600, predictedProfit: 9140, confidence: 92, trend: "down" },
    { id: "d12", date: "2026-07-21", label: "Jul 21", predictedRevenue: 12280, predictedSpend: 2720, predictedProfit: 9560, confidence: 93, trend: "up" },
    { id: "d13", date: "2026-07-22", label: "Jul 22", predictedRevenue: 11920, predictedSpend: 2640, predictedProfit: 9280, confidence: 92, trend: "down" },
    { id: "d14", date: "2026-07-23", label: "Jul 23", predictedRevenue: 11580, predictedSpend: 2560, predictedProfit: 9020, confidence: 91, trend: "down" },
    { id: "d15", date: "2026-07-24", label: "Jul 24", predictedRevenue: 12100, predictedSpend: 2680, predictedProfit: 9420, confidence: 92, trend: "up" },
    { id: "d16", date: "2026-07-25", label: "Jul 25", predictedRevenue: 12460, predictedSpend: 2760, predictedProfit: 9700, confidence: 93, trend: "up" },
    { id: "d17", date: "2026-07-26", label: "Jul 26", predictedRevenue: 11880, predictedSpend: 2630, predictedProfit: 9250, confidence: 92, trend: "down" },
    { id: "d18", date: "2026-07-27", label: "Jul 27", predictedRevenue: 11620, predictedSpend: 2570, predictedProfit: 9050, confidence: 91, trend: "down" },
    { id: "d19", date: "2026-07-28", label: "Jul 28", predictedRevenue: 12040, predictedSpend: 2670, predictedProfit: 9370, confidence: 92, trend: "up" },
    { id: "d20", date: "2026-07-29", label: "Jul 29", predictedRevenue: 12380, predictedSpend: 2740, predictedProfit: 9640, confidence: 93, trend: "up" },
    { id: "d21", date: "2026-07-30", label: "Jul 30", predictedRevenue: 12620, predictedSpend: 2790, predictedProfit: 9830, confidence: 93, trend: "up" },
    { id: "d22", date: "2026-07-31", label: "Jul 31", predictedRevenue: 11980, predictedSpend: 2650, predictedProfit: 9330, confidence: 92, trend: "down" },
    { id: "d23", date: "2026-08-01", label: "Aug 1", predictedRevenue: 11420, predictedSpend: 2530, predictedProfit: 8890, confidence: 91, trend: "down" },
    { id: "d24", date: "2026-08-02", label: "Aug 2", predictedRevenue: 11760, predictedSpend: 2600, predictedProfit: 9160, confidence: 92, trend: "up" },
    { id: "d25", date: "2026-08-03", label: "Aug 3", predictedRevenue: 12080, predictedSpend: 2670, predictedProfit: 9410, confidence: 92, trend: "up" },
    { id: "d26", date: "2026-08-04", label: "Aug 4", predictedRevenue: 12420, predictedSpend: 2750, predictedProfit: 9670, confidence: 93, trend: "up" },
    { id: "d27", date: "2026-08-05", label: "Aug 5", predictedRevenue: 12140, predictedSpend: 2680, predictedProfit: 9460, confidence: 92, trend: "down" },
    { id: "d28", date: "2026-08-06", label: "Aug 6", predictedRevenue: 11860, predictedSpend: 2620, predictedProfit: 9240, confidence: 91, trend: "down" },
    { id: "d29", date: "2026-08-07", label: "Aug 7", predictedRevenue: 12200, predictedSpend: 2700, predictedProfit: 9500, confidence: 92, trend: "up" },
    { id: "d30", date: "2026-08-08", label: "Aug 8", predictedRevenue: 12540, predictedSpend: 2770, predictedProfit: 9770, confidence: 93, trend: "up" },
  ];

  return rows;
}

export const mockForecastResponse: ForecastApiResponse = {
  kpis: {
    forecastedRevenue: 326800,
    forecastGrowth: 14.8,
    forecastConfidence: 93,
    forecastPeriod: "Next 30 Days",
    bestForecastDay: "July 18",
    worstForecastDay: "July 7",
  },
  summary: {
    currentTrend: "Upward",
    expectedGrowth: "+14.8%",
    confidence: 93,
    businessOutlook: "Positive",
  },
  revenueChart: buildRevenueChart(),
  dailyForecast: buildDailyForecast(),
  growthProjection: [
    { label: "Week 1", current: 62400, forecast: 68200 },
    { label: "Week 2", current: 65800, forecast: 72400 },
    { label: "Week 3", current: 68200, forecast: 76800 },
    { label: "Week 4", current: 70100, forecast: 79400 },
    { label: "Week 5", current: 71800, forecast: 82400 },
    { label: "Week 6", current: 73400, forecast: 85200 },
  ],
  channelForecast: [
    { channel: "Google Search", forecastRevenue: 98400 },
    { channel: "Meta", forecastRevenue: 76200 },
    { channel: "Shopping", forecastRevenue: 62800 },
    { channel: "Email", forecastRevenue: 38400 },
    { channel: "Display", forecastRevenue: 24600 },
    { channel: "YouTube", forecastRevenue: 26400 },
  ],
  insights: [
    {
      id: "fi1",
      title: "Weekend Campaign Lift",
      description:
        "Revenue is expected to increase 18% after weekend campaigns launch on July 12–13, driven by retargeting audiences and promotional offers.",
    },
    {
      id: "fi2",
      title: "Shopping Channel Surge",
      description:
        "Shopping is projected to outperform Google Search next month with a 22% higher ROAS, fueled by seasonal product demand and optimized feed listings.",
    },
    {
      id: "fi3",
      title: "Display Spend Decline",
      description:
        "Display is expected to continue declining at −8% week-over-week as budget shifts toward higher-converting channels with stronger attribution signals.",
    },
    {
      id: "fi4",
      title: "Meta Retargeting Recovery",
      description:
        "Meta retargeting campaigns are forecast to recover with a projected 12% revenue uplift after creative refresh and audience segmentation updates.",
    },
    {
      id: "fi5",
      title: "Email Performance Stability",
      description:
        "Email campaigns remain stable with consistent 4.2x ROAS. Lifecycle automations and win-back sequences maintain predictable revenue contribution.",
    },
  ],
  risks: [
    {
      id: "r1",
      level: "High",
      title: "Display Channel Underperformance",
      explanation:
        "Display campaigns show declining CTR and rising CPM. Without budget reallocation, forecast accuracy drops and projected revenue could miss by up to $8,400.",
    },
    {
      id: "r2",
      level: "Medium",
      title: "Mid-Week Revenue Dip",
      explanation:
        "Historical patterns indicate a recurring mid-week slowdown. July 15–16 and July 22–23 show elevated variance that may require promotional support.",
    },
    {
      id: "r3",
      level: "Low",
      title: "Seasonal Demand Volatility",
      explanation:
        "Minor fluctuations in product demand are expected but within normal range. Email and Shopping channels provide sufficient buffer to absorb variance.",
    },
  ],
  bottomSummary: {
    overallScore: 93,
    expectedRevenue: 326800,
    expectedGrowth: 14.8,
    confidence: 93,
  },
};

/**
 * Types aligned with the future FastAPI scenario simulator endpoint.
 * Replace mock data with API payload when integrating.
 */

export type ScenarioId =
  | "increase-budget"
  | "reduce-budget"
  | "pause-campaigns"
  | "increase-ctr"
  | "improve-conversion"
  | "boost-revenue";

export type ScenarioKpis = {
  currentRevenue: number;
  simulatedRevenue: number;
  revenueIncrease: number;
  expectedRoi: number;
  winningScenario: string;
  confidence: number;
};

export type SimulationMetric = {
  key: string;
  label: string;
  current: number;
  simulated: number;
  format: "currency" | "percent" | "number" | "multiplier";
};

export type RevenueComparisonPoint = {
  month: string;
  label: string;
  current: number;
  simulated: number;
};

export type ChannelImpact = {
  channel: string;
  current: number;
  simulated: number;
};

export type CampaignImpactStatus = "Increase" | "Maintain" | "Decrease" | "Pause";

export type CampaignImpactRow = {
  id: string;
  campaign: string;
  currentRevenue: number;
  simulatedRevenue: number;
  difference: number;
  roi: number;
  recommendation: string;
  status: CampaignImpactStatus;
};

export type ScenarioInsight = {
  id: string;
  title: string;
  description: string;
};

export type RiskStatus = "Low" | "Medium" | "High";

export type ScenarioRisk = {
  id: string;
  title: string;
  status: RiskStatus;
  description: string;
};

export type ScenarioOption = {
  id: ScenarioId;
  name: string;
  explanation: string;
  expectedRevenueImpact: number;
  estimatedRoi: number;
};

export type ScenarioBottomSummary = {
  scenarioSelected: string;
  expectedRevenue: number;
  revenueIncrease: number;
  expectedRoi: number;
  confidenceScore: number;
  businessRecommendation: string;
};

export type ScenarioData = {
  id: ScenarioId;
  kpis: ScenarioKpis;
  simulationResults: SimulationMetric[];
  revenueChart: RevenueComparisonPoint[];
  channelImpact: ChannelImpact[];
  campaigns: CampaignImpactRow[];
  insights: ScenarioInsight[];
  risks: ScenarioRisk[];
  bottomSummary: ScenarioBottomSummary;
};

export type ScenarioApiResponse = ScenarioData & {
  options: ScenarioOption[];
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BASE_CAMPAIGNS: Omit<
  CampaignImpactRow,
  "simulatedRevenue" | "difference" | "roi" | "recommendation" | "status"
>[] = [
  { id: "c1", campaign: "Google Search — Brand Keywords", currentRevenue: 48200 },
  { id: "c2", campaign: "Google Search — Non-Brand", currentRevenue: 36800 },
  { id: "c3", campaign: "Meta Ads — Prospecting", currentRevenue: 29400 },
  { id: "c4", campaign: "Meta Ads — Retargeting", currentRevenue: 22100 },
  { id: "c5", campaign: "Google Shopping — Core SKUs", currentRevenue: 35600 },
  { id: "c6", campaign: "Display — Awareness", currentRevenue: 12800 },
  { id: "c7", campaign: "Display — Remarketing", currentRevenue: 9400 },
  { id: "c8", campaign: "Email — Promotional", currentRevenue: 18600 },
  { id: "c9", campaign: "Email — Lifecycle", currentRevenue: 14200 },
  { id: "c10", campaign: "YouTube — In-Stream", currentRevenue: 17400 },
];

function buildRevenueChart(currentTotal: number, simulatedTotal: number): RevenueComparisonPoint[] {
  const currentWeights = [0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.09, 0.08, 0.09, 0.1, 0.11, 0.12];
  const simulatedWeights = [0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.09, 0.08, 0.09, 0.1, 0.11, 0.12];

  return MONTHS.map((label, i) => ({
    month: `2026-${String(i + 1).padStart(2, "0")}`,
    label,
    current: Math.round(currentTotal * currentWeights[i]),
    simulated: Math.round(simulatedTotal * simulatedWeights[i]),
  }));
}

function buildCampaigns(
  multipliers: number[],
  recommendations: string[],
  statuses: CampaignImpactStatus[],
  roiValues: number[],
): CampaignImpactRow[] {
  return BASE_CAMPAIGNS.map((row, i) => {
    const simulatedRevenue = Math.round(row.currentRevenue * multipliers[i]);
    return {
      ...row,
      simulatedRevenue,
      difference: simulatedRevenue - row.currentRevenue,
      roi: roiValues[i],
      recommendation: recommendations[i],
      status: statuses[i],
    };
  });
}

export const scenarioOptions: ScenarioOption[] = [
  {
    id: "increase-budget",
    name: "Increase Budget (+20%)",
    explanation: "Scale spend across top-performing Search and Shopping campaigns by 20%.",
    expectedRevenueImpact: 42300,
    estimatedRoi: 582,
  },
  {
    id: "reduce-budget",
    name: "Reduce Budget (-15%)",
    explanation: "Cut overall ad spend by 15% while protecting high-ROAS channels.",
    expectedRevenueImpact: -18600,
    estimatedRoi: 312,
  },
  {
    id: "pause-campaigns",
    name: "Pause Underperforming Campaigns",
    explanation: "Stop spend on low-ROAS Display and underperforming Meta prospecting.",
    expectedRevenueImpact: 12800,
    estimatedRoi: 748,
  },
  {
    id: "increase-ctr",
    name: "Increase CTR by 10%",
    explanation: "Improve ad creative and targeting to lift click-through rates by 10%.",
    expectedRevenueImpact: 22400,
    estimatedRoi: 920,
  },
  {
    id: "improve-conversion",
    name: "Improve Conversion Rate by 15%",
    explanation: "Optimize landing pages and checkout flow for a 15% conversion lift.",
    expectedRevenueImpact: 35800,
    estimatedRoi: 645,
  },
  {
    id: "boost-revenue",
    name: "Boost Revenue Target",
    explanation: "Aggressive growth plan combining budget increases and channel reallocation.",
    expectedRevenueImpact: 51200,
    estimatedRoi: 498,
  },
];

const scenarioDefinitions: Record<ScenarioId, Omit<ScenarioData, "id">> = {
  "increase-budget": {
    kpis: {
      currentRevenue: 284500,
      simulatedRevenue: 326800,
      revenueIncrease: 42300,
      expectedRoi: 582,
      winningScenario: "Increase Search Budget",
      confidence: 92,
    },
    simulationResults: [
      { key: "revenue", label: "Revenue", current: 284500, simulated: 326800, format: "currency" },
      { key: "profit", label: "Profit", current: 68200, simulated: 89400, format: "currency" },
      { key: "roas", label: "ROAS", current: 4.2, simulated: 5.1, format: "multiplier" },
      { key: "roi", label: "ROI", current: 412, simulated: 582, format: "percent" },
      { key: "conversions", label: "Conversions", current: 4280, simulated: 4910, format: "number" },
      { key: "spend", label: "Spend", current: 67800, simulated: 81400, format: "currency" },
    ],
    revenueChart: buildRevenueChart(284500, 326800),
    channelImpact: [
      { channel: "Google Search", current: 85000, simulated: 108400 },
      { channel: "Meta Ads", current: 51500, simulated: 56200 },
      { channel: "Shopping", current: 35600, simulated: 48200 },
      { channel: "Display", current: 22200, simulated: 16800 },
      { channel: "Email", current: 32800, simulated: 34600 },
      { channel: "YouTube", current: 17400, simulated: 19600 },
    ],
    campaigns: buildCampaigns(
      [1.22, 1.28, 1.08, 1.05, 1.35, 0.72, 0.68, 1.06, 1.04, 1.12],
      [
        "Increase budget 25%",
        "Increase budget 30%",
        "Maintain current spend",
        "Maintain current spend",
        "Increase budget 35%",
        "Reduce budget 28%",
        "Pause remarketing",
        "Maintain current spend",
        "Maintain current spend",
        "Increase budget 12%",
      ],
      ["Increase", "Increase", "Maintain", "Maintain", "Increase", "Decrease", "Pause", "Maintain", "Maintain", "Increase"],
      [612, 548, 420, 385, 624, 180, 95, 890, 720, 445],
    ),
    insights: [
      {
        id: "i1",
        title: "Search campaigns gain the highest incremental revenue",
        description:
          "Google Search campaigns account for 68% of projected revenue uplift when budget is increased by 20%.",
      },
      {
        id: "i2",
        title: "Display campaigns remain inefficient",
        description:
          "Display spend continues to deliver sub-2x ROAS even after reallocation. Consider further cuts.",
      },
      {
        id: "i3",
        title: "Shopping campaigns benefit most from increased budget",
        description:
          "Shopping ROAS improves to 6.2x under this scenario, making it the highest-efficiency paid channel.",
      },
      {
        id: "i4",
        title: "Improved CTR increases revenue without increasing spend",
        description:
          "Creative refresh on Search ads contributes an estimated 8% CTR lift, amplifying budget efficiency.",
      },
      {
        id: "i5",
        title: "Pausing low-performing campaigns improves overall ROI",
        description:
          "Eliminating underperforming Display remarketing saves $4,200/month with minimal revenue loss.",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Revenue Risk",
        status: "Low",
        description:
          "Projected revenue variance is within ±4.2% based on historical seasonality and channel stability.",
      },
      {
        id: "r2",
        title: "Budget Risk",
        status: "Medium",
        description:
          "20% budget increase may face diminishing returns if Search auction costs rise above forecast.",
      },
      {
        id: "r3",
        title: "Forecast Reliability",
        status: "Low",
        description:
          "Model trained on 18 months of campaign data with 92% backtest accuracy on similar scenarios.",
      },
      {
        id: "r4",
        title: "Business Confidence",
        status: "Low",
        description:
          "High confidence driven by consistent Search ROAS above 5x and stable conversion trends.",
      },
    ],
    bottomSummary: {
      scenarioSelected: "Increase Search Budget",
      expectedRevenue: 326800,
      revenueIncrease: 42300,
      expectedRoi: 582,
      confidenceScore: 92,
      businessRecommendation:
        "MarketMind AI recommends reallocating 20% of Display spend to Google Search and Shopping campaigns while pausing low-performing Display campaigns. This scenario produces the highest projected revenue increase with minimal risk.",
    },
  },
  "reduce-budget": {
    kpis: {
      currentRevenue: 284500,
      simulatedRevenue: 265900,
      revenueIncrease: -18600,
      expectedRoi: 312,
      winningScenario: "Efficiency-First Cut",
      confidence: 78,
    },
    simulationResults: [
      { key: "revenue", label: "Revenue", current: 284500, simulated: 265900, format: "currency" },
      { key: "profit", label: "Profit", current: 68200, simulated: 72400, format: "currency" },
      { key: "roas", label: "ROAS", current: 4.2, simulated: 5.4, format: "multiplier" },
      { key: "roi", label: "ROI", current: 412, simulated: 312, format: "percent" },
      { key: "conversions", label: "Conversions", current: 4280, simulated: 3980, format: "number" },
      { key: "spend", label: "Spend", current: 67800, simulated: 57600, format: "currency" },
    ],
    revenueChart: buildRevenueChart(284500, 265900),
    channelImpact: [
      { channel: "Google Search", current: 85000, simulated: 78200 },
      { channel: "Meta Ads", current: 51500, simulated: 42800 },
      { channel: "Shopping", current: 35600, simulated: 33400 },
      { channel: "Display", current: 22200, simulated: 12400 },
      { channel: "Email", current: 32800, simulated: 32800 },
      { channel: "YouTube", current: 17400, simulated: 14200 },
    ],
    campaigns: buildCampaigns(
      [0.95, 0.92, 0.78, 0.82, 0.94, 0.45, 0.38, 1.0, 1.0, 0.72],
      [
        "Reduce budget 5%",
        "Reduce budget 8%",
        "Reduce budget 22%",
        "Reduce budget 18%",
        "Reduce budget 6%",
        "Pause awareness",
        "Pause remarketing",
        "Maintain current spend",
        "Maintain current spend",
        "Reduce budget 28%",
      ],
      ["Decrease", "Decrease", "Decrease", "Decrease", "Decrease", "Pause", "Pause", "Maintain", "Maintain", "Decrease"],
      [520, 480, 280, 310, 580, 0, 0, 890, 720, 320],
    ),
    insights: [
      {
        id: "i1",
        title: "Profit margin improves despite revenue dip",
        description: "Cutting low-ROAS spend lifts net profit by $4,200 even with an 6.5% revenue decline.",
      },
      {
        id: "i2",
        title: "Display campaigns remain inefficient",
        description: "Display channels show the largest efficiency gains when budgets are reduced.",
      },
      {
        id: "i3",
        title: "Search campaigns retain strong performance",
        description: "Protected Search budgets maintain 94% of current revenue at reduced spend levels.",
      },
      {
        id: "i4",
        title: "Email delivers stable returns under budget cuts",
        description: "Owned channels remain unaffected, providing a reliable revenue baseline.",
      },
      {
        id: "i5",
        title: "Pausing low-performing campaigns improves overall ROI",
        description: "Eliminating Display spend improves blended ROAS from 4.2x to 5.4x.",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Revenue Risk",
        status: "Medium",
        description: "Revenue may decline 6–8% if competitive pressure increases on remaining channels.",
      },
      {
        id: "r2",
        title: "Budget Risk",
        status: "Low",
        description: "15% spend reduction is within tested thresholds with minimal market share impact.",
      },
      {
        id: "r3",
        title: "Forecast Reliability",
        status: "Medium",
        description: "Budget reduction scenarios have 78% historical accuracy due to non-linear scaling effects.",
      },
      {
        id: "r4",
        title: "Business Confidence",
        status: "Medium",
        description: "Moderate confidence — profit gains are clear but top-line growth is constrained.",
      },
    ],
    bottomSummary: {
      scenarioSelected: "Reduce Budget (-15%)",
      expectedRevenue: 265900,
      revenueIncrease: -18600,
      expectedRoi: 312,
      confidenceScore: 78,
      businessRecommendation:
        "MarketMind AI recommends a 15% budget reduction focused on Display and underperforming Meta prospecting. Protect Search and Shopping budgets to preserve 94% of revenue while improving profit margins.",
    },
  },
  "pause-campaigns": {
    kpis: {
      currentRevenue: 284500,
      simulatedRevenue: 297300,
      revenueIncrease: 12800,
      expectedRoi: 748,
      winningScenario: "Pause & Reallocate",
      confidence: 88,
    },
    simulationResults: [
      { key: "revenue", label: "Revenue", current: 284500, simulated: 297300, format: "currency" },
      { key: "profit", label: "Profit", current: 68200, simulated: 81200, format: "currency" },
      { key: "roas", label: "ROAS", current: 4.2, simulated: 5.8, format: "multiplier" },
      { key: "roi", label: "ROI", current: 412, simulated: 748, format: "percent" },
      { key: "conversions", label: "Conversions", current: 4280, simulated: 4460, format: "number" },
      { key: "spend", label: "Spend", current: 67800, simulated: 58400, format: "currency" },
    ],
    revenueChart: buildRevenueChart(284500, 297300),
    channelImpact: [
      { channel: "Google Search", current: 85000, simulated: 92400 },
      { channel: "Meta Ads", current: 51500, simulated: 48200 },
      { channel: "Shopping", current: 35600, simulated: 41800 },
      { channel: "Display", current: 22200, simulated: 8400 },
      { channel: "Email", current: 32800, simulated: 35200 },
      { channel: "YouTube", current: 17400, simulated: 18600 },
    ],
    campaigns: buildCampaigns(
      [1.08, 1.12, 0.72, 1.04, 1.18, 0.0, 0.0, 1.08, 1.06, 1.06],
      [
        "Reallocate saved spend",
        "Reallocate saved spend",
        "Pause prospecting",
        "Maintain current spend",
        "Reallocate saved spend",
        "Pause immediately",
        "Pause immediately",
        "Maintain current spend",
        "Maintain current spend",
        "Maintain current spend",
      ],
      ["Increase", "Increase", "Pause", "Maintain", "Increase", "Pause", "Pause", "Maintain", "Maintain", "Maintain"],
      [580, 520, 0, 390, 680, 0, 0, 920, 740, 460],
    ),
    insights: [
      {
        id: "i1",
        title: "Pausing low-performing campaigns improves overall ROI",
        description: "Removing $9,400/month in wasteful Display spend lifts blended ROI to 748%.",
      },
      {
        id: "i2",
        title: "Search campaigns gain the highest incremental revenue",
        description: "Reallocated budget to Search drives an additional $7,400 in monthly revenue.",
      },
      {
        id: "i3",
        title: "Display campaigns remain inefficient",
        description: "Both Display campaigns show ROAS below 1.5x — pausing them has minimal revenue impact.",
      },
      {
        id: "i4",
        title: "Shopping campaigns benefit most from increased budget",
        description: "Reallocated Display budget to Shopping yields 6.8x ROAS on incremental spend.",
      },
      {
        id: "i5",
        title: "Improved CTR increases revenue without increasing spend",
        description: "Budget reallocation to proven creatives improves efficiency without new ad spend.",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Revenue Risk",
        status: "Low",
        description: "Revenue impact is positive with only 2.1% variance in backtested pause scenarios.",
      },
      {
        id: "r2",
        title: "Budget Risk",
        status: "Low",
        description: "Net spend decreases by $9,400/month while revenue increases — favorable risk profile.",
      },
      {
        id: "r3",
        title: "Forecast Reliability",
        status: "Low",
        description: "Pause scenarios show 88% accuracy — among the most reliable simulation types.",
      },
      {
        id: "r4",
        title: "Business Confidence",
        status: "Low",
        description: "High confidence due to clear underperformer identification and proven reallocation paths.",
      },
    ],
    bottomSummary: {
      scenarioSelected: "Pause Underperforming Campaigns",
      expectedRevenue: 297300,
      revenueIncrease: 12800,
      expectedRoi: 748,
      confidenceScore: 88,
      businessRecommendation:
        "MarketMind AI recommends immediately pausing Display Awareness, Display Remarketing, and Meta Prospecting campaigns. Reallocate saved budget to Google Search and Shopping for a net revenue gain of $12,800 with reduced spend.",
    },
  },
  "increase-ctr": {
    kpis: {
      currentRevenue: 284500,
      simulatedRevenue: 306900,
      revenueIncrease: 22400,
      expectedRoi: 920,
      winningScenario: "Creative Optimization",
      confidence: 85,
    },
    simulationResults: [
      { key: "revenue", label: "Revenue", current: 284500, simulated: 306900, format: "currency" },
      { key: "profit", label: "Profit", current: 68200, simulated: 79800, format: "currency" },
      { key: "roas", label: "ROAS", current: 4.2, simulated: 4.8, format: "multiplier" },
      { key: "roi", label: "ROI", current: 412, simulated: 920, format: "percent" },
      { key: "conversions", label: "Conversions", current: 4280, simulated: 4620, format: "number" },
      { key: "spend", label: "Spend", current: 67800, simulated: 67800, format: "currency" },
    ],
    revenueChart: buildRevenueChart(284500, 306900),
    channelImpact: [
      { channel: "Google Search", current: 85000, simulated: 94200 },
      { channel: "Meta Ads", current: 51500, simulated: 56800 },
      { channel: "Shopping", current: 35600, simulated: 39400 },
      { channel: "Display", current: 22200, simulated: 23800 },
      { channel: "Email", current: 32800, simulated: 34200 },
      { channel: "YouTube", current: 17400, simulated: 19200 },
    ],
    campaigns: buildCampaigns(
      [1.12, 1.14, 1.1, 1.08, 1.11, 1.06, 1.04, 1.02, 1.02, 1.1],
      [
        "Refresh ad copy",
        "Test new headlines",
        "Update creative assets",
        "Optimize audiences",
        "Improve product titles",
        "New banner designs",
        "Dynamic creative test",
        "A/B test subject lines",
        "Personalize content",
        "New video creatives",
      ],
      ["Increase", "Increase", "Increase", "Increase", "Increase", "Maintain", "Maintain", "Maintain", "Maintain", "Increase"],
      [720, 640, 480, 420, 580, 210, 120, 910, 730, 520],
    ),
    insights: [
      {
        id: "i1",
        title: "Improved CTR increases revenue without increasing spend",
        description: "A 10% CTR lift across paid channels generates $22,400 in additional revenue at zero extra cost.",
      },
      {
        id: "i2",
        title: "Search campaigns gain the highest incremental revenue",
        description: "Search CTR improvements deliver the largest absolute revenue gain per impression.",
      },
      {
        id: "i3",
        title: "Display campaigns remain inefficient",
        description: "Even with CTR gains, Display ROAS stays below 2.5x — consider budget reallocation.",
      },
      {
        id: "i4",
        title: "Shopping campaigns benefit most from increased budget",
        description: "Product listing ad CTR improvements compound with high purchase intent.",
      },
      {
        id: "i5",
        title: "Pausing low-performing campaigns improves overall ROI",
        description: "CTR optimization on top performers yields better ROI than broad spend increases.",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Revenue Risk",
        status: "Low",
        description: "CTR improvements are incremental and reversible — low downside exposure.",
      },
      {
        id: "r2",
        title: "Budget Risk",
        status: "Low",
        description: "Zero additional spend required — no budget risk in this scenario.",
      },
      {
        id: "r3",
        title: "Forecast Reliability",
        status: "Medium",
        description: "CTR lift assumptions based on A/B test history; actual results may vary ±6%.",
      },
      {
        id: "r4",
        title: "Business Confidence",
        status: "Low",
        description: "Creative optimization is a proven lever with consistent historical performance.",
      },
    ],
    bottomSummary: {
      scenarioSelected: "Increase CTR by 10%",
      expectedRevenue: 306900,
      revenueIncrease: 22400,
      expectedRoi: 920,
      confidenceScore: 85,
      businessRecommendation:
        "MarketMind AI recommends prioritizing creative refresh on Google Search and Meta Ads. A 10% CTR improvement delivers $22,400 in incremental revenue with no additional spend — the highest ROI scenario available.",
    },
  },
  "improve-conversion": {
    kpis: {
      currentRevenue: 284500,
      simulatedRevenue: 320300,
      revenueIncrease: 35800,
      expectedRoi: 645,
      winningScenario: "Conversion Optimization",
      confidence: 90,
    },
    simulationResults: [
      { key: "revenue", label: "Revenue", current: 284500, simulated: 320300, format: "currency" },
      { key: "profit", label: "Profit", current: 68200, simulated: 86400, format: "currency" },
      { key: "roas", label: "ROAS", current: 4.2, simulated: 4.9, format: "multiplier" },
      { key: "roi", label: "ROI", current: 412, simulated: 645, format: "percent" },
      { key: "conversions", label: "Conversions", current: 4280, simulated: 4920, format: "number" },
      { key: "spend", label: "Spend", current: 67800, simulated: 69200, format: "currency" },
    ],
    revenueChart: buildRevenueChart(284500, 320300),
    channelImpact: [
      { channel: "Google Search", current: 85000, simulated: 98400 },
      { channel: "Meta Ads", current: 51500, simulated: 58600 },
      { channel: "Shopping", current: 35600, simulated: 42800 },
      { channel: "Display", current: 22200, simulated: 23400 },
      { channel: "Email", current: 32800, simulated: 38200 },
      { channel: "YouTube", current: 17400, simulated: 19800 },
    ],
    campaigns: buildCampaigns(
      [1.15, 1.18, 1.14, 1.12, 1.2, 1.05, 1.04, 1.16, 1.14, 1.12],
      [
        "Optimize landing pages",
        "Improve page speed",
        "Streamline checkout",
        "Add social proof",
        "Enhance product pages",
        "Improve landing experience",
        "Simplify form fields",
        "Personalize offers",
        "Automate follow-ups",
        "Add video testimonials",
      ],
      ["Increase", "Increase", "Increase", "Increase", "Increase", "Maintain", "Maintain", "Increase", "Increase", "Increase"],
      [640, 580, 460, 410, 620, 195, 110, 940, 780, 490],
    ),
    insights: [
      {
        id: "i1",
        title: "Conversion rate lift drives highest absolute revenue gain",
        description: "15% CVR improvement across channels adds $35,800 in revenue with minimal spend increase.",
      },
      {
        id: "i2",
        title: "Search campaigns gain the highest incremental revenue",
        description: "High-intent Search traffic converts at 18% higher rates with optimized landing pages.",
      },
      {
        id: "i3",
        title: "Shopping campaigns benefit most from increased budget",
        description: "Product page optimization lifts Shopping CVR by 20%, the largest channel improvement.",
      },
      {
        id: "i4",
        title: "Improved CTR increases revenue without increasing spend",
        description: "Better landing experiences reduce bounce rates, effectively increasing traffic value.",
      },
      {
        id: "i5",
        title: "Email lifecycle flows show strong conversion uplift",
        description: "Automated nurture sequences benefit most from checkout and form optimizations.",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Revenue Risk",
        status: "Low",
        description: "Conversion improvements are durable and compound over time with low reversal risk.",
      },
      {
        id: "r2",
        title: "Budget Risk",
        status: "Low",
        description: "Only $1,400 additional monthly spend needed for CRO tooling and testing.",
      },
      {
        id: "r3",
        title: "Forecast Reliability",
        status: "Low",
        description: "CVR scenarios achieve 90% backtest accuracy — highest among optimization levers.",
      },
      {
        id: "r4",
        title: "Business Confidence",
        status: "Low",
        description: "Strong confidence backed by existing A/B test data showing 12–18% CVR lifts.",
      },
    ],
    bottomSummary: {
      scenarioSelected: "Improve Conversion Rate by 15%",
      expectedRevenue: 320300,
      revenueIncrease: 35800,
      expectedRoi: 645,
      confidenceScore: 90,
      businessRecommendation:
        "MarketMind AI recommends investing in landing page optimization, checkout streamlining, and product page enhancements. A 15% conversion rate improvement delivers $35,800 in incremental revenue — the second-highest absolute gain among all scenarios.",
    },
  },
  "boost-revenue": {
    kpis: {
      currentRevenue: 284500,
      simulatedRevenue: 335700,
      revenueIncrease: 51200,
      expectedRoi: 498,
      winningScenario: "Aggressive Growth",
      confidence: 74,
    },
    simulationResults: [
      { key: "revenue", label: "Revenue", current: 284500, simulated: 335700, format: "currency" },
      { key: "profit", label: "Profit", current: 68200, simulated: 82800, format: "currency" },
      { key: "roas", label: "ROAS", current: 4.2, simulated: 4.6, format: "multiplier" },
      { key: "roi", label: "ROI", current: 412, simulated: 498, format: "percent" },
      { key: "conversions", label: "Conversions", current: 4280, simulated: 5040, format: "number" },
      { key: "spend", label: "Spend", current: 67800, simulated: 89200, format: "currency" },
    ],
    revenueChart: buildRevenueChart(284500, 335700),
    channelImpact: [
      { channel: "Google Search", current: 85000, simulated: 112400 },
      { channel: "Meta Ads", current: 51500, simulated: 62400 },
      { channel: "Shopping", current: 35600, simulated: 52800 },
      { channel: "Display", current: 22200, simulated: 18600 },
      { channel: "Email", current: 32800, simulated: 38400 },
      { channel: "YouTube", current: 17400, simulated: 24200 },
    ],
    campaigns: buildCampaigns(
      [1.32, 1.38, 1.22, 1.18, 1.48, 0.84, 0.78, 1.18, 1.16, 1.38],
      [
        "Scale budget 35%",
        "Scale budget 40%",
        "Increase budget 22%",
        "Increase budget 18%",
        "Scale budget 48%",
        "Reduce budget 16%",
        "Reduce budget 22%",
        "Increase sends 18%",
        "Expand automation",
        "Scale budget 38%",
      ],
      ["Increase", "Increase", "Increase", "Increase", "Increase", "Decrease", "Decrease", "Increase", "Increase", "Increase"],
      [520, 480, 380, 360, 560, 160, 90, 820, 680, 420],
    ),
    insights: [
      {
        id: "i1",
        title: "Aggressive scaling delivers highest revenue ceiling",
        description: "Combined budget increases and reallocation project $51,200 in additional annual revenue.",
      },
      {
        id: "i2",
        title: "Search campaigns gain the highest incremental revenue",
        description: "Search scaling accounts for 54% of total projected uplift in this growth scenario.",
      },
      {
        id: "i3",
        title: "Display campaigns remain inefficient",
        description: "Display receives reduced allocation despite overall budget growth — efficiency concerns persist.",
      },
      {
        id: "i4",
        title: "Shopping campaigns benefit most from increased budget",
        description: "48% Shopping budget increase yields projected 5.6x ROAS on incremental spend.",
      },
      {
        id: "i5",
        title: "Pausing low-performing campaigns improves overall ROI",
        description: "Even in growth mode, cutting Display waste improves capital efficiency.",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Revenue Risk",
        status: "Medium",
        description: "Aggressive scaling may hit diminishing returns — projected variance ±8.4%.",
      },
      {
        id: "r2",
        title: "Budget Risk",
        status: "High",
        description: "$21,400/month additional spend requires sustained cash flow and margin support.",
      },
      {
        id: "r3",
        title: "Forecast Reliability",
        status: "Medium",
        description: "Growth scenarios have 74% accuracy due to auction dynamics and competitive response.",
      },
      {
        id: "r4",
        title: "Business Confidence",
        status: "Medium",
        description: "Moderate confidence — high reward potential balanced against scaling risk.",
      },
    ],
    bottomSummary: {
      scenarioSelected: "Boost Revenue Target",
      expectedRevenue: 335700,
      revenueIncrease: 51200,
      expectedRoi: 498,
      confidenceScore: 74,
      businessRecommendation:
        "MarketMind AI recommends an aggressive growth plan scaling Search and Shopping budgets by 35–48% while cutting Display waste. This scenario targets the highest absolute revenue gain ($51,200) but carries elevated budget risk — proceed with phased rollout.",
    },
  },
};

export const defaultScenarioId: ScenarioId = "increase-budget";

export function getScenarioData(id: ScenarioId): ScenarioData {
  const definition = scenarioDefinitions[id];
  return { id, ...definition };
}

export function getScenarioApiResponse(id: ScenarioId = defaultScenarioId): ScenarioApiResponse {
  return {
    ...getScenarioData(id),
    options: scenarioOptions,
  };
}

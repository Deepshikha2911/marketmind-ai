"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  DollarSign,
  Eye,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AnalysisKpis } from "@/lib/analysis-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

type AnalysisKpiCardsProps = {
  kpis: AnalysisKpis;
};

const kpiConfig = [
  {
    key: "revenue" as const,
    title: "Revenue",
    icon: DollarSign,
    format: (k: AnalysisKpis) => formatCurrency(k.revenue),
    accent: "text-emerald-400 bg-emerald-500/15",
  },
  {
    key: "spend" as const,
    title: "Spend",
    icon: Wallet,
    format: (k: AnalysisKpis) => formatCurrency(k.spend),
    accent: "text-rose-400 bg-rose-500/15",
  },
  {
    key: "roi" as const,
    title: "ROI",
    icon: TrendingUp,
    format: (k: AnalysisKpis) => `${k.roi}%`,
    accent: "text-cyan-400 bg-cyan-500/15",
  },
  {
    key: "roas" as const,
    title: "ROAS",
    icon: Target,
    format: (k: AnalysisKpis) => `${k.roas.toFixed(2)}x`,
    accent: "text-indigo-400 bg-indigo-500/15",
  },
  {
    key: "ctr" as const,
    title: "CTR",
    icon: MousePointerClick,
    format: (k: AnalysisKpis) => formatPercent(k.ctr),
    accent: "text-violet-400 bg-violet-500/15",
  },
  {
    key: "conversions" as const,
    title: "Conversions",
    icon: Zap,
    format: (k: AnalysisKpis) => formatNumber(k.conversions),
    accent: "text-emerald-400 bg-emerald-500/15",
  },
  {
    key: "cpc" as const,
    title: "CPC",
    icon: BarChart3,
    format: (k: AnalysisKpis) => `$${k.cpc.toFixed(2)}`,
    accent: "text-amber-400 bg-amber-500/15",
  },
  {
    key: "cpm" as const,
    title: "CPM",
    icon: Eye,
    format: (k: AnalysisKpis) => `$${k.cpm.toFixed(2)}`,
    accent: "text-cyan-400 bg-cyan-500/15",
  },
  {
    key: "predictionAccuracy" as const,
    title: "Prediction Accuracy",
    icon: Activity,
    format: (k: AnalysisKpis) => formatPercent(k.predictionAccuracy),
    accent: "text-indigo-400 bg-indigo-500/15",
  },
  {
    key: "forecastConfidence" as const,
    title: "Forecast Confidence",
    icon: ShieldCheck,
    format: (k: AnalysisKpis) => formatPercent(k.forecastConfidence, 0),
    accent: "text-violet-400 bg-violet-500/15",
  },
  {
    key: "optimizationScore" as const,
    title: "Optimization Score",
    icon: Sparkles,
    format: (k: AnalysisKpis) => `${k.optimizationScore}/100`,
    accent: "text-cyan-400 bg-cyan-500/15",
  },
  {
    key: "businessHealthScore" as const,
    title: "Business Health Score",
    icon: TrendingUp,
    format: (k: AnalysisKpis) => `${k.businessHealthScore}/100`,
    accent: "text-emerald-400 bg-emerald-500/15",
  },
];

export function AnalysisKpiCards({ kpis }: AnalysisKpiCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {kpiConfig.map(({ key, title, icon: Icon, format, accent }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
        >
        <GlassCard
          className="group flex h-full flex-col p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 sm:p-5"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${accent}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="mt-3 flex flex-1 flex-col">
            <p className="text-xs text-slate-400 sm:text-sm">{title}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              {format(kpis)}
            </p>
          </div>
        </GlassCard>
        </motion.div>
      ))}
    </section>
  );
}

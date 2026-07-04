import { Brain, LineChart, ShieldCheck, Target } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PredictionInsights } from "@/lib/insights-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

type PredictionInsightsCardsProps = {
  prediction: PredictionInsights;
};

const cards = [
  {
    key: "averagePredictedRevenue" as const,
    title: "Average Predicted Revenue",
    icon: Target,
    format: (p: PredictionInsights) => formatCurrency(p.averagePredictedRevenue),
  },
  {
    key: "predictionAccuracy" as const,
    title: "Prediction Accuracy",
    icon: ShieldCheck,
    format: (p: PredictionInsights) => formatPercent(p.predictionAccuracy),
  },
  {
    key: "confidence" as const,
    title: "Confidence",
    icon: Brain,
    format: (p: PredictionInsights) => formatPercent(p.confidence),
  },
];

export function PredictionInsightsCards({ prediction }: PredictionInsightsCardsProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Prediction Insights</h2>
        <p className="mt-1 text-sm text-slate-400">AI forecast metrics and model confidence</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, title, icon: Icon, format }) => (
          <GlassCard
            key={key}
            className="flex h-full flex-col p-5 transition-all duration-300 hover:border-violet-500/30 sm:p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-slate-400">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{format(prediction)}</p>
            {key === "confidence" && (
              <progress
                value={prediction.confidence}
                max={100}
                className="upload-progress mt-4 h-2 w-full"
              />
            )}
          </GlassCard>
        ))}

        <GlassCard className="flex h-full flex-col border-violet-500/20 bg-violet-500/5 p-5 sm:col-span-2 sm:p-6 xl:col-span-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
            <LineChart className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-400">Forecast Summary</p>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
            {prediction.forecastSummary}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

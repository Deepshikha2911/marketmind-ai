import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ForecastRisk, RiskLevel } from "@/lib/forecast-data";
import { cn } from "@/lib/utils";

type RiskAnalysisProps = {
  risks: ForecastRisk[];
};

const riskConfig: Record<
  RiskLevel,
  { variant: "high" | "medium" | "low"; border: string; icon: typeof ShieldAlert }
> = {
  High: {
    variant: "high",
    border: "border-rose-500/20 hover:border-rose-500/35",
    icon: AlertTriangle,
  },
  Medium: {
    variant: "medium",
    border: "border-amber-500/15 hover:border-amber-500/30",
    icon: ShieldAlert,
  },
  Low: {
    variant: "low",
    border: "border-emerald-500/15 hover:border-emerald-500/30",
    icon: ShieldCheck,
  },
};

export function RiskAnalysis({ risks }: RiskAnalysisProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Risk Analysis</h2>
        <p className="mt-1 text-sm text-slate-400">
          Identified risks that may impact forecast accuracy
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {risks.map((risk) => {
          const config = riskConfig[risk.level];
          const RiskIcon = config.icon;

          return (
            <GlassCard
              key={risk.id}
              className={cn(
                "flex h-full flex-col border p-5 transition-all duration-300 hover:shadow-lg sm:p-6",
                config.border,
              )}
            >
              <div className="flex items-center gap-2">
                <Badge variant={config.variant} className="gap-1">
                  <RiskIcon className="h-3 w-3" />
                  {risk.level} Risk
                </Badge>
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">{risk.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                {risk.explanation}
              </p>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

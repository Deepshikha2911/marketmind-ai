import { Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const tips = [
  "Use Google Ads or Meta Ads exports.",
  "Ensure campaign dates are present.",
  "Larger datasets improve forecasting accuracy.",
];

export function TipsCard() {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Tips</h3>
          <p className="mt-1 text-sm text-slate-400">
            Get the best results from your upload
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-slate-300"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            {tip}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

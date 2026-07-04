import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const requirements = [
  "CSV format only",
  "Maximum size: 100 MB",
  "UTF-8 Encoding",
  "Required columns will be validated automatically",
  "Missing values handled automatically",
];

export function RequirementsCard() {
  return (
    <GlassCard className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-white">Dataset Requirements</h3>
      <p className="mt-1 text-sm text-slate-400">
        Ensure your file meets these specifications before uploading
      </p>

      <ul className="mt-5 space-y-3">
        {requirements.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
              <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
            </span>
            <span className="text-sm leading-relaxed text-slate-300">{item}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

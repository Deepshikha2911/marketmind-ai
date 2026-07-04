import { UPLOAD_PROGRESS_STEPS } from "@/lib/upload-data";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

type UploadProgressProps = {
  progress: number;
  isActive: boolean;
};

function getCurrentStepIndex(progress: number) {
  return UPLOAD_PROGRESS_STEPS.findIndex((step) => progress < step.threshold);
}

export function UploadProgress({ progress, isActive }: UploadProgressProps) {
  const currentIndex =
    progress >= 100
      ? UPLOAD_PROGRESS_STEPS.length - 1
      : Math.max(getCurrentStepIndex(progress), 0);

  if (!isActive && progress === 0) {
    return null;
  }

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">Upload Progress</h3>
          <p className="mt-1 text-sm text-slate-400">
            {isActive ? "Processing your dataset..." : "Upload complete"}
          </p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-indigo-400">
          {Math.round(progress)}%
        </span>
      </div>

      <progress
        value={progress}
        max={100}
        className={cn(
          "upload-progress h-2 w-full",
          isActive && "animate-pulse",
        )}
      />

      <ol className="mt-6 space-y-3">
        {UPLOAD_PROGRESS_STEPS.map((step, index) => {
          const isComplete = progress >= step.threshold;
          const isCurrent = index === currentIndex && isActive;

          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300",
                isCurrent && "bg-indigo-500/10",
                isComplete && !isCurrent && "opacity-80",
                !isComplete && !isCurrent && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isComplete
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isCurrent
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-white/5 text-slate-500",
                )}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isComplete || isCurrent ? "text-slate-200" : "text-slate-500",
                )}
              >
                {step.label}
              </span>
              {isCurrent && (
                <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
              )}
            </li>
          );
        })}
      </ol>
    </GlassCard>
  );
}

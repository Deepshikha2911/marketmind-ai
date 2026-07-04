import { cn } from "@/lib/utils";

type EmptyStateProps = {
  message?: string;
  className?: string;
};

export function EmptyState({ message = "No data available", className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center",
        className,
      )}
    >
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

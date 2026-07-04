import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/25",
  high: "bg-rose-500/15 text-rose-400 ring-rose-500/25",
  medium: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
  low: "bg-slate-500/15 text-slate-300 ring-slate-500/25",
  cyan: "bg-cyan-500/15 text-cyan-400 ring-cyan-500/25",
  success: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

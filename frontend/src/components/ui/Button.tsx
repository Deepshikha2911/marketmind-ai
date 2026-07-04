import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:opacity-90",
  secondary:
    "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white",
  outline:
    "border border-white/10 bg-transparent text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white",
  ghost: "text-slate-400 hover:bg-white/10 hover:text-white",
};

const sizes = {
  default: "h-10 px-5 py-2.5 text-sm",
  sm: "h-9 rounded-lg px-4 text-xs",
  lg: "h-11 rounded-xl px-6 text-sm",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

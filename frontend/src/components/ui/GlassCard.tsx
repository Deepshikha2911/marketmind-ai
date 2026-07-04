import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
};

export function GlassCard({ children, className, strong = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-xl shadow-black/10",
        strong ? "glass-panel-strong" : "glass-panel",
        className,
      )}
    >
      {children}
    </div>
  );
}

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/10", className)} />;
}

export function ScenarioPageSkeleton() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GlassCard key={i} className="p-4 sm:p-5">
            <SkeletonBar className="h-9 w-9 rounded-xl" />
            <SkeletonBar className="mt-3 h-4 w-24" />
            <SkeletonBar className="mt-2 h-6 w-32" />
          </GlassCard>
        ))}
      </div>

      <div>
        <SkeletonBar className="h-6 w-48" />
        <SkeletonBar className="mt-2 h-4 w-72" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i} className="p-5 sm:p-6">
              <SkeletonBar className="h-5 w-40" />
              <SkeletonBar className="mt-3 h-4 w-full" />
              <SkeletonBar className="mt-4 h-8 w-28" />
            </GlassCard>
          ))}
        </div>
      </div>

      <ScenarioResultsSkeleton />
    </div>
  );
}

export function ScenarioResultsSkeleton() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <GlassCard key={i} className="p-5 sm:p-6">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="mt-3 h-8 w-36" />
            <SkeletonBar className="mt-2 h-4 w-28" />
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GlassCard className="p-5 sm:p-6">
          <SkeletonBar className="h-5 w-44" />
          <SkeletonBar className="mt-6 h-64 w-full rounded-xl" />
        </GlassCard>
        <GlassCard className="p-5 sm:p-6">
          <SkeletonBar className="h-5 w-40" />
          <SkeletonBar className="mt-6 h-64 w-full rounded-xl" />
        </GlassCard>
      </div>

      <GlassCard className="p-5 sm:p-6">
        <SkeletonBar className="h-5 w-36" />
        <SkeletonBar className="mt-6 h-48 w-full rounded-xl" />
      </GlassCard>
    </div>
  );
}

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/10", className)} />;
}

export function UploadPageSkeleton() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <GlassCard className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4 sm:px-6">
              <SkeletonBar className="h-5 w-40" />
              <SkeletonBar className="mt-2 h-4 w-64" />
            </div>
            <div className="p-5 sm:p-6">
              <SkeletonBar className="h-56 w-full rounded-2xl" />
            </div>
          </GlassCard>
          <GlassCard className="p-5 sm:p-6">
            <SkeletonBar className="h-5 w-36" />
            <SkeletonBar className="mt-2 h-4 w-52" />
            <SkeletonBar className="mt-6 h-2 w-full rounded-full" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBar key={index} className="h-10 w-full" />
              ))}
            </div>
          </GlassCard>
        </div>
        <div className="space-y-6">
          <GlassCard className="p-5 sm:p-6">
            <SkeletonBar className="h-5 w-44" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBar key={index} className="h-4 w-full" />
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-5 sm:p-6">
            <SkeletonBar className="h-5 w-20" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBar key={index} className="h-12 w-full" />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
      <GlassCard className="overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <SkeletonBar className="h-5 w-32" />
        </div>
        <div className="space-y-4 p-5 sm:p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBar key={index} className="h-10 w-full" />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

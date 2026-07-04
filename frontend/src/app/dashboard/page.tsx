import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { SpendChart } from "@/components/dashboard/SpendChart";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  aiInsights,
  kpiMetrics,
  recentUploads,
  revenueTrend,
  spendVsRevenue,
} from "@/lib/dashboard-data";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your marketing performance"
    >
      <div className="space-y-6 lg:space-y-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RevenueChart data={revenueTrend} />
          <SpendChart data={spendVsRevenue} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentUploads uploads={recentUploads} />
          </div>
          <AIInsightCard insights={aiInsights} />
        </section>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { SpendChart } from "@/components/dashboard/SpendChart";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getDashboard } from "@/lib/dashboard-service";
import type { KpiMetric } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [spendVsRevenue, setSpendVsRevenue] = useState<any[]>([]);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboard();
        console.log("Dashboard API result:", data);

        if (!mounted) return;

        const summary = data.summary ?? {};

        const kpiArray: KpiMetric[] = [
          {
            id: "revenue",
            title: "Total Revenue",
            value: summary.totalRevenue !== undefined && summary.totalRevenue !== null ? formatCurrency(summary.totalRevenue) : null,
            change: null,
            trend: null,
            description: "",
          },
          {
            id: "spend",
            title: "Ad Spend",
            value: summary.totalSpend !== undefined && summary.totalSpend !== null ? formatCurrency(summary.totalSpend) : null,
            change: null,
            trend: null,
            description: "",
          },
          {
            id: "roas",
            title: "ROAS",
            value: summary.roas !== undefined && summary.roas !== null ? String(summary.roas.toFixed(2)) : null,
            change: null,
            trend: null,
            description: "",
          },
          {
            id: "conversions",
            title: "Conversions",
            value: summary.conversions !== undefined && summary.conversions !== null ? String(summary.conversions) : null,
            change: null,
            trend: null,
            description: "",
          },
        ];

        setKpis(kpiArray);
        setRevenueTrend(data.revenueTrend ?? []);
        setSpendVsRevenue(data.spendRevenue ?? []);
        setRecentUploads((data.recentUploads || []).map((u: any) => ({
          id: u.id,
          name: u.originalFilename,
          uploadedAt: u.uploadDate,
          size: `${Math.round((u.fileSize ?? 0) / 1024)} KB`,
          status: u.status,
        })));

        setInsights((data.topInsights || []).map((ins: any) => ({
          id: ins.id,
          title: ins.title,
          description: ins.description,
          tag: ins.priority ?? "",
          confidence: ins.impact ? Math.round(Math.min(100, Math.abs(ins.impact))) : 0,
        })));
      } catch (err: any) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your marketing performance"
    >
      <div className="space-y-6 lg:space-y-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(loading ? Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} metric={{ id: String(i), title: "", value: null, change: null, trend: null, description: "" }} />
          )) : kpis.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          )))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RevenueChart data={revenueTrend} />
          <SpendChart data={spendVsRevenue} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentUploads uploads={recentUploads} />
          </div>
          <AIInsightCard insights={insights} />
        </section>
      </div>
    </DashboardLayout>
  );
}

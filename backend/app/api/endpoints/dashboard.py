from pathlib import Path
from datetime import datetime
import json

import pandas as pd
from fastapi import APIRouter, HTTPException

from backend.app.schemas.dashboard import DashboardResponse, DatasetInfo, RevenuePoint, SpendRevenuePoint, InsightItem
from backend.app.services.upload_service import UploadService
from backend.app.services.insight_service import InsightService

router = APIRouter()

upload_service = UploadService()
insight_service = InsightService()


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard():
    print("[dashboard] GET /api/dashboard invoked")
    current = upload_service.get_current()
    history = upload_service.get_history()

    recent_uploads = [
        DatasetInfo(
            id=item.id,
            originalFilename=item.originalFilename,
            storedFilename=item.storedFilename,
            uploadTimestamp=item.uploadTimestamp,
            uploadDate=item.uploadDate,
            fileSize=item.fileSize,
            rows=item.rows,
            columns=item.columns,
            status=item.status,
        )
        for item in history
    ]

    if current is None:
        print("[dashboard] No current upload found")
        # empty state — return base structure
        resp = DashboardResponse(
            dataset=None,
            summary={},
            revenueTrend=[],
            spendRevenue=[],
            recentUploads=recent_uploads,
            topInsights=[],
        )
        print("[dashboard] response:", resp.json())
        return resp

    file_path = Path("uploads") / current.storedFilename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded dataset not found.")

    try:
        print(f"[dashboard] Attempting to read dataset from: {file_path}")
        df = pd.read_csv(file_path)
        print("[dashboard] df.head():\n", df.head())
        print("[dashboard] df.columns:\n", list(df.columns))
        print("[dashboard] df.shape:\n", df.shape)
    except Exception as exc:
        print("[dashboard] Failed to read CSV:", exc)
        raise HTTPException(status_code=400, detail=f"Unable to parse CSV file: {exc}")

    # Robust column detection helpers
    cols_lower = {c.lower(): c for c in df.columns}

    def find_col(keywords: list[str]) -> str | None:
        for k in keywords:
            for low, orig in cols_lower.items():
                if k in low:
                    return orig
        return None

    date_col = find_col(["date", "timeperiod", "period", "day"]) or None

    revenue_col = find_col(["conversion_value", "revenue", "revenue_value", "metrics_conversions_value", "value"])
    spend_col = find_col(["cost", "spend", "ad_spend", "amount", "metrics_cost_micros"])
    conv_col = find_col(["conversions", "conversion", "metrics_conversions", "orders"]) 

    def sum_col(col_name: str | None) -> float:
        if not col_name or col_name not in df.columns:
            return 0.0
        series = df[col_name]
        # If column name suggests micros, scale down
        if "micros" in col_name.lower():
            try:
                return float(series.dropna().astype(float).sum() / 1_000_000)
            except Exception:
                return 0.0
        try:
            return float(series.dropna().astype(float).sum())
        except Exception:
            return 0.0

    total_revenue = sum_col(revenue_col) if revenue_col else (sum_col(conv_col) if conv_col else 0.0)
    total_spend = sum_col(spend_col)
    total_conversions = int(sum_col(conv_col)) if conv_col else 0
    roas = float(total_revenue / total_spend) if total_spend else 0.0

    # Monthly grouping (attempt from CSV, fallback to persisted metadata)
    revenue_trend: list[RevenuePoint] = []
    spend_revenue: list[SpendRevenuePoint] = []

    def build_monthly_from_df():
        nonlocal revenue_trend, spend_revenue
        if not date_col or date_col not in df.columns:
            return
        try:
            dates = pd.to_datetime(df[date_col], errors="coerce")
            df_dates = df.copy()
            df_dates["__date"] = dates
            df_dates = df_dates.dropna(subset=["__date"])
            if df_dates.empty:
                return
            df_dates["month"] = df_dates["__date"].dt.to_period("M").dt.to_timestamp()
            grp = df_dates.groupby("month", as_index=False)
            for month, group in grp:
                month_label = month.strftime("%b %Y") if hasattr(month, "strftime") else str(month)

                # revenue per group
                rev = 0.0
                if revenue_col and revenue_col in group.columns:
                    try:
                        if "micros" in revenue_col.lower():
                            rev = float(group[revenue_col].dropna().astype(float).sum() / 1_000_000)
                        else:
                            rev = float(group[revenue_col].dropna().astype(float).sum())
                    except Exception:
                        rev = 0.0
                elif conv_col and conv_col in group.columns:
                    try:
                        rev = float(group[conv_col].dropna().astype(float).sum())
                    except Exception:
                        rev = 0.0

                # compute spend per group
                spd = 0.0
                if spend_col and spend_col in group.columns:
                    try:
                        if "micros" in spend_col.lower():
                            spd = float(group[spend_col].dropna().astype(float).sum() / 1_000_000)
                        else:
                            spd = float(group[spend_col].dropna().astype(float).sum())
                    except Exception:
                        spd = 0.0
                revenue_trend.append(RevenuePoint(month=month_label, revenue=rev))
                spend_revenue.append(SpendRevenuePoint(month=month_label, revenue=rev, spend=spd))
        except Exception as exc:
            print("[dashboard] Error building monthly trend:", exc)

    build_monthly_from_df()

    # Top insights — prefer reuse of metadata generated at upload time
    top_insights = []
    meta_file = Path("uploads") / f"{current.storedFilename}.meta.json"
    if meta_file.exists():
        try:
            with meta_file.open("r", encoding="utf-8") as mh:
                meta = json.load(mh)

            raw_insights = meta.get("insights", {}) if isinstance(meta, dict) else {}

            # If insights were stored as a list of dicts, reuse directly
            if isinstance(raw_insights, list):
                for ins in raw_insights[:4]:
                    if not isinstance(ins, dict):
                        continue
                    top_insights.append(
                        InsightItem(
                            id=str(ins.get("id", "")),
                            priority=ins.get("priority"),
                            title=ins.get("title", "Insight"),
                            description=ins.get("explanation") or ins.get("description"),
                            impact=float(ins.get("estimatedRevenueGain", 0.0)) if ins.get("estimatedRevenueGain") is not None else None,
                        )
                    )

            # If insights were stored as a dict (legacy/structured), synthesize up to 4 summary items
            elif isinstance(raw_insights, dict):
                candidates: list[dict] = []

                ai = raw_insights.get("ai_summary")
                if isinstance(ai, dict):
                    candidates.append({
                        "id": "ai_summary",
                        "title": "AI Summary",
                        "description": ai.get("summary"),
                    })

                budget = raw_insights.get("budget_insights")
                if isinstance(budget, dict):
                    desc = f"Total revenue: {budget.get('total_revenue')} | Total spend: {budget.get('total_spend')}"
                    candidates.append({"id": "budget_insights", "title": "Budget Insights", "description": desc})

                summary_list = raw_insights.get("summary")
                if isinstance(summary_list, list):
                    for i, s in enumerate(summary_list):
                        candidates.append({"id": f"summary_{i}", "title": "Summary", "description": str(s)})

                at_risk = raw_insights.get("at_risk_campaigns")
                if isinstance(at_risk, list) and len(at_risk) > 0:
                    first = at_risk[0]
                    if isinstance(first, dict):
                        candidates.append({
                            "id": "at_risk_0",
                            "title": f"At-risk: {first.get('campaign')}",
                            "description": first.get("reason"),
                            "impact": float(first.get("roi", 0.0)) if first.get("roi") is not None else None,
                        })

                for ins in candidates[:4]:
                    top_insights.append(
                        InsightItem(
                            id=str(ins.get("id", "")),
                            priority=ins.get("priority"),
                            title=ins.get("title", "Insight"),
                            description=ins.get("description"),
                            impact=float(ins.get("impact")) if ins.get("impact") is not None else None,
                        )
                    )

            print(f"[dashboard] Reused {len(top_insights)} insights from metadata: {meta_file}")
        except Exception as exc:
            print("[dashboard] Failed to load insights from metadata:", exc)
            top_insights = []
    else:
        print("[dashboard] No metadata insights found; skipping regeneration per policy")

    # If we couldn't build monthly series from CSV, try to reuse persisted trend data in metadata
    if not revenue_trend and meta_file.exists():
        try:
            trend = meta.get("insights", {}).get("trend_analysis", {}).get("series") if isinstance(meta, dict) else None
            if isinstance(trend, list) and len(trend) > 0:
                for item in trend:
                    label = item.get("label")
                    # convert label like '2024-05' to 'May 2024' when possible
                    try:
                        ts = pd.to_datetime(label)
                        month_label = ts.strftime("%b %Y")
                    except Exception:
                        month_label = str(label)
                    rev = float(item.get("actual_revenue", 0.0)) if isinstance(item, dict) else 0.0
                    revenue_trend.append(RevenuePoint(month=month_label, revenue=rev))
                # spend not available in trend_analysis; attempt to derive per-month spend from roi_series if present
                roi_series = meta.get("insights", {}).get("roi_series", []) if isinstance(meta, dict) else []
                for i, item in enumerate(revenue_trend):
                    spd = 0.0
                    if i < len(roi_series) and isinstance(roi_series[i], dict):
                        roi_val = roi_series[i].get("value")
                        if roi_val:
                            # if ROI is non-zero, estimate spend = revenue / (roi/100) if roi expressed as percent
                            try:
                                est = float(item.revenue) / (float(roi_val) / 100.0)
                                spd = est
                            except Exception:
                                spd = 0.0
                    spend_revenue.append(SpendRevenuePoint(month=item.month, revenue=item.revenue, spend=spd))
                print(f"[dashboard] Built monthly series from persisted metadata: {meta_file}")
        except Exception as exc:
            print("[dashboard] Failed to build trend from metadata:", exc)

    dataset_info = {
        "id": current.id,
        "originalFilename": current.originalFilename,
        "storedFilename": current.storedFilename,
        "uploadTimestamp": current.uploadTimestamp,
        "uploadDate": current.uploadDate,
        "fileSize": current.fileSize,
        "rows": current.rows,
        "columns": current.columns,
        "status": current.status,
    }

    summary = {
        "totalRevenue": total_revenue,
        "totalSpend": total_spend,
        "roas": roas,
        "conversions": total_conversions,
        "datasetName": current.originalFilename,
        "rows": current.rows,
        "columns": current.columns,
    }

    response = DashboardResponse(
        dataset=dataset_info,
        summary=summary,
        revenueTrend=revenue_trend,
        spendRevenue=spend_revenue,
        recentUploads=recent_uploads,
        topInsights=top_insights,
    )

    try:
        print("[dashboard] response:", response.json())
    except Exception:
        print("[dashboard] response constructed (unable to JSON-serialize for print)")

    return response

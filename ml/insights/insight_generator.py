import logging
from typing import Any, Dict, List

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class InsightGenerator:
    """Generate a BI-style insights payload from a marketing dataset."""

    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe.copy()
        self.insights: Dict[str, Any] = {}
        self.summary: List[str] = []

    @staticmethod
    def safe_divide(numerator, denominator):
        if isinstance(denominator, pd.Series):
            denominator = denominator.replace(0, np.nan)
        return (numerator / denominator).fillna(0)

    def ensure_columns(self):
        defaults = {
            "campaign_name": "Unknown",
            "campaign_id": 0,
            "date": pd.NaT,
            "spend": 0,
            "revenue": 0,
            "predicted_revenue": 0,
            "clicks": 0,
            "impressions": 0,
            "conversions": 0,
            "daily_budget": 0,
        }
        for column, default in defaults.items():
            if column not in self.df.columns:
                logger.warning(f"{column} missing.")
                self.df[column] = default

    def prepare_dates(self):
        self.df["date"] = pd.to_datetime(self.df["date"], errors="coerce")
        if self.df["date"].notna().any():
            self.df = self.df.sort_values("date").reset_index(drop=True)

    def calculate_metrics(self):
        self.df["ctr"] = self.safe_divide(self.df["clicks"], self.df["impressions"])
        self.df["cpc"] = self.safe_divide(self.df["spend"], self.df["clicks"])
        self.df["cpm"] = self.safe_divide(self.df["spend"] * 1000, self.df["impressions"])
        self.df["conversion_rate"] = self.safe_divide(self.df["conversions"], self.df["clicks"])
        self.df["roi"] = self.safe_divide(self.df["revenue"] - self.df["spend"], self.df["spend"])
        self.df["roas"] = self.safe_divide(self.df["revenue"], self.df["spend"])
        self.df["profit"] = self.df["revenue"] - self.df["spend"]
        self.df["budget_utilization"] = self.safe_divide(self.df["spend"], self.df["daily_budget"])

    def _numeric(self, value: Any) -> float:
        return round(float(value), 4) if pd.notna(value) else 0.0

    def build_trend_analysis(self) -> Dict[str, Any]:
        if self.df["date"].notna().any():
            grouped = (
                self.df.dropna(subset=["date"])
                .groupby("date", as_index=False)
                .agg(
                    actual_revenue=("revenue", "sum"),
                    spend=("spend", "sum"),
                    clicks=("clicks", "sum"),
                    conversions=("conversions", "sum"),
                    predicted_revenue=("predicted_revenue", "sum"),
                )
            )
            grouped = grouped.sort_values("date").reset_index(drop=True)
            grouped["roi"] = self.safe_divide(grouped["actual_revenue"] - grouped["spend"], grouped["spend"])
            grouped["ctr"] = self.safe_divide(grouped["clicks"], grouped["clicks"].replace(0, np.nan))
            grouped["ctr"] = grouped["ctr"].fillna(0)
            grouped["conversion_rate"] = self.safe_divide(grouped["conversions"], grouped["clicks"])
            grouped = grouped.copy()
            grouped["date_label"] = grouped["date"].dt.strftime("%Y-%m-%d")
            if len(grouped) > 12:
                grouped = (
                    grouped.groupby(grouped["date"].dt.to_period("M"))
                    .agg(
                        actual_revenue=("actual_revenue", "sum"),
                        predicted_revenue=("predicted_revenue", "sum"),
                        spend=("spend", "sum"),
                        clicks=("clicks", "sum"),
                        conversions=("conversions", "sum"),
                    )
                    .reset_index()
                )
                grouped["date_label"] = grouped["date"].astype(str)
            grouped["roi"] = self.safe_divide(grouped["actual_revenue"] - grouped["spend"], grouped["spend"])
            grouped["ctr"] = self.safe_divide(grouped["clicks"], grouped["clicks"].replace(0, np.nan)).fillna(0)
            grouped["conversion_rate"] = self.safe_divide(grouped["conversions"], grouped["clicks"])
            group_records = grouped.to_dict("records")
            series = [
                {
                    "label": str(record["date_label"]),
                    "actual_revenue": self._numeric(record["actual_revenue"]),
                    "predicted_revenue": self._numeric(record["predicted_revenue"]),
                }
                for record in group_records
            ]
            return {
                "series": series,
                "roi_series": [
                    {
                        "label": str(record["date_label"]),
                        "value": self._numeric(record["roi"] * 100),
                    }
                    for record in group_records
                ],
                "ctr_series": [
                    {
                        "label": str(record["date_label"]),
                        "value": self._numeric(record["ctr"] * 100),
                    }
                    for record in group_records
                ],
                "conversion_series": [
                    {
                        "label": str(record["date_label"]),
                        "value": self._numeric(record["conversion_rate"] * 100),
                    }
                    for record in group_records
                ],
            }
        return {"series": [], "roi_series": [], "ctr_series": [], "conversion_series": []}

    def build_budget_insights(self) -> Dict[str, Any]:
        grouped = (
            self.df.groupby("campaign_name", as_index=False)
            .agg(spend=("spend", "sum"), revenue=("revenue", "sum"), clicks=("clicks", "sum"), impressions=("impressions", "sum"), conversions=("conversions", "sum"))
        )
        grouped["profit"] = grouped["revenue"] - grouped["spend"]
        grouped["roi"] = self.safe_divide(grouped["profit"], grouped["spend"])
        grouped["ctr"] = self.safe_divide(grouped["clicks"], grouped["impressions"])
        grouped["conversion_rate"] = self.safe_divide(grouped["conversions"], grouped["clicks"])
        grouped["roas"] = self.safe_divide(grouped["revenue"], grouped["spend"])

        avg_spend = grouped["spend"].mean()
        avg_roi = grouped["roi"].mean()
        avg_roas = grouped["roas"].mean()
        avg_ctr = grouped["ctr"].mean()
        avg_conversion = grouped["conversion_rate"].mean()
        overspending = grouped[(grouped["spend"] > avg_spend) & (grouped["roi"] < avg_roi)].sort_values("roi")
        top_overspending = overspending.head(5)
        underutilized = grouped[(grouped["spend"] < avg_spend) & (grouped["roi"] > avg_roi)].sort_values(["roi", "spend"], ascending=[False, True])

        recommended_budget_increase = 0.0
        extra_revenue = 0.0
        if not underutilized.empty:
            candidate = underutilized.iloc[0]
            recommended_budget_increase = self._numeric(candidate["spend"] * 0.2)
            extra_revenue = self._numeric(candidate["revenue"] * 0.15)

        score = round(min(100, max(0, (avg_roi * 100) + (avg_ctr * 200) + (avg_conversion * 200) + (avg_roas * 10) + 10)))

        return {
            "total_spend": self._numeric(grouped["spend"].sum()),
            "total_revenue": self._numeric(grouped["revenue"].sum()),
            "average_roi": self._numeric(avg_roi * 100),
            "average_roas": self._numeric(avg_roas),
            "average_ctr": self._numeric(avg_ctr * 100),
            "average_conversion_rate": self._numeric(avg_conversion * 100),
            "overspending_campaigns": [
                {
                    "campaign": row["campaign_name"],
                    "spend": self._numeric(row["spend"]),
                    "revenue": self._numeric(row["revenue"]),
                    "roi": self._numeric(row["roi"] * 100),
                    "status": "Over Budget" if row["spend"] > avg_spend else "Monitor",
                    "reason": "High spend with below-average ROI" if row["roi"] < avg_roi else "Below-average efficiency",
                }
                for _, row in top_overspending.iterrows()
            ],
            "underutilized_budget": {
                "campaign": underutilized.iloc[0]["campaign_name"] if not underutilized.empty else "N/A",
                "recommended_budget_increase": recommended_budget_increase,
                "estimated_extra_revenue": extra_revenue,
            },
            "budget_efficiency_score": int(score)
        }

    def build_at_risk_campaigns(self) -> List[Dict[str, Any]]:
        grouped = (
            self.df.groupby("campaign_name", as_index=False)
            .agg(spend=("spend", "sum"), revenue=("revenue", "sum"), clicks=("clicks", "sum"), impressions=("impressions", "sum"), conversions=("conversions", "sum"))
        )
        grouped["profit"] = grouped["revenue"] - grouped["spend"]
        grouped["roi"] = self.safe_divide(grouped["profit"], grouped["spend"])
        grouped["ctr"] = self.safe_divide(grouped["clicks"], grouped["impressions"])
        grouped["conversion_rate"] = self.safe_divide(grouped["conversions"], grouped["clicks"])
        avg_roi = grouped["roi"].mean()
        avg_ctr = grouped["ctr"].mean()
        avg_conversion = grouped["conversion_rate"].mean()
        risky = []
        for _, row in grouped.iterrows():
            reasons = []
            if row["roi"] < avg_roi:
                reasons.append("ROI below average")
            if row["ctr"] < avg_ctr:
                reasons.append("CTR below average")
            if row["conversion_rate"] < avg_conversion:
                reasons.append("Conversion rate below average")
            if row["spend"] > grouped["spend"].mean() and row["roi"] < avg_roi:
                reasons.append("High spend with low ROI")
            if reasons:
                risky.append({
                    "campaign": row["campaign_name"],
                    "spend": self._numeric(row["spend"]),
                    "revenue": self._numeric(row["revenue"]),
                    "roi": self._numeric(row["roi"] * 100),
                    "status": "At Risk",
                    "reason": "; ".join(reasons),
                })
        risky.sort(key=lambda item: (item["roi"], item["spend"]), reverse=False)
        return risky

    def build_prediction_metrics(self) -> Dict[str, Any]:
        avg_predicted = float(self.df["predicted_revenue"].mean()) if "predicted_revenue" in self.df.columns else 0.0
        highest_prediction = float(self.df["predicted_revenue"].max()) if "predicted_revenue" in self.df.columns else 0.0
        actual = self.df["revenue"].astype(float) if "revenue" in self.df.columns else pd.Series([0.0] * len(self.df))
        predicted = self.df["predicted_revenue"].astype(float) if "predicted_revenue" in self.df.columns else pd.Series([0.0] * len(self.df))
        error = (predicted - actual).abs()
        accuracy = max(0.0, 100.0 - (error.mean() / max(actual.mean(), 1.0) * 100.0)) if len(actual) else 0.0
        confidence = 0.0
        if "predicted_revenue" in self.df.columns and self.df["predicted_revenue"].notna().any():
            confidence = round(min(100.0, max(0.0, (self.df["predicted_revenue"].mean() / max(self.df["revenue"].sum(), 1.0)) * 100.0)), 2)
        return {
            "average_predicted_revenue": self._numeric(avg_predicted),
            "highest_prediction": self._numeric(highest_prediction),
            "prediction_accuracy": round(float(accuracy), 2),
            "confidence_score": round(float(confidence), 2),
        }

    def build_forecast_summary(self, prediction_metrics: Dict[str, Any]) -> Dict[str, Any]:
        avg_predicted = prediction_metrics["average_predicted_revenue"]
        highest_prediction = prediction_metrics["highest_prediction"]
        if avg_predicted > 0 and highest_prediction > 0:
            change = ((avg_predicted - highest_prediction) / max(highest_prediction, 1)) * 100
        else:
            change = 0.0
        if change >= 10:
            trend = "Revenue expected to increase"
        elif change <= -10:
            trend = "Revenue expected to decrease"
        else:
            trend = "Revenue expected to remain stable"
        if self.df["conversion_rate"].mean() > 0.05:
            conversion_text = "Conversion improving"
        else:
            conversion_text = "Conversion trending flat"
        if self.df["budget_utilization"].mean() > 1.0:
            budget_text = "Budget utilization improving"
        else:
            budget_text = "Budget utilization stable"
        return {
            "headline": f"{trend} with a projected average revenue of {self._numeric(avg_predicted):,.0f}",
            "details": [
                f"Revenue outlook: {trend.lower()}",
                f"CTR outlook: {'stable' if self.df['ctr'].mean() > 0 else 'flat'}",
                conversion_text,
                budget_text,
            ],
        }

    def build_ai_summary(self, budget_insights: Dict[str, Any], prediction_metrics: Dict[str, Any]) -> Dict[str, Any]:
        ctr = self.df["ctr"].mean()
        conversion_rate = self.df["conversion_rate"].mean()
        avg_roi = self.df["roi"].mean()
        top_campaign = self.df.groupby("campaign_name")["revenue"].sum().idxmax() if not self.df.empty else "N/A"
        strengths = []
        risks = []
        opportunities = []
        recommendations = []

        if ctr > 0.05:
            strengths.append("CTR is outperforming the baseline")
            recommendations.append("Keep the highest-intent creative variants active to preserve strong engagement")
        if conversion_rate > 0.03:
            strengths.append("Conversion efficiency is healthy")
        if avg_roi > 0.2:
            strengths.append("Overall campaign ROI is positive")
        else:
            risks.append("ROI is below a healthy threshold")
            recommendations.append("Reduce spend on low-ROI campaigns and reallocate to better performers")
        if budget_insights["overspending_campaigns"]:
            risks.append("Overspending campaigns are dragging efficiency")
            recommendations.append("Trim spend from campaigns with below-average ROI")
        if top_campaign != "N/A":
            opportunities.append(f"{top_campaign} shows the strongest revenue potential")
        if prediction_metrics["confidence_score"] > 70:
            opportunities.append("Prediction confidence is strong enough to support budget planning")
        if ctr < 0.03:
            recommendations.append("Refresh landing pages and ad copy to improve engagement")
        if conversion_rate < 0.02:
            recommendations.append("Tighten the conversion funnel around the highest-volume campaigns")

        summary = (
            "The dashboard reflects current campaign performance from the uploaded dataset, with "
            f"{len(self.df)} rows analyzed across {self.df['campaign_name'].nunique()} campaigns. "
            f"The strongest signals are {', '.join(strengths[:2]) if strengths else 'the current data quality'} and "
            f"the main risks are {', '.join(risks[:2]) if risks else 'limited'}"
        )
        return {
            "summary": summary,
            "recommendations": recommendations[:6],
            "strengths": strengths[:4],
            "risks": risks[:4],
            "opportunities": opportunities[:4],
        }

    def generate(self):
        logger.info("Generating BI-ready insights")
        self.ensure_columns()
        self.prepare_dates()
        self.calculate_metrics()

        trend_analysis = self.build_trend_analysis()
        budget_insights = self.build_budget_insights()
        at_risk_campaigns = self.build_at_risk_campaigns()
        prediction_metrics = self.build_prediction_metrics()
        forecast_summary = self.build_forecast_summary(prediction_metrics)
        ai_summary = self.build_ai_summary(budget_insights, prediction_metrics)

        self.insights = {
            "trend_analysis": trend_analysis,
            "budget_insights": budget_insights,
            "at_risk_campaigns": at_risk_campaigns,
            "prediction_metrics": prediction_metrics,
            "forecast_summary": forecast_summary,
            "ai_summary": ai_summary,
        }
        self.summary = [
            f"Analyzed {len(self.df)} rows from the uploaded dataset",
            f"Identified {len(at_risk_campaigns)} campaigns requiring attention",
            f"Budget efficiency score: {budget_insights['budget_efficiency_score']}/100",
        ]
        return {"insights": self.insights, "summary": self.summary}
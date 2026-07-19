import time
from pathlib import Path

import pandas as pd

from backend.app.services.budget_service import BudgetService
from backend.app.services.forecast_service import ForecastService
from backend.app.services.insight_service import InsightService
from backend.app.services.prediction_service import PredictionService
from backend.app.services.scenario_service import ScenarioService


class AnalyzeService:

    def __init__(self):
        self.prediction_service = PredictionService()
        self.budget_service = BudgetService()
        self.forecast_service = ForecastService()
        self.scenario_service = ScenarioService()
        self.insight_service = InsightService()

    @staticmethod
    def _safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
        try:
            return float(numerator) / float(denominator) if float(denominator) else float(default)
        except Exception:
            return float(default)

    @staticmethod
    def _round(value: float, digits: int = 2) -> float:
        try:
            return round(float(value), digits)
        except Exception:
            return round(float(0.0), digits)

    @staticmethod
    def _parse_float(value: object, default: float = 0.0) -> float:
        try:
            return float(value)
        except Exception:
            return float(default)

    @staticmethod
    def _normalize_campaign_key(df: pd.DataFrame) -> str | None:
        for key in ["campaign_name", "campaign", "campaign_id", "ad_group", "source", "channel"]:
            if key in df.columns:
                return key
        return None

    @staticmethod
    def _normalize_date_column(df: pd.DataFrame) -> pd.Series | None:
        if "date" in df.columns:
            return pd.to_datetime(df["date"], errors="coerce")
        return None

    def _build_revenue_overview(self, df: pd.DataFrame, forecast_payload: dict) -> list[dict]:
        actual_monthly = pd.DataFrame()
        forecast_monthly = pd.DataFrame()

        date_series = self._normalize_date_column(df)
        if date_series is not None:
            monthly = df.copy()
            monthly["date"] = date_series
            if "revenue" in monthly.columns:
                monthly = monthly.dropna(subset=["date"])
                if not monthly.empty:
                    monthly = monthly.assign(month=monthly["date"].dt.to_period("M"))
                    actual_monthly = (
                        monthly.groupby("month", as_index=False)
                        .agg(actual=("revenue", "sum"), predicted=("predicted_revenue", "sum"))
                    )
                    actual_monthly["month"] = actual_monthly["month"].dt.strftime("%b %Y")

        forecast_chart = forecast_payload.get("forecast_chart", []) or []
        if isinstance(forecast_chart, list) and forecast_chart:
            forecast_df = pd.DataFrame(forecast_chart)
            if not forecast_df.empty and "date" in forecast_df.columns:
                forecast_df["date"] = pd.to_datetime(forecast_df["date"], errors="coerce")
                forecast_df = forecast_df.dropna(subset=["date"])
                if not forecast_df.empty and "forecast" in forecast_df.columns:
                    forecast_df = forecast_df.assign(month=forecast_df["date"].dt.to_period("M"))
                    forecast_monthly = (
                        forecast_df.groupby("month", as_index=False)
                        .agg(forecast=("forecast", "sum"))
                    )
                    forecast_monthly["month"] = forecast_monthly["month"].dt.strftime("%b %Y")

        months = []
        if not actual_monthly.empty:
            months.extend(actual_monthly["month"].tolist())
        if not forecast_monthly.empty:
            months.extend(forecast_monthly["month"].tolist())
        months = sorted(set(months), key=lambda m: pd.to_datetime(m, format="%b %Y", errors="coerce") or pd.Timestamp.min)

        results = []
        for month in months:
            actual = float(actual_monthly.loc[actual_monthly["month"] == month, "actual"].sum()) if not actual_monthly.empty else 0.0
            predicted = float(actual_monthly.loc[actual_monthly["month"] == month, "predicted"].sum()) if not actual_monthly.empty else 0.0
            forecast = float(forecast_monthly.loc[forecast_monthly["month"] == month, "forecast"].sum()) if not forecast_monthly.empty else 0.0
            results.append({"month": month, "actual": actual, "predicted": predicted, "forecast": forecast})

        if not results:
            results.append({
                "month": "Current",
                "actual": float(df["revenue"].sum()) if "revenue" in df.columns else 0.0,
                "predicted": float(df["predicted_revenue"].sum()) if "predicted_revenue" in df.columns else 0.0,
                "forecast": float(forecast_payload.get("metrics", {}).get("forecastedRevenue", 0.0)),
            })

        return results

    def _build_funnel(self, df: pd.DataFrame) -> list[dict]:
        impressions = int(df["impressions"].sum()) if "impressions" in df.columns else 0
        clicks = int(df["clicks"].sum()) if "clicks" in df.columns else 0
        conversions = int(df["conversions"].sum()) if "conversions" in df.columns else 0
        revenue = float(df["revenue"].sum()) if "revenue" in df.columns else 0.0

        return [
            {"stage": "Impressions", "value": impressions, "label": "Impressions"},
            {"stage": "Clicks", "value": clicks, "label": "Clicks"},
            {"stage": "Conversions", "value": conversions, "label": "Conversions"},
            {"stage": "Revenue", "value": revenue, "label": "Revenue"},
        ]

    def _build_campaign_rows(self, df: pd.DataFrame, budget_campaigns: list[dict], forecast_total: float) -> list[dict]:
        campaign_key = self._normalize_campaign_key(df)
        if campaign_key is None:
            return []

        revenue_total = float(df["revenue"].sum()) if "revenue" in df.columns else 0.0
        groups = (
            df.groupby(campaign_key, dropna=False)
            .agg(revenue=("revenue", "sum"), spend=("spend", "sum"), predictedRevenue=("predicted_revenue", "sum"))
            .reset_index()
        )

        rows = []
        for _, row in groups.iterrows():
            campaign_name = str(row[campaign_key]) if pd.notna(row[campaign_key]) else "Unknown"
            budget_match = next((item for item in budget_campaigns if str(item.get("campaign", "")).strip() == campaign_name.strip()), None)
            spend = float(row["spend"])
            revenue = float(row["revenue"])
            predicted = float(row["predictedRevenue"])
            forecast_revenue = float((predicted / revenue_total) * forecast_total) if revenue_total else 0.0
            roi = self._safe_divide(revenue, spend, 0.0) * 100 if spend else 0.0

            rows.append({
                "id": str(budget_match.get("id") if budget_match else campaign_name.replace(" ", "-").lower()),
                "campaign": campaign_name,
                "revenue": self._round(revenue),
                "spend": self._round(spend),
                "roi": self._round(roi),
                "predictedRevenue": self._round(predicted),
                "forecastRevenue": self._round(forecast_revenue),
                "recommendation": budget_match.get("recommendation") if budget_match else "Maintain current pacing",
                "status": budget_match.get("status") if budget_match else ("Performing" if roi >= 50 else "Underperforming" if roi > 0 else "At Risk"),
            })

        return rows

    def _build_insights(self, budget_payload: dict, forecast_payload: dict) -> list[dict]:
        insights = []
        recommendations = budget_payload.get("recommendations", [])
        for rec in recommendations[:4]:
            insights.append({
                "id": str(rec.get("id", f"insight-{len(insights) + 1}")),
                "priority": rec.get("priority", "Medium"),
                "category": "Budget Opportunity" if rec.get("priority", "Medium") in ["High", "Medium"] else "Campaign Optimization",
                "title": rec.get("title", "Recommendation"),
                "explanation": rec.get("explanation", ""),
                "businessImpact": rec.get("title", ""),
                "recommendedAction": rec.get("suggestedAction", ""),
                "estimatedRevenueGain": self._parse_float(rec.get("estimatedGain", 0.0)),
            })

        if len(insights) < 4:
            extra = forecast_payload.get("insights", [])[: max(0, 4 - len(insights))]
            for idx, insight in enumerate(extra, start=len(insights) + 1):
                insights.append({
                    "id": str(insight.get("id", f"forecast-insight-{idx}")),
                    "priority": "Medium",
                    "category": "Forecast Insight",
                    "title": insight.get("title", "Forecast insight"),
                    "explanation": insight.get("description", ""),
                    "businessImpact": insight.get("description", ""),
                    "recommendedAction": insight.get("description", ""),
                    "estimatedRevenueGain": 0.0,
                })

        return insights

    def _build_final_recommendations(self, budget_payload: dict) -> list[dict]:
        return [
            {
                "id": str(rec.get("id", f"recommendation-{index + 1}")),
                "priority": rec.get("priority", "Medium"),
                "title": rec.get("title", "Recommendation"),
                "businessImpact": rec.get("explanation", ""),
                "estimatedRevenueGain": self._parse_float(rec.get("estimatedGain", 0.0)),
                "recommendedAction": rec.get("suggestedAction", ""),
            }
            for index, rec in enumerate(budget_payload.get("recommendations", [])[:6])
        ]

    def analyze(self, csv_path: str):
        start_time = time.time()

        prediction_result = self.prediction_service.predict(csv_path)
        df = prediction_result.get("df")
        if df is None or not isinstance(df, pd.DataFrame):
            raise ValueError("Prediction pipeline failed to produce a valid DataFrame.")

        forecast_payload = self.forecast_service.forecast(csv_path)
        budget_payload, _ = self.budget_service.optimize(csv_path)
        scenario_payload = self.scenario_service.simulate(csv_path)
        insight_result = self.insight_service.generate(csv_path)

        total_revenue = float(df["revenue"].sum()) if "revenue" in df.columns else 0.0
        total_spend = float(df["spend"].sum()) if "spend" in df.columns else 0.0
        total_profit = total_revenue - total_spend
        predicted_revenue = float(df["predicted_revenue"].sum()) if "predicted_revenue" in df.columns else 0.0
        forecast_revenue = float(forecast_payload.get("metrics", {}).get("forecastedRevenue", 0.0) or 0.0)
        optimization_gain = float(budget_payload.get("summary", {}).get("estimatedRevenueIncrease", 0.0) or 0.0)
        scenario_gain = float(scenario_payload.get("kpis", {}).get("revenueIncrease", 0.0) or 0.0)

        data_quality_score = float(prediction_result.get("data_quality", {}).get("score", 0.0) or 0.0) * 100.0
        prediction_confidence = float(prediction_result.get("confidence_score", 0.0) or 0.0)
        forecast_confidence = float(forecast_payload.get("metrics", {}).get("forecastConfidence", 0.0) or 0.0)
        optimization_score = int(budget_payload.get("summary", {}).get("optimizationScore", 0) or 0)
        scenario_confidence = float(scenario_payload.get("kpis", {}).get("confidence", 0.0) or 0.0)

        business_health_score = int(round(
            (data_quality_score + forecast_confidence + optimization_score + scenario_confidence) / 4.0
        ))
        overall_score = int(round(
            (prediction_confidence + forecast_confidence + optimization_score + business_health_score) / 4.0
        ))
        confidence_score = int(round(
            (prediction_confidence + forecast_confidence + scenario_confidence) / 3.0
        ))

        if business_health_score >= 85:
            campaign_health = "Excellent"
        elif business_health_score >= 70:
            campaign_health = "Strong"
        elif business_health_score >= 55:
            campaign_health = "Moderate"
        else:
            campaign_health = "At Risk"

        forecast_chart = forecast_payload.get("forecast_chart", []) or []
        daily_forecast = []
        if isinstance(forecast_chart, list):
            for row in forecast_chart:
                daily_forecast.append({
                    "day": row.get("label") or row.get("date", ""),
                    "revenue": self._parse_float(row.get("forecast", row.get("revenue", 0.0))),
                    "lower": self._parse_float(row.get("confidenceLower", row.get("lower_bound", 0.0))),
                    "upper": self._parse_float(row.get("confidenceUpper", row.get("upper_bound", 0.0))),
                })

        campaign_rows = self._build_campaign_rows(
            df,
            budget_payload.get("campaigns", []),
            forecast_revenue,
        )

        scenario_options = scenario_payload.get("options", []) or []
        best_scenario_id = None
        best_gain = float("-inf")
        for option in scenario_options:
            gain = self._parse_float(option.get("expectedRevenueImpact", 0.0))
            if gain > best_gain:
                best_gain = gain
                best_scenario_id = option.get("id")

        scenarios = [
            {
                "id": option.get("id", f"scenario-{index + 1}"),
                "name": option.get("name", "Scenario"),
                "description": option.get("explanation", ""),
                "revenueImpact": self._parse_float(option.get("expectedRevenueImpact", 0.0)),
                "roiImpact": self._parse_float(option.get("estimatedRoi", 0.0)),
                "isBest": option.get("id") == best_scenario_id,
            }
            for index, option in enumerate(scenario_options)
        ]

        bottom_recommendation = self._build_final_recommendations(budget_payload)[:1]
        bottom_recommendation_text = bottom_recommendation[0]["title"] if bottom_recommendation else "Review recommendations for the uploaded dataset."

        analysis_payload = {
            "overallScore": {
                "overallAiScore": max(0, min(100, overall_score)),
                "overallCampaignHealth": campaign_health,
                "confidence": max(0, min(100, confidence_score)),
                "dataset": Path(csv_path).name,
                "rowsProcessed": int(len(df)),
                "analysisTimeSeconds": round(time.time() - start_time, 2),
            },
            "executiveSummary": {
                "totalRevenue": self._round(total_revenue),
                "totalSpend": self._round(total_spend),
                "profit": self._round(total_profit),
                "averageRoi": self._round(self._safe_divide(total_profit, total_spend, 0.0) * 100),
                "averageRoas": self._round(self._safe_divide(total_revenue, total_spend, 0.0)),
                "predictedRevenue": self._round(predicted_revenue),
                "forecastRevenue": self._round(forecast_revenue),
                "optimizationGain": self._round(optimization_gain),
                "scenarioGain": self._round(scenario_gain),
            },
            "kpis": {
                "revenue": self._round(total_revenue),
                "spend": self._round(total_spend),
                "roi": self._round(self._safe_divide(total_profit, total_spend, 0.0) * 100),
                "roas": self._round(self._safe_divide(total_revenue, total_spend, 0.0)),
                "ctr": self._round(self._safe_divide(df["clicks"].sum() if "clicks" in df.columns else 0.0, df["impressions"].sum() if "impressions" in df.columns else 1.0, 0.0) * 100),
                "conversions": int(df["conversions"].sum()) if "conversions" in df.columns else 0,
                "cpc": self._round(self._safe_divide(total_spend, df["clicks"].sum() if "clicks" in df.columns else 1.0, 0.0)),
                "cpm": self._round(self._safe_divide(total_spend, self._safe_divide(df["impressions"].sum() if "impressions" in df.columns else 0.0, 1000.0, 0.0), 0.0)),
                "predictionAccuracy": self._round(prediction_confidence),
                "forecastConfidence": self._round(forecast_confidence),
                "optimizationScore": optimization_score,
                "businessHealthScore": business_health_score,
            },
            "revenueOverview": self._build_revenue_overview(df, forecast_payload),
            "funnel": self._build_funnel(df),
            "predictionSummary": {
                "rowsProcessed": int(len(df)),
                "predictionsGenerated": int(len(df)),
                "highestPrediction": self._round(df["predicted_revenue"].max()) if "predicted_revenue" in df.columns else 0.0,
                "averagePrediction": self._round(df["predicted_revenue"].mean()) if "predicted_revenue" in df.columns else 0.0,
            },
            "insights": self._build_insights(budget_payload, forecast_payload),
            "budget": {
                "currentBudget": self._round(total_spend),
                "recommendedBudget": self._round(budget_payload.get("summary", {}).get("recommendedBudget", 0.0)),
                "revenueIncrease": self._round(optimization_gain),
                "savings": self._round(budget_payload.get("summary", {}).get("budgetSaved", 0.0)),
                "allocation": [
                    {
                        "channel": item.get("channel", "Unknown"),
                        "currentBudget": self._parse_float(item.get("currentBudget", 0.0)),
                        "optimizedBudget": self._parse_float(item.get("recommendedBudget", 0.0)),
                    }
                    for item in budget_payload.get("allocation", [])
                ],
            },
            "forecast": {
                "expectedRevenue": self._round(forecast_revenue),
                "expectedGrowth": self._round(forecast_payload.get("metrics", {}).get("forecastGrowth", 0.0)),
                "confidence": int(round(forecast_confidence)),
                "dailyForecast": daily_forecast,
            },
            "scenarios": scenarios,
            "campaigns": campaign_rows,
            "businessHealth": {
                "overallHealth": business_health_score,
                "metrics": [
                    {"label": "Data Quality", "score": int(round(data_quality_score))},
                    {"label": "Forecast Confidence", "score": int(round(forecast_confidence))},
                    {"label": "Optimization Score", "score": optimization_score},
                    {"label": "Scenario Confidence", "score": int(round(scenario_confidence))},
                ],
            },
            "finalRecommendations": self._build_final_recommendations(budget_payload),
            "bottomSummary": {
                "overallScore": max(0, min(100, overall_score)),
                "predictedRevenue": self._round(predicted_revenue),
                "optimizationGain": self._round(optimization_gain),
                "forecastGrowth": self._round(forecast_payload.get("metrics", {}).get("forecastGrowth", 0.0)),
                "bestScenario": next((s["name"] for s in scenarios if s["isBest"]), "Baseline Scenario"),
                "confidence": max(0, min(100, confidence_score)),
                "finalRecommendation": bottom_recommendation_text,
            },
        }

        return {
            "success": True,
            "message": "Complete analysis completed successfully.",
            "data": analysis_payload,
        }

import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class BudgetOptimizer:
    """Generate a dataset-driven budget optimization dashboard payload."""

    REQUIRED_COLUMNS = [
        "campaign_name",
        "spend",
        "revenue",
        "clicks",
        "impressions",
        "conversions",
        "predicted_revenue",
    ]

    @staticmethod
    def safe_divide(numerator, denominator):
        denominator = pd.Series(denominator).replace(0, np.nan)
        return (pd.Series(numerator) / denominator).fillna(0)

    @staticmethod
    def clamp(value, minimum, maximum):
        return max(minimum, min(maximum, value))

    def _ensure_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        for col in self.REQUIRED_COLUMNS:
            if col not in df.columns:
                df[col] = 0

        if "campaign_name" not in df.columns:
            df["campaign_name"] = "Unknown"

        if "channel" not in df.columns:
            channel_column = next((col for col in ["channel", "source", "medium", "network", "platform"] if col in df.columns), None)
            if channel_column:
                df["channel"] = df[channel_column]
            else:
                df["channel"] = df["campaign_name"].apply(self._infer_channel)

        if "current_budget" not in df.columns:
            budget_column = next((col for col in ["daily_budget", "budget", "campaign_budget", "budget_amount"] if col in df.columns), None)
            if budget_column:
                budget_values = pd.to_numeric(df[budget_column], errors="coerce").fillna(0)
                df["current_budget"] = np.where(budget_values > 0, budget_values, df["spend"])
            else:
                df["current_budget"] = df["spend"]

        numeric_columns = ["spend", "revenue", "clicks", "impressions", "conversions", "current_budget", "predicted_revenue"]
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

        df["campaign_name"] = df["campaign_name"].fillna("Unknown").astype(str)
        df["channel"] = df["channel"].fillna("Other").astype(str)
        return df

    def _infer_channel(self, campaign_name):
        if pd.isna(campaign_name):
            return "Other"
        text = str(campaign_name).lower()
        if any(token in text for token in ["search", "google"]):
            return "Search"
        if any(token in text for token in ["shopping", "product"]):
            return "Shopping"
        if any(token in text for token in ["display", "banner"]):
            return "Display"
        if any(token in text for token in ["meta", "facebook", "instagram", "social"]):
            return "Meta"
        if any(token in text for token in ["email", "newsletter"]):
            return "Email"
        if any(token in text for token in ["youtube", "video"]):
            return "YouTube"
        return "Other"

    def _estimate_predicted_revenue(self, df: pd.DataFrame) -> pd.Series:
        avg_roas = df["roas"].mean() if "roas" in df.columns else 1.0
        avg_ctr = df["ctr"].mean() if "ctr" in df.columns else 0.01
        avg_conversion_rate = df["conversion_rate"].mean() if "conversion_rate" in df.columns else 0.01

        roas_factor = self.safe_divide(df["roas"], avg_roas if avg_roas > 0 else 1.0)
        ctr_factor = self.safe_divide(df["ctr"], avg_ctr if avg_ctr > 0 else 0.01)
        conversion_factor = self.safe_divide(df["conversion_rate"], avg_conversion_rate if avg_conversion_rate > 0 else 0.01)

        multiplier = 0.75 + 0.1 * roas_factor + 0.1 * ctr_factor + 0.05 * conversion_factor
        multiplier = multiplier.clip(lower=0.6, upper=1.4)
        baseline_revenue = df["revenue"].abs()
        return baseline_revenue * multiplier

    def _build_campaign_table(self, aggregated: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
        aggregated = aggregated.copy()
        aggregated["roas"] = self.safe_divide(aggregated["revenue"], aggregated["spend"])
        aggregated["roi"] = self.safe_divide(aggregated["revenue"] - aggregated["spend"], aggregated["spend"])
        aggregated["ctr"] = self.safe_divide(aggregated["clicks"], aggregated["impressions"])
        aggregated["conversion_rate"] = self.safe_divide(aggregated["conversions"], aggregated["clicks"])
        aggregated["cpa"] = self.safe_divide(aggregated["spend"], aggregated["conversions"])
        aggregated["budget_efficiency"] = self.safe_divide(aggregated["revenue"], aggregated["current_budget"])

        if "predicted_revenue" not in aggregated.columns:
            aggregated["predicted_revenue"] = self._estimate_predicted_revenue(aggregated)

        aggregated["predicted_roas"] = self.safe_divide(aggregated["predicted_revenue"], aggregated["spend"])
        aggregated["predicted_roi"] = self.safe_divide(aggregated["predicted_revenue"] - aggregated["spend"], aggregated["spend"])
        aggregated["expected_profit"] = aggregated["predicted_revenue"] - aggregated["spend"]

        avg_roas = aggregated["roas"].mean()
        avg_roi = aggregated["roi"].mean()
        avg_ctr = aggregated["ctr"].mean()
        avg_conversion_rate = aggregated["conversion_rate"].mean()
        avg_cpa = aggregated["cpa"].mean()
        avg_budget_efficiency = aggregated["budget_efficiency"].mean()
        avg_spend = aggregated["spend"].mean()
        avg_budget = aggregated["current_budget"].mean()

        recommendations = []
        for _, row in aggregated.iterrows():
            roas = row["roas"]
            roi = row["roi"]
            ctr = row["ctr"]
            conversion_rate = row["conversion_rate"]
            cpa = row["cpa"]
            spend = row["spend"]
            current_budget = row["current_budget"]
            predicted_roi = row["predicted_roi"]
            predicted_roas = row["predicted_roas"]
            campaign = row["campaign_name"]
            channel = row["channel"]

            change_pct = 0
            action = "Maintain"
            priority = "Low"
            title = f"Maintain {campaign} pacing"
            explanation = f"{campaign} is performing in line with the portfolio average and is not showing a strong need for additional budget changes."
            suggested_action = f"Keep the current budget steady for {campaign} and monitor performance over the next reporting cycle."

            if predicted_roi > 1.2 and roas > avg_roas * 1.05 and current_budget <= avg_budget * 0.95:
                action = "Increase"
                change_pct = min(25, int(round(12 + (predicted_roas / max(avg_roas, 0.01) - 1) * 10)))
                priority = "High"
                title = f"Scale {campaign}"
                explanation = f"{campaign} is outperforming the portfolio with {roas:.1f}x ROAS and strong predicted profitability, making it a strong underfunded opportunity."
                suggested_action = f"Increase the budget for {campaign} by {change_pct}% to capture additional demand."
            elif roas < avg_roas * 0.9 and spend > avg_spend * 1.15:
                action = "Decrease"
                change_pct = max(-30, int(round(-10 - (avg_roas / max(roas, 0.01) - 1) * 15)))
                priority = "High"
                title = f"Trim {campaign} budget"
                explanation = f"{campaign} is below the portfolio ROAS benchmark and is consuming a disproportionate share of spend relative to returns."
                suggested_action = f"Reduce the budget for {campaign} by {abs(change_pct)}% while monitoring the effect on conversions."
            elif ctr > avg_ctr * 1.1 and conversion_rate < avg_conversion_rate * 0.95:
                action = "Maintain"
                change_pct = 0
                priority = "Medium"
                title = f"Improve landing page for {campaign}"
                explanation = f"{campaign} has healthy traffic quality but weaker conversion efficiency than the portfolio average, suggesting a landing page or offer issue."
                suggested_action = f"Increase landing page testing and offer clarity for {campaign} to convert more of the engaged traffic."
            elif cpa > avg_cpa * 1.15:
                action = "Decrease"
                change_pct = -10
                priority = "Medium"
                title = f"Reduce inefficient spend for {campaign}"
                explanation = f"{campaign} is generating a higher cost per conversion than the portfolio benchmark, so efficiency gains are likely from trimming spend."
                suggested_action = f"Reduce spend for {campaign} by 10% until conversion efficiency improves."
            elif predicted_roi > 0.25:
                action = "Increase"
                change_pct = 8
                priority = "Medium"
                title = f"Boost {campaign} momentum"
                explanation = f"{campaign} is profitable and has a positive predicted ROI, so a moderate increase is justified."
                suggested_action = f"Increase the budget for {campaign} by 8% to support continued growth."
            elif roi < 0.1 and spend > avg_spend * 1.2:
                action = "Pause"
                change_pct = -100
                priority = "High"
                title = f"Pause {campaign}"
                explanation = f"{campaign} is not generating enough return to justify the current spend level and should be paused until it improves."
                suggested_action = f"Pause {campaign} entirely and reallocate budget to higher-performing initiatives."

            recommended_budget = max(0.0, current_budget * (1 + change_pct / 100))
            expected_roas = max(0.0, roas * (1.08 if action == "Increase" else 0.95 if action == "Decrease" else 0.98))
            expected_revenue = recommended_budget * expected_roas
            expected_gain = max(0.0, expected_revenue - row["revenue"])
            budget_change = recommended_budget - current_budget

            if action == "Increase":
                status = "Increase"
            elif action == "Decrease":
                status = "Decrease"
            elif action == "Pause":
                status = "Pause"
            else:
                status = "Maintain"

            recommendations.append(
                {
                    "campaign": campaign,
                    "channel": channel,
                    "currentBudget": round(current_budget, 2),
                    "recommendedBudget": round(recommended_budget, 2),
                    "currentRoas": round(roas, 2),
                    "expectedRoas": round(expected_roas, 2),
                    "budgetChange": round(budget_change, 2),
                    "expectedRevenue": round(expected_revenue, 2),
                    "status": status,
                    "priority": priority,
                    "changePct": change_pct,
                    "expectedGain": round(expected_gain, 2),
                    "title": title,
                    "explanation": explanation,
                    "suggestedAction": suggested_action,
                    "optimizationSignal": round(
                        self.clamp((predicted_roi * 20) + (roas / max(avg_roas, 0.01) * 10) + (ctr / max(avg_ctr, 0.01) * 5), 0, 100),
                        2,
                    ),
                }
            )

        recommendation_df = pd.DataFrame(recommendations)
        if recommendation_df.empty:
            return aggregated, {}

        recommendation_df = recommendation_df.sort_values(by=["expectedGain", "optimizationSignal"], ascending=False).reset_index(drop=True)
        recommendation_df["id"] = [f"rec-{index + 1}" for index in range(len(recommendation_df))]

        summary_metrics = {
            "avgRoas": round(float(aggregated["roas"].mean()), 2),
            "avgRoi": round(float(aggregated["roi"].mean()), 2),
            "avgCtr": round(float(aggregated["ctr"].mean()), 2),
            "avgConversionRate": round(float(aggregated["conversion_rate"].mean()), 2),
            "avgCpa": round(float(aggregated["cpa"].mean()), 2),
            "avgBudgetEfficiency": round(float(aggregated["budget_efficiency"].mean()), 2),
            "avgSpend": round(float(aggregated["spend"].mean()), 2),
            "avgBudget": round(float(aggregated["current_budget"].mean()), 2),
        }

        return recommendation_df, summary_metrics

    def _build_payload(self, recommendation_df: pd.DataFrame, summary_metrics: dict, df: pd.DataFrame) -> tuple[dict, pd.DataFrame]:
        if recommendation_df.empty:
            recommendation_df = pd.DataFrame(columns=["campaign", "channel", "currentBudget", "recommendedBudget", "currentRoas", "expectedRoas", "budgetChange", "expectedRevenue", "status", "priority", "changePct", "expectedGain", "title", "explanation", "suggestedAction", "optimizationSignal", "id"])

        summary = {
            "recommendedBudget": round(float(recommendation_df["recommendedBudget"].sum()), 2),
            "estimatedRevenueIncrease": round(float(max(0.0, recommendation_df["expectedRevenue"].sum() - df["revenue"].sum())), 2),
            "budgetSaved": round(float(max(0.0, (recommendation_df.loc[recommendation_df["budgetChange"] < 0, "budgetChange"].abs().sum()))), 2),
            "averageRoas": round(float(summary_metrics["avgRoas"]), 2),
            "optimizationScore": int(round(self._calculate_optimization_score(summary_metrics))),
            "campaignsOptimized": int((recommendation_df["status"] != "Maintain").sum()),
        }

        recommendations = []
        for _, row in recommendation_df.head(6).iterrows():
            recommendations.append(
                {
                    "id": str(row["id"]),
                    "priority": row["priority"],
                    "title": row["title"],
                    "explanation": row["explanation"],
                    "estimatedGain": round(float(row["expectedGain"]), 2),
                    "suggestedAction": row["suggestedAction"],
                }
            )

        allocation = (
            recommendation_df.groupby("channel", dropna=False)
            .agg(currentBudget=("currentBudget", "sum"), recommendedBudget=("recommendedBudget", "sum"))
            .reset_index()
            .rename(columns={"channel": "channel"})
            .to_dict(orient="records")
        )

        roi_comparison = []
        for row in allocation:
            channel = row["channel"]
            channel_rows = recommendation_df[recommendation_df["channel"] == channel]
            if channel_rows.empty:
                continue
            current_revenue = float(channel_rows["currentBudget"].sum() * max(1.0, summary_metrics["avgRoas"]))
            optimized_revenue = float(channel_rows["recommendedBudget"].sum() * max(1.0, summary_metrics["avgRoas"]))
            roi = current_revenue / max(channel_rows["currentBudget"].sum(), 1.0)
            optimized_roi = optimized_revenue / max(channel_rows["recommendedBudget"].sum(), 1.0)
            roi_comparison.append(
                {
                    "channel": channel,
                    "currentRoi": round(roi, 2),
                    "optimizedRoi": round(optimized_roi, 2),
                }
            )

        campaigns = []
        for _, row in recommendation_df.iterrows():
            campaigns.append(
                {
                    "id": str(row["id"]),
                    "campaign": row["campaign"],
                    "currentBudget": round(float(row["currentBudget"]), 2),
                    "recommendedBudget": round(float(row["recommendedBudget"]), 2),
                    "currentRoas": round(float(row["currentRoas"]), 2),
                    "expectedRoas": round(float(row["expectedRoas"]), 2),
                    "budgetChange": round(float(row["budgetChange"]), 2),
                    "expectedRevenue": round(float(row["expectedRevenue"]), 2),
                    "status": row["status"],
                }
            )

        insights = self._build_insights(recommendation_df, summary_metrics)
        bottom_summary = {
            "optimizationScore": summary["optimizationScore"],
            "estimatedMonthlyRevenueIncrease": summary["estimatedRevenueIncrease"],
            "budgetSavings": summary["budgetSaved"],
            "confidence": round(float(self._calculate_confidence(df, summary_metrics)), 2),
        }

        payload = {
            "summary": summary,
            "recommendations": recommendations,
            "allocation": allocation,
            "roiComparison": roi_comparison,
            "campaigns": campaigns,
            "insights": insights,
            "bottomSummary": bottom_summary,
            "budget_allocation": allocation,
            "roi_comparison": roi_comparison,
            "campaign_table": campaigns,
            "optimization_insights": insights,
            "optimization_score": summary["optimizationScore"],
            "downloads": {
                "csv": "budget-optimizer.csv",
                "excel": "budget-optimizer.xlsx",
                "pdf": "budget-optimizer.pdf",
            },
        }

        return payload, recommendation_df

    def _build_insights(self, recommendation_df: pd.DataFrame, summary_metrics: dict) -> list[dict]:
        if recommendation_df.empty:
            return []

        highest_roas = recommendation_df.sort_values("currentRoas", ascending=False).iloc[0]
        lowest_roas = recommendation_df.sort_values("currentRoas", ascending=True).iloc[0]
        cpa_series = recommendation_df["currentBudget"] / np.maximum(recommendation_df["currentRoas"], 0.01)
        highest_cpa = recommendation_df.assign(_cpa=cpa_series).sort_values("_cpa", ascending=False).iloc[0]
        lowest_cpa = recommendation_df.assign(_cpa=cpa_series).sort_values("_cpa", ascending=True).iloc[0]
        most_efficient = recommendation_df.sort_values("expectedRoas", ascending=False).iloc[0]
        worst_campaign = recommendation_df.sort_values(["currentRoas", "expectedRoas"], ascending=True).iloc[0]
        highest_growth = recommendation_df.sort_values("expectedRevenue", ascending=False).iloc[0]

        insights = [
            {"id": "insight-1", "title": "Highest ROAS channel", "description": f"{highest_roas['campaign']} is leading with {highest_roas['currentRoas']:.1f}x ROAS and should be the first place for budget growth."},
            {"id": "insight-2", "title": "Lowest ROAS channel", "description": f"{lowest_roas['campaign']} is lagging at {lowest_roas['currentRoas']:.1f}x ROAS and should be reviewed before additional allocation."},
            {"id": "insight-3", "title": "Highest CPA", "description": f"{highest_cpa['campaign']} is carrying the highest cost-per-conversion burden relative to the portfolio average."},
            {"id": "insight-4", "title": "Most efficient campaign", "description": f"{most_efficient['campaign']} is producing the strongest expected return and is the best candidate for scale-up."},
            {"id": "insight-5", "title": "Worst campaign", "description": f"{worst_campaign['campaign']} is underperforming and should be trimmed or paused to preserve budget efficiency."},
            {"id": "insight-6", "title": "Budget imbalance", "description": f"The portfolio average ROAS is {summary_metrics['avgRoas']:.1f}x and the optimizer is shifting spend toward the strongest campaigns."},
        ]
        return insights

    def _calculate_optimization_score(self, summary_metrics: dict) -> float:
        roas_score = self.clamp((summary_metrics["avgRoas"] / max(summary_metrics["avgRoas"] + 1.0, 1.0)) * 100, 0, 100)
        roi_score = self.clamp(((summary_metrics["avgRoi"] + 1.0) / 2.0) * 100, 0, 100)
        ctr_score = self.clamp((summary_metrics["avgCtr"] / max(summary_metrics["avgCtr"] + 0.05, 0.05)) * 100, 0, 100)
        conversion_score = self.clamp((summary_metrics["avgConversionRate"] / max(summary_metrics["avgConversionRate"] + 0.05, 0.05)) * 100, 0, 100)
        cpa_score = self.clamp((1.0 - min(summary_metrics["avgCpa"] / max(summary_metrics["avgCpa"] + 25.0, 25.0), 1.0)) * 100, 0, 100)
        efficiency_score = self.clamp((summary_metrics["avgBudgetEfficiency"] / max(summary_metrics["avgBudgetEfficiency"] + 0.5, 0.5)) * 100, 0, 100)
        return (roas_score * 0.25 + roi_score * 0.2 + ctr_score * 0.15 + conversion_score * 0.15 + cpa_score * 0.1 + efficiency_score * 0.15)

    def _calculate_confidence(self, df: pd.DataFrame, summary_metrics: dict) -> float:
        required_columns = ["spend", "revenue", "clicks", "impressions", "conversions"]
        feature_completeness = float(df[required_columns].notna().mean().mean())
        missing_ratio = float(df[required_columns].isna().mean().mean())
        data_quality = 1.0 - min(1.0, float(df.duplicated().sum()) / max(len(df), 1))
        sample_size_score = self.clamp(len(df) / 50.0, 0.0, 1.0)
        prediction_confidence = 1.0 if summary_metrics["avgRoas"] > 0 else 0.0
        confidence = (0.25 * feature_completeness + 0.2 * data_quality + 0.25 * prediction_confidence + 0.15 * sample_size_score + 0.15 * (1.0 - missing_ratio)) * 100
        return self.clamp(confidence, 0.0, 100.0)

    def optimize(self, df: pd.DataFrame):
        logger.info("=" * 60)
        logger.info("Running Budget Optimizer...")
        logger.info("=" * 60)

        df = self._ensure_columns(df)

        if "predicted_revenue" not in df.columns or df["predicted_revenue"].eq(0).all():
            df["roas"] = self.safe_divide(df["revenue"], df["spend"])
            df["ctr"] = self.safe_divide(df["clicks"], df["impressions"])
            df["conversion_rate"] = self.safe_divide(df["conversions"], df["clicks"])
            df["predicted_revenue"] = self._estimate_predicted_revenue(df)

        df["predicted_roi"] = self.safe_divide(df["predicted_revenue"] - df["spend"], df["spend"])
        df["predicted_roas"] = self.safe_divide(df["predicted_revenue"], df["spend"])
        df["expected_profit"] = df["predicted_revenue"] - df["spend"]

        aggregated = (
            df.groupby("campaign_name", dropna=False)
            .agg(
                spend=("spend", "sum"),
                revenue=("revenue", "sum"),
                clicks=("clicks", "sum"),
                impressions=("impressions", "sum"),
                conversions=("conversions", "sum"),
                current_budget=("current_budget", "sum"),
                predicted_revenue=("predicted_revenue", "sum"),
                channel=("channel", lambda values: values.mode()[0] if not values.mode().empty else "Other"),
            )
            .reset_index()
        )

        recommendation_df, summary_metrics = self._build_campaign_table(aggregated)
        payload, recommendation_df = self._build_payload(recommendation_df, summary_metrics, df)

        logger.info(f"Generated {len(recommendation_df)} budget recommendations.")
        logger.info("=" * 60)
        logger.info("Budget Optimization Complete.")
        logger.info("=" * 60)

        return payload, recommendation_df
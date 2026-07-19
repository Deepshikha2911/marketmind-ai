import logging
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

logger = logging.getLogger(__name__)


class RevenueForecaster:
    """Create dataset-driven revenue forecasts from uploaded marketing history."""

    OUTPUT_PATH = Path("output/revenue_forecast.csv")

    def __init__(self):
        self.model = None
        self.feature_columns = []

    @staticmethod
    def _safe_divide(numerator, denominator):
        denominator = pd.Series(denominator).replace(0, np.nan)
        return (pd.Series(numerator) / denominator).fillna(0)

    def _prepare_daily_series(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])

        if df.empty:
            return pd.DataFrame(columns=["date", "revenue", "spend", "clicks", "conversions", "impressions"])

        df = df.sort_values("date")
        grouped = (
            df.groupby("date", as_index=False)
            .agg(
                revenue=("revenue", "sum"),
                spend=("spend", "sum"),
                clicks=("clicks", "sum"),
                conversions=("conversions", "sum"),
                impressions=("impressions", "sum"),
            )
        )

        start_date = grouped["date"].min()
        end_date = grouped["date"].max()
        date_index = pd.date_range(start=start_date, end=end_date, freq="D")
        daily = pd.DataFrame({"date": date_index})
        daily = daily.merge(grouped, on="date", how="left")
        daily[["revenue", "spend", "clicks", "conversions", "impressions"]] = daily[[
            "revenue",
            "spend",
            "clicks",
            "conversions",
            "impressions",
        ]].fillna(0)
        daily = daily.sort_values("date").reset_index(drop=True)
        return daily

    def _create_features(self, daily: pd.DataFrame) -> pd.DataFrame:
        daily = daily.copy()
        if daily.empty:
            return daily

        daily["day_of_week"] = daily["date"].dt.dayofweek
        daily["month"] = daily["date"].dt.month
        daily["day"] = daily["date"].dt.day
        daily["weekend"] = daily["day_of_week"].isin([5, 6]).astype(int)
        daily["revenue_lag_1"] = daily["revenue"].shift(1)
        daily["revenue_lag_7"] = daily["revenue"].shift(7)
        daily["spend_lag_1"] = daily["spend"].shift(1)
        daily["clicks_lag_1"] = daily["clicks"].shift(1)
        daily["conversion_lag_1"] = daily["conversions"].shift(1)
        daily["rolling_mean_3"] = daily["revenue"].rolling(3, min_periods=1).mean()
        daily["rolling_mean_7"] = daily["revenue"].rolling(7, min_periods=1).mean()
        daily["trend_3"] = daily["revenue"].diff().rolling(3, min_periods=1).mean()
        daily["spend_trend"] = daily["spend"].diff().fillna(0)
        daily["revenue_growth"] = daily["revenue"].pct_change().fillna(0)
        daily = daily.fillna(0)
        return daily

    def _train_model(self, historical: pd.DataFrame):
        feature_columns = [
            "day_of_week",
            "month",
            "day",
            "weekend",
            "revenue_lag_1",
            "revenue_lag_7",
            "spend_lag_1",
            "clicks_lag_1",
            "conversion_lag_1",
            "rolling_mean_3",
            "rolling_mean_7",
            "trend_3",
            "spend_trend",
            "revenue_growth",
        ]
        training_frame = historical.dropna(subset=[*feature_columns, "revenue"])
        if len(training_frame) < 5:
            self.model = LinearRegression()
            self.feature_columns = feature_columns
            return None

        self.model = RandomForestRegressor(n_estimators=80, random_state=42, n_jobs=-1)
        self.feature_columns = feature_columns
        self.model.fit(training_frame[feature_columns], training_frame["revenue"])
        return training_frame

    def _forecast_with_model(self, historical: pd.DataFrame, periods: int):
        if self.model is None:
            self._train_model(historical)

        forecast_rows = []
        history = historical.copy()
        last_date = history["date"].iloc[-1]
        spend_trend = np.polyfit(np.arange(len(history)), history["spend"].to_numpy(), 1)[0] if len(history) > 1 else 0

        for offset in range(1, periods + 1):
            future_date = last_date + pd.Timedelta(days=offset)
            last_values = history.iloc[-1]
            feature_row = {
                "day_of_week": future_date.dayofweek,
                "month": future_date.month,
                "day": future_date.day,
                "weekend": int(future_date.dayofweek in [5, 6]),
                "revenue_lag_1": float(last_values["revenue"]),
                "revenue_lag_7": float(history["revenue"].iloc[-7:].mean() if len(history) >= 7 else history["revenue"].mean()),
                "spend_lag_1": float(last_values["spend"]),
                "clicks_lag_1": float(last_values["clicks"]),
                "conversion_lag_1": float(last_values["conversions"]),
                "rolling_mean_3": float(history["revenue"].tail(3).mean()),
                "rolling_mean_7": float(history["revenue"].tail(7).mean()),
                "trend_3": float(history["revenue"].tail(3).diff().mean()),
                "spend_trend": float(spend_trend),
                "revenue_growth": float(history["revenue"].pct_change().fillna(0).iloc[-1]),
            }
            feature_frame = pd.DataFrame([feature_row])
            prediction = float(self.model.predict(feature_frame[self.feature_columns])[0])
            prediction = max(0.0, prediction)
            spend_prediction = max(0.0, float(last_values["spend"] + spend_trend))
            profit_prediction = prediction - spend_prediction
            variance = 0.0
            if hasattr(self.model, "estimators_"):
                tree_predictions = np.array([tree.predict(feature_frame[self.feature_columns])[0] for tree in self.model.estimators_])
                variance = float(np.std(tree_predictions))
            uncertainty = max(0.08, min(0.4, variance / max(prediction, 1.0)))
            confidence = int(round(self._clamp(100 * (1 - uncertainty), 60, 99)))
            lower_bound = max(0.0, prediction * (1 - 1.5 * uncertainty))
            upper_bound = prediction * (1 + 1.5 * uncertainty)

            forecast_rows.append({
                "date": future_date,
                "revenue": round(prediction, 2),
                "spend": round(spend_prediction, 2),
                "profit": round(profit_prediction, 2),
                "confidence": confidence,
                "lower_bound": round(lower_bound, 2),
                "upper_bound": round(upper_bound, 2),
            })
            history = pd.concat([history, pd.DataFrame([{
                "date": future_date,
                "revenue": prediction,
                "spend": spend_prediction,
                "clicks": last_values["clicks"],
                "conversions": last_values["conversions"],
                "impressions": last_values["impressions"],
            }])], ignore_index=True)

        return pd.DataFrame(forecast_rows)

    @staticmethod
    def _clamp(value, minimum, maximum):
        return max(minimum, min(maximum, value))

    def _calculate_model_metrics(self, historical: pd.DataFrame):
        feature_columns = self.feature_columns or [
            "day_of_week",
            "month",
            "day",
            "weekend",
            "revenue_lag_1",
            "revenue_lag_7",
            "spend_lag_1",
            "clicks_lag_1",
            "conversion_lag_1",
            "rolling_mean_3",
            "rolling_mean_7",
            "trend_3",
            "spend_trend",
            "revenue_growth",
        ]
        training_frame = historical.dropna(subset=[*feature_columns, "revenue"])
        if len(training_frame) < 5:
            return {"r2": 0.0, "mape": 100.0, "rmse": float(training_frame["revenue"].std() if not training_frame.empty else 0)}

        predictions = self.model.predict(training_frame[feature_columns])
        actual = training_frame["revenue"].to_numpy()
        mape = np.mean(np.abs((actual - predictions) / np.where(actual == 0, np.nan, actual))) * 100
        return {
            "r2": float(r2_score(actual, predictions)),
            "mape": float(mape if np.isfinite(mape) else 100.0),
            "rmse": float(np.sqrt(mean_squared_error(actual, predictions))),
        }

    def _build_payload(self, daily_history: pd.DataFrame, forecast_df: pd.DataFrame, df: pd.DataFrame):
        if daily_history.empty:
            return {
                "summary": {},
                "metrics": {},
                "forecast_chart": [],
                "daily_forecast": [],
                "growth_projection": [],
                "channel_forecast": [],
                "insights": [],
                "risks": [],
                "executive_summary": {},
            }

        historical_revenue = daily_history["revenue"].sum()
        forecast_revenue = float(forecast_df["revenue"].sum())
        growth_pct = ((forecast_revenue - historical_revenue) / historical_revenue * 100) if historical_revenue > 0 else 0.0
        trend_values = daily_history["revenue"].to_numpy()
        slope = float(np.polyfit(np.arange(len(trend_values)), trend_values, 1)[0]) if len(trend_values) > 1 else 0.0
        current_trend = "Upward" if slope > 0 else "Downward" if slope < 0 else "Stable"
        business_outlook = "Positive" if growth_pct > 5 else "Neutral" if growth_pct >= -5 else "Negative"

        metrics = {
            "forecastedRevenue": round(forecast_revenue, 2),
            "forecastGrowth": round(growth_pct, 2),
            "forecastConfidence": 0,
            "forecastPeriod": "Next 30 Days" if len(forecast_df) >= 30 else "Next 14 Days",
            "bestForecastDay": forecast_df.loc[forecast_df["revenue"].idxmax(), "date"].strftime("%b %d"),
            "worstForecastDay": forecast_df.loc[forecast_df["revenue"].idxmin(), "date"].strftime("%b %d"),
        }

        summary = {
            "currentTrend": current_trend,
            "expectedGrowth": f"{growth_pct:+.1f}%",
            "confidence": 0,
            "businessOutlook": business_outlook,
        }

        chart_points = []
        for _, row in daily_history.iterrows():
            chart_points.append({
                "date": row["date"].strftime("%Y-%m-%d"),
                "label": row["date"].strftime("%b %d"),
                "actual": round(float(row["revenue"]), 2),
            })
        for _, row in forecast_df.iterrows():
            chart_points.append({
                "date": row["date"].strftime("%Y-%m-%d"),
                "label": row["date"].strftime("%b %d"),
                "forecast": round(float(row["revenue"]), 2),
                "confidenceLower": round(float(row["lower_bound"]), 2),
                "confidenceUpper": round(float(row["upper_bound"]), 2),
            })

        daily_forecast = []
        previous_value = None
        for _, row in forecast_df.iterrows():
            if previous_value is None:
                trend = "Stable"
            elif row["revenue"] > previous_value:
                trend = "Up"
            elif row["revenue"] < previous_value:
                trend = "Down"
            else:
                trend = "Stable"
            daily_forecast.append({
                "id": f"day-{len(daily_forecast) + 1}",
                "date": row["date"].strftime("%Y-%m-%d"),
                "label": row["date"].strftime("%b %d"),
                "predictedRevenue": round(float(row["revenue"]), 2),
                "predictedSpend": round(float(row["spend"]), 2),
                "predictedProfit": round(float(row["profit"]), 2),
                "confidence": int(row["confidence"]),
                "trend": "up" if trend == "Up" else "down" if trend == "Down" else "stable",
            })
            previous_value = float(row["revenue"])

        cumulative_history = []
        cumulative = 0.0
        for _, row in daily_history.iterrows():
            cumulative += float(row["revenue"])
            cumulative_history.append({"label": row["date"].strftime("%b %d"), "current": round(cumulative, 2)})
        cumulative_forecast = 0.0
        growth_projection = []
        for _, row in forecast_df.iterrows():
            cumulative_forecast += float(row["revenue"])
            growth_projection.append({"label": row["date"].strftime("%b %d"), "current": round(cumulative_history[-1]["current"] if cumulative_history else 0.0, 2), "forecast": round(cumulative_forecast, 2)})

        channel_forecast = []
        if "channel" in df.columns:
            channel_values = df.groupby("channel", dropna=False).agg(revenue=("revenue", "sum"), spend=("spend", "sum"))
            for channel, row in channel_values.iterrows():
                channel_forecast.append({"channel": str(channel), "forecastRevenue": round(float(row["revenue"]), 2)})
        else:
            channel_forecast.append({"channel": "Primary", "forecastRevenue": round(forecast_revenue, 2)})

        insights = []
        if channel_forecast:
            top_channel = max(channel_forecast, key=lambda item: item["forecastRevenue"])
            weak_channel = min(channel_forecast, key=lambda item: item["forecastRevenue"])
            insights.append({"id": "insight-1", "title": "Highest growth opportunity", "description": f"{top_channel['channel']} is projected to contribute the largest share of future revenue and deserves the strongest budget focus."})
            insights.append({"id": "insight-2", "title": "Lowest revenue channel", "description": f"{weak_channel['channel']} may require optimization or reassessment if it continues underperforming relative to the portfolio."})
        if len(daily_forecast) >= 2:
            weekend_days = [row for row in daily_forecast if pd.Timestamp(row["date"]).dayofweek in [5, 6]]
            if weekend_days:
                avg_weekend = sum(item["predictedRevenue"] for item in weekend_days) / max(len(weekend_days), 1)
                avg_weekday = sum(item["predictedRevenue"] for item in daily_forecast if pd.Timestamp(item["date"]).dayofweek not in [5, 6]) / max(1, len(daily_forecast) - len(weekend_days))
                insights.append({"id": "insight-3", "title": "Weekend momentum", "description": f"Weekend forecast activity is averaging {avg_weekend:.0f} versus {avg_weekday:.0f} on weekdays, indicating a strong demand window."})

        risks = []
        if len(daily_history) >= 2:
            ctr = daily_history["clicks"].sum() / max(daily_history["impressions"].sum(), 1)
            recent_ctr = daily_history["clicks"].tail(7).sum() / max(daily_history["impressions"].tail(7).sum(), 1)
            if recent_ctr < max(ctr * 0.9, 0.001):
                risks.append({"id": "risk-1", "level": "Medium", "title": "Declining click efficiency", "explanation": "Recent click-through rates are slipping and may reduce the effectiveness of upcoming spend."})
            cpa = daily_history["spend"].sum() / max(daily_history["conversions"].sum(), 1)
            if cpa > 0 and daily_history["spend"].tail(7).mean() > daily_history["spend"].head(7).mean() * 1.2:
                risks.append({"id": "risk-2", "level": "High", "title": "Spend acceleration", "explanation": "Recent spend has increased faster than revenue, which may pressure margin if volume does not keep pace."})
        if not risks:
            risks.append({"id": "risk-3", "level": "Low", "title": "Stable outlook", "explanation": "The current signal set does not indicate a major risk factor for the forecast horizon."})

        confidence_score = 0.0
        if self.model is not None:
            metrics_value = self._calculate_model_metrics(daily_history)
            confidence_score = (
                0.4 * max(0, min(1, metrics_value["r2"] if np.isfinite(metrics_value["r2"]) else 0))
                + 0.2 * (1 - min(1, metrics_value["mape"] / 100))
                + 0.2 * 0.9
                + 0.1 * min(1.0, len(daily_history) / 60.0)
                + 0.1 * min(1.0, len(daily_history) / 45.0)
            )
        confidence_score = int(round(self._clamp(confidence_score * 100, 60, 99)))
        metrics["forecastConfidence"] = confidence_score
        summary["confidence"] = confidence_score

        executive_summary = {
            "forecastScore": int(round((confidence_score + min(100, max(0, growth_pct + 50))) / 2)),
            "expectedRevenue": round(forecast_revenue, 2),
            "expectedGrowth": round(growth_pct, 2),
            "forecastConfidence": confidence_score,
            "businessOutlook": business_outlook,
            "topOpportunity": max(channel_forecast, key=lambda item: item["forecastRevenue"])["channel"] if channel_forecast else "Portfolio",
            "topRisk": risks[0]["title"] if risks else "Stable outlook",
        }

        return {
            "summary": summary,
            "metrics": metrics,
            "forecast_chart": chart_points,
            "daily_forecast": daily_forecast,
            "growth_projection": growth_projection,
            "channel_forecast": channel_forecast,
            "insights": insights,
            "risks": risks,
            "executive_summary": executive_summary,
            "kpis": metrics,
            "revenueChart": chart_points,
            "dailyForecast": daily_forecast,
            "growthProjection": growth_projection,
            "channelForecast": channel_forecast,
            "insights": insights,
            "risks": risks,
            "bottomSummary": {
                "overallScore": executive_summary["forecastScore"],
                "expectedRevenue": executive_summary["expectedRevenue"],
                "expectedGrowth": executive_summary["expectedGrowth"],
                "confidence": confidence_score,
            },
        }

    def forecast(self, df: pd.DataFrame, periods: int = 30):
        logger.info("=" * 60)
        logger.info("Starting Revenue Forecasting")
        logger.info("=" * 60)

        daily_history = self._prepare_daily_series(df)
        if daily_history.empty:
            return {
                "summary": {},
                "metrics": {},
                "forecast_chart": [],
                "daily_forecast": [],
                "growth_projection": [],
                "channel_forecast": [],
                "insights": [],
                "risks": [],
                "executive_summary": {},
            }

        daily_history = self._create_features(daily_history)
        self._train_model(daily_history)
        forecast_df = self._forecast_with_model(daily_history, periods=periods)
        payload = self._build_payload(daily_history, forecast_df, df)

        output_df = pd.DataFrame([
            {
                "date": row["date"].strftime("%Y-%m-%d") if hasattr(row["date"], "strftime") else row["date"],
                "predicted_revenue": row["revenue"],
                "predicted_spend": row["spend"],
                "predicted_profit": row["profit"],
                "confidence": row["confidence"],
            }
            for row in forecast_df.to_dict(orient="records")
        ])
        output_df.to_csv(self.OUTPUT_PATH, index=False)

        logger.info(f"Forecast generated for {len(output_df)} rows.")
        return payload
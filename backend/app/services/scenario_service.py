import pandas as pd

from ml.features.feature_engineering import FeatureEngineer
from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.preprocessing.validator import DataValidator
from ml.simulator.scenario_simulator import ScenarioSimulator


class ScenarioService:

    def __init__(self):
        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()
        self.simulator = ScenarioSimulator()

    @staticmethod
    def _humanize_scenario(scenario_id: str) -> str:
        mapping = {
            "increase-budget": "Increase Budget",
            "reduce-budget": "Reduce Budget",
            "pause-campaigns": "Pause Campaigns",
            "increase-ctr": "Increase CTR",
            "improve-conversion": "Improve Conversion",
            "boost-revenue": "Boost Revenue",
        }
        return mapping.get(scenario_id, scenario_id.replace("-", " ").title())

    @staticmethod
    def _format_metric_value(value: float, metric_format: str) -> float:
        if metric_format in {"currency", "percent", "number"}:
            return round(float(value), 2)
        return round(float(value), 2)

    def _build_option_payload(self, scenario_id: str, frame: pd.DataFrame, baseline: pd.DataFrame) -> dict:
        current_revenue = float(baseline["revenue"].sum()) if "revenue" in baseline.columns else 0.0
        simulated_revenue = float(frame["predicted_revenue"].sum()) if "predicted_revenue" in frame.columns else 0.0
        simulated_spend = float(frame["spend"].sum()) if "spend" in frame.columns else 0.0
        current_spend = float(baseline["spend"].sum()) if "spend" in baseline.columns else 0.0
        revenue_change = simulated_revenue - current_revenue
        roi = (simulated_revenue - simulated_spend) / simulated_spend * 100 if simulated_spend else 0.0
        return {
            "id": scenario_id,
            "name": self._humanize_scenario(scenario_id),
            "explanation": f"Apply the {self._humanize_scenario(scenario_id).lower()} strategy to the uploaded dataset.",
            "expectedRevenueImpact": round(revenue_change, 2),
            "estimatedRoi": round(roi, 2),
        }

    def _build_payload(self, baseline: pd.DataFrame, current_frame: pd.DataFrame, selected_id: str, option_payloads: list[dict]) -> dict:
        current_revenue = float(baseline["revenue"].sum()) if "revenue" in baseline.columns else 0.0
        simulated_revenue = float(current_frame["predicted_revenue"].sum()) if "predicted_revenue" in current_frame.columns else 0.0
        simulated_spend = float(current_frame["spend"].sum()) if "spend" in current_frame.columns else 0.0
        current_spend = float(baseline["spend"].sum()) if "spend" in baseline.columns else 0.0
        current_clicks = float(baseline["clicks"].sum()) if "clicks" in baseline.columns else 0.0
        simulated_clicks = float(current_frame["clicks"].sum()) if "clicks" in current_frame.columns else 0.0
        current_conversions = float(baseline["conversions"].sum()) if "conversions" in baseline.columns else 0.0
        simulated_conversions = float(current_frame["conversions"].sum()) if "conversions" in current_frame.columns else 0.0
        current_profit = current_revenue - current_spend
        simulated_profit = simulated_revenue - simulated_spend
        current_roas = current_revenue / current_spend if current_spend else 0.0
        simulated_roas = simulated_revenue / simulated_spend if simulated_spend else 0.0
        current_roi = current_profit / current_spend * 100 if current_spend else 0.0
        simulated_roi = simulated_profit / simulated_spend * 100 if simulated_spend else 0.0
        current_conversion_rate = current_conversions / current_clicks if current_clicks else 0.0
        simulated_conversion_rate = simulated_conversions / simulated_clicks if simulated_clicks else 0.0
        revenue_change = simulated_revenue - current_revenue
        confidence = int(min(99, max(60, 70 + min(20, len(baseline) // 10))))

        kpis = {
            "currentRevenue": round(current_revenue, 2),
            "simulatedRevenue": round(simulated_revenue, 2),
            "revenueIncrease": round(revenue_change, 2),
            "expectedRoi": round(simulated_roi, 2),
            "winningScenario": self._humanize_scenario(selected_id),
            "confidence": confidence,
        }

        simulation_results = [
            {"key": "revenue", "label": "Revenue", "current": round(current_revenue, 2), "simulated": round(simulated_revenue, 2), "format": "currency"},
            {"key": "profit", "label": "Profit", "current": round(current_profit, 2), "simulated": round(simulated_profit, 2), "format": "currency"},
            {"key": "roas", "label": "ROAS", "current": round(current_roas, 2), "simulated": round(simulated_roas, 2), "format": "multiplier"},
            {"key": "roi", "label": "ROI", "current": round(current_roi, 2), "simulated": round(simulated_roi, 2), "format": "percent"},
            {"key": "conversions", "label": "Conversions", "current": round(current_conversions, 2), "simulated": round(simulated_conversions, 2), "format": "number"},
            {"key": "spend", "label": "Spend", "current": round(current_spend, 2), "simulated": round(simulated_spend, 2), "format": "currency"},
        ]

        if "date" in baseline.columns and "date" in current_frame.columns:
            baseline_dates = pd.to_datetime(baseline["date"], errors="coerce")
            current_dates = pd.to_datetime(current_frame["date"], errors="coerce")
            baseline_months = baseline_dates.dropna().dt.to_period("M")
            current_months = current_dates.dropna().dt.to_period("M")
            baseline_monthly = baseline.groupby(baseline_months).agg(current_revenue=("revenue", "sum"))
            simulated_monthly = current_frame.groupby(current_months).agg(simulated_revenue=("predicted_revenue", "sum"))
            months = sorted(set(baseline_monthly.index) | set(simulated_monthly.index))
            revenue_chart = []
            for month in months:
                label = str(month)
                revenue_chart.append({
                    "month": str(month),
                    "label": label,
                    "current": round(float(baseline_monthly.loc[month, "current_revenue"]) if month in baseline_monthly.index else 0.0, 2),
                    "simulated": round(float(simulated_monthly.loc[month, "simulated_revenue"]) if month in simulated_monthly.index else 0.0, 2),
                })
        else:
            revenue_chart = []

        channel_key = "channel" if "channel" in baseline.columns else None
        if channel_key:
            current_channels = baseline.groupby(channel_key).agg(current_revenue=("revenue", "sum"))
            simulated_channels = current_frame.groupby(channel_key).agg(simulated_revenue=("predicted_revenue", "sum"))
            channel_names = sorted(set(current_channels.index) | set(simulated_channels.index))
            channel_impact = []
            for channel_name in channel_names:
                channel_impact.append({
                    "channel": str(channel_name),
                    "current": round(float(current_channels.loc[channel_name, "current_revenue"]) if channel_name in current_channels.index else 0.0, 2),
                    "simulated": round(float(simulated_channels.loc[channel_name, "simulated_revenue"]) if channel_name in simulated_channels.index else 0.0, 2),
                })
        else:
            channel_impact = [{"channel": "Portfolio", "current": round(current_revenue, 2), "simulated": round(simulated_revenue, 2)}]

        campaign_key = "campaign_name" if "campaign_name" in baseline.columns else "campaign_id" if "campaign_id" in baseline.columns else None
        if campaign_key:
            current_campaigns = baseline.groupby(campaign_key).agg(current_revenue=("revenue", "sum"))
            simulated_campaigns = current_frame.groupby(campaign_key).agg(simulated_revenue=("predicted_revenue", "sum"))
            campaign_names = sorted(set(current_campaigns.index) | set(simulated_campaigns.index))
            campaigns = []
            for campaign_name in campaign_names:
                current_value = float(current_campaigns.loc[campaign_name, "current_revenue"]) if campaign_name in current_campaigns.index else 0.0
                simulated_value = float(simulated_campaigns.loc[campaign_name, "simulated_revenue"]) if campaign_name in simulated_campaigns.index else 0.0
                difference = simulated_value - current_value
                simulated_spend = float(
                    current_frame.loc[current_frame[campaign_key] == campaign_name, "spend"].sum()
                ) if campaign_key in current_frame.columns else 0.0
                roi_value = (
                    ((simulated_value - simulated_spend) / max(simulated_spend, 1)) * 100
                    if simulated_spend > 0
                    else 0.0
                )
                campaigns.append({
                    "id": str(campaign_name).replace(" ", "-").lower(),
                    "campaign": str(campaign_name),
                    "currentRevenue": round(current_value, 2),
                    "simulatedRevenue": round(simulated_value, 2),
                    "difference": round(difference, 2),
                    "roi": round(roi_value, 2),
                    "recommendation": "Increase allocation" if difference > 0 else "Reduce allocation" if difference < 0 else "Maintain",
                    "status": "Increase" if difference > 0 else "Decrease" if difference < 0 else "Maintain",
                })
        else:
            campaigns = []

        insights = []
        if campaigns:
            best_campaign = max(campaigns, key=lambda item: item["difference"])
            worst_campaign = min(campaigns, key=lambda item: item["difference"])
            insights.append({
                "id": "insight-1",
                "title": "Largest gain from the selected scenario",
                "description": f"{best_campaign['campaign']} contributes the largest projected lift in this scenario.",
            })
            insights.append({
                "id": "insight-2",
                "title": "Campaigns that need attention",
                "description": f"{worst_campaign['campaign']} shows the weakest projected change and should be monitored closely.",
            })
        if channel_impact:
            top_channel = max(channel_impact, key=lambda item: item["simulated"])
            insights.append({
                "id": "insight-3",
                "title": "Portfolio concentration",
                "description": f"{top_channel['channel']} is expected to carry the largest simulated revenue contribution.",
            })

        risks = []
        if simulated_roi < 0:
            risks.append({"id": "risk-1", "title": "Negative ROI risk", "status": "High", "description": "The simulated scenario is projected to lose money on incremental spend."})
        elif simulated_roi < 10:
            risks.append({"id": "risk-2", "title": "Efficiency pressure", "status": "Medium", "description": "The scenario produces modest returns and should be monitored for diminishing returns."})
        else:
            risks.append({"id": "risk-3", "title": "Balanced outlook", "status": "Low", "description": "The scenario remains efficient based on the uploaded dataset."})

        if revenue_change < 0:
            risks.append({"id": "risk-4", "title": "Revenue headwind", "status": "Medium", "description": "The selected scenario is projected to reduce revenue relative to the current portfolio."})

        bottom_summary = {
            "scenarioSelected": self._humanize_scenario(selected_id),
            "expectedRevenue": round(simulated_revenue, 2),
            "revenueIncrease": round(revenue_change, 2),
            "expectedRoi": round(simulated_roi, 2),
            "confidenceScore": confidence,
            "businessRecommendation": f"The {self._humanize_scenario(selected_id).lower()} strategy should be prioritized if the goal is to improve efficiency and keep revenue moving in line with the current mix.",
        }

        return {
            "success": True,
            "message": "Scenario simulation completed successfully.",
            "scenarioId": selected_id,
            "kpis": kpis,
            "simulationResults": simulation_results,
            "revenueChart": revenue_chart,
            "channelImpact": channel_impact,
            "campaigns": campaigns,
            "insights": insights,
            "risks": risks,
            "bottomSummary": bottom_summary,
            "options": option_payloads,
        }

    def simulate(self, csv_path: str, scenario_id: str = "increase-budget"):
        df = self.loader.load_csv(csv_path)
        df = self.validator.validate(df)
        df = DataPreprocessor(df).preprocess()
        df = self.engineer.transform(df)

        scenario_mapping = {
            "increase-budget": lambda frame: self.simulator.increase_budget(frame, 20),
            "reduce-budget": lambda frame: self.simulator.reduce_budget(frame, 20),
            "pause-campaigns": lambda frame: self.simulator.pause_campaign(frame),
            "increase-ctr": lambda frame: self.simulator.increase_ctr(frame, 15),
            "improve-conversion": lambda frame: self.simulator.improve_conversion_rate(frame, 15),
            "boost-revenue": lambda frame: self.simulator.boost_revenue(frame, 10),
        }

        selected_key = scenario_id.lower().replace(" ", "-") if isinstance(scenario_id, str) else "increase-budget"
        selected_key = selected_key if selected_key in scenario_mapping else "increase-budget"

        scenario_frames = {key: func(df) for key, func in scenario_mapping.items()}
        selected_frame = scenario_frames[selected_key]

        option_payloads = [
            self._build_option_payload(key, frame, df) for key, frame in scenario_frames.items()
        ]

        payload = self._build_payload(df, selected_frame, selected_key, option_payloads)
        payload["files"] = {}
        return payload
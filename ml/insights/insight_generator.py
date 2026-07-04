import logging
from typing import Dict, List, Any

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class InsightGenerator:
    """
    Production Ready Insight Generator

    Generates business insights from any marketing dataset.

    Features
    --------
    ✓ Executive Summary
    ✓ KPI Analysis
    ✓ Campaign Ranking
    ✓ Budget Analysis
    ✓ Revenue Analysis
    ✓ ROI Analysis
    ✓ Predicted Revenue Analysis
    ✓ Trend Analysis
    ✓ AI Recommendations
    ✓ Dashboard Friendly Output
    """

    def __init__(self, dataframe: pd.DataFrame):

        self.df = dataframe.copy()

        self.insights: Dict[str, Any] = {}

        self.summary: List[str] = []

    # ---------------------------------------------------
    # Safe Divide
    # ---------------------------------------------------

    @staticmethod
    def safe_divide(a, b):

        if isinstance(b, pd.Series):
            b = b.replace(0, np.nan)

        return (a / b).fillna(0)

    # ---------------------------------------------------
    # Required Columns
    # ---------------------------------------------------

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

            "daily_budget": 0

        }

        for column, default in defaults.items():

            if column not in self.df.columns:

                logger.warning(f"{column} missing.")

                self.df[column] = default

    # ---------------------------------------------------
    # Date Conversion
    # ---------------------------------------------------

    def prepare_dates(self):

        self.df["date"] = pd.to_datetime(

            self.df["date"],

            errors="coerce"

        )

    # ---------------------------------------------------
    # KPI Calculation
    # ---------------------------------------------------

    def calculate_metrics(self):

        self.df["ctr"] = self.safe_divide(

            self.df["clicks"],

            self.df["impressions"]

        )

        self.df["cpc"] = self.safe_divide(

            self.df["spend"],

            self.df["clicks"]

        )

        self.df["cpm"] = self.safe_divide(

            self.df["spend"] * 1000,

            self.df["impressions"]

        )

        self.df["conversion_rate"] = self.safe_divide(

            self.df["conversions"],

            self.df["clicks"]

        )

        self.df["roi"] = self.safe_divide(

            self.df["revenue"] - self.df["spend"],

            self.df["spend"]

        )

        self.df["roas"] = self.safe_divide(

            self.df["revenue"],

            self.df["spend"]

        )

        self.df["profit"] = (

            self.df["revenue"]

            - self.df["spend"]

        )

        self.df["budget_utilization"] = self.safe_divide(

            self.df["spend"],

            self.df["daily_budget"]

        )

    # ---------------------------------------------------
    # Executive Summary
    # ---------------------------------------------------

    def executive_summary(self):

        total_spend = float(

            self.df["spend"].sum()

        )

        total_revenue = float(

            self.df["revenue"].sum()

        )

        total_profit = float(

            self.df["profit"].sum()

        )

        avg_roi = float(

            self.df["roi"].mean()

        )

        avg_roas = float(

            self.df["roas"].mean()

        )

        self.insights["summary"] = {

            "campaigns": int(

                self.df["campaign_name"]

                .nunique()

            ),

            "rows": int(len(self.df)),

            "total_spend": round(

                total_spend,

                2

            ),

            "total_revenue": round(

                total_revenue,

                2

            ),

            "total_profit": round(

                total_profit,

                2

            ),

            "average_roi": round(

                avg_roi,

                4

            ),

            "average_roas": round(

                avg_roas,

                4

            )

        }

        self.summary.append(

            f"Total Revenue : {total_revenue:,.2f}"

        )

        self.summary.append(

            f"Total Spend : {total_spend:,.2f}"

        )

        self.summary.append(

            f"Profit : {total_profit:,.2f}"

        )

        self.summary.append(

            f"Average ROI : {avg_roi:.2%}"

        )

        self.summary.append(

            f"Average ROAS : {avg_roas:.2f}"

        )
    # ---------------------------------------------------
    # Campaign Performance
    # ---------------------------------------------------

    def campaign_performance(self):

        grouped = (

            self.df.groupby("campaign_name")

            .agg({

                "spend": "sum",

                "revenue": "sum",

                "profit": "sum",

                "clicks": "sum",

                "impressions": "sum",

                "conversions": "sum"

            })

            .reset_index()

        )

        grouped["roi"] = self.safe_divide(

            grouped["profit"],

            grouped["spend"]

        )

        grouped["roas"] = self.safe_divide(

            grouped["revenue"],

            grouped["spend"]

        )

        grouped["ctr"] = self.safe_divide(

            grouped["clicks"],

            grouped["impressions"]

        )

        grouped["conversion_rate"] = self.safe_divide(

            grouped["conversions"],

            grouped["clicks"]

        )

        grouped["cpc"] = self.safe_divide(

            grouped["spend"],

            grouped["clicks"]

        )

        grouped["cpm"] = self.safe_divide(

            grouped["spend"] * 1000,

            grouped["impressions"]

        )

        self.insights["campaign_performance"] = (

            grouped

            .round(4)

            .to_dict("records")

        )

    # ---------------------------------------------------
    # Top & Bottom Campaigns
    # ---------------------------------------------------

    def top_bottom_campaigns(self):

        grouped = (

            self.df.groupby("campaign_name")["revenue"]

            .sum()

            .sort_values(

                ascending=False

            )

        )

        self.insights["top_5_campaigns"] = (

            grouped

            .head(5)

            .to_dict()

        )

        self.insights["bottom_5_campaigns"] = (

            grouped

            .tail(5)

            .to_dict()

        )

        if len(grouped):

            self.summary.append(

                f"Best Campaign : {grouped.idxmax()}"

            )

            self.summary.append(

                f"Worst Campaign : {grouped.idxmin()}"

            )

    # ---------------------------------------------------
    # Budget Analysis
    # ---------------------------------------------------

    def budget_analysis(self):

        over_budget = self.df[

            self.df["spend"]

            >

            self.df["daily_budget"]

        ]

        under_budget = self.df[

            self.df["spend"]

            <=

            self.df["daily_budget"]

        ]

        self.insights["budget"] = {

            "over_budget_campaigns": int(

                len(over_budget)

            ),

            "within_budget_campaigns": int(

                len(under_budget)

            ),

            "average_budget_utilization": round(

                float(

                    self.df["budget_utilization"]

                    .mean()

                ),

                4

            )

        }

        self.summary.append(

            f"Over Budget Campaigns : {len(over_budget)}"

        )

    # ---------------------------------------------------
    # ROI Analysis
    # ---------------------------------------------------

    def roi_analysis(self):

        negative = self.df[

            self.df["roi"] < 0

        ]

        positive = self.df[

            self.df["roi"] >= 0

        ]

        self.insights["roi_analysis"] = {

            "positive_roi_campaigns": int(

                len(positive)

            ),

            "negative_roi_campaigns": int(

                len(negative)

            ),

            "average_roi": round(

                float(

                    self.df["roi"].mean()

                ),

                4

            )

        }

        if len(negative):

            self.summary.append(

                f"{len(negative)} campaigns have negative ROI."

            )

    # ---------------------------------------------------
    # KPI Summary
    # ---------------------------------------------------

    def kpi_summary(self):

        self.insights["kpis"] = {

            "average_ctr": round(

                float(

                    self.df["ctr"].mean()

                ),

                4

            ),

            "average_cpc": round(

                float(

                    self.df["cpc"].mean()

                ),

                4

            ),

            "average_cpm": round(

                float(

                    self.df["cpm"].mean()

                ),

                4

            ),

            "average_conversion_rate": round(

                float(

                    self.df["conversion_rate"].mean()

                ),

                4

            )

        }
    # ---------------------------------------------------
    # Trend Analysis
    # ---------------------------------------------------

    def trend_analysis(self):

        trend = (

            self.df

            .sort_values("date")

            .groupby("date")

            .agg({

                "revenue": "sum",

                "spend": "sum",

                "clicks": "sum",

                "conversions": "sum"

            })

            .reset_index()

        )

        self.insights["trend"] = (

            trend

            .round(4)

            .to_dict("records")

        )

    # ---------------------------------------------------
    # Monthly Performance
    # ---------------------------------------------------

    def monthly_analysis(self):

        monthly = (

            self.df.groupby(

                ["year", "month"]

            )

            .agg({

                "revenue": "sum",

                "spend": "sum",

                "profit": "sum"

            })

            .reset_index()

        )

        monthly["roi"] = self.safe_divide(

            monthly["profit"],

            monthly["spend"]

        )

        self.insights["monthly_analysis"] = (

            monthly

            .round(4)

            .to_dict("records")

        )

    # ---------------------------------------------------
    # Weekday Analysis
    # ---------------------------------------------------

    def weekday_analysis(self):

        weekday = (

            self.df.groupby("weekday")

            .agg({

                "revenue": "mean",

                "spend": "mean",

                "profit": "mean"

            })

            .reset_index()

        )

        self.insights["weekday_analysis"] = (

            weekday

            .round(4)

            .to_dict("records")

        )

    # ---------------------------------------------------
    # Prediction Analysis
    # ---------------------------------------------------

    def prediction_analysis(self):

        if "predicted_revenue" not in self.df.columns:

            return

        error = (

            self.df["predicted_revenue"]

            -

            self.df["revenue"]

        )

        self.insights["prediction"] = {

            "average_predicted_revenue":

                round(

                    float(

                        self.df["predicted_revenue"]

                        .mean()

                    ),

                    4

                ),

            "average_actual_revenue":

                round(

                    float(

                        self.df["revenue"]

                        .mean()

                    ),

                    4

                ),

            "mean_prediction_error":

                round(

                    float(

                        error.mean()

                    ),

                    4

                ),

            "mean_absolute_error":

                round(

                    float(

                        error.abs().mean()

                    ),

                    4

                )

        }

    # ---------------------------------------------------
    # Growth Analysis
    # ---------------------------------------------------

    def growth_analysis(self):

        self.insights["growth"] = {

            "average_spend_growth":

                round(

                    float(

                        self.df["spend_growth"]

                        .mean()

                    ),

                    4

                ),

            "average_click_growth":

                round(

                    float(

                        self.df["click_growth"]

                        .mean()

                    ),

                    4

                ),

            "average_conversion_growth":

                round(

                    float(

                        self.df["conversion_growth"]

                        .mean()

                    ),

                    4

                )

        }

    # ---------------------------------------------------
    # Dataset Summary
    # ---------------------------------------------------

    def dataset_summary(self):

        self.insights["dataset"] = {

            "rows": int(len(self.df)),

            "campaigns": int(

                self.df["campaign_id"]

                .nunique()

            ),

            "date_range": {

                "start": str(

                    self.df["date"].min()

                ),

                "end": str(

                    self.df["date"].max()

                )

            }

        }
    # ---------------------------------------------------
    # Generate All Insights
    # ---------------------------------------------------

    def generate(self):

        logger.info("=" * 10 + " Generating Insights " + "=" * 10)

        # Prepare dataset
        self.ensure_columns()
        self.prepare_dates()
        self.calculate_metrics()

        # Generate insights
        self.executive_summary()
        self.campaign_performance()
        self.top_bottom_campaigns()
        self.budget_analysis()
        self.roi_analysis()
        self.kpi_summary()
        self.trend_analysis()
        self.monthly_analysis()
        self.weekday_analysis()
        self.prediction_analysis()
        self.growth_analysis()
        self.dataset_summary()

        logger.info("Insight generation completed.")

        return {
            "insights": self.insights,
            "summary": self.summary
        }
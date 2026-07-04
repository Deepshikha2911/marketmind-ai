import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """
    Feature Engineering Pipeline

    Creates only features that are available BEFORE revenue is known.
    """

    REQUIRED_COLUMNS = [
        "date",
        "campaign_id",
        "campaign_name",
        "spend",
        "revenue",
        "clicks",
        "impressions",
        "conversions",
        "daily_budget",
    ]

    @staticmethod
    def safe_divide(numerator, denominator):
        denominator = denominator.replace(0, np.nan)
        return (numerator / denominator).fillna(0)

    def transform(self, df: pd.DataFrame):

        logger.info("=" * 10 + " Feature Engineering Started " + "=" * 10)

        df = df.copy()

        ####################################################
        # Ensure required columns exist
        ####################################################

        for column in self.REQUIRED_COLUMNS:

            if column not in df.columns:

                logger.warning(f"{column} missing. Creating default values.")

                if column == "date":
                    df[column] = pd.NaT

                elif column == "campaign_name":
                    df[column] = "Unknown"

                else:
                    df[column] = 0

        ####################################################
        # Date Features
        ####################################################

        df["date"] = pd.to_datetime(df["date"], errors="coerce")

        df["year"] = df["date"].dt.year.fillna(0).astype(int)
        df["month"] = df["date"].dt.month.fillna(0).astype(int)
        df["day"] = df["date"].dt.day.fillna(0).astype(int)
        df["weekday"] = df["date"].dt.weekday.fillna(0).astype(int)

        df["is_weekend"] = (
            df["weekday"]
            .isin([5, 6])
            .astype(int)
        )

        ####################################################
        # Safe Marketing KPIs
        ####################################################

        # These DO NOT reveal revenue.

        df["ctr"] = self.safe_divide(
            df["clicks"],
            df["impressions"]
        )

        df["cpc"] = self.safe_divide(
            df["spend"],
            df["clicks"]
        )

        df["cpm"] = self.safe_divide(
            df["spend"] * 1000,
            df["impressions"]
        )

        df["conversion_rate"] = self.safe_divide(
            df["conversions"],
            df["clicks"]
        )

        df["cost_per_conversion"] = self.safe_divide(
            df["spend"],
            df["conversions"]
        )

        df["budget_utilization"] = self.safe_divide(
            df["spend"],
            df["daily_budget"]
        )

        ####################################################
        # Growth Features
        ####################################################

        if "campaign_id" in df.columns:

            df = df.sort_values(
                ["campaign_id", "date"]
            )

            df["spend_growth"] = (
                df.groupby("campaign_id")["spend"]
                .pct_change()
                .fillna(0)
            )

            df["click_growth"] = (
                df.groupby("campaign_id")["clicks"]
                .pct_change()
                .fillna(0)
            )

            df["conversion_growth"] = (
                df.groupby("campaign_id")["conversions"]
                .pct_change()
                .fillna(0)
            )

        ####################################################
        # Cleanup
        ####################################################

        df.replace(
            [np.inf, -np.inf],
            np.nan,
            inplace=True
        )

        numeric_columns = df.select_dtypes(
            include=np.number
        ).columns

        df[numeric_columns] = (
            df[numeric_columns]
            .fillna(0)
            .round(4)
        )

        df.reset_index(
            drop=True,
            inplace=True
        )

        logger.info(
            f"Feature Engineering Complete | Shape: {df.shape}"
        )

        logger.info("=" * 10 + " Feature Engineering Finished " + "=" * 10)

        return df
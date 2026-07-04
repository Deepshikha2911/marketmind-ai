import logging
from pathlib import Path

import pandas as pd
import numpy as np

from ml.training.predictor import MarketingPredictor

logger = logging.getLogger(__name__)


class RevenueForecaster:
    """
    Revenue Forecasting Engine

    Uses the trained MarketingPredictor to estimate
    future campaign revenue.

    Output:
        output/revenue_forecast.csv
    """

    OUTPUT_PATH = Path("output/revenue_forecast.csv")

    def __init__(self):

        self.predictor = MarketingPredictor()
        self.predictor.load()
    # --------------------------------------------------
    # Generate Future Dates
    # --------------------------------------------------

    def generate_future_dates(
        self,
        last_date,
        periods=30
    ):
        """
        Generate future dates starting after the
        last date in the dataset.
        """

        future_dates = pd.date_range(
            start=last_date + pd.Timedelta(days=1),
            periods=periods,
            freq="D"
        )

        return future_dates
    # --------------------------------------------------
    # Build Future Dataset
    # --------------------------------------------------

    def create_future_dataframe(
        self,
        df: pd.DataFrame,
        periods=30
    ):
        """
        Creates a future dataframe by taking the latest
        record of every campaign and extending it into
        future dates.
        """

        df = df.copy()

        df["date"] = pd.to_datetime(df["date"])

        last_date = df["date"].max()

        future_dates = self.generate_future_dates(
            last_date,
            periods
        )

        future_rows = []

        # Take the latest record for every campaign
        latest_campaigns = (
            df.sort_values("date")
              .groupby("campaign_id")
              .tail(1)
        )

        for _, row in latest_campaigns.iterrows():

            for future_date in future_dates:

                new_row = row.copy()

                new_row["date"] = future_date

                future_rows.append(new_row)

        future_df = pd.DataFrame(future_rows)

        logger.info(
            f"Created {len(future_df)} future prediction rows."
        )

        return future_df
    # --------------------------------------------------
    # Forecast Revenue
    # --------------------------------------------------

    def forecast(
        self,
        df: pd.DataFrame,
        periods=30
    ):
        """
        Forecast future revenue using the trained model.
        """

        logger.info("=" * 60)
        logger.info("Starting Revenue Forecasting")
        logger.info("=" * 60)

        # Create future dataset
        future_df = self.create_future_dataframe(
            df,
            periods
        )

        # Generate date features
        future_df["year"] = future_df["date"].dt.year
        future_df["month"] = future_df["date"].dt.month
        future_df["day"] = future_df["date"].dt.day
        future_df["weekday"] = future_df["date"].dt.weekday
        future_df["is_weekend"] = (
            future_df["weekday"]
            .isin([5, 6])
            .astype(int)
        )

        # Predict revenue
        predictions = self.predictor.predict(
            future_df
        )

        future_df["forecasted_revenue"] = predictions

        logger.info(
            f"Forecast generated for {len(future_df)} rows."
        )

        return future_df
    # --------------------------------------------------
    # Save Forecast
    # --------------------------------------------------

    def save_forecast(
        self,
        forecast_df: pd.DataFrame
    ):
        """
        Save forecast to CSV.
        """

        self.OUTPUT_PATH.parent.mkdir(
            exist_ok=True
        )

        forecast_df.to_csv(
            self.OUTPUT_PATH,
            index=False
        )

        logger.info(
            f"Forecast saved to {self.OUTPUT_PATH}"
        )
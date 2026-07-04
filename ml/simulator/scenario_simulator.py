import logging

import numpy as np
import pandas as pd

from ml.training.predictor import MarketingPredictor

logger = logging.getLogger(__name__)


class ScenarioSimulator:
    """
    Scenario Simulator

    Simulates different marketing strategies and predicts
    how revenue changes using the trained ML model.
    """

    def __init__(self):

        self.predictor = MarketingPredictor()

        try:

            self.predictor.load()

            logger.info(
                "Prediction model loaded successfully."
            )

        except Exception as e:

            logger.warning(
                f"Could not load prediction model : {e}"
            )

            self.predictor = None

    # --------------------------------------------------
    # Utility
    # --------------------------------------------------

    @staticmethod
    def safe_divide(a, b):

        if not isinstance(b, pd.Series):
            b = pd.Series(b)

        b = b.replace(0, np.nan)

        return (a / b).fillna(0)

    # --------------------------------------------------
    # Revenue Prediction
    # --------------------------------------------------

    def predict_revenue(
        self,
        dataframe: pd.DataFrame,
    ):

        df = dataframe.copy()

        if self.predictor is None:

            logger.warning(
                "Predictor unavailable. Using existing revenue."
            )

            df["predicted_revenue"] = df["revenue"]

            return df

        prediction = self.predictor.predict(df)

        df["predicted_revenue"] = prediction

        return df

    # --------------------------------------------------
    # KPI Recalculation
    # --------------------------------------------------

    def recalculate_metrics(
        self,
        dataframe: pd.DataFrame,
    ):

        df = dataframe.copy()

        df["profit"] = (
            df["predicted_revenue"]
            - df["spend"]
        )

        df["roi"] = self.safe_divide(
            df["profit"],
            df["spend"],
        )

        df["roas"] = self.safe_divide(
            df["predicted_revenue"],
            df["spend"],
        )

        df["ctr"] = self.safe_divide(
            df["clicks"],
            df["impressions"],
        )

        df["cpc"] = self.safe_divide(
            df["spend"],
            df["clicks"],
        )

        df["cpm"] = self.safe_divide(
            df["spend"] * 1000,
            df["impressions"],
        )

        df["conversion_rate"] = self.safe_divide(
            df["conversions"],
            df["clicks"],
        )

        return df
    # --------------------------------------------------
    # Generic Simulation Engine
    # --------------------------------------------------

    def simulate(
        self,
        dataframe: pd.DataFrame,
        budget_change: float = 0,
        ctr_change: float = 0,
        conversion_change: float = 0,
    ):
        """
        Simulate marketing scenarios.

        Parameters
        ----------
        budget_change : percentage (+20, -10, etc.)

        ctr_change : percentage increase/decrease in clicks

        conversion_change : percentage increase/decrease
                            in conversions
        """

        logger.info("=" * 60)
        logger.info("Running Scenario Simulation")
        logger.info("=" * 60)

        df = dataframe.copy()

        # ----------------------------
        # Budget Change
        # ----------------------------

        if budget_change != 0:

            multiplier = 1 + budget_change / 100

            df["spend"] *= multiplier

        # ----------------------------
        # CTR Change
        # ----------------------------

        if ctr_change != 0:

            multiplier = 1 + ctr_change / 100

            df["clicks"] *= multiplier

        # ----------------------------
        # Conversion Change
        # ----------------------------

        if conversion_change != 0:

            multiplier = 1 + conversion_change / 100

            df["conversions"] *= multiplier

        # ----------------------------
        # Predict Revenue
        # ----------------------------

        df = self.predict_revenue(df)

        # ----------------------------
        # Recalculate KPIs
        # ----------------------------

        df = self.recalculate_metrics(df)

        logger.info(
            f"Scenario simulation completed for {len(df)} rows."
        )

        logger.info("=" * 60)

        return df
    # --------------------------------------------------
    # Ready-made Scenarios
    # --------------------------------------------------

    def increase_budget(
        self,
        dataframe: pd.DataFrame,
        percent: float = 20,
    ):
        """
        Increase campaign budget.
        """

        return self.simulate(
            dataframe,
            budget_change=percent,
        )

    def reduce_budget(
        self,
        dataframe: pd.DataFrame,
        percent: float = 20,
    ):
        """
        Reduce campaign budget.
        """

        return self.simulate(
            dataframe,
            budget_change=-percent,
        )

    def pause_campaign(
        self,
        dataframe: pd.DataFrame,
    ):
        """
        Pause campaign completely.
        """

        df = dataframe.copy()

        df["spend"] = 0
        df["clicks"] = 0
        df["impressions"] = 0
        df["conversions"] = 0

        df = self.predict_revenue(df)

        return self.recalculate_metrics(df)

    def increase_ctr(
        self,
        dataframe: pd.DataFrame,
        percent: float = 15,
    ):
        """
        Increase CTR by increasing clicks.
        """

        return self.simulate(
            dataframe,
            ctr_change=percent,
        )

    def improve_conversion_rate(
        self,
        dataframe: pd.DataFrame,
        percent: float = 15,
    ):
        """
        Improve conversion rate.
        """

        return self.simulate(
            dataframe,
            conversion_change=percent,
        )

    def increase_impressions(
        self,
        dataframe: pd.DataFrame,
        percent: float = 20,
    ):
        """
        Increase impressions.
        """

        df = dataframe.copy()

        df["impressions"] *= (
            1 + percent / 100
        )

        df = self.predict_revenue(df)

        return self.recalculate_metrics(df)

    def increase_clicks(
        self,
        dataframe: pd.DataFrame,
        percent: float = 20,
    ):
        """
        Increase clicks.
        """

        df = dataframe.copy()

        df["clicks"] *= (
            1 + percent / 100
        )

        df = self.predict_revenue(df)

        return self.recalculate_metrics(df)

    def increase_conversions(
        self,
        dataframe: pd.DataFrame,
        percent: float = 20,
    ):
        """
        Increase conversions.
        """

        return self.simulate(
            dataframe,
            conversion_change=percent,
        )
    # --------------------------------------------------
    # Revenue Boost Simulation
    # --------------------------------------------------

    def boost_revenue(
        self,
        dataframe: pd.DataFrame,
        percent: float = 10,
    ):
        """
        Artificially increase predicted revenue.
        Useful for business planning scenarios.
        """

        df = dataframe.copy()

        df = self.predict_revenue(df)

        df["predicted_revenue"] *= (
            1 + percent / 100
        )

        return self.recalculate_metrics(df)

    # --------------------------------------------------
    # Custom Scenario
    # --------------------------------------------------

    def custom_scenario(
        self,
        dataframe: pd.DataFrame,
        budget_change: float = 0,
        ctr_change: float = 0,
        conversion_change: float = 0,
        impression_change: float = 0,
    ):
        """
        Run a fully customized scenario by combining
        multiple marketing changes together.
        """

        logger.info("=" * 60)
        logger.info("Running Custom Scenario")
        logger.info("=" * 60)

        df = dataframe.copy()

        if budget_change != 0:
            df["spend"] *= (
                1 + budget_change / 100
            )

        if ctr_change != 0:
            df["clicks"] *= (
                1 + ctr_change / 100
            )

        if conversion_change != 0:
            df["conversions"] *= (
                1 + conversion_change / 100
            )

        if impression_change != 0:
            df["impressions"] *= (
                1 + impression_change / 100
            )

        df = self.predict_revenue(df)

        df = self.recalculate_metrics(df)

        logger.info(
            f"Custom scenario completed for {len(df)} rows."
        )

        logger.info("=" * 60)

        return df
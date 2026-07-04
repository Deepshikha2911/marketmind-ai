import pandas as pd
import numpy as np
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


class DataPreprocessor:
    """
    Handles basic preprocessing before feature engineering.

    Responsibilities
    ----------------
    ✓ Clean missing values
    ✓ Convert data types
    ✓ Remove duplicate rows

    Feature engineering is handled separately by FeatureEngineer.
    """

    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()

    # ----------------------------------------------------
    # Missing Values
    # ----------------------------------------------------

    def clean_missing_values(self):

        numeric_cols = self.df.select_dtypes(
            include=[np.number]
        ).columns

        self.df[numeric_cols] = (
            self.df[numeric_cols]
            .fillna(0)
        )

        logger.info("Missing values cleaned.")

        return self

    # ----------------------------------------------------
    # Data Types
    # ----------------------------------------------------

    def convert_data_types(self):

        numeric_cols = self.df.select_dtypes(
            include=["int64", "float64"]
        ).columns

        for col in numeric_cols:

            self.df[col] = pd.to_numeric(
                self.df[col],
                errors="coerce"
            ).fillna(0)

        logger.info("Data types converted.")

        return self

    # ----------------------------------------------------
    # Remove Duplicates
    # ----------------------------------------------------

    def remove_duplicates(self):

        initial_rows = len(self.df)

        self.df = self.df.drop_duplicates()

        removed = initial_rows - len(self.df)

        logger.info(f"Removed {removed} duplicate rows.")

        return self

    # ----------------------------------------------------
    # Metric Calculation
    # ----------------------------------------------------

    def calculate_metrics(self):
        """
        Metrics are now calculated inside FeatureEngineer.

        Keeping this method maintains compatibility with
        the existing pipeline.
        """

        logger.info(
            "Skipping metric calculation (handled in FeatureEngineer)."
        )

        return self

    # ----------------------------------------------------
    # Complete Pipeline
    # ----------------------------------------------------

    def preprocess(self):

        try:

            (
                self
                .clean_missing_values()
                .convert_data_types()
                .remove_duplicates()
                .calculate_metrics()
            )

            logger.info(
                "Preprocessing pipeline completed successfully."
            )

            return self.df

        except Exception as e:

            logger.error(
                f"Error during preprocessing: {e}"
            )

            raise
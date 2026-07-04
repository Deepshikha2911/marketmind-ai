import logging
import pandas as pd

logger = logging.getLogger(__name__)


class DataValidator:
    """
    Validates and cleans marketing datasets before ML processing.
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
        "daily_budget"
    ]

    NUMERIC_COLUMNS = [
        "spend",
        "revenue",
        "clicks",
        "impressions",
        "conversions",
        "daily_budget"
    ]

    def validate(self, df: pd.DataFrame) -> pd.DataFrame:

        logger.info("Starting dataset validation...")

        # Check required columns
        for col in self.REQUIRED_COLUMNS:
            if col not in df.columns:
                raise ValueError(f"Required column '{col}' is missing.")

        # Remove duplicate rows
        duplicates = df.duplicated().sum()

        if duplicates > 0:
            logger.warning(f"Removed {duplicates} duplicate rows.")
            df = df.drop_duplicates()

        # Convert dates
        df["date"] = pd.to_datetime(
            df["date"],
            errors="coerce"
        )

        invalid_dates = df["date"].isna().sum()

        if invalid_dates > 0:
            logger.warning(f"{invalid_dates} invalid dates found.")

        # Numeric conversion
        for col in self.NUMERIC_COLUMNS:

            df[col] = pd.to_numeric(
                df[col],
                errors="coerce"
            )

        # Missing values
        missing = df.isna().sum()

        for column, count in missing.items():

            if count > 0:

                logger.warning(
                    f"{column}: {count} missing values."
                )

        # Fill numeric NaN
        df[self.NUMERIC_COLUMNS] = df[self.NUMERIC_COLUMNS].fillna(0)

        # Campaign name
        df["campaign_name"] = df["campaign_name"].fillna("Unknown")

        # Negative values
        for col in self.NUMERIC_COLUMNS:

            negatives = (df[col] < 0).sum()

            if negatives > 0:

                logger.warning(
                    f"{negatives} negative values detected in {col}."
                )

                df.loc[df[col] < 0, col] = 0

        logger.info("Validation complete.")

        return df
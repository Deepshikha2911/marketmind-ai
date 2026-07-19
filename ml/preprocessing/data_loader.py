import logging
from pathlib import Path
from typing import Dict

import pandas as pd

logger = logging.getLogger(__name__)


class UniversalDatasetLoader:
    """
    Universal Dataset Loader

    Converts any marketing dataset into one standard schema.
    """

    COLUMN_SYNONYMS = {

        "date": [
            "date",
            "day",
            "timeperiod",
            "time_period",
            "date_start",
            "report_date",
            "segments_date"
        ],

        "campaign_id": [
            "campaign_id",
            "campaignid",
            "campaign"
        ],

        "campaign_name": [
            "campaign_name",
            "campaign title",
            "campaigntitle",
            "campaign"
        ],

        "spend": [
            "spend",
            "cost",
            "amount_spent",
            "expense",
            "metrics_cost_micros"
        ],

        "revenue": [
            "revenue",
            "conversion_value",
            "purchase_value",
            "sales",
            "metrics_conversions_value",
            "conversion"
        ],

        "clicks": [
            "clicks",
            "link_clicks",
            "metrics_clicks"
        ],

        "impressions": [
            "impressions",
            "imps",
            "metrics_impressions"
        ],

        "conversions": [
            "conversions",
            "purchases",
            "metrics_conversions"
        ],

        "daily_budget": [
            "daily_budget",
            "budget",
            "budget_amount",
            "campaign_budget_amount"
        ],

        "channel": [
            "channel",
            "source",
            "medium",
            "network",
            "platform"
        ]

    }

    TARGET_COLUMNS = [
        "date",
        "campaign_id",
        "campaign_name",
        "spend",
        "revenue",
        "clicks",
        "impressions",
        "conversions",
        "daily_budget",
        "channel"
    ]

    def __init__(self):
        pass

    @staticmethod
    def normalize(column: str) -> str:

        return (
            column.lower()
            .replace("_", "")
            .replace("-", "")
            .replace(" ", "")
        )

    def rename_columns(self, df: pd.DataFrame) -> pd.DataFrame:

        new_columns: Dict[str, str] = {}

        for original in df.columns:

            normalized = self.normalize(original)

            for target, synonyms in self.COLUMN_SYNONYMS.items():

                normalized_synonyms = [
                    self.normalize(x)
                    for x in synonyms
                ]

                if normalized in normalized_synonyms:
                    new_columns[original] = target
                    break

        df = df.rename(columns=new_columns)

        return df

    def clean_dataframe(self, df: pd.DataFrame):

        # Save original column names before renaming
        original_columns = df.columns.tolist()

        # Rename columns
        df = self.rename_columns(df)

        # Add missing columns
        for col in self.TARGET_COLUMNS:

            if col not in df.columns:

                logger.warning(f"{col} missing. Filling default value.")

                if col == "campaign_name":
                    df[col] = "Unknown"

                elif col == "date":
                    df[col] = pd.NaT

                elif col == "channel":
                    df[col] = "Unknown"

                else:
                    df[col] = 0

        numeric_columns = [
            "spend",
            "revenue",
            "clicks",
            "impressions",
            "conversions",
            "daily_budget"
        ]

        for col in numeric_columns:
            df[col] = pd.to_numeric(
                df[col],
                errors="coerce"
            ).fillna(0)

        # Google Ads stores cost in micros
        if "metrics_cost_micros" in original_columns:
            df["spend"] = df["spend"] / 1_000_000

        return df[self.TARGET_COLUMNS]

    def load_csv(self, path: str):

        logger.info(f"Loading {path}")

        df = pd.read_csv(path)

        return self.clean_dataframe(df)

    def load_folder(self, folder: str):

        folder = Path(folder)

        dfs = []

        for file in folder.glob("*.csv"):

            try:

                dfs.append(self.load_csv(file))

                logger.info(f"Loaded {file.name}")

            except Exception as e:

                logger.error(f"Failed {file.name}: {e}")

        if len(dfs) == 0:
            raise Exception("No datasets found.")

        return pd.concat(
            dfs,
            ignore_index=True
        )
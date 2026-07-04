import json
import logging
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

logger = logging.getLogger(__name__)


class MarketingPredictor:
    """
    Production-ready Marketing Predictor.

    Features
    --------
    ✓ Automatic feature detection
    ✓ Feature scaling
    ✓ Random Forest training
    ✓ Model evaluation
    ✓ Feature importance
    ✓ Save / Load model
    ✓ Predict on unseen datasets
    """

    MODEL_DIR = Path("models")
    OUTPUT_DIR = Path("output")

    MODEL_PATH = MODEL_DIR / "marketing_model.pkl"
    SCALER_PATH = MODEL_DIR / "scaler.pkl"
    METADATA_PATH = MODEL_DIR / "metadata.json"
    METRICS_PATH = OUTPUT_DIR / "metrics.json"

    IGNORE_COLUMNS = [
        "date",
        "campaign_id",
        "campaign_name",
        "channel",
        # Leakage features
        "profit",
        "ROI",
        "ROAS",
        "roi",
        "roas",
        "revenue_per_click",
        "revenue_growth",
    ]

    def __init__(self):

        self.MODEL_DIR.mkdir(exist_ok=True)
        self.OUTPUT_DIR.mkdir(exist_ok=True)

        self.model = None
        self.scaler = None
        self.feature_columns = []
        self.target_column = None

    # --------------------------------------------------
    # Feature Detection
    # --------------------------------------------------

    def get_feature_columns(
        self,
        dataframe: pd.DataFrame,
        target_column: str
    ):

        features = []

        for column in dataframe.columns:

            if column == target_column:
                continue

            if column in self.IGNORE_COLUMNS:
                continue

            if pd.api.types.is_numeric_dtype(dataframe[column]):
                features.append(column)

        logger.info(f"Detected {len(features)} feature columns.")

        return features

    # --------------------------------------------------
    # Train
    # --------------------------------------------------

    def train(
        self,
        dataframe: pd.DataFrame,
        target_column="revenue",
        test_size=0.2,
        random_state=42,
    ):

        logger.info("Training Marketing Predictor...")

        self.target_column = target_column

        self.feature_columns = self.get_feature_columns(
            dataframe,
            target_column,
        )

        X = dataframe[self.feature_columns]
        y = dataframe[target_column]

        (
            X_train,
            X_test,
            y_train,
            y_test,
        ) = train_test_split(
            X,
            y,
            test_size=test_size,
            shuffle=False
        )

        self.scaler = StandardScaler()

        X_train = self.scaler.fit_transform(X_train)
        X_test = self.scaler.transform(X_test)

        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            random_state=random_state,
            n_jobs=-1,
        )

        self.model.fit(
            X_train,
            y_train,
        )

        logger.info("Training Complete.")

        metrics = self.evaluate(
            X_test,
            y_test,
        )

        self.save()

        return metrics

    # --------------------------------------------------
    # Evaluation
    # --------------------------------------------------

    def evaluate(
        self,
        X_test,
        y_test,
    ):

        predictions = self.model.predict(X_test)

        metrics = {

            "MAE": float(
                mean_absolute_error(
                    y_test,
                    predictions,
                )
            ),

            "RMSE": float(
                np.sqrt(
                    mean_squared_error(
                        y_test,
                        predictions,
                    )
                )
            ),

            "R2": float(
                r2_score(
                    y_test,
                    predictions,
                )
            ),
        }

        with open(
            self.METRICS_PATH,
            "w",
        ) as file:

            json.dump(
                metrics,
                file,
                indent=4,
            )

        logger.info(metrics)

        return metrics

    # --------------------------------------------------
    # Feature Importance
    # --------------------------------------------------

    def feature_importance(self):

        if self.model is None:
            return {}

        importance = {}

        for feature, score in zip(
            self.feature_columns,
            self.model.feature_importances_,
        ):
            importance[feature] = round(
                float(score),
                4,
            )

        return dict(
            sorted(
                importance.items(),
                key=lambda x: x[1],
                reverse=True,
            )
        )

    # --------------------------------------------------
    # Save
    # --------------------------------------------------

    def save(self):

        joblib.dump(
            self.model,
            self.MODEL_PATH,
        )

        joblib.dump(
            self.scaler,
            self.SCALER_PATH,
        )

        metadata = {

            "features": self.feature_columns,

            "target": self.target_column,

            "feature_importance":
                self.feature_importance(),
        }

        with open(
            self.METADATA_PATH,
            "w",
        ) as file:

            json.dump(
                metadata,
                file,
                indent=4,
            )

        logger.info("Model saved.")

    # --------------------------------------------------
    # Load
    # --------------------------------------------------

    def load(self):

        self.model = joblib.load(
            self.MODEL_PATH
        )

        self.scaler = joblib.load(
            self.SCALER_PATH
        )

        with open(
            self.METADATA_PATH,
        ) as file:

            metadata = json.load(file)

        self.feature_columns = metadata["features"]
        self.target_column = metadata["target"]

        logger.info("Model loaded.")

    # --------------------------------------------------
    # Predict
    # --------------------------------------------------

    def predict(
        self,
        dataframe: pd.DataFrame,
    ):

        if self.model is None:
            self.load()

        dataframe = dataframe.copy()

        for feature in self.feature_columns:

            if feature not in dataframe.columns:
                dataframe[feature] = 0

        dataframe = dataframe[self.feature_columns]

        dataframe = self.scaler.transform(
            dataframe
        )

        predictions = self.model.predict(
            dataframe
        )

        return predictions
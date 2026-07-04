import logging
from pathlib import Path

import pandas as pd

from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.validator import DataValidator
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.features.feature_engineering import FeatureEngineer
from ml.training.predictor import MarketingPredictor

logger = logging.getLogger(__name__)


class PredictionPipeline:
    """
    Complete prediction pipeline.

    Flow

    CSV
      ↓
    Load
      ↓
    Validate
      ↓
    Preprocess
      ↓
    Feature Engineering
      ↓
    Load Trained Model
      ↓
    Predict Revenue
      ↓
    Save Predictions
    """

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.feature_engineer = FeatureEngineer()
        self.predictor = MarketingPredictor()

    def predict(
        self,
        csv_path,
        output_path="output/predictions.csv"
    ):

        logger.info("=" * 60)
        logger.info("Starting Prediction Pipeline")
        logger.info("=" * 60)

        #################################################
        # Load Dataset
        #################################################

        df = self.loader.load_csv(csv_path)

        logger.info(f"Loaded dataset : {df.shape}")

        #################################################
        # Validate
        #################################################

        df = self.validator.validate(df)

        #################################################
        # Preprocess
        #################################################

        df = DataPreprocessor(df).preprocess()

        #################################################
        # Feature Engineering
        #################################################

        df = self.feature_engineer.transform(df)

        #################################################
        # Predict
        #################################################

        predictions = self.predictor.predict(df)

        #################################################
        # Save
        #################################################

        result = df.copy()

        result["predicted_revenue"] = predictions

        Path(output_path).parent.mkdir(
            exist_ok=True
        )

        result.to_csv(
            output_path,
            index=False
        )

        logger.info(f"Predictions saved to {output_path}")

        logger.info("=" * 60)
        logger.info("Prediction Pipeline Finished")
        logger.info("=" * 60)

        return result
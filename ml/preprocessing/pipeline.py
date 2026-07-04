import logging

from .data_loader import UniversalDatasetLoader
from .validator import DataValidator
from .preprocessing import DataPreprocessor
from ..features.feature_engineering import FeatureEngineer

logger = logging.getLogger(__name__)


class DataPipeline:
    """
    Complete ML data pipeline.

    Flow:
        Load Dataset
            ↓
        Validate Dataset
            ↓
        Preprocess Dataset
            ↓
        Feature Engineering
            ↓
        Return Final DataFrame
    """

    def __init__(self):
        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()

    def run(self, folder_path: str):
        """
        Execute the complete preprocessing pipeline.

        Args:
            folder_path (str):
                Folder containing one or more CSV files.

        Returns:
            pandas.DataFrame:
                Fully cleaned and engineered dataset.
        """

        logger.info("=" * 60)
        logger.info("Starting MarketMindAI Data Pipeline")
        logger.info("=" * 60)

        # ----------------------------
        # Step 1 : Load Dataset
        # ----------------------------
        df = self.loader.load_folder(folder_path)

        logger.info(f"Loaded dataset shape : {df.shape}")

        # ----------------------------
        # Step 2 : Validate Dataset
        # ----------------------------
        df = self.validator.validate(df)

        logger.info(f"Validated dataset shape : {df.shape}")

        # ----------------------------
        # Step 3 : Preprocessing
        # ----------------------------
        preprocessor = DataPreprocessor(df)

        df = preprocessor.preprocess()

        logger.info(f"Preprocessed dataset shape : {df.shape}")

        # ----------------------------
        # Step 4 : Feature Engineering
        # ----------------------------
        df = self.engineer.transform(df)

        logger.info(f"Feature engineered dataset shape : {df.shape}")

        logger.info("=" * 60)
        logger.info("Data Pipeline Completed Successfully")
        logger.info("=" * 60)

        return df
import logging
from pathlib import Path

from ml.preprocessing.pipeline import DataPipeline
from ml.training.predictor import MarketingPredictor

# -------------------------------------------------------
# Logging Configuration
# -------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


class TrainingPipeline:
    """
    Complete ML Training Pipeline.

    Flow:
        Load Data
            ↓
        Validate
            ↓
        Preprocess
            ↓
        Feature Engineering
            ↓
        Train Model
            ↓
        Save Model
            ↓
        Save Metrics
    """

    def __init__(self):

        self.pipeline = DataPipeline()

        self.predictor = MarketingPredictor()

    def run(
        self,
        dataset_folder="data/raw",
        target_column="revenue"
    ):

        logger.info("=" * 60)
        logger.info("Starting Training Pipeline")
        logger.info("=" * 60)

        # -----------------------------------
        # Step 1 : Load + Clean Dataset
        # -----------------------------------

        df = self.pipeline.run(dataset_folder)

        logger.info(f"Dataset Ready : {df.shape}")

        # -----------------------------------
        # Step 2 : Train Model
        # -----------------------------------

        metrics = self.predictor.train(
            dataframe=df,
            target_column=target_column
        )

        logger.info("Training Completed")

        # -----------------------------------
        # Step 3 : Print Metrics
        # -----------------------------------

        logger.info("Model Performance")

        for metric, value in metrics.items():

            logger.info(f"{metric}: {value:.4f}")

        logger.info("=" * 60)
        logger.info("Training Pipeline Finished")
        logger.info("=" * 60)

        return metrics


if __name__ == "__main__":

    trainer = TrainingPipeline()

    trainer.run()
import logging
from pathlib import Path

from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.validator import DataValidator
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.features.feature_engineering import FeatureEngineer
from ml.training.predictor import MarketingPredictor
from ml.optimizer.budget_optimizer import BudgetOptimizer


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


def main():

    logger.info("=" * 60)
    logger.info("Starting Budget Optimization Pipeline")
    logger.info("=" * 60)

    # ----------------------------------
    # Load Dataset
    # ----------------------------------

    dataset_path = "data/raw/google_ads_campaign_stats.csv"

    loader = UniversalDatasetLoader()

    df = loader.load_csv(dataset_path)

    logger.info(f"Loaded dataset : {df.shape}")

    # ----------------------------------
    # Validation
    # ----------------------------------

    validator = DataValidator()

    df = validator.validate(df)

    # ----------------------------------
    # Preprocessing
    # ----------------------------------

    preprocessor = DataPreprocessor(df)

    df = preprocessor.preprocess()

    # ----------------------------------
    # Feature Engineering
    # ----------------------------------

    engineer = FeatureEngineer()

    df = engineer.transform(df)

    # ----------------------------------
    # Revenue Prediction
    # ----------------------------------

    predictor = MarketingPredictor()

    predictions = predictor.predict(df)

    df["predicted_revenue"] = predictions

    # ----------------------------------
    # Budget Optimization
    # ----------------------------------

    optimizer = BudgetOptimizer()

    recommendations = optimizer.optimize(df)

    # ----------------------------------
    # Save Output
    # ----------------------------------

    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    output_file = output_dir / "budget_recommendations.csv"

    recommendations.to_csv(
        output_file,
        index=False
    )

    logger.info(f"Recommendations saved to {output_file}")

    logger.info("=" * 60)
    logger.info("Budget Optimization Completed")
    logger.info("=" * 60)

    print("\nBudget Optimization Completed.")


if __name__ == "__main__":
    main()
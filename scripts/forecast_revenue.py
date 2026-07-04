import logging

from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.validator import DataValidator
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.features.feature_engineering import FeatureEngineer
from ml.forecasting.forecast_engine import RevenueForecaster


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


def main():

    logger.info("=" * 60)
    logger.info("Starting Revenue Forecast Pipeline")
    logger.info("=" * 60)

    # ----------------------------------
    # Load Dataset
    # ----------------------------------

    loader = UniversalDatasetLoader()

    df = loader.load_csv(
        "data/raw/google_ads_campaign_stats.csv"
    )

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
    # Forecast
    # ----------------------------------

    forecaster = RevenueForecaster()

    forecast_df = forecaster.forecast(
        df,
        periods=30
    )

    logger.info("=" * 60)
    logger.info("Revenue Forecast Completed")
    logger.info("=" * 60)

    print("\nRevenue Forecast Completed.")
    print(f"Forecast rows : {len(forecast_df)}")
    print("Saved to output/revenue_forecast.csv")


if __name__ == "__main__":
    main()
import logging

from ml.forecasting.predict_pipeline import PredictionPipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

pipeline = PredictionPipeline()

pipeline.predict(
    "data/raw/google_ads_campaign_stats.csv"
)

print("\nPrediction Completed.")
from ml.forecasting.forecast_engine import RevenueForecaster
from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.preprocessing.validator import DataValidator
from ml.features.feature_engineering import FeatureEngineer


class ForecastService:

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()
        self.forecaster = RevenueForecaster()

    def forecast(self, csv_path: str):

        # Load dataset
        df = self.loader.load_csv(csv_path)

        # Validate
        df = self.validator.validate(df)

        # Preprocess
        df = DataPreprocessor(df).preprocess()

        # Feature Engineering
        df = self.engineer.transform(df)

        # Generate revenue forecast
        forecast_df = self.forecaster.forecast(df)

        return forecast_df
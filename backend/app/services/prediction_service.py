from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.validator import DataValidator
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.features.feature_engineering import FeatureEngineer
from ml.training.predictor import MarketingPredictor


class PredictionService:

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()

        self.predictor = MarketingPredictor()
        self.predictor.load()

    def predict(self, csv_path: str):

        # Load dataset
        df = self.loader.load_csv(csv_path)

        # Validate
        df = self.validator.validate(df)

        # Preprocess
        df = DataPreprocessor(df).preprocess()

        # Feature Engineering
        df = self.engineer.transform(df)

        # Predict revenue
        predictions = self.predictor.predict(df)

        # Add prediction column
        df["predicted_revenue"] = predictions

        return df
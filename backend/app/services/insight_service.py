from ml.insights.insight_generator import InsightGenerator
from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.preprocessing.validator import DataValidator
from ml.features.feature_engineering import FeatureEngineer


class InsightService:

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()

    def generate(self, csv_path: str):

        # Load dataset
        df = self.loader.load_csv(csv_path)

        # Validate
        df = self.validator.validate(df)

        # Preprocess
        df = DataPreprocessor(df).preprocess()

        # Feature Engineering
        df = self.engineer.transform(df)

        # Generate insights
        generator = InsightGenerator(df)

        return generator.generate()
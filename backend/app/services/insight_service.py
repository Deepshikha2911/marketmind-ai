from ml.insights.insight_generator import InsightGenerator
from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.preprocessing.validator import DataValidator
from ml.features.feature_engineering import FeatureEngineer
import pandas as pd
from typing import Union


class InsightService:

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()

    def generate(self, csv_path_or_df: Union[str, pd.DataFrame]):

        # Accept either a file path (string) or a pre-loaded DataFrame
        if isinstance(csv_path_or_df, str):
            df = self.loader.load_csv(csv_path_or_df)
        else:
            df = csv_path_or_df.copy()
            # Defensive: drop duplicate column names which can break downstream operations
            if df.columns.duplicated().any():
                df = df.loc[:, ~df.columns.duplicated()]

        # Validate
        df = self.validator.validate(df)

        # Preprocess
        df = DataPreprocessor(df).preprocess()

        # Feature Engineering
        df = self.engineer.transform(df)

        # Generate insights
        generator = InsightGenerator(df)
        generated = generator.generate()
        payload = generated["insights"]
        # Return a normalized structure: keep insights as a single dict and separate summary
        return {"insights": payload, "summary": generated["summary"]}
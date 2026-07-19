import logging

from ml.features.feature_engineering import FeatureEngineer
from ml.optimizer.budget_optimizer import BudgetOptimizer
from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.preprocessing.validator import DataValidator
from ml.training.predictor import MarketingPredictor

logger = logging.getLogger(__name__)


class BudgetService:

    def __init__(self):
        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()
        self.optimizer = BudgetOptimizer()

        self.predictor = MarketingPredictor()
        self.predictor_ready = False
        try:
            self.predictor.load()
            self.predictor_ready = True
        except Exception as exc:
            logger.warning("Predictor model is unavailable; using dataset-driven revenue estimates. %s", exc)

    def _predict_revenue(self, df):
        if self.predictor_ready:
            try:
                return self.predictor.predict(df)
            except Exception as exc:
                logger.warning("Prediction fallback failed; using dataset-derived estimates. %s", exc)

        return self.optimizer._estimate_predicted_revenue(df)

    def optimize(self, csv_path: str):
        df = self.loader.load_csv(csv_path)
        df = self.validator.validate(df)
        df = DataPreprocessor(df).preprocess()
        df = self.engineer.transform(df)

        if "predicted_revenue" not in df.columns or df["predicted_revenue"].eq(0).all():
            df["predicted_revenue"] = self._predict_revenue(df)

        return self.optimizer.optimize(df)
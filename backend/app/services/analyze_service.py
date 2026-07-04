from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.validator import DataValidator
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.features.feature_engineering import FeatureEngineer

from ml.training.predictor import MarketingPredictor
from ml.insights.insight_generator import InsightGenerator
from ml.optimizer.budget_optimizer import BudgetOptimizer
from ml.forecasting.forecast_engine import RevenueForecaster
from ml.simulator.scenario_simulator import ScenarioSimulator


class AnalyzeService:

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()

        self.predictor = MarketingPredictor()
        self.predictor.load()

        self.forecaster = RevenueForecaster()
        self.optimizer = BudgetOptimizer()
        self.simulator = ScenarioSimulator()

    def analyze(self, csv_path: str):

        # Load dataset
        df = self.loader.load_csv(csv_path)

        # Validate
        df = self.validator.validate(df)

        # Preprocess
        df = DataPreprocessor(df).preprocess()

        # Feature Engineering
        df = self.engineer.transform(df)

        # Prediction
        predictions = self.predictor.predict(df)
        df["predicted_revenue"] = predictions

        # Insights
        insights = InsightGenerator(df).generate()

        # Budget Optimization
        budget = self.optimizer.optimize(df)

        # Revenue Forecast
        forecast = self.forecaster.forecast(df)

        # Scenario Simulation
        scenarios = {
            "increase_budget": self.simulator.increase_budget(df),
            "reduce_budget": self.simulator.reduce_budget(df),
            "pause_campaign": self.simulator.pause_campaign(df),
        }

        return {
            "success": True,
            "message": "Complete analysis completed successfully.",
            "data": {
                "prediction_rows": len(df),
                "insights": insights,
                "budget_rows": len(budget),
                "forecast_rows": len(forecast),
                "scenario_count": len(scenarios),
            },
        }
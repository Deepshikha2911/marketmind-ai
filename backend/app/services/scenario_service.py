from ml.simulator.scenario_simulator import ScenarioSimulator
from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.preprocessing.validator import DataValidator
from ml.features.feature_engineering import FeatureEngineer


class ScenarioService:

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()
        self.simulator = ScenarioSimulator()

    def simulate(self, csv_path: str):

        # Load dataset
        df = self.loader.load_csv(csv_path)

        # Validate
        df = self.validator.validate(df)

        # Preprocess
        df = DataPreprocessor(df).preprocess()

        # Feature Engineering
        df = self.engineer.transform(df)

        # Run all simulation scenarios
        scenarios = {
            "increase_budget": self.simulator.increase_budget(df),
            "reduce_budget": self.simulator.reduce_budget(df),
            "pause_campaign": self.simulator.pause_campaign(df),
            "increase_ctr": self.simulator.increase_ctr(df),
            "improve_conversion_rate": self.simulator.improve_conversion_rate(df),
            "boost_revenue": self.simulator.boost_revenue(df),
        }

        return scenarios
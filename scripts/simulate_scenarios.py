import logging
from pathlib import Path

import pandas as pd

from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.validator import DataValidator
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.features.feature_engineering import FeatureEngineer
from ml.simulator.scenario_simulator import ScenarioSimulator


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


def main():

    logger.info("=" * 60)
    logger.info("Starting Scenario Simulation Pipeline")
    logger.info("=" * 60)

    # --------------------------------------------------
    # Load Dataset
    # --------------------------------------------------

    loader = UniversalDatasetLoader()

    df = loader.load_csv(
        "data/raw/google_ads_campaign_stats.csv"
    )

    logger.info(f"Loaded dataset : {df.shape}")

    # --------------------------------------------------
    # Validation
    # --------------------------------------------------

    validator = DataValidator()

    df = validator.validate(df)

    # --------------------------------------------------
    # Preprocessing
    # --------------------------------------------------

    preprocessor = DataPreprocessor(df)

    df = preprocessor.preprocess()

    # --------------------------------------------------
    # Feature Engineering
    # --------------------------------------------------

    engineer = FeatureEngineer()

    df = engineer.transform(df)

    # --------------------------------------------------
    # Scenario Simulator
    # --------------------------------------------------

    simulator = ScenarioSimulator()

    scenarios = {

        "increase_budget": simulator.increase_budget(df, 20),

        "reduce_budget": simulator.reduce_budget(df, 20),

        "pause_campaign": simulator.pause_campaign(df),

        "increase_ctr": simulator.increase_ctr(df, 15),

        "improve_conversion_rate":
            simulator.improve_conversion_rate(df, 15),

        "boost_revenue":
            simulator.boost_revenue(df, 10),
    }

    output_dir = Path("output/scenarios")
    output_dir.mkdir(parents=True, exist_ok=True)

    for name, scenario_df in scenarios.items():

        output_file = output_dir / f"{name}.csv"

        scenario_df.to_csv(
            output_file,
            index=False
        )

        logger.info(f"Saved {output_file}")

    logger.info("=" * 60)
    logger.info("Scenario Simulation Completed")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
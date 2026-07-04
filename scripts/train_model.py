import logging

from ml.training.train_pipeline import TrainingPipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


def main():

    logger.info("=" * 60)
    logger.info("MarketMindAI Model Training")
    logger.info("=" * 60)

    trainer = TrainingPipeline()

    metrics = trainer.run(
        dataset_folder="data/raw",
        target_column="revenue"
    )

    print("\n")
    print("=" * 50)
    print("TRAINING COMPLETED")
    print("=" * 50)

    print("\nModel Performance")

    for metric, value in metrics.items():
        print(f"{metric:<10}: {value:.4f}")

    print("\nModel saved successfully.")


if __name__ == "__main__":
    main()
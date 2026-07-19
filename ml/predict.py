#!/usr/bin/env python3
"""Standalone prediction CLI for hackathon submission."""

import argparse
import json
import logging
import pickle
import sys
from pathlib import Path

import pandas as pd

try:
    import joblib
except ModuleNotFoundError:  # pragma: no cover - fallback for minimal environments
    joblib = None

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

logger = logging.getLogger(__name__)


def parse_args():
    parser = argparse.ArgumentParser(description="Run predictions with a trained marketing model")
    parser.add_argument("--features", required=True, help="Path to the feature CSV file")
    parser.add_argument("--model", required=True, help="Path to the trained model file")
    parser.add_argument("--output", required=True, help="Path to the output predictions CSV")
    return parser.parse_args()


def load_model_components(model_path: str):
    model_path = Path(model_path)
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    if joblib is not None:
        model = joblib.load(model_path)
    else:
        with model_path.open("rb") as handle:
            model = pickle.load(handle)

    scaler = None
    scaler_candidates = [
        model_path.parent / "scaler.pkl",
        ROOT / "models" / "scaler.pkl",
    ]
    for scaler_path in scaler_candidates:
        if scaler_path.exists():
            if joblib is not None:
                scaler = joblib.load(scaler_path)
            else:
                with scaler_path.open("rb") as handle:
                    scaler = pickle.load(handle)
            break

    feature_columns = None
    metadata_candidates = [
        model_path.parent / "metadata.json",
        ROOT / "models" / "metadata.json",
    ]
    for metadata_path in metadata_candidates:
        if metadata_path.exists():
            with metadata_path.open("r", encoding="utf-8") as handle:
                metadata = json.load(handle)
            feature_columns = metadata.get("features")
            break

    return model, scaler, feature_columns


def prepare_features(frame: pd.DataFrame, feature_columns):
    prepared = frame.copy()

    if feature_columns:
        for column in feature_columns:
            if column not in prepared.columns:
                prepared[column] = 0
        prepared = prepared[feature_columns]

    return prepared


def main():
    logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")

    args = parse_args()

    features_path = Path(args.features)
    output_path = Path(args.output)

    if not features_path.exists():
        raise FileNotFoundError(f"Features file not found: {features_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    logger.info("Loading feature data")
    frame = pd.read_csv(features_path)

    logger.info("Loading trained model")
    model, scaler, feature_columns = load_model_components(args.model)

    if feature_columns:
        logger.info("Using metadata-defined feature order")

    prepared = prepare_features(frame, feature_columns or [])

    if scaler is not None:
        logger.info("Applying scaler")
        prepared = scaler.transform(prepared)

    logger.info("Generating predictions")
    predictions = model.predict(prepared)

    output_frame = pd.DataFrame({"predicted_revenue": predictions})

    if "id" in frame.columns:
        output_frame.insert(0, "id", frame["id"].values)

    output_frame.to_csv(output_path, index=False)

    logger.info(f"Predictions saved to {output_path}")


if __name__ == "__main__":
    main()

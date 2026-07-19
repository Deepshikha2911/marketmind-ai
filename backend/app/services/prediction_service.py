from ml.preprocessing.data_loader import UniversalDatasetLoader
from ml.preprocessing.validator import DataValidator
from ml.preprocessing.preprocessing import DataPreprocessor
from ml.features.feature_engineering import FeatureEngineer
from ml.training.predictor import MarketingPredictor
import numpy as np
import pandas as pd


class PredictionService:

    def __init__(self):

        self.loader = UniversalDatasetLoader()
        self.validator = DataValidator()
        self.engineer = FeatureEngineer()

        self.predictor = MarketingPredictor()
        # Do not load a saved model here; we'll train on the uploaded dataset when available.

    def predict(self, csv_path: str):

        # Load dataset
        df = self.loader.load_csv(csv_path)

        # Validate
        df = self.validator.validate(df)

        # Preprocess
        df = DataPreprocessor(df).preprocess()

        # Feature Engineering
        df = self.engineer.transform(df)

        # Ensure a revenue target exists (prefer existing revenue, fallback to metrics_conversions_value)
        if "revenue" not in df.columns or df["revenue"].isna().all():
            if "metrics_conversions_value" in df.columns and df["metrics_conversions_value"].notna().any():
                df["revenue"] = df["metrics_conversions_value"].fillna(0)

        eval_metrics = None
        train_rows = 0
        test_rows = 0

        # Train on uploaded dataset if a target is available and has non-zero variance
        try:
            if "revenue" in df.columns and df["revenue"].notna().any() and len(df) > 5:
                eval_metrics = self.predictor.train(df.copy(), target_column="revenue", test_size=0.2, random_state=42)
                train_rows = getattr(self.predictor, "train_rows", 0)
                test_rows = getattr(self.predictor, "test_rows", 0)
                # After training, predict for all rows
                predictions = self.predictor.predict(df.copy())
                df["predicted_revenue"] = predictions
            else:
                # No target to train on; attempt to load existing model if present and predict
                try:
                    self.predictor.load()
                    predictions = self.predictor.predict(df.copy())
                    df["predicted_revenue"] = predictions
                except Exception:
                    # Unable to train or load model; fill zeros
                    df["predicted_revenue"] = 0.0
        except Exception:
            # On any unexpected failure, ensure pipeline still returns dataframe
            df["predicted_revenue"] = 0.0

        # Dataset quality checks
        data_quality = {}
        try:
            rows = len(df)
            data_quality["rows"] = int(rows)
            # missing values ratio (per important features if available)
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            if numeric_cols:
                missing_fraction = float(pd.isna(df[numeric_cols]).sum().sum()) / (rows * len(numeric_cols)) if rows > 0 else 1.0
            else:
                missing_fraction = 1.0

            dup_count = int(df.duplicated().sum())
            dup_fraction = dup_count / rows if rows > 0 else 1.0

            # simple outlier heuristic: fraction of numeric values with z-score > 3
            outlier_fraction = 0.0
            try:
                if numeric_cols and rows > 0:
                    numeric_vals = df[numeric_cols].apply(lambda x: (x - x.mean()) / (x.std(ddof=0) + 1e-9))
                    outlier_fraction = float((numeric_vals.abs() > 3).sum().sum()) / (rows * len(numeric_cols))
            except Exception:
                outlier_fraction = 0.0

            # important columns presence (based on model feature detection if available)
            important_missing = 0
            important_total = 0
            try:
                features = getattr(self.predictor, "feature_columns", [])
                if features:
                    important_total = len(features)
                    for f in features:
                        if f not in df.columns or df[f].isna().all():
                            important_missing += 1
            except Exception:
                important_missing = 0
                important_total = 0

            # aggregate simple quality score (1.0 = perfect)
            score = 1.0
            score -= min(0.9, missing_fraction)
            score -= min(0.5, dup_fraction)
            score -= min(0.5, outlier_fraction)
            if important_total:
                score -= (important_missing / important_total) * 0.5

            data_quality["missing_fraction"] = round(float(missing_fraction), 4)
            data_quality["duplicate_fraction"] = round(float(dup_fraction), 4)
            data_quality["outlier_fraction"] = round(float(outlier_fraction), 4)
            data_quality["important_missing"] = int(important_missing)
            data_quality["score"] = max(0.0, min(1.0, float(score)))
        except Exception:
            data_quality = {"score": 0.0}

        # Derive a final confidence score combining model performance and data quality
        confidence_score = None
        try:
            model_score = 0.0
            if eval_metrics and isinstance(eval_metrics, dict) and eval_metrics.get("R2") is not None:
                r2 = float(eval_metrics.get("R2"))
                # Map R2 to a model performance percentage according to thresholds
                if r2 >= 0.95:
                    model_score = 98.0
                elif r2 >= 0.90:
                    model_score = 95.0
                elif r2 >= 0.80:
                    model_score = 90.0
                elif r2 >= 0.70:
                    model_score = 83.5
                elif r2 >= 0.60:
                    model_score = 74.5
                else:
                    model_score = 65.0
            # data quality contribution (0-100)
            dq = float(data_quality.get("score", 0.0)) * 100.0
            confidence_score = round((0.8 * model_score) + (0.2 * dq), 2)
        except Exception:
            confidence_score = None

        return {
            "df": df,
            "metrics": eval_metrics,
            "train_rows": int(train_rows),
            "test_rows": int(test_rows),
            "data_quality": data_quality,
            "confidence_score": confidence_score,
        }

        # Temporary debug logs: inspect revenue vs predicted_revenue and correlation
        try:
            if "revenue" in df.columns:
                print("--- PREDICTION PIPELINE DEBUG ---")
                try:
                    print(df[["revenue", "predicted_revenue"]].head(20).to_string())
                except Exception:
                    print(df[["revenue", "predicted_revenue"]].head(20))

                try:
                    corr = df["revenue"].corr(df["predicted_revenue"])
                    print("revenue vs predicted_revenue correlation:", corr)
                except Exception as _e:
                    print("correlation computation failed:", repr(_e))

                print("--- END PREDICTION PIPELINE DEBUG ---")
        except Exception:
            pass

        return df
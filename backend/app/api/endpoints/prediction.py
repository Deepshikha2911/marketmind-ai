from pathlib import Path
from typing import Any
import threading

import json
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

from backend.app.schemas.prediction import PredictionResponse
from backend.app.services.prediction_service import PredictionService
from backend.app.services.upload_service import UploadService

router = APIRouter()

service = PredictionService()
upload_service = UploadService()


def _safe_float(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _build_prediction_payload(df: pd.DataFrame) -> dict[str, Any]:
    df = df.copy()
    if "predicted_revenue" not in df.columns:
        raise HTTPException(status_code=500, detail="Prediction model did not produce revenue estimates.")

    if "campaign_name" not in df.columns:
        df["campaign_name"] = df.index.astype(str)
    if "segments_date" not in df.columns:
        df["segments_date"] = pd.Series(["Unknown" for _ in range(len(df))])
    # Ensure metric helper columns exist but DO NOT overwrite user-provided columns.
    if "metrics_clicks" not in df.columns:
        df["metrics_clicks"] = 0.0
    if "metrics_conversions" not in df.columns:
        df["metrics_conversions"] = 0.0
    if "metrics_cost_micros" not in df.columns:
        df["metrics_cost_micros"] = 0.0
    if "metrics_conversions_value" not in df.columns:
        df["metrics_conversions_value"] = 0.0

    # Only derive core columns when they are missing. Do not overwrite existing columns.
    if "spend" not in df.columns:
        if "metrics_cost_micros" in df.columns:
            df["spend"] = df["metrics_cost_micros"] / 1_000_000
        else:
            df["spend"] = 0.0

    if "clicks" not in df.columns:
        if "metrics_clicks" in df.columns:
            df["clicks"] = df["metrics_clicks"].fillna(0)
        else:
            df["clicks"] = 0.0

    if "conversions" not in df.columns:
        if "metrics_conversions" in df.columns:
            df["conversions"] = df["metrics_conversions"].fillna(0)
        else:
            df["conversions"] = 0.0

    if "impressions" not in df.columns:
        # No metrics_impressions available in pipeline; default to 0 if missing
        df["impressions"] = 0.0

    # Revenue: prefer existing `revenue` column if provided, otherwise use metrics_conversions_value
    if "revenue" not in df.columns:
        if "metrics_conversions_value" in df.columns:
            df["revenue"] = df["metrics_conversions_value"].fillna(0)
        else:
            df["revenue"] = 0.0

    # actual_revenue should reflect the canonical revenue column when available
    if "revenue" in df.columns:
        df["actual_revenue"] = df["revenue"].fillna(0)
    elif "metrics_conversions_value" in df.columns:
        df["actual_revenue"] = df["metrics_conversions_value"].fillna(0)
    else:
        df["actual_revenue"] = 0.0

    # Keep original predicted_revenue values (fill missing but do not overwrite)
    if "predicted_revenue" in df.columns:
        df["predicted_revenue"] = df["predicted_revenue"].fillna(0)
    else:
        # If model didn't attach predictions, ensure column exists to avoid later failures
        df["predicted_revenue"] = 0.0

    df["difference"] = df["predicted_revenue"] - df["actual_revenue"]

    # Aggregate by campaign_name to produce campaign-level summaries (reduces payload size)
    group_key = "campaign_name"
    agg_cols = {}
    for c in ["spend", "clicks", "conversions", "actual_revenue", "predicted_revenue", "impressions"]:
        if c in df.columns:
            agg_cols[c] = "sum"

    # Always include campaign identifier
    if group_key not in df.columns:
        df[group_key] = df.index.astype(str)

    if agg_cols:
        df_agg = df.groupby(group_key, as_index=False).agg(agg_cols)
    else:
        # nothing to aggregate numerically; create campaign list
        df_agg = df[[group_key]].drop_duplicates().rename(columns={group_key: group_key})

    # Build aggregated rows
    rows = []
    for idx, r in df_agg.iterrows():
        pred_val = r.get("predicted_revenue", None)
        actual_val = r.get("actual_revenue", None)
        rows.append(
            {
                "id": str(idx),
                "campaignName": str(r.get(group_key, "")),
                "spend": (round(float(r["spend"]), 2) if "spend" in r and pd.notna(r["spend"]) else None),
                "clicks": (int(r["clicks"]) if "clicks" in r and pd.notna(r["clicks"]) else None),
                "conversions": (int(r["conversions"]) if "conversions" in r and pd.notna(r["conversions"]) else None),
                "actualRevenue": (round(float(actual_val), 2) if pd.notna(actual_val) else None),
                "predictedRevenue": (round(float(pred_val), 6) if pd.notna(pred_val) else None),
                "difference": (round(float(pred_val - actual_val), 6) if pd.notna(pred_val) and pd.notna(actual_val) else None),
            }
        )

    # Sort rows by predictedRevenue desc (treat None as -inf)
    def _sort_key(item):
        v = item.get("predictedRevenue")
        return (v is not None, v if v is not None else -float("inf"))

    rows = sorted(rows, key=_sort_key, reverse=True)

    total_predictions = len(rows)
    pred_values = [r["predictedRevenue"] for r in rows if r.get("predictedRevenue") is not None]
    average_prediction = round(float(np.mean(pred_values)), 2) if pred_values else 0.0
    highest_prediction = float(max(pred_values)) if pred_values else 0.0
    lowest_prediction = float(min(pred_values)) if pred_values else 0.0

    # Confidence metrics: prefer saved training metrics, otherwise compute against actual revenue if available
    confidence_metrics = {"R2": None, "RMSE": None, "MAE": None}
    metrics_path = Path("output") / "metrics.json"
    if metrics_path.exists():
        try:
            with metrics_path.open() as fh:
                file_metrics = json.load(fh)
            confidence_metrics.update({k: file_metrics.get(k) for k in confidence_metrics.keys()})
        except Exception:
            pass

    # If R2 not available, compute from aggregated actual vs predicted when possible
    if confidence_metrics.get("R2") is None:
        # gather pairs where both present from aggregated rows
        pairs = [(r.get("actualRevenue"), r.get("predictedRevenue")) for r in rows if r.get("actualRevenue") is not None and r.get("predictedRevenue") is not None]
        if pairs:
            actuals = np.array([p[0] for p in pairs], dtype=float)
            preds = np.array([p[1] for p in pairs], dtype=float)
            try:
                confidence_metrics["R2"] = float(r2_score(actuals, preds))
                confidence_metrics["RMSE"] = float(np.sqrt(mean_squared_error(actuals, preds)))
                confidence_metrics["MAE"] = float(mean_absolute_error(actuals, preds))
            except Exception:
                pass

    # Compute a data-quality score based on feature completeness (weighted by training importance when available)
    quality_score = None
    try:
        model_meta_path = Path("models") / "metadata.json"
        if model_meta_path.exists():
            with model_meta_path.open() as fh:
                model_meta = json.load(fh)

            features = model_meta.get("features", [])
            importance = model_meta.get("feature_importance", {})
            weights = [importance.get(f, 1.0) for f in features]
            total_w = sum(weights) if sum(weights) > 0 else len(weights)

            completeness = 0.0
            for f, w in zip(features, weights):
                if f in df.columns:
                    non_null = df[f].notna().sum()
                    frac = non_null / len(df) if len(df) > 0 else 0.0
                else:
                    frac = 0.0
                completeness += w * frac

            quality_score = completeness / total_w if total_w else 0.0
        else:
            # Fallback: basic required metric presence
            required = ["spend", "clicks", "conversions", "impressions"]
            present = 0
            for c in required:
                if c in df.columns and df[c].notna().any():
                    present += 1
            quality_score = present / len(required)
    except Exception:
        quality_score = None

    # Combine R2 and quality into a final confidence score (weighted)
    if confidence_metrics.get("R2") is not None:
        r2_scaled = max(0.0, min(100.0, confidence_metrics["R2"] * 100.0))
        if quality_score is not None:
            confidence = round((0.7 * r2_scaled) + (0.3 * (quality_score * 100.0)), 2)
        else:
            confidence = round(r2_scaled, 2)
    else:
        confidence = round(quality_score * 100.0, 2) if quality_score is not None else None

    # expose quality score in metrics for debug/UX
    if quality_score is not None:
        confidence_metrics["data_quality"] = round(float(quality_score), 4)

    # Actual vs Predicted chart: group by date if available, otherwise by campaign
    if "date" in df.columns and pd.api.types.is_datetime64_any_dtype(df["date"]):
        avp = df.groupby("date", as_index=False).agg({"actual_revenue": "sum", "predicted_revenue": "sum"})
        actual_vs_predicted = [
            {"label": str(row["date"].date() if hasattr(row["date"], "date") else row["date"]), "actual": round(_safe_float(row["actual_revenue"]), 2), "predicted": round(_safe_float(row["predicted_revenue"]), 6)}
            for _, row in avp.head(10).iterrows()
        ]
    else:
        avp = df.groupby("campaign_name", as_index=False).agg({"actual_revenue": "sum", "predicted_revenue": "sum"})
        actual_vs_predicted = [
            {"label": str(row["campaign_name"]), "actual": round(_safe_float(row["actual_revenue"]), 2), "predicted": round(_safe_float(row["predicted_revenue"]), 6)}
            for _, row in avp.head(10).iterrows()
        ]

    if not actual_vs_predicted:
        actual_vs_predicted = [{"label": "No data", "actual": 0.0, "predicted": 0.0}]

    # Revenue distribution from aggregated predicted revenue values (sample if very large)
    revenue_values = pd.to_numeric(pd.Series(pred_values), errors="coerce").dropna()
    distribution_buckets = []
    if not revenue_values.empty:
        sample_vals = revenue_values
        if len(revenue_values) > 5000:
            sample_vals = revenue_values.sample(5000, random_state=1)

        try:
            bins = pd.qcut(sample_vals, q=6, duplicates="drop")
            for interval, count in bins.value_counts().sort_index().items():
                if hasattr(interval, "left") and hasattr(interval, "right"):
                    distribution_buckets.append({"range": f"{interval.left:,.0f}–{interval.right:,.0f}", "count": int(count)})
        except Exception:
            # fallback simple buckets
            counts, edges = np.histogram(sample_vals, bins=6)
            for i in range(len(counts)):
                distribution_buckets.append({"range": f"{edges[i]:,.0f}–{edges[i+1]:,.0f}", "count": int(counts[i])})

    # Limit the returned rows payload to reduce network overhead and rendering time
    DISPLAY_LIMIT = 200
    display_rows = rows[:DISPLAY_LIMIT]

    top_campaigns = [
        {"campaign": r["campaignName"], "predictedRevenue": r["predictedRevenue"]}
        for r in display_rows[:10]
    ]

    summary_block = {
        "totalPredictions": int(total_predictions),
        "averagePrediction": round(average_prediction, 2),
        "highestPrediction": round(highest_prediction, 2),
        "lowestPrediction": round(lowest_prediction, 2),
        "confidenceScore": confidence,
    }

    kpis_block = {
        "rowsProcessed": int(len(df)),
        "predictionsGenerated": int(total_predictions),
        "averagePredictedRevenue": round(average_prediction, 2),
        "highestPredictedRevenue": round(highest_prediction, 2),
    }

    return {
        "success": True,
        "message": "Prediction completed successfully.",
        "dataset": {
            "selectedDataset": "",
            "uploadTime": "",
            "rowsProcessed": int(len(df)),
            "predictionStatus": "Ready",
        },
        "kpis": kpis_block,
        # return a trimmed set for UI (full dataset still saved to output/predictions.csv)
        "predictions": display_rows,
        "campaign_predictions": display_rows,
        "summary": summary_block,
        "prediction_summary": summary_block,
        "confidence_metrics": confidence_metrics,
        "charts": {
            "actualVsPredicted": actual_vs_predicted,
            "revenueDistribution": distribution_buckets,
            "topCampaigns": top_campaigns,
        },
        "downloads": {
            "csv": "output/predictions.csv",
            "excel": "output/predictions.xlsx",
        },
    }


@router.get(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict campaign revenue from the current uploaded dataset",
)
async def predict():
    current_upload = upload_service.get_current()
    if not current_upload:
        return {
            "success": False,
            "message": "No dataset uploaded",
            "rows_processed": 0,
            "predictions_generated": 0,
            "output_file": "",
        }

    upload_path = Path("uploads") / current_upload.storedFilename
    if not upload_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded dataset no longer exists.")

    service_result = service.predict(str(upload_path))
    if isinstance(service_result, dict) and "df" in service_result:
        df = service_result["df"]
        eval_metrics = service_result.get("metrics") or {}
        train_rows = int(service_result.get("train_rows", 0))
        test_rows = int(service_result.get("test_rows", 0))
        data_quality = service_result.get("data_quality", {})
        confidence_score = service_result.get("confidence_score")
    else:
        # backward compatibility: if service returned a DataFrame directly
        df = service_result
        eval_metrics = {}
        train_rows = 0
        test_rows = 0
        data_quality = {}
        confidence_score = None

    # Temporary debug logging (do not remove) — inspect dataframe after prediction/preprocessing
    try:
        print("--- PREDICTION DEBUG START ---")
        print("columns:", df.columns.tolist())
        try:
            print("head:\n", df.head().to_string())
        except Exception:
            print("head: (unable to render full head, showing repr)", repr(df.head()))

        if "campaign_name" in df.columns:
            try:
                print("campaign_name head:\n", df[["campaign_name"]].head().to_string())
            except Exception:
                print("campaign_name head: (unable to render)", repr(df[["campaign_name"]].head()))

        # Numeric columns (dtype-based)
        try:
            numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
        except Exception:
            numeric_cols = []
        print("numeric_columns (dtype detect):", numeric_cols)

        # Numeric-like columns (coerce test)
        coerced_numeric = []
        for col in df.columns:
            try:
                coerced = pd.to_numeric(df[col], errors="coerce")
                # consider numeric-like if at least one non-NaN after coercion
                if coerced.notna().any():
                    coerced_numeric.append(col)
            except Exception:
                continue
        print("numeric_like_columns (coerce detect):", coerced_numeric)

        # Specific columns existence
        keys_to_check = [
            "spend",
            "revenue",
            "clicks",
            "impressions",
            "conversion",
            "predicted_revenue",
            "prediction",
            "predictions",
            "daily_budget",
        ]
        existence = {k: (k in df.columns) for k in keys_to_check}
        print("columns_exist:", existence)

        if "predicted_revenue" in df.columns:
            try:
                print("predicted_revenue describe:\n", df[["predicted_revenue"]].describe().to_string())
            except Exception:
                print("predicted_revenue describe: (unable to render)")
        else:
            predict_like = [c for c in df.columns if "predict" in c.lower()]
            print("predict_like_columns:", predict_like)

        print("--- PREDICTION DEBUG END ---")
    except Exception as _dbg_err:
        print("Prediction debug logging failed:", repr(_dbg_err))

    output_path = Path("output")
    output_path.mkdir(exist_ok=True)

    prediction_file = output_path / "predictions.csv"
    excel_file = output_path / "predictions.xlsx"
    df.to_csv(prediction_file, index=False)

    prediction_payload = _build_prediction_payload(df)
    prediction_payload["dataset"]["selectedDataset"] = current_upload.originalFilename
    prediction_payload["dataset"]["uploadTime"] = current_upload.uploadDate
    prediction_payload["downloads"]["csv"] = str(prediction_file)
    prediction_payload["downloads"]["excel"] = str(excel_file)

    # Inject evaluation metrics and dataset quality into the payload
    try:
        # Ensure confidence_metrics exists
        if "confidence_metrics" not in prediction_payload:
            prediction_payload["confidence_metrics"] = {}

        if eval_metrics:
            prediction_payload["confidence_metrics"].update({
                "R2": eval_metrics.get("R2"),
                "MAE": eval_metrics.get("MAE"),
                "RMSE": eval_metrics.get("RMSE"),
                "MAPE": eval_metrics.get("MAPE"),
            })

        prediction_payload["summary"]["confidenceScore"] = confidence_score
        prediction_payload["confidence_score"] = confidence_score
        prediction_payload["r2_score"] = eval_metrics.get("R2") if eval_metrics else None
        prediction_payload["mae"] = eval_metrics.get("MAE") if eval_metrics else None
        prediction_payload["rmse"] = eval_metrics.get("RMSE") if eval_metrics else None
        prediction_payload["mape"] = eval_metrics.get("MAPE") if eval_metrics else None
        prediction_payload["rows_used"] = int(len(df))
        prediction_payload["train_rows"] = train_rows
        prediction_payload["test_rows"] = test_rows
        prediction_payload["data_quality"] = data_quality
    except Exception:
        pass

    # Write Excel in background to avoid blocking the API response for large datasets
    def _write_excel(path: Path, frame: pd.DataFrame):
        try:
            frame.to_excel(path, index=False)
        except Exception:
            try:
                path.write_text("", encoding="utf-8")
            except Exception:
                pass

    try:
        thread = threading.Thread(target=_write_excel, args=(excel_file, df.copy()))
        thread.daemon = True
        thread.start()
    except Exception:
        try:
            excel_file.write_text("", encoding="utf-8")
        except Exception:
            pass

    return PredictionResponse(**{
        "success": True,
        "message": "Prediction completed successfully.",
        "rows_processed": prediction_payload["kpis"]["rowsProcessed"],
        "predictions_generated": prediction_payload["kpis"]["predictionsGenerated"],
        "output_file": str(prediction_file),
        "data": prediction_payload,
    })
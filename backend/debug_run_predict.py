from pathlib import Path
import pandas as pd
from backend.app.services.upload_service import UploadService
from backend.app.services.prediction_service import PredictionService
from backend.app.api.endpoints.prediction import _build_prediction_payload
import json

upload_service = UploadService()
service = PredictionService()

current = upload_service.get_current()
if not current:
    print("No current upload found")
    raise SystemExit(1)

upload_path = Path("uploads") / current.storedFilename
if not upload_path.exists():
    print("Upload file not found:", upload_path)
    raise SystemExit(1)

print("Using upload file:", upload_path)

# Run prediction (this runs preprocessing + model)
df = service.predict(str(upload_path))

print("--- DEBUG OUTPUT (script) ---")
print("columns:", df.columns.tolist())
print("\nHEAD:\n")
print(df.head().to_string())

if "campaign_name" in df.columns:
    print("\nCAMPAIGN_NAME HEAD:\n")
    print(df[["campaign_name"]].head().to_string())

# Numeric columns via dtype
try:
    numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
except Exception:
    numeric_cols = []
print("\nnumeric_columns (dtype):", numeric_cols)

# Numeric-like via coercion
coerced_numeric = []
for col in df.columns:
    try:
        coerced = pd.to_numeric(df[col], errors="coerce")
        if coerced.notna().any():
            coerced_numeric.append(col)
    except Exception:
        continue
print("\nnumeric_like_columns (coerce):", coerced_numeric)

cols_to_check = [
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
existence = {k: (k in df.columns) for k in cols_to_check}
print("\ncolumns_exist:", existence)

if "predicted_revenue" in df.columns:
    print("\npredicted_revenue describe:\n")
    try:
        print(df[["predicted_revenue"]].describe().to_string())
    except Exception:
        print(df[["predicted_revenue"]].head().to_string())
else:
    predict_like = [c for c in df.columns if "predict" in c.lower()]
    print("\npredict_like_columns:", predict_like)

print("--- END DEBUG OUTPUT ---")

# Build payload using the same server-side builder to verify final JSON values
payload = _build_prediction_payload(df)
print("\n--- SAMPLE JSON RESPONSE (payload sample) ---")
# print a compact sample of first 3 predictions and key KPI values
sample_preds = payload.get("predictions", [])[:3]
print(json.dumps({
    "sample_predictions": sample_preds,
    "kpis": payload.get("kpis"),
    "summary": payload.get("summary"),
}, indent=2))

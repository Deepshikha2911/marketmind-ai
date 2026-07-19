import traceback
import sys
from pathlib import Path
# Ensure project root is on path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.app.services.upload_service import UploadService
from backend.app.services.prediction_service import PredictionService
from backend.app.services.insight_service import InsightService

us = UploadService()
ps = PredictionService()
insight_svc = InsightService()

current = us.get_current()
if not current:
    print('No current upload')
    raise SystemExit(1)

upload_path = f"uploads/{current.storedFilename}"
print('Using upload:', upload_path)

try:
    pred = ps.predict(upload_path)
    print('Prediction result keys:', list(pred.keys()) if isinstance(pred, dict) else type(pred))
    df = pred.get('df') if isinstance(pred, dict) else pred
    print('DF shape:', None if df is None else df.shape)
    res = insight_svc.generate(df)
    print('Insight generate succeeded; top keys:', list(res.keys()))
except Exception as e:
    print('Exception during generation:')
    traceback.print_exc()
    raise

#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

DATA_DIR="${1:-./data/raw}"
MODEL_PATH="${2:-./models/marketing_model.pkl}"
OUTPUT_PATH="${3:-./output/predictions.csv}"

if [[ ! -d "$DATA_DIR" ]]; then
  echo "Data directory not found: $DATA_DIR" >&2
  exit 1
fi

if [[ -x ./backend/.venv/bin/python ]]; then
  PYTHON_BIN=./backend/.venv/bin/python
elif [[ -x ./backend/.venv/Scripts/python.exe ]]; then
  PYTHON_BIN=./backend/.venv/Scripts/python.exe
elif command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN=python
else
  echo "Python interpreter not found" >&2
  exit 1
fi

FIRST_CSV=$($PYTHON_BIN - <<'PY' "$DATA_DIR"
import sys
from pathlib import Path

root = Path(sys.argv[1])
csv_files = sorted(path for path in root.iterdir() if path.is_file() and path.suffix.lower() == '.csv')
if not csv_files:
    raise SystemExit(1)
print(csv_files[0])
PY
)

if [[ -z "$FIRST_CSV" ]]; then
  echo "No CSV files found in $DATA_DIR" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_PATH")"

FEATURES_FILE="$(mktemp "${TMPDIR:-/tmp}/marketmind-features.XXXXXX.csv")"
trap 'rm -f "$FEATURES_FILE"' EXIT

$PYTHON_BIN - <<'PY' "$FIRST_CSV" "$FEATURES_FILE"
import sys
from pathlib import Path

import pandas as pd

root = Path.cwd()
if str(root) not in sys.path:
    sys.path.insert(0, str(root))

from ml.features.feature_engineering import FeatureEngineer

input_path = Path(sys.argv[1])
output_path = Path(sys.argv[2])

df = pd.read_csv(input_path)
engineered = FeatureEngineer().transform(df)
engineered.to_csv(output_path, index=False)
PY

$PYTHON_BIN ml/predict.py \
  --features "$FEATURES_FILE" \
  --model "$MODEL_PATH" \
  --output "$OUTPUT_PATH"

echo "Done. Predictions written to $OUTPUT_PATH"

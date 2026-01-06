#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "== JSON schema parse =="
python3 - <<'PY'
import json, glob
for p in glob.glob("schemas/*.json"):
    json.load(open(p, "r", encoding="utf-8"))
print("OK")
PY

echo "== Indexer build pipeline (offline-safe) =="
python3 "$ROOT/indexer/build_index.py"
python3 "$ROOT/indexer/verify_artifacts.py"

echo "== Worker unit test (if npm exists) =="
if command -v npm >/dev/null 2>&1; then
  (cd "$ROOT/worker" && npm test)
else
  echo "SKIP (npm missing)"
fi

echo "DONE"

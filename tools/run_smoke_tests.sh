#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

PYBIN="py -3"

echo "== Using Python: $PYBIN ==" 

echo "== JSON schema parse ==" 
$PYBIN -c "import json,glob; [json.load(open(p, 'r', encoding='utf-8')) for p in glob.glob('schemas/*.json')]; print('OK')"

echo "== Indexer build pipeline (offline-safe) ==" 
$PYBIN "$ROOT/indexer/build_index.py"
$PYBIN "$ROOT/indexer/verify_artifacts.py"

echo "== Worker unit test (if npm exists) ==" 
if command -v npm >/dev/null 2>&1; then
  (cd "$ROOT/worker" && npm test)
else
  echo "SKIP (npm missing)"
fi

echo "DONE"

#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist"
mkdir -p "$OUT"
name="onetoo-ai-search-v2.0-$(date +%Y-%m-%d).zip"
cd "$ROOT"
zip -r "$OUT/$name" . -x "*.zip" -x "node_modules/*" -x ".git/*"
echo "Created: $OUT/$name"

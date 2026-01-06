# API v2

## GET /healthz
Basic health.

## GET /search/v2?q=...&limit=20&lane=stable|sandbox
Returns results + proof bundle.

## POST /contrib/v2/submit
Append-only submit.
- Validates schema
- Computes `contribution_id = sha256(canonical_json)`
- Stores contribution in pending log
- Enforces replay window (timestamp + nonce) and basic rate limiting hooks

## GET /contrib/v2/pending
Maintainer-only in production (for review).

## GET /contrib/v2/accepted
Served from signed artifact `contrib-accepted.json`

---

### Stability requirement
Stable lane **must be able to operate solely by reading**:
- `contrib-accepted.json` (+ sig)
- `ai-search-index.json` (+ sig)
- shard dumps referenced by the manifest

# Canonical JSON (Signing)

All signatures and IDs rely on canonical JSON serialization.

Rules:
- UTF-8
- object keys sorted lexicographically
- arrays preserved
- no whitespace
- JSON numbers should be minimal representation
- reject NaN/Infinity

`contribution_id = sha256(canonical_json(contribution))`

See implementations:
- `common/canon.ts`
- `common/canon.py`

# Proof bundles

A proof bundle is a machine-consumable explanation of trust:
- which artifacts were verified
- which keys were used (key_id / pubkey ref)
- which hashes matched
- what acceptance set version was applied

Proof bundle must be returned by:
- `/search/v2`
and may be stored in:
- `artifacts/out/proof/*.json`

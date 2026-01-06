# Indexer & Builder (v2)

This folder contains decade-stable reference tooling:
- `crawl_verify_normalize.py` — fetch TFWS endpoints (scope-limited), normalize to JSONL
- `build_index.py` — produce deterministic index shards + `ai-search-index.json`
- `make_accepted_set.py` — turn reviewed contribution IDs into signed accepted set (signature stub)
- `verify_artifacts.py` — offline verifier for hashes + signatures (signature stub)

Real signing/verification hooks:
- minisign (recommended) or sigstore
- keep maintainer secret keys offline

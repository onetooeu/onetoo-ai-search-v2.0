# Restricted ranking rule language (RRL)

Purpose: allow ranking tweaks without arbitrary code execution.

Rule object (conceptual):
- `if`: simple boolean predicates over trust signals
- `then`: score adjustment (+/-)
- no loops, no network calls, no file IO

Examples:
- boost verified sources
- penalize sources with unresolved critical incidents
- freshness bonus for recent signed releases

Implementation can be a deterministic evaluator in indexer/worker.

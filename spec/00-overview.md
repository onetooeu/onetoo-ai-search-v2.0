# Spec v2 — Overview

This system indexes **trust artifacts** (TFWS-native), not the entire internet.

## Allowed fetch scope (default)
- `/.well-known/*`
- `/api/v1/*`
- `/dumps/*`

## Core objects
- Contribution (signed by author)
- Pending log (append-only)
- Accepted set (signed by maintainer)
- Index manifest (signed by maintainer)
- Shard dumps (content addressed via sha256 + optional signatures)
- Proof bundle (returned in queries)

## Lanes
- **stable**: uses only signed accepted-set + signed manifest + referenced shards
- **sandbox**: may apply pending contributions for evaluation (never default)

## Guiding rule
> Agents may propose. Only maintainers publish signed reality.

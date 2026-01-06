# Governance (v2)

## Roles
- Contributor: proposes signed contributions (append-only)
- Maintainer: publishes signed accepted-set + signed index manifest
- Operator: runs infra (no signing keys required)

## Key strategy
- Separate keys:
  - contributor keys
  - maintainer keys (offline preferred)
- Key rotation supported by publishing:
  - `/.well-known/key-history.json` (TFWS-style) in the trust hub

## Acceptance is deterministic
Stable lane changes only when a maintainer publishes a new signed `contrib-accepted.json`.

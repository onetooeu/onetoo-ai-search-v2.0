# Threat model (expanded)

## Poisoning
Attackers submit malicious contributions (seed injection, rank manipulation).
Mitigations:
- stable lane uses only accepted-set
- deterministic acceptance checks
- reputation/allowlist
- sandbox evaluation before stable acceptance

## Seed injection / SSRF-like fetch abuse
Mitigations:
- scope-limited fetcher
- HTTPS-only
- forbid private IPs
- path allowlist (`/.well-known/`, `/api/v1/`, `/dumps/`)

## Replay attacks
Mitigations:
- timestamp window
- per-author nonce cache
- contribution_id de-duplication

## DoS / crawler loops
Mitigations:
- caching headers on trust hubs
- rate-limits at edge
- exponential backoff in indexer
- treat temporary failures as availability incidents, not trust failures

## Key compromise
Mitigations:
- offline maintainer signing
- key rotation + key history publication
- incident workflow for key compromise

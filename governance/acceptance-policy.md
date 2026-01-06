# Acceptance policy (deterministic, decade-stable)

A contribution is eligible for acceptance only if:

1) **Schema valid** (contribution-v2)
2) **Canonical ID** computed as `sha256(canonical_json)`
3) **Signature verified**
   - author key allowlisted OR meets explicit reputation policy
4) **Replay window**
   - timestamp within allowed window OR accepted as historical with justification
   - nonce never previously seen for the same author key_id
5) **Type-specific checks**
   - seed_add:
     - HTTPS only
     - allowed fetch scope only
     - must publish `/.well-known/minisign.pub`
     - must provide at least one signed dump or hash manifest
   - rank_rule:
     - must use the restricted rule language (no code execution)
     - deterministic evaluation
   - incident_report/spam_report:
     - must include evidence URLs/hashes

**Stable lane** uses only accepted contributions + signed artifacts.

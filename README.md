# onetoo-ai-search v2.0 (Decade-stable TFWS-native AI Search)

**Mission:** A trust-first search layer **for AI agents** that indexes only **verifiable TFWS artifacts**, and improves safely via
**signed, audit-able contributions** — without allowing “truth overwrite”.

This repository is designed to run with **minimal changes for a decade**:
- **Deterministic artifacts** as the source of truth
- **Append-only logs**
- **Offline signing**
- **Stable lane** never depends on mutable DB state
- **Sandbox lane** for experimentation and self-improvement evaluation

> Scaffold date: 2026-01-06 (Europe/Bratislava)

---

## What you get (v2.0)
- **Protocol v2**: query + contribution + evidence + proof bundles
- **Artifact-first architecture** (stable lane can run purely from signed dumps)
- **Two-lane model**: `stable` + `sandbox`
- **Governance**: roles, key rotation, acceptance policy, incident process
- **Security**: replay protection, allowlisted crawling scope, poisoning defenses
- **Reference implementations**:
  - Cloudflare Worker API (read + submit)
  - Python indexer/build pipeline (deterministic outputs)
  - Offline verifier + “release builder” (hashes, merkle, minisign hooks)
- **Schemas**: contributions, accepted-set, index-manifest, incident, trust-state, proof bundle

---

## Decade-stability principles
1) **Truth is a signed dump**
   - The stable lane uses only:
     - `contrib-accepted.json` (signed)
     - `ai-search-index.json` (signed)
     - shard dumps referenced by the manifest (signed or hashed via sha256.json)
2) **Write endpoints never mutate stable behavior**
   - `/contrib/v2/submit` is append-only (pending log)
3) **Offline signing**
   - Maintainer signing keys never have to be on the server
4) **Key rotation is first-class**
   - `/.well-known/key-history.json` compatible approach (see governance)
5) **Scope-limited crawling**
   - Only `.well-known/`, `/api/v1/`, `/dumps/` unless explicitly accepted
6) **Proof bundles everywhere**
   - Every search result can include “why trusted” evidence

---

## Quickstart (local)
### Worker (API)
```bash
cd worker
npm install
npm run dev
```

### Smoke tests (repo-level)
```bash
bash tools/run_smoke_tests.sh
```

---

## Deploy model (recommended)
- Run indexer/build locally or in CI **without signing keys**
- Sign artifacts offline (or via secure signing step)
- Publish to `onetoo-eu` as `/dumps/*` (TFWS style)
- Worker serves stable lane directly from published signed artifacts

See: `docs/operations.md`

---

## License
CC0 (adjust if needed).

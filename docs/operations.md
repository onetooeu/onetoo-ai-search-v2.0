# Operations (decade-stable)

## Recommended topology
- Build + verify + normalize locally / CI
- Sign artifacts offline
- Publish to trust hub (`onetoo-eu`) as static dumps
- Worker reads only the published artifacts

## Cloudflare hints
- Use Cache-Control for dumps:
  - accepted-set and manifest: short cache (minutes) + ETag
  - versioned shards: long cache + immutable
- WAF rate-limits:
  - `/.well-known/*` and `/dumps/*` burst protection
- Separate write endpoint host if needed (`api.onetoo.eu`) while keeping trust hub static

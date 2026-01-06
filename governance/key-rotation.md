# Key rotation

Goal: keep verification possible for years.

Publish in trust hub:
- `/.well-known/minisign.pub` (current)
- `/.well-known/key-history.json` (past keys + validity windows + reason)

Accepted-set and index-manifest should include:
- `maintainer.key_id`
- `maintainer.pubkey_ref` (or embedded)

Recommended:
- never delete old public keys
- mark old keys as retired with date

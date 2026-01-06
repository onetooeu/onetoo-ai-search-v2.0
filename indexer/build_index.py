#!/usr/bin/env python3
import json, hashlib, datetime
import sys
from pathlib import Path as _Path
sys.path.insert(0, str(_Path(__file__).resolve().parents[1]))

from pathlib import Path
from common.canon import canonicalize

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / "artifacts" / "work"
OUT = ROOT / "artifacts" / "out"
OUT.mkdir(parents=True, exist_ok=True)

def sha256_hex(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def main():
    # Demo builder: creates one shard from normalized jsonl (if present)
    norm = WORK / "normalized.jsonl"
    shard = OUT / "ai-search-shard-0001.jsonl"
    if norm.exists():
        shard.write_bytes(norm.read_bytes())
    else:
        shard.write_text(json.dumps({"note":"run crawl_verify_normalize.py first"})+"\n", encoding="utf-8")

    shard_hash = sha256_hex(shard.read_bytes())

    manifest = {
        "version":"2.0",
        "generated_at": datetime.datetime.now(datetime.UTC).replace(microsecond=0).isoformat().replace("+00:00","Z"),
        "lane":"stable",
        "accepted_set_ref": {
            "url":"https://onetoo.eu/dumps/contrib-accepted.json",
            "sha256":"TODO",
            "sig_url":"https://onetoo.eu/dumps/contrib-accepted.json.minisig"
        },
        "sources":["https://onetoo.eu/"],
        "shards":[{"name":"ai-search-shard-0001","url":"https://onetoo.eu/dumps/ai-search-shard-0001.jsonl","sha256": shard_hash, "count": sum(1 for _ in shard.open("r",encoding="utf-8"))}],
        "merkle_root":"TODO",
        "signature":{"alg":"minisign","value":"TODO"}
    }

    (OUT/"ai-search-index.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (OUT/"sha256.json").write_text(json.dumps({
        "version":"2.0",
        "generated_at": manifest["generated_at"],
        "files":{
            "ai-search-index.json": sha256_hex((OUT/"ai-search-index.json").read_bytes()),
            "ai-search-shard-0001.jsonl": shard_hash
        }
    }, indent=2), encoding="utf-8")

    print("Wrote:")
    print(" -", OUT/"ai-search-index.json")
    print(" -", OUT/"ai-search-shard-0001.jsonl")
    print(" -", OUT/"sha256.json")

if __name__ == "__main__":
    main()

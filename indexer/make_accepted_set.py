#!/usr/bin/env python3
import json, datetime, hashlib
import sys
from pathlib import Path as _Path
sys.path.insert(0, str(_Path(__file__).resolve().parents[1]))

from pathlib import Path
from common.merkle import merkle_root_hex

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "artifacts" / "out"
OUT.mkdir(parents=True, exist_ok=True)

def sha256_hex(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def main():
    # Input: a plain text file containing accepted contribution IDs (one per line)
    inp = ROOT / "artifacts" / "work" / "accepted_ids.txt"
    ids = []
    if inp.exists():
        ids = [l.strip() for l in inp.read_text(encoding="utf-8").splitlines() if l.strip()]
    # For demo, accept none
    leaves = [hashlib.sha256(i.encode("utf-8")).hexdigest() for i in ids]
    mr = merkle_root_hex(leaves)

    doc = {
        "version":"2.0",
        "generated_at": datetime.datetime.utcnow().replace(microsecond=0).isoformat()+"Z",
        "policy_ref":"https://onetoo.eu/.well-known/ai-search-acceptance-policy.txt",
        "accepted":[
            {"id": i, "sha256": i, "author_key_id":"unknown", "contrib_type":"unknown", "timestamp": doc_ts}
            for i, doc_ts in []
        ],
        "maintainer":{"key_id":"TODO","pubkey_ref":"https://onetoo.eu/.well-known/minisign.pub"},
        "merkle_root": mr,
        "signature":{"alg":"minisign","value":"TODO"}
    }

    (OUT/"contrib-accepted.json").write_text(json.dumps(doc, indent=2), encoding="utf-8")
    print("Wrote", OUT/"contrib-accepted.json")
    print("NOTE: signature is TODO (sign offline using minisign).")

if __name__ == "__main__":
    main()

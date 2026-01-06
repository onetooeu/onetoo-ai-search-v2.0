#!/usr/bin/env python3
import sys
from pathlib import Path as _Path
sys.path.insert(0, str(_Path(__file__).resolve().parents[1]))

import json, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "artifacts" / "out"

def sha256_hex(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def main():
    sha = OUT/"sha256.json"
    if not sha.exists():
        raise SystemExit("sha256.json not found. Run build_index.py")

    data = json.loads(sha.read_text(encoding="utf-8"))
    files = data.get("files", {})
    ok = True
    for name, expected in files.items():
        p = OUT/name
        if not p.exists():
            print("MISSING", name); ok = False; continue
        got = sha256_hex(p.read_bytes())
        if got != expected:
            print("BAD", name, "expected", expected, "got", got); ok = False
        else:
            print("OK ", name)
    if ok:
        print("All hashes OK. Signature verification is external (minisign).")
    else:
        raise SystemExit(2)

if __name__ == "__main__":
    main()

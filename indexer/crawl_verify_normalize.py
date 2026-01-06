#!/usr/bin/env python3
import sys
from pathlib import Path as _Path
sys.path.insert(0, str(_Path(__file__).resolve().parents[1]))

import json, urllib.request, datetime, hashlib, ipaddress, socket
from urllib.parse import urlparse
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "artifacts" / "work"
OUT.mkdir(parents=True, exist_ok=True)

ALLOWED_PREFIXES = ("/.well-known/", "/api/v1/", "/dumps/")

def _ua():
    return {"User-Agent":"onetoo-ai-search-indexer/2.0"}

def sha256_hex(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def is_public_host(host: str) -> bool:
    try:
        infos = socket.getaddrinfo(host, 443, proto=socket.IPPROTO_TCP)
        for info in infos:
            ip = info[4][0]
            ip_obj = ipaddress.ip_address(ip)
            if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local:
                return False
        return True
    except Exception:
        return False

def fetch(url: str, timeout=20) -> bytes:
    u = urlparse(url)
    if u.scheme != "https":
        raise ValueError("HTTPS only")
    if not is_public_host(u.hostname or ""):
        raise ValueError("Non-public host blocked")
    if not any(u.path.startswith(p) for p in ALLOWED_PREFIXES):
        raise ValueError("Path out of allowed scope")
    req = urllib.request.Request(url, headers=_ua())
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def main():
    seeds = [l.strip().rstrip("/") for l in (Path(__file__).parent/"seeds.txt").read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]
    rows = []
    for base in seeds:
        for path in ["/.well-known/ai-trust-hub.json", "/.well-known/minisign.pub", "/dumps/sha256.json"]:
            url = base + path
            try:
                data = fetch(url)
                rows.append({
                    "base": base + "/",
                    "url": url,
                    "sha256": sha256_hex(data),
                    "fetched_at": datetime.datetime.utcnow().replace(microsecond=0).isoformat()+"Z",
                    "ok": True
                })
            except Exception as e:
                rows.append({"base": base + "/", "url": url, "ok": False, "error": str(e)})

    out = OUT / "normalized.jsonl"
    with out.open("w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print("Wrote", out)

if __name__ == "__main__":
    main()

import hashlib
from typing import List

def _h(x: bytes) -> bytes:
    return hashlib.sha256(x).digest()

def merkle_root_hex(leaves_hex: List[str]) -> str:
    if not leaves_hex:
        return hashlib.sha256(b"").hexdigest()
    level = [bytes.fromhex(x) for x in leaves_hex]
    while len(level) > 1:
        if len(level) % 2 == 1:
            level.append(level[-1])
        nxt = []
        for i in range(0, len(level), 2):
            nxt.append(_h(level[i] + level[i+1]))
        level = nxt
    return level[0].hex()

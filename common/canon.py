import json
from typing import Any

def canonicalize(value: Any) -> str:
    def norm(v):
        if v is None or isinstance(v, (str, int, float, bool)):
            return v
        if isinstance(v, list):
            return [norm(x) for x in v]
        if isinstance(v, dict):
            return {k: norm(v[k]) for k in sorted(v.keys())}
        raise TypeError(f"Unsupported type: {type(v)}")

    return json.dumps(norm(value), separators=(",", ":"), ensure_ascii=False)

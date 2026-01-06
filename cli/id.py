#!/usr/bin/env python3
import sys, json, hashlib
from common.canon import canonicalize

def main():
    obj = json.load(sys.stdin)
    canon = canonicalize(obj).encode("utf-8")
    sys.stdout.write(hashlib.sha256(canon).hexdigest() + "\n")

if __name__ == "__main__":
    main()

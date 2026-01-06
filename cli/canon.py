#!/usr/bin/env python3
import sys, json
from common.canon import canonicalize

def main():
    obj = json.load(sys.stdin)
    sys.stdout.write(canonicalize(obj))

if __name__ == "__main__":
    main()

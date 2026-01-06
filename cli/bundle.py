#!/usr/bin/env python3
import json, datetime

def main():
    b = {
        "version":"2.0",
        "generated_at": datetime.datetime.now(datetime.UTC).replace(microsecond=0).isoformat().replace("+00:00","Z"),
        "accepted_set": {"url":"https://onetoo.eu/dumps/contrib-accepted.json","sha256":"TODO","sig_url":"https://onetoo.eu/dumps/contrib-accepted.json.minisig"},
        "verified_sources": [],
        "checks": ["skeleton"]
    }
    print(json.dumps(b, indent=2))

if __name__ == "__main__":
    main()

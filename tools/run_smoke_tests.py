import shutil
import glob, json, subprocess, sys, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]

print("== JSON schema parse ==")
for p in glob.glob(str(ROOT / "schemas" / "*.json")):
    json.load(open(p, "r", encoding="utf-8"))
print("OK")

print("== Indexer build pipeline (offline-safe) ==")
subprocess.check_call([sys.executable, str(ROOT/"indexer"/"build_index.py")])
subprocess.check_call([sys.executable, str(ROOT/"indexer"/"verify_artifacts.py")])

print("== Worker unit test (if npm exists) ==")
if shutil.which("npm"):
    subprocess.check_call(["npm","test"], cwd=str(ROOT/"worker"))
else:
    print("SKIP (npm missing)")

print("DONE")

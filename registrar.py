"""
Module registrar — runs once on container startup to register
this module with the FuzzyPeanut shell registry.
"""
import json
import os
import sys
import time
import urllib.request

REGISTRY_URL = os.environ.get("REGISTRY_URL", "http://shell-registry:3100")
MODULE_UI_URL = os.environ.get("MODULE_UI_URL", "http://localhost:3001")

with open("/manifest.json") as f:
    manifest = json.load(f)

# Update remoteEntry to the actual serving URL
manifest["remoteEntry"] = f"{MODULE_UI_URL}/remoteEntry.js"

payload = json.dumps(manifest).encode()

# Retry until registry is up (it may start after us)
for attempt in range(10):
    try:
        req = urllib.request.Request(
            f"{REGISTRY_URL}/modules",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status in (200, 201):
                print(f"Registered {manifest['id']} with registry at {REGISTRY_URL}")
                sys.exit(0)
    except Exception as e:
        print(f"Attempt {attempt + 1}/10: registry not ready ({e}), retrying...")
        time.sleep(3)

print("Failed to register with registry after 10 attempts", file=sys.stderr)
sys.exit(1)

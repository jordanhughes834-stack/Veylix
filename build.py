#!/usr/bin/env python3
"""
Build script for Veylix.

Assembles index.html (the single self-contained page served by GitHub
Pages) from:
  src/template.html  - page shell: <head> meta/manifest/icon tags, CSS (with
                        fonts already embedded as base64 @font-face data
                        URIs), and the static HTML markup. Contains the
                        placeholder string "VEYLIX_SCRIPT_PLACEHOLDER" where
                        the app logic goes.
  src/app.js          - all application logic (state, rendering, event
                        handlers, auth, cloud sync). Edit this file for
                        behaviour changes.

manifest.json, service-worker.js and the icon-*.png files are served
as-is from the repo root alongside index.html - they aren't templated.

Usage:
    python3 build.py

Then commit and push index.html to deploy via GitHub Pages.
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
template = (ROOT / "src" / "template.html").read_text()
script = (ROOT / "src" / "app.js").read_text()

placeholder = '"VEYLIX_SCRIPT_PLACEHOLDER"'
if placeholder not in template:
    raise SystemExit(f"template.html is missing the {placeholder} marker")

output = template.replace(placeholder, script)
(ROOT / "index.html").write_text(output)
print(f"Built index.html ({len(output):,} bytes)")

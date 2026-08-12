#!/usr/bin/env python3
"""
Build script for GymPT.

Assembles gympt.html (the single self-contained file that gets published as
the Claude Artifact) from:
  src/template.html  - page shell: <title>, CSS (with fonts already embedded
                        as base64 @font-face data URIs), and the static HTML
                        markup. Contains the placeholder string
                        "GYMPT_SCRIPT_PLACEHOLDER" where the app logic goes.
  src/app.js          - all application logic (state, rendering, event
                        handlers). Edit this file for behaviour changes.

Usage:
    python3 build.py

Then republish gympt.html as the Claude Artifact to push the change live.
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
template = (ROOT / "src" / "template.html").read_text()
script = (ROOT / "src" / "app.js").read_text()

placeholder = '"GYMPT_SCRIPT_PLACEHOLDER"'
if placeholder not in template:
    raise SystemExit(f"template.html is missing the {placeholder} marker")

output = template.replace(placeholder, script)
(ROOT / "gympt.html").write_text(output)
print(f"Built gympt.html ({len(output):,} bytes)")

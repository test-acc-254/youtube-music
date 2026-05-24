#!/usr/bin/env python3
"""
Verify that every plugin directory under src/plugins/ contains an index.ts file.

Also checks for empty plugin directories. Prints warnings for any issues found
and exits with a non-zero status if the structure is invalid.

Usage:
    python scripts/verify_plugin_structure.py
"""

from __future__ import annotations

import sys
from pathlib import Path


def main() -> int:
    plugins_dir = Path(__file__).resolve().parent.parent / "src" / "plugins"
    if not plugins_dir.exists():
        print(f"Plugins directory not found: {plugins_dir}", file=sys.stderr)
        return 1

    issues = 0
    checked = 0

    for item in sorted(plugins_dir.iterdir()):
        if not item.is_dir():
            continue
        if item.name in {"utils"}:  # shared helper directories, not plugins
            continue

        checked += 1
        index_file = item / "index.ts"

        if not index_file.exists():
            print(f"[ERROR] Missing index.ts in plugin directory: {item.name}")
            issues += 1
            continue

        # Basic sanity check: index.ts should not be empty
        content = index_file.read_text(encoding="utf-8").strip()
        if not content:
            print(f"[WARN]  Empty index.ts in plugin directory: {item.name}")
            issues += 1
            continue

        print(f"[OK]    Plugin structure valid: {item.name}")

    print()
    if issues:
        print(f"Found {issues} issue(s) out of {checked} plugin(s).")
        return 1
    else:
        print(f"All {checked} plugin directories have valid structure.")
        return 0


if __name__ == "__main__":
    sys.exit(main())

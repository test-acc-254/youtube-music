#!/usr/bin/env python3
"""
Check i18n translation completeness against the English reference.

Compares all JSON files in src/i18n/resources/ against en.json to find
missing or extra keys. Prints a summary and exits with a non-zero status
if any translations are incomplete.

Usage:
    python scripts/check_i18n_completeness.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


def collect_keys(obj: Any, prefix: str = "") -> set[str]:
    """Recursively collect dot-notation keys from a nested dict."""
    keys: set[str] = set()
    if isinstance(obj, dict):
        for key, value in obj.items():
            full = f"{prefix}.{key}" if prefix else key
            if isinstance(value, dict):
                keys.update(collect_keys(value, full))
            else:
                keys.add(full)
    return keys


def main() -> int:
    resources_dir = Path(__file__).resolve().parent.parent / "src" / "i18n" / "resources"
    reference_file = resources_dir / "en.json"

    if not reference_file.exists():
        print(f"Reference file not found: {reference_file}", file=sys.stderr)
        return 1

    reference_data = json.loads(reference_file.read_text(encoding="utf-8"))
    reference_keys = collect_keys(reference_data)

    translation_files = sorted(
        f for f in resources_dir.glob("*.json") if f.name != reference_file.name
    )

    if not translation_files:
        print("No translation files found to compare.")
        return 0

    incomplete = []
    total_keys = len(reference_keys)

    for tr_file in translation_files:
        tr_data = json.loads(tr_file.read_text(encoding="utf-8"))
        tr_keys = collect_keys(tr_data)

        missing = reference_keys - tr_keys
        extra = tr_keys - reference_keys
        present = len(tr_keys & reference_keys)
        percent = (present / total_keys) * 100 if total_keys else 100.0

        status = "OK" if not missing and not extra else "INCOMPLETE"
        print(f"[{status}] {tr_file.name}: {present}/{total_keys} ({percent:.1f}%)")

        if missing:
            for key in sorted(missing):
                print(f"    MISSING: {key}")
        if extra:
            for key in sorted(extra):
                print(f"    EXTRA:   {key}")

        if missing or extra:
            incomplete.append(tr_file.name)

    print()
    if incomplete:
        print(f"Incomplete translations: {len(incomplete)}/{len(translation_files)}")
        return 1
    else:
        print("All translations are complete.")
        return 0


if __name__ == "__main__":
    sys.exit(main())

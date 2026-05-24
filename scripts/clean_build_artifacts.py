#!/usr/bin/env python3
"""
Clean common build artifacts, caches, and temporary files for the project.

This script removes directories that are generated during development or
build processes but are not part of the source tree. It is safer than
'rm -rf' because it only targets known artifact paths and asks for
confirmation when run in interactive mode.

Usage:
    python scripts/clean_build_artifacts.py [--force]
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path


ARTIFACT_PATHS = [
    "dist",
    "pack",
    ".vite-inspect",
    "node_modules/.cache",
    "node_modules/.vite",
    "out",
    ".electron-vite",
]


def remove_path(path: Path, force: bool) -> bool:
    if not path.exists():
        return True

    label = "Removing" if force else "Would remove"
    print(f"  {label}: {path}")

    if force:
        try:
            if path.is_dir():
                shutil.rmtree(path)
            else:
                path.unlink()
            return True
        except OSError as exc:
            print(f"    Failed to remove {path}: {exc}", file=sys.stderr)
            return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Clean build artifacts and caches for the project."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Actually delete the files (without this flag, runs in dry-run mode).",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    all_ok = True

    mode = "DRY-RUN" if not args.force else "ACTIVE"
    print(f"Clean mode: {mode}")
    print("-" * 40)

    for rel in ARTIFACT_PATHS:
        target = root / rel
        if not remove_path(target, args.force):
            all_ok = False

    # Also look for stray .log files in the root
    for log_file in root.glob("*.log"):
        if not remove_path(log_file, args.force):
            all_ok = False

    print("-" * 40)
    if args.force:
        print("Cleanup complete.")
    else:
        print("Dry-run complete. Use --force to actually delete files.")

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())

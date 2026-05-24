#!/usr/bin/env python3
"""
Generate a Markdown summary of all plugins in the project.

Scans src/plugins/ and attempts to extract each plugin's display name from
its index.ts file. Writes a formatted list to stdout or a file.

Usage:
    python scripts/generate_plugin_docs.py [--output plugins.md]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def extract_plugin_name(index_path: Path) -> str | None:
    """Try to extract the plugin's human-readable name from index.ts."""
    content = index_path.read_text(encoding="utf-8")

    # Look for name: '...' or name: "..."
    match = re.search(r"name\s*:\s*['\"](.+?)['\"]", content)
    if match:
        return match.group(1)

    # Fallback: use directory name with hyphens replaced by spaces
    return index_path.parent.name.replace("-", " ").title()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a Markdown list of all plugins."
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        help="Write output to a file instead of stdout.",
    )
    args = parser.parse_args()

    plugins_dir = Path(__file__).resolve().parent.parent / "src" / "plugins"
    if not plugins_dir.exists():
        print(f"Plugins directory not found: {plugins_dir}", file=sys.stderr)
        return 1

    plugins: list[tuple[str, str]] = []

    for item in sorted(plugins_dir.iterdir()):
        if not item.is_dir():
            continue
        if item.name in {"utils"}:  # not a plugin
            continue

        index_file = item / "index.ts"
        if not index_file.exists():
            continue

        name = extract_plugin_name(index_file) or item.name
        plugins.append((item.name, name))

    lines: list[str] = [
        "# Plugin Summary",
        "",
        f"Total plugins: {len(plugins)}",
        "",
        "| Directory | Name |",
        "|-----------|------|",
    ]

    for directory, name in plugins:
        lines.append(f"| `{directory}` | {name} |")

    lines.append("")

    output = "\n".join(lines)

    if args.output:
        args.output.write_text(output, encoding="utf-8")
        print(f"Plugin summary written to {args.output}")
    else:
        print(output)

    return 0


if __name__ == "__main__":
    sys.exit(main())

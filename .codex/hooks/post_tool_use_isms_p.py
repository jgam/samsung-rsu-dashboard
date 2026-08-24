#!/usr/bin/env python3
"""Require the repository's ISMS-P workflow after a file-writing tool succeeds."""

import json
import sys


def main() -> int:
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, OSError) as error:
        print(json.dumps({"systemMessage": f"ISMS-P PostToolUse hook could not read its event: {error}"}))
        return 1

    if event.get("hook_event_name") != "PostToolUse":
        return 0

    message = (
        "A file-writing tool just completed. Before declaring this change complete, you must run the "
        "available ISMS-P plugin skills: secure-coding-clauses-2-8-1-and-2-8-2, secret-detection, "
        "and test-data-privacy-clause-2-8-4. Also run personal-data-in-code-domain-3-and-clause-2-7 "
        "when the change touches personal data, schemas, migrations, logging, API responses, "
        "retention, deletion, or encryption. Record results and blockers in the unified workflow "
        "report. Do not claim a skill ran if it is unavailable."
    )
    print(json.dumps({"systemMessage": message}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/bin/sh
set -eu

root_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

required_files='AGENTS.md
README.md
skills/write-unit-tests/SKILL.md
skills/deep-interview/SKILL.md
skills/deep-interview/agents/openai.yaml
skills/write-unit-tests/references/test-run-reporting.md
harness/contracts/vulnerability-reporting.md
harness/templates/review-report.md
harness/templates/workflow-result.md
.codex/hooks.json
.codex/hooks/post_tool_use_isms_p.py'

missing=0
printf '%s\n' "$required_files" | while IFS= read -r relative_path; do
  if [ ! -s "$root_dir/$relative_path" ]; then
    printf 'missing or empty: %s\n' "$relative_path" >&2
    missing=1
  fi
done

# The loop may execute in a subshell, so make one authoritative pass for status.
for relative_path in $required_files; do
  if [ ! -s "$root_dir/$relative_path" ]; then
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  exit 1
fi

if ! grep -q 'strictly greater than 90%' "$root_dir/AGENTS.md"; then
  printf 'coverage gate is missing from AGENTS.md\n' >&2
  exit 1
fi

if ! grep -q 'localhost:3001/api/test-runs' "$root_dir/AGENTS.md"; then
  printf 'test-run endpoint is missing from AGENTS.md\n' >&2
  exit 1
fi

if ! grep -q 'localhost:3001/api/vulnerabilities' "$root_dir/AGENTS.md"; then
  printf 'vulnerability endpoint is missing from AGENTS.md\n' >&2
  exit 1
fi

if ! grep -q 'PostToolUse' "$root_dir/.codex/hooks.json"; then
  printf 'PostToolUse hook is missing from .codex/hooks.json\n' >&2
  exit 1
fi

if ! grep -q 'secure-coding-clauses-2-8-1-and-2-8-2' "$root_dir/.codex/hooks/post_tool_use_isms_p.py"; then
  printf 'ISMS-P enforcement is missing from the PostToolUse hook\n' >&2
  exit 1
fi

printf 'Harness check passed: %s\n' "$root_dir"

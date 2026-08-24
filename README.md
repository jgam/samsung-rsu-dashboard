# Project Harness Starter

This is an intentionally empty project with a repository-local engineering harness. Add application code and its native build/test configuration without removing the harness files.

Before implementation, invoke `$deep-interview` to turn the initial idea into a confirmed, build-ready brief. The skill is stored locally at `skills/deep-interview/SKILL.md`.

The workflow is driven by `AGENTS.md` and covers implementation, unit tests with a strict greater-than-90% coverage gate, code and ISMS-P review, vulnerability dashboard reporting, test-run reporting, and Slack/email notification.

## Start a project

1. Initialize Git so branch and commit metadata can be reported.
2. Add the application and its normal package/build configuration.
3. Configure the test runner to emit machine-readable test results and coverage for lines, branches, functions, and statements.
4. Ensure the local monitoring API is available at `http://localhost:3001` when reporting is required.
5. Connect the vulnerability dashboard reporter, ISMS-P, Slack, and Gmail capabilities in Codex.
6. Open `/hooks` in Codex, inspect the repository-local `PostToolUse` hook, and trust it. Codex intentionally skips new or changed project hooks until they are trusted.
7. Run `./scripts/check-harness.sh` to verify the repository-local harness.

No application framework is imposed by this starter. The unit-test skill adapts to the framework selected by the project.

The hook runs after Codex file-writing tools and injects a mandatory instruction to execute the installed ISMS-P plugin skills. Codex command hooks cannot invoke a skill directly, so the hook enforces execution through the agent loop and makes an unavailable plugin an explicit blocker.

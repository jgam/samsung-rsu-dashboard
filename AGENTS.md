# Unified Engineering Workflow

These instructions apply to every code change in this repository. Implementation, unit testing, code review, security review, vulnerability reporting, test-run reporting, and notifications are one required workflow.

## Local harness files

- Unit testing: `skills/write-unit-tests/SKILL.md`
- Project discovery: `skills/deep-interview/SKILL.md`
- Test-run API contract: `skills/write-unit-tests/references/test-run-reporting.md`
- Review record template: `harness/templates/review-report.md`
- Consolidated result template: `harness/templates/workflow-result.md`
- Vulnerability payload contract: `harness/contracts/vulnerability-reporting.md`
- Post-tool ISMS-P enforcement: `.codex/hooks.json` and `.codex/hooks/post_tool_use_isms_p.py`
- Harness check: `scripts/check-harness.sh`

Keep these files inside the repository. Do not replace them with references to another local project.

The project-local `PostToolUse` hook requires the ISMS-P plugin workflow after file-writing tools. Review and trust the hook with `/hooks` when Codex first opens this repository; an untrusted hook is skipped and blocks the unified definition of done.

## Required capabilities

- Use `vulnerability-dashboard-reporter:security-diff-scan` for a working-tree, commit, branch, or PR change. Use `vulnerability-dashboard-reporter:security-scan` for a repository or scoped-path audit.
- Finalize and validate security findings, including attack-path analysis where applicable, then use `vulnerability-dashboard-reporter:report-vulnerabilities` for each validated vulnerability.
- Run these ISMS-P reviews on every change: `secure-coding-clauses-2-8-1-and-2-8-2`, `secret-detection`, and `test-data-privacy-clause-2-8-4`.
- Also run `personal-data-in-code-domain-3-and-clause-2-7` when a change touches personal data, schemas, migrations, logs, API responses, retention, deletion, or encryption.
- Follow the repository-local `write-unit-tests` skill for all test creation and execution.
- Send the consolidated result to Slack `#samsung-monitoring-system` (`C0A10HA24M9`) and email `jgam@alumni.nd.edu`.

If a required plugin, connector, recipient, credential, local service, or test tool is unavailable, complete safe independent work and report the missing capability as a blocker. Never claim a skipped gate ran.

## Ordered workflow

1. **Orient and scope**
   - Read this file, project configuration, relevant source, and existing tests before editing.
   - Preserve unrelated user changes.
   - Identify behavior changes, security boundaries, personal-data handling, secrets risk, and required tests.

2. **Implement**
   - Make the smallest production-quality change that satisfies the request.
   - Do not add real credentials or production personal data.
   - Keep intentionally vulnerable training fixtures isolated, labeled, disabled by default, and excluded from deployment.

3. **Test**
   - Follow `skills/write-unit-tests/SKILL.md`.
   - Add deterministic tests for public behavior, boundaries, failures, and regressions.
   - Run the narrowest relevant command, then the full affected suite with coverage.
   - Every reported aggregate metric—lines, branches, functions, and statements—must be strictly greater than 90%. Missing required coverage data fails the gate.

4. **Review code and ISMS-P controls**
   - Review the actual diff for correctness, regressions, maintainability, error handling, concurrency/state issues, and missing tests.
   - Run all seven KISA secure-coding categories, secret detection over the working tree and relevant history, and test-data privacy review over tests and test artifacts.
   - Run the personal-data review when applicable.
   - Record findings in `harness/templates/review-report.md` format. Each finding needs location, severity, remediation, owner, target date, and re-verification. Never close a finding without re-verification.

5. **Scan and report vulnerabilities**
   - Select the scan type from the target: diff scan for changes; standard scan for a repository or path.
   - Validate candidates and complete attack-path analysis before treating them as vulnerabilities.
   - Submit each finalized finding separately to `http://localhost:3001/api/vulnerabilities` using `harness/contracts/vulnerability-reporting.md`.
   - Do not submit informational noise, unvalidated candidates, or known duplicates. Preserve the payload and response when submission fails.

6. **Report tests**
   - Build the payload from actual Git metadata and machine-readable test/coverage output using `skills/write-unit-tests/references/test-run-reporting.md`.
   - POST every completed reportable run, passing or failing, to `http://localhost:3001/api/test-runs` with `curl --fail-with-body` and a safely generated temporary JSON file.
   - Treat non-2xx responses as failures. Do not retry if duplicate behavior is unknown without user approval.

7. **Notify**
   - After API submissions, send the same consolidated result to both required destinations using `harness/templates/workflow-result.md`.
   - Include repository and branch/PR, commit SHA, checks, tests, coverage, API IDs/errors, review and vulnerability counts, blockers, and remaining risks.
   - Do not include secrets, tokens, raw personal data, or exploit payloads.
   - Verify Slack delivery from the message result/link and email delivery from the send result.

8. **Definition of done**
   - Requested behavior is complete and relevant build, lint, and type checks pass.
   - Tests are deterministic and passing, with every available required coverage metric strictly above 90%.
   - Test-run reporting succeeded.
   - Code and ISMS-P reviews ran and findings have auditable disposition.
   - The correct security scan ran and all validated vulnerabilities were accepted by the dashboard.
   - Both notifications were delivered and verified.
   - The final response reports changed files, commands/outcomes, coverage, review results, API results, notification results, blockers, and remaining risk.

Never describe the unified workflow as complete if any required gate was skipped, unavailable, failed, or could not be reported.

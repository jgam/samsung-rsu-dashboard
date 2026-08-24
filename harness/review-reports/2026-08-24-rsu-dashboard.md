# Engineering Review Record

- Date: 2026-08-24
- Repository: jgam/samsung-rsu-dashboard
- Branch/PR: feature/rsu-dashboard (PR pending)
- Commit/diff: 888cf9591bc8eb1b109f4fb2d60f6ceede0d71b6
- Reviewer: Codex
- Scope: Mock-only React RSU dashboard, its unit tests, package configuration, and scanner-training fixture.

## Check outcomes

| Check | Outcome | Evidence |
| --- | --- | --- |
| Correctness and regressions | passed | Ten deterministic tests reconcile quantities and values, price changes, schedule dates, transaction-empty state, and loading/error states. |
| Maintainability and error handling | passed | Presentation is separated from local mock data and calculation helpers; controlled loading and retryable error states are included. |
| Tests and coverage | passed | `npm run test:coverage`: 10/10 passed; lines 100%, branches 97.05%, functions 100%, statements 100%. |
| KISA secure coding (all seven categories) | passed | Input/representation: constrained numeric price slider; security features: no auth or sensitive integration; time/state: local React state only; error handling: generic UI error; code quality: tests and lint clean; encapsulation: mock data stays local; API misuse: no external APIs. |
| Secret detection (working tree and history) | accepted-risk | Seven secret-pattern lines occur only in the explicitly labelled fixture; source import search found no runtime reference and `npm pack --dry-run` excludes it. History has one fixture introduction commit. |
| Test-data privacy | passed | Tests use only fictional Alex Kim baseline scenario; no Korean RRN, phone, real-domain email, bank, card, or production dump pattern was found. Clause 2.8.4. |
| Personal-data handling (when applicable) | passed | Alex Kim is explicit fictional demonstration data only. No database, API response, logging, retention, encryption, or real personal-data collection was added. Clauses 3.1, 3.2, 3.4, 2.7. |
| Security scan and validation | blocked | Required vulnerability-dashboard-reporter diff scan preflight cannot run because its installed plugin is missing `preflight/capability-profiles.toml`. Running scan ID: `8e7b9755-f124-4bda-970e-52e56216c2d7`. |

## Findings

| ID | Location | Severity | Description | Remediation | Owner | Target date | Re-verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FIXTURE-001 | `security-fixtures/vulnerable.js` | high | Deliberately vulnerable scanner-training code includes credentials and exploitable sink patterns. It is non-imported and excluded from package output, so no production attack path is reachable. | Keep the fixture isolated, labelled, non-imported, and package-excluded; never deploy or execute it. | Repository owner | 2026-08-24 | Verified `rg` finds no app import and `npm pack --dry-run` excludes `security-fixtures/`. | accepted-risk |
| TOOLING-001 | vulnerability-dashboard-reporter plugin | medium | The required diff-scan preflight registry is absent, preventing the mandated scan and dashboard finding submission. | Repair/reinstall the plugin with its `preflight/capability-profiles.toml` asset, then rerun the diff scan and report any validated production findings. | Plugin maintainer | 2026-08-31 | Run the profile preflight and confirm it returns `ready`; complete scan ID or start a fresh scan. | open |

## Remaining risks and blockers

- The intentionally vulnerable fixture must remain non-deployable; automated fixture isolation should be added in CI before any production release.
- The mandatory security diff scan and vulnerability API report are blocked by the plugin installation, not marked complete.
- Browser runtime was unavailable; desktop screenshot QA passed through local headless Chrome, while a true mobile-device viewport was not conclusively available in that fallback.

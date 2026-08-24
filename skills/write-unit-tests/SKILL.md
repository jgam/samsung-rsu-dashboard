---
name: write-unit-tests
description: Write, extend, and repair unit tests in an existing software project. Use when asked to add test coverage for a function, class, module, component, bug fix, edge case, or changed behavior; create regression tests; improve weak or brittle unit tests; or diagnose and fix unit-test failures. Adapt to the repository's existing language, framework, fixtures, mocks, naming, and test commands.
---

# Write Unit Tests

Build a durable suite around three non-negotiable properties: behavioral truth, coverage above 90%, and deterministic, diagnostic tests.

## Core Principles

### Behavior Is the Source of Truth

- Derive expectations from observable contracts: requirements, API behavior, domain rules, public types, documented invariants, and confirmed regressions.
- Treat the current implementation as evidence, not as the specification. Do not copy its branching structure into tests or preserve behavior that conflicts with the contract.
- Assert inputs and observable outputs, state transitions, errors, events, and boundary interactions. Avoid private methods, incidental call order, internal data shapes, and other refactor-sensitive details.

### Coverage Must Stay Above 90%

- Run the repository's coverage-capable test command after every completed unit-test run.
- Require every reported aggregate metric—lines, branches, functions, and statements when available—to be strictly greater than 90%. Do not waive, round up, or silently omit a metric reported by the tool.
- Treat missing coverage data or any metric at or below 90% as a failed quality gate.
- When the gate fails, send an alert through the project's configured Slack or email integration. Include project, branch, commit, failing metrics, test counts, run time, and recommended next action.
- Never claim an alert was sent without a successful tool response. If no recipient, channel, connector, or credentials are configured, prominently tell the user that the mandatory alert could not be delivered and identify the missing configuration.

### The Suite Is a Long-Lived Asset

- Make determinism and diagnostic value acceptance criteria, not cleanup work.
- Control time, randomness, locale, time zone, environment, filesystem state, network access, concurrency, and asynchronous completion wherever they affect outcomes.
- Eliminate order dependence and leaked state. Keep setup local, cleanup reliable, and parallel execution safe.
- Make every failure explain the broken behavior. Prefer precise assertions, meaningful test names, minimal fixtures, and failure output that identifies expected versus actual behavior.

## Workflow

1. Inspect repository instructions such as `AGENTS.md` and relevant configuration files.
2. Identify the implementation under test, its callers, nearby tests, test framework, and established test command. Prefer existing project tooling over introducing a dependency.
3. Determine the behavioral contract from code, types, documentation, and the user's request. For a reported bug, reproduce it with a failing regression test before changing production code when practical.
4. Choose the smallest useful test set. Cover the primary behavior, important boundary or error cases, and the regression being requested. Avoid exhaustive permutations without meaningful risk reduction.
5. Write tests using the repository's structure, naming, fixtures, factories, assertion style, and setup/teardown patterns.
6. Run the narrowest relevant test command first. Fix test defects and implementation issues that are explicitly within scope.
7. Run the broader affected suite with coverage. Enforce the greater-than-90% quality gate and send the required Slack or email alert when it fails.
8. After the run completes, POST its results to the local test-runs API using the contract in [references/test-run-reporting.md](references/test-run-reporting.md). Treat a non-2xx response as a reporting failure and show the response body.
9. Report files changed, behaviors covered, commands run, coverage, notification status, API reporting status, and any remaining limitation.

## Test Design Rules

- Test public behavior and stable contracts rather than private implementation details.
- Keep each test focused and make failures easy to diagnose. Use Arrange–Act–Assert when it improves readability; do not add ceremonial comments.
- Give tests behavior-oriented names that state the condition and expected result.
- Prefer deterministic inputs. Control clocks, randomness, environment variables, network access, and concurrency where relevant.
- Mock only external boundaries or collaborators that make the test slow, nondeterministic, or out of scope. Do not mock the unit's own logic.
- Assert meaningful outputs, state changes, emitted events, or boundary interactions. Avoid assertions that merely repeat the setup.
- Reuse existing helpers when they clarify intent. Add a local helper only when it removes substantial duplication without hiding behavior.
- Keep fixtures minimal. Prefer builders or factories when large objects obscure what matters to the test.
- Include negative and boundary cases based on actual risks: empty input, invalid values, missing dependencies, failures, limits, and state transitions.
- Do not weaken assertions, skip tests, increase timeouts, or update snapshots blindly to obtain a passing run.

## Handling Failures

Classify a failure before editing:

- **Test defect:** Correct setup, expectations, isolation, or framework usage.
- **Production defect:** Preserve the regression test and fix production code only when the request includes implementation or the change is necessary to make the requested behavior true.
- **Environment defect:** Report the missing service, dependency, credential, runtime, or platform constraint. Do not disguise it as a passing test.
- **Unrelated existing failure:** Confirm it independently when possible and report it without broadening the patch.

Never claim a test passed unless its command completed successfully. If execution is unavailable, state that the tests were written but not run and explain why.

Diagnose every failed case when evidence permits. Record a concise root cause, a concrete suggested fix, and one of the reporting contract's resolution statuses. Use `investigating` when the available evidence is insufficient; do not invent certainty.

## Scope and Handoff

Keep changes limited to tests and the smallest necessary support code. Do not refactor unrelated production code or add a new testing framework when the repository already has one.

In the final response, summarize:

- behaviors covered;
- test and support files changed;
- exact verification commands and outcomes;
- coverage for every available metric and whether the quality gate passed;
- Slack or email alert delivery status when the gate failed;
- test-run API delivery status;
- any untested risk or blocker.

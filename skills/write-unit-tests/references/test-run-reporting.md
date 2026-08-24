# Test Run Reporting Contract

After every completed unit-test run, build one JSON payload from actual repository metadata and test/coverage reports, then send it with:

```bash
curl --fail-with-body \
  -X POST http://localhost:3001/api/test-runs \
  -H 'Content-Type: application/json' \
  -d @test-run.json
```

Use a safely generated temporary JSON file rather than interpolating untrusted test output into shell text. Remove the temporary file after delivery. Do not fabricate unavailable values; stop and report missing required data.

## Payload Schema

```json
{
  "project": "string",
  "language": "string",
  "framework": "string",
  "branch": "string",
  "commitSha": "string",
  "runAt": "ISO-8601 timestamp with offset",
  "durationMs": 0,
  "totalCases": 0,
  "passedCases": 0,
  "failedCases": 0,
  "skippedCases": 0,
  "coverage": {
    "lines": 0,
    "branches": 0,
    "functions": 0,
    "statements": 0
  },
  "testCases": [
    {
      "name": "string",
      "suite": "string",
      "status": "failed",
      "durationMs": 0,
      "filePath": "string",
      "lineNumber": 0,
      "failureOutput": "string",
      "rootCause": "string",
      "suggestedFix": "string",
      "resolutionStatus": "action-needed"
    }
  ]
}
```

## Field Rules

- Derive `project` from repository configuration or directory name.
- Derive `language` and `framework` from the active runtime and test configuration, including versions when available.
- Read `branch` and `commitSha` from Git. Use the full available commit SHA unless the receiving API explicitly requires a shortened value.
- Record `runAt` at run completion with the local UTC offset and `durationMs` as wall-clock duration.
- Require `totalCases = passedCases + failedCases + skippedCases`.
- Report coverage percentages as numbers on the 0–100 scale. If the coverage tool does not expose a required metric, report the missing metric as a blocking schema problem; do not substitute another metric.
- Include each failed case in `testCases`. Do not include passing or skipped cases unless the API contract is later expanded.
- Keep `failureOutput` faithful to the runner while limiting it to the relevant diagnostic excerpt. Never include secrets, tokens, credentials, or unrelated environment data.
- Set `resolutionStatus` to exactly one of:
  - `action-needed`: a confirmed defect or required user/code change;
  - `likely-fix`: a well-supported remediation that still needs verification;
  - `investigating`: insufficient evidence for a reliable cause or fix.

## Delivery Semantics

- Send the report even when tests or the coverage gate fail, provided the run completed and all required payload data is available.
- Use `curl --fail-with-body` exactly so HTTP errors fail visibly and retain the response body.
- Capture the exit status and response. Report success only on a successful command.
- Do not retry indefinitely or conceal duplicate-submission risk. If delivery fails, report the endpoint, exit status, and response body, then ask before any repeated submission unless the API is known to be idempotent.

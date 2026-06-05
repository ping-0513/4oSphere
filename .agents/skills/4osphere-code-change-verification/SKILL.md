---
name: 4osphere-code-change-verification
description: Use before marking 4oSphere code changes complete. Runs or proposes focused verification for formatting, linting, typecheck, tests, build, settings coverage, and security-sensitive changes. Requires honest reporting when scripts are missing or checks cannot be run.
---

# 4oSphere Code Change Verification

## Purpose

Standardize the final verification pass for code changes. This follows the public repo-local skill pattern for code-change verification: inspect available scripts, run the smallest meaningful checks, and report exact results.

## Required workflow

1. Inspect available project scripts/configuration:
   - package manager files
   - package scripts
   - TypeScript config
   - lint/test/build config
   - CI workflows
2. Choose the narrowest meaningful checks for the actual change.
3. Prefer this order:
   - format/lint for touched files
   - typecheck
   - unit tests for touched area
   - focused integration/UI tests
   - build
   - broader tests only when necessary
4. For settings-related changes, include a settings coverage audit:
   - UI control
   - validation
   - persistence
   - restoration
   - request payload mapping
5. For security-sensitive changes, include a security review pass.
6. Report exact commands and outcomes.
7. If checks cannot be run, say why and identify the next best manual verification.

## Output format

Return:

1. Summary
2. Commands run
3. Results
4. Settings coverage result, if applicable
5. Security review result, if applicable
6. Remaining risks
7. Follow-up checks
8. Completion status: complete / blocked / needs human review

## Hard rules

- Do not claim tests passed unless they were actually run and passed.
- Do not run broad, expensive checks when a focused check is sufficient unless requested.
- Do not retry failing checks blindly. Inspect the failure first.
- If the repo has no scripts yet, explicitly state that and propose initial scripts.

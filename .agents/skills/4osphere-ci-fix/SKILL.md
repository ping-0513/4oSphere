---
name: 4osphere-ci-fix
description: Use when 4oSphere CI, GitHub Actions, build, lint, typecheck, or tests fail. Diagnoses the smallest likely failure cause, proposes focused fixes, and avoids broad rewrites or unrelated changes.
---

# 4oSphere CI Fix

## Purpose

Diagnose and fix failing CI with minimal changes. This wraps the public gh-fix-ci / pr-review-ci-fix pattern for 4oSphere.

## Required workflow

1. Identify the failing check:
   - workflow/job/step name
   - command
   - error message
   - changed files likely related
2. Classify failure:
   - environment/toolchain
   - lint/format
   - typecheck
   - unit test
   - UI/e2e test
   - build
   - security/secret scan
   - flaky/infra
3. Propose the smallest focused fix.
4. Prefer fixing the root cause over bypassing checks.
5. Re-run only the relevant command first.
6. Report exact command and result.

## Output format

Return:

1. Failing check
2. Root-cause hypothesis
3. Evidence
4. Minimal fix plan
5. Commands to run
6. Result
7. Remaining risk

## Hard rules

- Do not disable CI checks to make CI green unless explicitly approved and justified.
- Do not broaden scope beyond the failing area.
- Do not touch deploy secrets or environment values.
- If logs are missing, ask for them or identify the exact workflow/run needed.

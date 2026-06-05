---
name: 4osphere-test-coverage-improver
description: Use when improving 4oSphere test coverage or after code changes that add settings, persistence, request payload mapping, security gates, or UI behavior. Prioritizes high-value tests over broad coverage chasing.
---

# 4oSphere Test Coverage Improver

## Purpose

Find the highest-value missing tests for 4oSphere without bloating the suite. This follows the public test-coverage-improver pattern: inspect changed behavior, identify risk, propose focused tests.

## Required workflow

1. Identify changed or risky behavior:
   - settings UI controls
   - validation
   - persistence/restoration
   - GPT-4o request payload mapping
   - presets/import/export
   - security gates
   - docs/examples claims
2. Identify existing tests and gaps.
3. Prioritize tests by risk:
   - Required: prevents likely regression or security issue
   - Priority: valuable but not merge-blocking
   - Deferred: useful later
4. Prefer small focused tests over broad snapshots.
5. Avoid paid API calls in tests. Mock OpenAI/GPT-4o requests unless explicitly approved.
6. Include negative/error-path tests for validation and security-sensitive changes.

## Output format

Return:

1. Behavior under test
2. Existing coverage found
3. Missing tests table
4. Required tests
5. Priority tests
6. Deferred tests
7. Suggested test names/files
8. Notes on mocks/fixtures

## Missing tests table

| Behavior | Existing test | Missing assertion | Priority | Suggested file |
|---|---:|---|---|---|
| setting persists | partial | reload restores value | Required | settings.test.ts |

## Hard rules

- Do not chase arbitrary percentage coverage.
- Do not add brittle UI snapshots where behavior assertions are better.
- Do not hit paid external APIs in tests unless explicitly approved.

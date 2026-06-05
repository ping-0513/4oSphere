---
name: 4osphere-webapp-testing
description: Use when validating 4oSphere UI behavior in a browser or planning Playwright/browser tests. Focuses on settings UI flows, persistence, restoration, GPT-4o request payload behavior, accessibility basics, and preventing expensive or uncontrolled test runs.
---

# 4oSphere Webapp Testing

## Purpose

Validate that user-visible 4oSphere behavior actually works in the browser, not only in code. This wraps the public Playwright/webapp-testing pattern for this GPT-4o-only repo.

## Required workflow

1. Identify the flow to test:
   - settings control changes
   - save/restore behavior
   - preset import/export
   - GPT-4o request payload preview or submission
   - error/validation states
   - dangerous-setting confirmation UI
2. Define a minimal browser scenario before running tools.
3. Prefer deterministic selectors:
   - accessible names
   - labels
   - test ids only when necessary
4. Verify:
   - initial state
   - interaction
   - validation
   - persistence/restoration
   - final user-visible outcome
   - error handling
5. Keep test scope narrow.
6. Stop before external network, paid API calls, destructive actions, or deploy unless explicitly approved.

## Suggested scenario format

Use this format before writing/running browser tests:

| Flow | Preconditions | Steps | Expected result | Risk |
|---|---|---|---|---|
| temperature setting persists | app loaded | change value, save, reload | value restored and payload updates | low |

## Output format

Return:

1. Test objective
2. Browser scenarios
3. Selectors or accessibility hooks needed
4. Expected assertions
5. Commands to run
6. Results or blockers
7. Follow-up tests

## Hard rules

- Do not trigger paid OpenAI calls unless explicitly approved.
- Do not run broad e2e suites if one focused scenario is enough.
- Do not claim UI behavior works without browser evidence or a clear reason tests could not run.

---
name: 4osphere-pr-review
description: Use when explicitly preparing or reviewing a 4oSphere pull request or diff. Produces an integrated review across implementation strategy, settings coverage, security, docs, tests, compatibility, and merge readiness for the GPT-4o-only edition.
---

# 4oSphere PR Review

## Purpose

Review a 4oSphere PR or diff against project standards. This skill combines the useful public PR-review, code-verification, docs-sync, and security-review patterns into a single merge-readiness checklist.

Use this for final review. For deep work, also invoke the more specific skill first.

## Review scope

Check:

1. Implementation strategy
   - clear intent
   - small safe diff
   - no accidental provider generalization
   - non-goals respected
2. Settings coverage
   - UI controls exist
   - validation exists
   - persistence/restoration works
   - final OpenAI/GPT-4o request payload mapping is complete
   - unsupported/deferred items are explicit
3. Security
   - no secret exposure
   - prompt/tool injection risks handled
   - XSS/HTML/Markdown rendering safe
   - storage/logging safe
   - dangerous actions gated
4. Tests and verification
   - typecheck/lint/build where available
   - focused tests for changed behavior
   - settings coverage tests for config changes
   - security regression tests when relevant
5. Docs/help text
   - README/docs updated
   - UI copy/help text accurate
   - defaults and limitations documented
6. Compatibility
   - saved settings
   - presets/import/export
   - migrations
   - backwards compatibility

## Output format

Return:

1. Summary
2. Safe-to-merge: yes / no / conditional
3. Required fixes
4. Settings coverage gaps
5. Security concerns
6. Test gaps
7. Docs/help text gaps
8. Compatibility risks
9. Suggested review comments
10. Follow-up tasks

## Hard rules

- Do not approve a PR that silently removes API-configurable behavior from the UI.
- Do not approve a PR that stores secrets insecurely.
- Do not approve a PR that introduces deploy, shell, network, file upload, or destructive behavior without explicit gates.
- If evidence is missing, say exactly what file, command, or test should be checked.

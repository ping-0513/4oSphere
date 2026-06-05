---
name: 4osphere-docs-sync
description: Use when 4oSphere behavior, settings, UI copy, defaults, API payload behavior, workflows, or safety gates change. Checks that README, docs, help text, changelog, and UI descriptions stay synchronized with implementation.
---

# 4oSphere Docs Sync

## Purpose

Keep user-facing and developer-facing docs aligned with implementation. This follows the public docs-sync skill pattern: detect behavior changes, identify impacted docs, and produce minimal doc updates.

## Required workflow

1. Identify what changed:
   - settings UI
   - GPT-4o request behavior
   - defaults/presets
   - persistence/import/export
   - security/safety gates
   - commands/scripts
   - CI/CD workflow
2. Identify impacted documentation:
   - README
   - docs files
   - UI help text/tooltips
   - examples
   - changelog/release notes
   - AGENTS.md or repo-local skill docs
3. Check for mismatch:
   - missing setting description
   - outdated default value
   - unsupported behavior described as supported
   - implementation changed but docs did not
   - docs mention non-4o providers without explicit scope
4. Propose or apply minimal doc edits.

## Output format

Return:

1. Summary
2. Behavior changes found
3. Docs that need updates
4. Proposed doc edits
5. Remaining ambiguity
6. Follow-up docs/tests

## Hard rules

- Keep docs consistent with the GPT-4o-only scope unless user requests expansion.
- Do not invent features that are not implemented.
- If a setting is intentionally deferred or unsupported, document that clearly.

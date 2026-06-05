---
name: 4osphere-implementation-strategy
description: Use before implementing or refactoring 4oSphere architecture, settings UI, config schemas, persistence, request payload mapping, or other cross-file behavior. This skill forces a spec-first plan, identifies boundaries and non-goals, and prevents broad, vague, or provider-generalized changes in the GPT-4o-only edition.
---

# 4oSphere Implementation Strategy

## Purpose

Create a short implementation plan before editing code. This skill is based on the effective repo-local skill pattern used for implementation strategy and release workflows: narrow contract, clear trigger, concrete output.

4oSphere is the GPT-4o-only edition. Do not generalize to other providers or models unless explicitly requested.

## Required workflow

1. Restate the requested behavior in one paragraph.
2. Identify non-goals and out-of-scope work.
3. Identify source-of-truth files to inspect first:
   - settings/config schema
   - request payload builder
   - OpenAI/GPT-4o API adapter
   - persistence layer
   - settings UI components
   - tests/build scripts
   - docs/help text
4. Enumerate every affected API-configurable option or behavior.
5. Classify each affected item:
   - Required
   - Priority
   - Deferred
   - Unsupported / needs confirmation
6. Define the smallest safe diff.
7. Define verification steps before editing.
8. Stop for confirmation if the work implies deploy, secrets, destructive operations, new storage of sensitive data, broad network access, or provider generalization.

## Output format

Return:

1. Intended behavior
2. Non-goals
3. Files to inspect/change
4. Affected option inventory
5. Required / Priority / Deferred / Unsupported classification
6. Implementation plan
7. Verification plan
8. Risks and stop conditions

## Hard rules

- Do not silently reduce a broad settings request to a few convenient controls.
- Prefer advanced/collapsible UI sections over omitting options.
- Keep diffs small and reviewable.
- Do not claim unsupported provider behavior for this GPT-4o-only repo.

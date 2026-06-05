---
name: 4osphere-settings-coverage
description: Use whenever 4oSphere work touches settings UI, GPT-4o model configuration, presets, defaults, persistence, validation, or OpenAI request payload mapping. Ensures every relevant API-configurable behavior remains reachable from UI and prevents silent simplification.
---

# 4oSphere Settings Coverage

## Purpose

Ensure every relevant GPT-4o/OpenAI-configurable behavior is represented across UI, validation, persistence, restoration, and final request payload mapping.

This skill intentionally favors complete coverage over a minimal-looking UI. If an option is advanced, place it under Advanced, Experimental, Dangerous, or Developer settings instead of deleting it.

## Required workflow

1. Identify the source of truth:
   - OpenAI/GPT-4o request payload builder
   - TypeScript settings/config types
   - schema/validation files
   - persisted settings defaults/migrations
   - settings UI controls
   - presets/import/export code
   - tests
2. Enumerate every affected configurable option or behavior.
3. For each option, verify:
   - UI control exists or intentional non-UI reason is documented
   - default value is visible or documented
   - validation exists
   - value persists
   - value restores
   - value maps to final OpenAI request payload
   - unsupported/deprecated/dangerous status is visible where relevant
4. Classify every item:
   - Required: must be implemented for correctness
   - Priority: should be included in this change if practical
   - Deferred: intentionally postponed with reason
   - Unsupported / needs confirmation: API exists but product support is unclear
   - Not applicable: documented reason required
5. Produce a coverage table before claiming done.

## Coverage table

Use this format:

| Option / behavior | Source | UI | Persisted | Restored | Payload | Status | Notes |
|---|---|---:|---:|---:|---:|---|---|
| temperature | payload/type | yes | yes | yes | yes | Required | OK |
| top_p | payload/type | no | no | no | no | Required | missing |

## 4o-only scope

- Assume GPT-4o/OpenAI-only unless instructed otherwise.
- Do not add provider abstraction or non-4o capability tables just because they are common in other agents.
- If model-dependent behavior matters inside GPT-4o variants, label it as needs confirmation.

## Output format

Return:

1. Summary
2. Coverage table
3. Missing UI controls
4. Missing validation/persistence/restoration/payload mapping
5. Required fixes
6. Priority improvements
7. Deferred items with reasons
8. Unsupported / needs confirmation
9. Tests to add
10. Security concerns

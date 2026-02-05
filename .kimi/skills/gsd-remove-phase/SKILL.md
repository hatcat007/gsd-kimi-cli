---
name: gsd-remove-phase
description: Remove a phase from the roadmap. Use when a phase is no longer needed or was created by mistake.
---

# Remove Phase

Remove a phase from the project roadmap.

## Usage

```
/skill:gsd-remove-phase <phase_number> [--force]
```

## Process

### 1. Safety Checks
- Check if phase has completed work
- Warn if PLAN.md or SUMMARY.md exists
- Require --force to delete with work

### 2. Archive (Optional)
- Move completed work to `.planning/archive/`
- Preserve git history reference

### 3. Remove Phase
- Remove from ROADMAP.md
- Delete phase directory (or archive)
- Renumber subsequent phases

### 4. Update State
- Update STATE.md
- Log removal in CHANGELOG

## Safety

Without `--force`, will refuse to remove phases with:
- Existing PLAN.md
- Existing SUMMARY.md
- Completed tasks

## Example

```
/skill:gsd-remove-phase 5
/skill:gsd-remove-phase 3 --force
```

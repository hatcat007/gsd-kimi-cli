---
name: gsd-complete-milestone
description: Mark a milestone as complete. Archives the milestone and updates project state. Use when all milestone phases are finished.
---

# Complete Milestone

Mark a milestone as complete.

## Usage

```
/skill:gsd-complete-milestone <milestone_id>
```

## Process

### 1. Verify Completion
- Check all phases in milestone are complete
- Verify all verifications pass
- Ensure no open todos

### 2. Archive Work
- Move phase files to `.planning/archive/`
- Create milestone summary
- Tag git commit

### 3. Create Completion Report
Generate `<ID>-MILESTONE-COMPLETE.md`:
```markdown
# Milestone Complete: <name>

**Completed:** <date>

## Phases Delivered
- Phase X: <title>
- Phase Y: <title>

## Key Deliverables
- <list>

## Metrics
- Total commits: <n>
- Files changed: <n>
- Tests added: <n>
```

### 4. Update State
- Mark milestone complete
- Set next milestone (if exists)
- Update STATE.md

## Example

```
/skill:gsd-complete-milestone M1
```

## Post-Completion

Consider:
- Creating release notes
- Deploying to production
- Announcing completion
- Starting next milestone

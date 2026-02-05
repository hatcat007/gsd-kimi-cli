---
name: gsd-verify-work
description: Validate built features through conversational user acceptance testing
type: standard
---

# GSD Verify Work

Validate completed work through conversational user acceptance testing (UAT).

## Arguments

```
/skill:gsd-verify-work [phase-number]
```

- `phase-number` - Phase to verify (optional, defaults to current phase)

## Purpose

Confirm that what was built actually works from the user's perspective. Tests are presented one at a time in plain text conversation.

When issues are found, automatically:
1. Diagnose root causes
2. Plan fixes
3. Prepare for execution

## Prerequisites

- [ ] `.planning/` directory exists
- [ ] Phase has been executed (has SUMMARY.md files)
- [ ] User available for testing

## Process

### Step 1: Check for Active UAT Session

**Check for existing UAT.md:**

```bash
UAT_FILES=$(ls -1 .planning/phases/*/*-UAT.md 2>/dev/null | grep -v "resolved")

if [ -n "$UAT_FILES" ]; then
    echo "Active UAT session found"
    # Offer to resume or start new
fi
```

### Step 2: Resolve Phase

**If phase not provided:**

```bash
# Get current phase from STATE.md
CURRENT_PHASE=$(grep "^Phase:" .planning/STATE.md 2>/dev/null | head -1 | sed 's/Phase: *//' | awk '{print $1}')
PHASE_ARG="${1:-$CURRENT_PHASE}"
```

**Find phase directory:**

```bash
PADDED_PHASE=$(printf "%02d" "$PHASE_ARG" 2>/dev/null || echo "$PHASE_ARG")
PHASE_DIR=$(find .planning/phases -maxdepth 1 -type d \( -name "${PADDED_PHASE}-*" -o -name "${PHASE_ARG}-*" \) 2>/dev/null | head -1)

if [ -z "$PHASE_DIR" ]; then
    echo "ERROR: Phase $PHASE_ARG not found"
    exit 1
fi
```

### Step 3: Find SUMMARY.md Files

**Discover completed plans:**

```bash
SUMMARY_FILES=$(ls -1 "$PHASE_DIR"/*-SUMMARY.md 2>/dev/null | sort)

if [ -z "$SUMMARY_FILES" ]; then
    echo "ERROR: No SUMMARY.md files found in $PHASE_DIR"
    echo "Phase may not have been executed yet."
    exit 1
fi

echo "Found $(echo "$SUMMARY_FILES" | wc -l) completed plans to verify"
```

### Step 4: Extract Testable Deliverables

**Read each SUMMARY.md and extract:**

```bash
for summary in $SUMMARY_FILES; do
    echo "Reading: $(basename $summary)"
    # Extract:
    # - What was accomplished
    # - Key features delivered
    # - User-observable outcomes
done
```

**Generate test list:**

From SUMMARY.md content, identify:
- Features that should be testable
- User-facing functionality
- Integration points

### Step 5: Create UAT.md

**Create UAT document:**

```bash
UAT_FILE="${PHASE_DIR}/$(basename $PHASE_DIR)-UAT.md"
```

**Template:**

```markdown
# Phase X: UAT Report

**Phase:** [phase-name]
**Date:** $(date +%Y-%m-%d)
**Status:** in-progress | passed | diagnosed

## Test Results

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 1 | [Test description] | [Expected behavior] | [pass/fail] | [notes] |

## Issues Found

### Issue 1: [Description]
**Severity:** critical | major | minor
**Test:** #N
**Symptom:** [What user observed]
**Root Cause:** [Diagnosed cause]
**Fix Plan:** [Reference to fix plan]

## Summary

- Tests: N passed / M total
- Issues: X found
- Status: [overall status]
```

### Step 6: Present Tests One at a Time

**For each test:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST N of M

[Feature/Function being tested]

Expected behavior:
[Clear description of what should happen]

Does this work correctly? (yes/y/next or describe issue)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**User response handling:**

| Response | Action |
|----------|--------|
| "yes", "y", "next" | Mark as passed |
| Anything else | Log as issue, infer severity |

**Infer severity from description:**

| Keywords | Severity |
|----------|----------|
| "crash", "error", "broken", "doesn't work at all" | critical |
| "wrong", "incorrect", "missing", "should be" | major |
| "minor", "cosmetic", "style", "typo" | minor |

### Step 7: Update UAT.md After Each Response

**Append to UAT.md:**

```markdown
| N | [Test name] | [Expected] | pass/fail | [User response] |
```

**If issue found, also add:**

```markdown
### Issue N: [Brief description]
**Severity:** [inferred]
**Test:** #N
**Symptom:** [User's description]
```

**Batch writes:**
- On issue found (immediate)
- Every 5 passes
- On completion

### Step 8: Commit Progress

```bash
git add "$UAT_FILE"
git commit -m "test(${PHASE_NAME}): UAT progress - N/M tests

Co-Authored-By: Kimi k2.5 <noreply@moonshot.cn>"
```

### Step 9: Handle Issues (If Found)

**If issues were found:**

**9a. Spawn parallel debug agents:**

```python
Task(
    description=f"Diagnose issue: {issue_description}",
    subagent_name="gsd-debugger",
    prompt=f"""
Diagnose root cause of UAT issue.

## Issue
{issue_description}

## Context
- UAT File: {UAT_FILE}
- Phase: {PHASE_NAME}
- Related SUMMARY: {SUMMARY_FILE}

## Your Task
1. Examine the codebase
2. Find the root cause
3. Document in UAT.md under "Root Cause"
4. Suggest fix approach

Return diagnosis report.
"""
)
```

**Spawn one task per issue (parallel).**

**9b. Update UAT.md with diagnoses:**

```markdown
### Issue N: [Description]
**Severity:** [severity]
**Test:** #N
**Symptom:** [What user observed]
**Root Cause:** [From debug agent]
**Suggested Fix:** [Approach]
```

**9c. Spawn planner for gap plans:**

```python
Task(
    description=f"Create gap fix plans for {PHASE_NAME}",
    subagent_name="gsd-planner",
    prompt=f"""
Create fix plans for UAT gaps.

## UAT Report
{UAT_FILE}

## Issues to Fix
[List issues with root causes]

## Your Task
1. Read UAT.md gaps
2. Create plans: XX-gap-01-PLAN.md, XX-gap-02-PLAN.md, etc.
3. Mark with gap_closure: true in frontmatter
4. Ensure plans address root causes

Return: Plans created with paths.
"""
)
```

**9d. Verify fix plans:**

```python
Task(
    description="Verify gap fix plans",
    subagent_name="gsd-plan-checker",
    prompt=f"""
Verify that gap fix plans properly address UAT issues.

## Plans to Check
[List gap plans]

## Original Issues
[From UAT.md]

## Your Task
1. Read each gap plan
2. Verify it addresses the root cause
3. Check completeness
4. Report: verified or needs revision

Max 3 iterations with planner.
"""
)
```

**9e. Update UAT status:**

```markdown
**Status:** diagnosed
```

### Step 10: Complete UAT

**Update UAT.md final status:**

```markdown
## Summary

- Tests: N passed / M total
- Issues: X found, Y diagnosed
- Status: [passed | diagnosed]
- Completed: [date]
```

**Final commit:**

```bash
git add "$UAT_FILE"
git commit -m "test(${PHASE_NAME}): complete UAT

Tests: N passed / M total
Issues: X found
Status: [passed | diagnosed]

Co-Authored-By: Kimi k2.5 <noreply@moonshot.cn>"
```

### Step 11: Route Based on Results

**Route A: All tests pass, more phases remain**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PHASE {Z} VERIFIED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase {Z}: {Name}

{N}/{N} tests passed
UAT complete ✓

───────────────────────────────────────────────────────────────

## ▶ Next Up

**Phase {Z+1}: {Name}** — {Goal}

/skill:gsd-discuss-phase {Z+1}

───────────────────────────────────────────────────────────────
```

**Route B: All tests pass, milestone complete**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PHASE {Z} VERIFIED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase {Z}: {Name}

{N}/{N} tests passed
Final phase verified ✓

───────────────────────────────────────────────────────────────

## ▶ Next Up

**Audit milestone** — verify requirements, integration

/skill:gsd-audit-milestone

───────────────────────────────────────────────────────────────
```

**Route C: Issues found, fix plans ready**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PHASE {Z} ISSUES FOUND ⚠
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase {Z}: {Name}

{N}/{M} tests passed
{X} issues diagnosed
Fix plans verified ✓

### Issues Found

[List with severity]

───────────────────────────────────────────────────────────────

## ▶ Next Up

**Execute fix plans**

/skill:gsd-execute-phase {Z} --gaps-only

───────────────────────────────────────────────────────────────
```

**Route D: Issues found, planning blocked**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PHASE {Z} BLOCKED ✗
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase {Z}: {Name}

{N}/{M} tests passed
Fix planning blocked after {X} iterations

### Unresolved Issues

[List blocking issues]

───────────────────────────────────────────────────────────────

## ▶ Next Up

**Manual intervention required**

Review issues and either:
1. Provide guidance for fix planning
2. Manually address blockers
3. Accept current state and continue

───────────────────────────────────────────────────────────────
```

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Use AskUserQuestion for test responses | Plain text conversation |
| Ask severity | Infer from description |
| Present full checklist upfront | One test at a time |
| Run automated tests | Manual user validation |
| Fix issues during testing | Log as gaps, diagnose after |

## Outputs

### Files Created

- `{phase}-UAT.md` - UAT report with test results and issues

### Git Commits

- UAT progress commits (batched)
- Final UAT completion commit

## Success Criteria

- [ ] UAT.md created with tests from SUMMARY.md
- [ ] Tests presented one at a time with expected behavior
- [ ] Plain text responses (no structured forms)
- [ ] Severity inferred, never asked
- [ ] Batched writes: on issue, every 5 passes, or completion
- [ ] Committed on completion
- [ ] If issues: parallel debug agents diagnose root causes
- [ ] If issues: planner creates fix plans from diagnosed gaps
- [ ] If issues: checker verifies fix plans (max 3 iterations)
- [ ] Ready for `/skill:gsd-execute-phase --gaps-only` when complete

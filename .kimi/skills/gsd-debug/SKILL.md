---
name: gsd-debug
description: Debug issues and create fix plans
type: standard
---

# GSD Debug

Debug issues and create fix plans using systematic root cause analysis.

## Arguments

```
/skill:gsd-debug ["issue description"] [--from-checkpoint=<file>]
```

## Process

### Step 1: Capture Issue Context

**Collect all relevant information:**
- Error messages and stack traces
- Reproduction steps
- Expected vs actual behavior
- Recent changes (git log)

### Step 2: Create Debug Session

**Generate debug session file:**
```bash
DEBUG_ID=$(date +%s)
DEBUG_DIR=".planning/debug"
mkdir -p "$DEBUG_DIR"
DEBUG_FILE="$DEBUG_DIR/${DEBUG_ID}-issue.md"
```

**Initial template:**
```markdown
# Debug-${DEBUG_ID}: [Issue Title]

**Status:** diagnosing
**Created:** $(date +%Y-%m-%d)

## Problem

[User description]

## Reproduction

1. [Step 1]
2. [Step 2]

## Environment

- [ ] OS:
- [ ] Language:
- [ ] Dependencies:
```

### Step 3: Spawn Debugger Subagent

```python
Task(
    description=f"Debug issue: {issue_title}",
    subagent_name="gsd-debugger",
    prompt=f"""
Debug this issue using the GSD scientific method.

## Debug Session
{DEBUG_FILE}

## Issue Description
{issue_description}

## Your Task
1. Examine the codebase thoroughly
2. Form hypotheses about root cause
3. Test hypotheses with code/binaries/logs
4. Update the debug session file with:
   - **Root Cause:** [Specific location and explanation]
   - **Fix Approach:** [How to resolve]
   - **Estimated Effort:** [small/medium/large]

5. If fix is straightforward, propose the fix
6. If complex, create a FIX-PLAN.md

## Method
Follow the scientific method:
1. Observe symptoms
2. Form hypothesis
3. Test hypothesis
4. Conclude root cause
5. Propose solution

## Output
Return the root cause and recommended fix approach.
"""
)
```

### Step 4: Update Debug Session

**After debugger completes, update:**
```markdown
## Diagnosis

**Root Cause:** [From debugger]

**Location:** [File:line]

**Analysis:** [Detailed explanation]

## Fix

**Approach:** [How to fix]

**Estimated Effort:** [small/medium/large]

**Fix Plan:** `.planning/debug/{DEBUG_ID}-FIX-PLAN.md` (if needed)
```

### Step 5: Offer Actions

Based on complexity:

| Effort | Action |
|--------|--------|
| small | `/skill:gsd-quick` - Execute fix now |
| medium/large | `/skill:gsd-add-todo` - Add to backlog |
| complex | Create formal plan for next phase |

**Prompt user:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► DEBUG COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: [title]
Root Cause: [summary]
Effort: [size]

▶ Actions:
1. Fix now (gsd-quick)
2. Add to todos
3. Create formal plan
```

### Step 6: Update STATE.md

```bash
# Add debug session to STATE.md tracking
```

## Debug Session Template

```markdown
# Debug-XXX: [Issue Title]

**Status:** diagnosing|fixed|wontfix
**Created:** [date]

## Problem

[Description]

## Reproduction

1. [Step 1]
2. [Step 2]

## Diagnosis

**Root Cause:** [Explanation]

**Location:** [File:line]

## Fix

**Approach:** [How to fix]

**Estimated Effort:** [small/medium/large]

## Plan

Created: .planning/debug/XXX-FIX-PLAN.md
```

## Integration

Debug sessions tracked in STATE.md and shown by gsd-progress.

## Success Criteria

- [ ] Issue context captured
- [ ] Debug session file created
- [ ] gsd-debugger subagent spawned
- [ ] Root cause identified
- [ ] Fix approach documented
- [ ] User presented with action options

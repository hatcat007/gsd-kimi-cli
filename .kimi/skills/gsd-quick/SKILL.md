---
name: gsd-quick
description: Execute ad-hoc tasks with GSD guarantees but skip optional agents
type: standard
---

# GSD Quick

Execute small, ad-hoc tasks with GSD guarantees (atomic commits, STATE.md tracking) while skipping optional agents.

## Arguments

```
/skill:gsd-quick ["task description"]
```

- `task description` - What to do (optional, will prompt if not provided)

## Purpose

Quick mode is the same GSD system with a shorter path:
- Spawns planner (quick mode) + executor
- Skips researcher, plan-checker, verifier
- Tasks live in `.planning/quick/` separate from planned phases
- Updates STATE.md "Quick Tasks" table (NOT ROADMAP.md)

**Use when:** You know exactly what to do and the task is small enough to not need research or verification.

## Process

### Step 1: Resolve Model Profile

**Read from config:**

```bash
MODEL_PROFILE=$(cat .planning/config.json 2>/dev/null | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('model_profile', 'balanced'))
except:
    print('balanced')
")
```

**Model mapping:**

| Profile | Planner | Executor |
|---------|---------|----------|
| quality | kimi-k2.5 | kimi-k2.5 |
| balanced | kimi-k2.5 | kimi-k2.5 |
| budget | kimi-k2.5 | kimi-k2.5 |

### Step 2: Pre-flight Validation

**Check for active project:**

```bash
if [ ! -f ".planning/ROADMAP.md" ]; then
    echo "Quick mode requires an active project with ROADMAP.md."
    echo ""
    echo "Run /skill:gsd-new-project first."
    exit 1
fi
```

### Step 3: Get Task Description

**If not provided as argument:**

```
What do you want to do?

Enter a brief task description:
```

**Generate slug from description:**

```bash
SLUG=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | \
       sed 's/[^a-z0-9]/-/g' | \
       sed 's/--*/-/g' | \
       sed 's/^-//;s/-$//' | \
       cut -c1-40)
```

Example:
- Input: "Add email validation to signup form"
- Slug: "add-email-validation-to-signup-form"

### Step 4: Calculate Next Quick Task Number

**Find highest existing number:**

```bash
# Ensure directory exists
mkdir -p .planning/quick

# Find last number
LAST=$(ls -1d .planning/quick/[0-9][0-9][0-9]-* 2>/dev/null | \
       sort -r | head -1 | \
       xargs basename 2>/dev/null | \
       grep -oE '^[0-9]+')

if [ -z "$LAST" ]; then
    NEXT_NUM="001"
else
    NEXT_NUM=$(printf "%03d" $((10#$LAST + 1)))
fi
```

### Step 5: Create Quick Task Directory

```bash
QUICK_DIR=".planning/quick/${NEXT_NUM}-${SLUG}"
mkdir -p "$QUICK_DIR"

echo "Creating quick task ${NEXT_NUM}: ${DESCRIPTION}"
echo "Directory: ${QUICK_DIR}"
```

### Step 6: Spawn Planner (Quick Mode)

**Spawn planner subagent:**

```
Task(
    description=f"Quick plan: {DESCRIPTION}",
    subagent_name="gsd-planner",
    prompt=f"""
Create a QUICK execution plan (minimal, no research).

## Mode
QUICK - Skip research and verification

## Task
{DESCRIPTION}

## Output Location
{QUICK_DIR}/{NEXT_NUM}-PLAN.md

## Constraints
- Create a SINGLE plan with 1-3 focused tasks
- Quick tasks should be atomic and self-contained
- No research phase, no checker phase
- Target simple, focused execution (~30 min tasks)

## Plan Format
Use standard GSD plan format:
- Frontmatter with phase: quick, plan: {NEXT_NUM}
- Objective (one sentence)
- 1-3 tasks with clear done criteria
- Success criteria

Write plan to: {QUICK_DIR}/{NEXT_NUM}-PLAN.md

Return: ## PLANNING COMPLETE with plan path
"""
)
```

**Verify plan created:**

```bash
if [ ! -f "${QUICK_DIR}/${NEXT_NUM}-PLAN.md" ]; then
    echo "ERROR: Planner failed to create ${NEXT_NUM}-PLAN.md"
    exit 1
fi

echo "Plan created: ${QUICK_DIR}/${NEXT_NUM}-PLAN.md"
```

### Step 7: Spawn Executor

**Spawn executor subagent:**

```
Task(
    description=f"Execute: {DESCRIPTION}",
    subagent_name="gsd-executor",
    prompt=f"""
Execute quick task {NEXT_NUM}.

## Plan
{QUICK_DIR}/{NEXT_NUM}-PLAN.md

## Project State
.planning/STATE.md

## Constraints
- Execute all tasks in the plan
- Commit each task atomically
- Create summary at: {QUICK_DIR}/{NEXT_NUM}-SUMMARY.md
- Do NOT update ROADMAP.md (quick tasks are separate)
- Use commit format: type(quick-{NEXT_NUM}): description

## Deviation Rules
Apply automatically:
- Rule 1: Auto-fix bugs
- Rule 2: Auto-add missing critical functionality
- Rule 3: Auto-fix blocking issues
- Rule 4: STOP for architectural changes (checkpoint)

Return: ## PLAN COMPLETE with summary path and commits
"""
)
```

**Verify summary created:**

```bash
if [ ! -f "${QUICK_DIR}/${NEXT_NUM}-SUMMARY.md" ]; then
    echo "ERROR: Executor failed to create ${NEXT_NUM}-SUMMARY.md"
    exit 1
fi
```

### Step 8: Update STATE.md

**Check for Quick Tasks section:**

```bash
if ! grep -q "### Quick Tasks Completed" .planning/STATE.md; then
    # Add section after Blockers/Concerns
    # Use sed or similar to insert section
fi
```

**Add task to table:**

```markdown
### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Add email validation | 2026-02-03 | abc123 | [001-add-email-validation](./quick/001-add-email-validation/) |
| 002 | Fix navigation bug | 2026-02-03 | def456 | [002-fix-navigation-bug](./quick/002-fix-navigation-bug/) |
```

**Update Last activity:**

```markdown
Last activity: 2026-02-03 - Completed quick task ${NEXT_NUM}: ${DESCRIPTION}
```

### Step 9: Final Commit

**Stage quick task artifacts:**

```bash
git add "${QUICK_DIR}/${NEXT_NUM}-PLAN.md"
git add "${QUICK_DIR}/${NEXT_NUM}-SUMMARY.md"
git add .planning/STATE.md
```

**Commit:**

```bash
git commit -m "quick(${NEXT_NUM}): ${DESCRIPTION}

Quick task completed.

Co-Authored-By: Kimi k2.5 <noreply@moonshot.cn>"
```

**Get commit hash:**

```bash
COMMIT_HASH=$(git rev-parse --short HEAD)
```

### Step 10: Display Completion

```
╔══════════════════════════════════════════════════════════════════╗
║  QUICK TASK COMPLETE                                             ║
╚══════════════════════════════════════════════════════════════════╝

Quick Task ${NEXT_NUM}: ${DESCRIPTION}

Summary: ${QUICK_DIR}/${NEXT_NUM}-SUMMARY.md
Commit: ${COMMIT_HASH}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready for next task: /skill:gsd-quick

───────────────────────────────────────────────────────────────────
```

## Quick Task vs Planned Phase

| Aspect | Quick Task | Planned Phase |
|--------|-----------|---------------|
| Location | `.planning/quick/` | `.planning/phases/XX-name/` |
| Research | Skipped | Optional |
| Plan checker | Skipped | Included |
| Verifier | Skipped | Included |
| Tasks | 1-3 atomic | 2-3 per plan |
| Duration | ~30 min | Hours/days |
| STATE.md | Quick Tasks table | Full position update |
| ROADMAP.md | Not modified | Updated |

## When to Use Quick Mode

**Good for:**
- Bug fixes
- Small feature additions
- Refactoring
- Documentation updates
- Configuration changes

**Not for:**
- Large features
- Architectural changes
- Multi-day work
- Complex integrations
- Phases requiring research

## Outputs

### Files Created

- `.planning/quick/NNN-slug/NNN-PLAN.md` - Quick plan
- `.planning/quick/NNN-slug/NNN-SUMMARY.md` - Execution summary

### Git Commits

- Format: `quick(NNN): description`
- Includes planning artifacts

### STATE.md Updates

- Added to Quick Tasks Completed table
- Last activity updated

## Success Criteria

- [ ] ROADMAP.md validation passes
- [ ] User provides task description
- [ ] Slug generated (lowercase, hyphens, max 40 chars)
- [ ] Next number calculated (001, 002, 003...)
- [ ] Directory created at `.planning/quick/NNN-slug/`
- [ ] `NNN-PLAN.md` created by planner
- [ ] `NNN-SUMMARY.md` created by executor
- [ ] STATE.md updated with quick task row
- [ ] Artifacts committed

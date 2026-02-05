---
name: gsd-progress
description: Check project progress, show context, and route to next action
type: standard
---

# GSD Progress

Check project progress, summarize recent work and what's ahead, then intelligently route to the next action.

## Arguments

```
/skill:gsd-progress
```

No arguments - automatically detects current state and provides comprehensive progress report.

## Purpose

Provides situational awareness before continuing work:
- What's been done
- Current position
- What's next
- Smart routing to appropriate action

## Process

### Step 0: Source Directory Check

**Check if running from GSD source code:**

```bash
if [ -f "./package.json" ] && grep -q '"name": "gsd-kimi-cli"' ./package.json 2>/dev/null; then
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║  ⚠️  YOU'RE IN THE GSD SOURCE DIRECTORY                          ║
╚══════════════════════════════════════════════════════════════════╝

This is the gsd-kimi-cli tool repository.

To USE GSD:
  cd /path/to/your/project
  /skill:gsd-new-project

EOF
    exit 0
fi
```

### Step 1: Verify Planning Structure

**Check if in GSD project:**

```bash
if [ ! -d ".planning" ]; then
    echo "No planning structure found."
    echo ""
    echo "Run /skill:gsd-new-project to start a new project."
    exit 1
fi

if [ ! -f ".planning/STATE.md" ]; then
    echo "STATE.md not found."
    echo ""
    echo "Run /skill:gsd-new-project to initialize project."
    exit 1
fi
```

**Check for completed milestone:**

```bash
if [ ! -f ".planning/ROADMAP.md" ] && [ -f ".planning/PROJECT.md" ]; then
    echo "Milestone was completed and archived."
    # Route to between-milestones flow
fi
```

### Step 2: Load Project Context

**Read core files:**

```bash
# Load STATE.md for living memory
STATE_CONTENT=$(cat .planning/STATE.md)

# Load ROADMAP.md for phase structure
ROADMAP_CONTENT=$(cat .planning/ROADMAP.md)

# Load PROJECT.md for overview
PROJECT_CONTENT=$(cat .planning/PROJECT.md)

# Load config
CONFIG=$(cat .planning/config.json 2>/dev/null || echo '{}')
```

**Extract key info:**

```bash
PROJECT_NAME=$(head -1 .planning/PROJECT.md | sed 's/^# //')
MODEL_PROFILE=$(echo "$CONFIG" | python3 -c "import sys,json; print(json.load(sys.stdin).get('model_profile','balanced'))")
```

### Step 3: Gather Recent Work

**Find recent SUMMARY.md files:**

```bash
RECENT_SUMMARIES=$(find .planning/phases -name "*-SUMMARY.md" -type f -exec ls -lt {} + 2>/dev/null | head -6 | awk '{print $NF}')
```

**Extract accomplishments:**

For each recent summary, extract:
- Phase and plan number
- What was accomplished (one-liner)
- Key decisions made

### Step 4: Parse Current Position

**From STATE.md:**

```bash
CURRENT_PHASE=$(grep "^Phase:" .planning/STATE.md | head -1)
CURRENT_STATUS=$(grep "^Status:" .planning/STATE.md | head -1)
```

**Calculate progress:**

```bash
# Count total plans
TOTAL_PLANS=$(find .planning/phases -name "*-PLAN.md" | wc -l)

# Count completed plans
COMPLETED_PLANS=$(find .planning/phases -name "*-SUMMARY.md" | wc -l)

# Calculate percentage
if [ "$TOTAL_PLANS" -gt 0 ]; then
    PERCENT=$((COMPLETED_PLANS * 100 / TOTAL_PLANS))
else
    PERCENT=0
fi
```

**Count pending todos:**

```bash
TODO_COUNT=$(ls -1 .planning/todos/pending/*.md 2>/dev/null | wc -l)
```

**Check for active debug sessions:**

```bash
DEBUG_COUNT=$(ls -1 .planning/debug/*.md 2>/dev/null | grep -v resolved | wc -l)
```

### Step 5: Build Progress Bar

```bash
# Build visual progress bar
COMPLETED_BARS=$((PERCENT / 10))
REMAINING_BARS=$((10 - COMPLETED_BARS))

BAR=""
for i in $(seq 1 $COMPLETED_BARS); do BAR="${BAR}█"; done
for i in $(seq 1 $REMAINING_BARS); do BAR="${BAR}░"; done
```

### Step 6: Generate Status Report

```
╔══════════════════════════════════════════════════════════════════╗
║  PROJECT STATUS                                                  ║
╚══════════════════════════════════════════════════════════════════╝

# [Project Name]

**Progress:** [████████░░] ${COMPLETED_PLANS}/${TOTAL_PLANS} plans complete (${PERCENT}%)
**Profile:** [${MODEL_PROFILE}]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Recent Work

- [Phase X, Plan Y]: [what was accomplished]
- [Phase X, Plan Z]: [what was accomplished]
- [Phase A, Plan B]: [what was accomplished]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Current Position

${CURRENT_PHASE}
${CURRENT_STATUS}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Key Decisions Made

[Extract from STATE.md decisions table]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Blockers/Concerns

[Extract from STATE.md if any]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If pending todos:**

```
## Pending Todos

${TODO_COUNT} pending — /skill:gsd-check-todos to review
```

**If active debug sessions:**

```
## Active Debug Sessions

${DEBUG_COUNT} active — /skill:gsd-debug to continue
```

### Step 7: Analyze Current Phase

**Find current phase directory:**

```bash
PHASE_DIR=$(ls -1d .planning/phases/[0-9]*-* 2>/dev/null | sort | tail -1)
PHASE_NAME=$(basename "$PHASE_DIR")
```

**Count phase files:**

```bash
PLAN_COUNT=$(ls -1 "$PHASE_DIR"/*-PLAN.md 2>/dev/null | wc -l)
SUMMARY_COUNT=$(ls -1 "$PHASE_DIR"/*-SUMMARY.md 2>/dev/null | wc -l)
UAT_COUNT=$(ls -1 "$PHASE_DIR"/*-UAT.md 2>/dev/null | wc -l)
```

**Check for UAT gaps:**

```bash
UAT_WITH_GAPS=$(grep -l "status: diagnosed" "$PHASE_DIR"/*-UAT.md 2>/dev/null | wc -l)
```

**Check for CONTEXT.md:**

```bash
if [ -f "$PHASE_DIR/$(basename $PHASE_DIR)-CONTEXT.md" ]; then
    HAS_CONTEXT="✓"
else
    HAS_CONTEXT="-"
fi
```

### Step 8: Route to Next Action

**Routing logic:**

| Condition | Route |
|-----------|-------|
| UAT_WITH_GAPS > 0 | Route E (fix gaps) |
| SUMMARY_COUNT < PLAN_COUNT | Route A (execute) |
| SUMMARY_COUNT = PLAN_COUNT AND PLAN_COUNT > 0 | Phase complete → Step 9 |
| PLAN_COUNT = 0 | Route B (needs planning) |

---

**Route A: Unexecuted plan exists**

```
───────────────────────────────────────────────────────────────

## ▶ Next Up

**Execute pending plans**

This phase has ${PLAN_COUNT} plans, ${SUMMARY_COUNT} complete.

`/skill:gsd-execute-phase $(echo $PHASE_NAME | cut -d- -f1)`

<sub>Run `/skill:gsd-help execute-phase` for details</sub>

───────────────────────────────────────────────────────────────
```

---

**Route B: Phase needs planning**

```
───────────────────────────────────────────────────────────────

## ▶ Next Up

**Plan this phase**

Context: ${HAS_CONTEXT} (CONTEXT.md ${HAS_CONTEXT}exists)

`/skill:gsd-discuss-phase $(echo $PHASE_NAME | cut -d- -f1)`
— gather context and clarify approach

Also available:
- `/skill:gsd-plan-phase $(echo $PHASE_NAME | cut -d- -f1)` — skip discussion
- `/skill:gsd-list-phase-assumptions $(echo $PHASE_NAME | cut -d- -f1)` — see assumptions

───────────────────────────────────────────────────────────────
```

---

**Route E: UAT gaps need fix plans**

```
───────────────────────────────────────────────────────────────

## ⚠ UAT Gaps Found

${UAT_FILE} has gaps requiring fixes.

`/skill:gsd-plan-phase $(echo $PHASE_NAME | cut -d- -f1) --gaps`

───────────────────────────────────────────────────────────────
```

---

### Step 9: Check Milestone Status

**If phase is complete, check if more phases remain:**

```bash
# Get current phase number
CURRENT_NUM=$(echo "$PHASE_NAME" | grep -oE '^[0-9]+')

# Find highest phase in roadmap
HIGHEST_NUM=$(grep "^## Phase" .planning/ROADMAP.md | tail -1 | grep -oE '[0-9]+' | head -1)
```

**Route C: Phase complete, more phases remain**

```
───────────────────────────────────────────────────────────────

## ✓ Phase ${CURRENT_NUM} Complete

## ▶ Next Up

**Phase ${NEXT_NUM}: [Name]** — [Goal from ROADMAP]

`/skill:gsd-discuss-phase ${NEXT_NUM}` — gather context

Also available:
- `/skill:gsd-plan-phase ${NEXT_NUM}` — skip discussion
- `/skill:gsd-verify-work ${CURRENT_NUM}` — UAT before continuing

───────────────────────────────────────────────────────────────
```

---

**Route D: Milestone complete**

```
───────────────────────────────────────────────────────────────

## 🎉 Milestone Complete

All phases finished!

## ▶ Next Up

**Complete Milestone** — archive and prepare for next

`/skill:gsd-complete-milestone`

Also available:
- `/skill:gsd-verify-work` — final UAT before completion

───────────────────────────────────────────────────────────────
```

---

**Route F: Between milestones**

```
───────────────────────────────────────────────────────────────

## ✓ Milestone Complete

ROADMAP.md archived. Ready for next milestone.

## ▶ Next Up

**Start Next Milestone**

`/skill:gsd-new-milestone`

───────────────────────────────────────────────────────────────
```

### Step 10: Handle Edge Cases

**Phase complete but next phase not planned:**
- Offer `/skill:gsd-plan-phase [next]`

**All work complete:**
- Offer milestone completion

**Blockers present:**
- Highlight before offering to continue

**Handoff file exists:**
- Mention it, offer `/skill:gsd-resume-work`

## Sample Output

```
╔══════════════════════════════════════════════════════════════════╗
║  PROJECT STATUS                                                  ║
╚══════════════════════════════════════════════════════════════════╝

# My Awesome App

**Progress:** [███████░░░] 7/10 plans complete (70%)
**Profile:** [balanced]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Recent Work

- Phase 02, Plan 02: Implemented JWT authentication middleware
- Phase 02, Plan 01: Created user model and database schema
- Phase 01, Plan 03: Setup project structure and dependencies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Current Position

Phase: 02 of 05 (Authentication)
Status: In progress - 2 of 3 plans complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Key Decisions Made

| Date | Decision |
|------|----------|
| 2026-02-01 | Use JWT with refresh tokens |
| 2026-02-01 | PostgreSQL for main database |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ▶ Next Up

**Execute pending plans**

This phase has 3 plans, 2 complete.

`/skill:gsd-execute-phase 02`

───────────────────────────────────────────────────────────────
```

## Outputs

### Console Output

Rich status report displayed in chat.

### No File Changes

This skill only displays status - it doesn't modify files.

## Success Criteria

- [ ] Rich context provided (recent work, decisions, issues)
- [ ] Current position clear with visual progress
- [ ] What's next clearly explained
- [ ] Smart routing to appropriate action
- [ ] User informed before any action taken

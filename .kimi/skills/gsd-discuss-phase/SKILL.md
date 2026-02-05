---
name: gsd-discuss-phase
description: Gather phase context through adaptive questioning before planning
type: standard
---

# GSD Discuss Phase

Gather phase context through adaptive questioning. Creates `{phase}-CONTEXT.md` with implementation decisions.

## Arguments

```
/skill:gsd-discuss-phase <phase-number>
```

## Process

### Step 1: Validate Phase

```bash
PHASE_ARG="$1"
PADDED_PHASE=$(printf "%02d" "$PHASE_ARG" 2>/dev/null || echo "$PHASE_ARG")

if ! grep -q "Phase ${PADDED_PHASE}:" .planning/ROADMAP.md 2>/dev/null; then
    echo "ERROR: Phase $PHASE_ARG not found"
    exit 1
fi
```

### Step 2: Check Existing Context

Check for existing CONTEXT.md and offer update/view/skip.

### Step 3: Analyze Phase

Identify domain (UI, API, CLI, docs, data) and generate 3-4 phase-specific gray areas.

### Step 4: Present Gray Areas

Multi-select: which areas to discuss?

### Step 5: Deep-Dive

Ask 4 questions per area, check if more needed.

**Scope guardrail:** Redirect scope expansion to "deferred ideas."

### Step 6: Write CONTEXT.md

```markdown
# Phase X: Context

## Overview
## Decisions Made
### [Area 1]
**Decision:** [Clear statement]
**Rationale:** [Why]
**Details:** [Specifics]

## Out of Scope (Deferred)
## Open Questions
## Next Steps
```

### Step 7: Route

Offer: research-phase, plan-phase, or view context.

## Key Principle

Discuss HOW to implement, not WHETHER to add more.

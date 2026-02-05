---
name: gsd-research-phase
description: Research how to implement a phase (standalone)
type: standard
---

# GSD Research Phase

Research implementation approach for a phase. Creates RESEARCH.md with domain knowledge.

**Note:** Usually use `/skill:gsd-plan-phase` which includes research automatically.

## Arguments

```
/skill:gsd-research-phase <phase-number>
```

## Process

### Step 1: Validate Phase

```bash
PHASE_ARG="$1"
PADDED_PHASE=$(printf "%02d" "$PHASE_ARG" 2>/dev/null || echo "$PHASE_ARG")

if ! grep -q "Phase ${PADDED_PHASE}:" .planning/ROADMAP.md 2>/dev/null; then
    echo "ERROR: Phase $PHASE_ARG not found in ROADMAP.md"
    exit 1
fi

# Extract phase info
PHASE_INFO=$(grep -A10 "Phase ${PADDED_PHASE}:" .planning/ROADMAP.md)
PHASE_NAME=$(echo "$PHASE_INFO" | head -1 | sed 's/.*Phase [0-9.]*: //')
```

### Step 2: Check Existing Research

```bash
PHASE_DIR=$(find .planning/phases -maxdepth 1 -type d -name "${PADDED_PHASE}-*" 2>/dev/null | head -1)
RESEARCH_FILE="${PHASE_DIR}/${PADDED_PHASE}-RESEARCH.md"

if [ -f "$RESEARCH_FILE" ]; then
    echo "Research already exists: $RESEARCH_FILE"
    echo "Use --force to overwrite, or use existing research."
    # Offer: view existing, overwrite, or skip
fi
```

### Step 3: Gather Context

```bash
# Read project context
PROJECT=$(cat .planning/PROJECT.md 2>/dev/null | head -100)

# Read requirements
REQUIREMENTS=$(cat .planning/REQUIREMENTS.md 2>/dev/null | grep -A50 "Active" | head -50)

# Check for phase context
CONTEXT_FILE=$(find "$PHASE_DIR" -name "*CONTEXT.md" 2>/dev/null | head -1)
if [ -n "$CONTEXT_FILE" ]; then
    CONTEXT=$(cat "$CONTEXT_FILE")
fi
```

### Step 4: Spawn Researcher Subagent

```python
Task(
    description=f"Research phase {PADDED_PHASE} implementation",
    subagent_name="gsd-phase-researcher",
    prompt=f"""
Research how to implement Phase {PADDED_PHASE}: {PHASE_NAME}

## Phase Information
{PHASE_INFO}

## Project Context
{PROJECT}

## Requirements
{REQUIREMENTS}

## Phase Context (from discuss-phase)
{CONTEXT}

## Your Task
Answer: "What do I need to know to PLAN this phase well?"

Research and document:
1. **Standard Stack** - Libraries/frameworks typically used
2. **Architecture Patterns** - How to structure this type of feature
3. **Don't Hand-Roll** - What to use established solutions for
4. **Common Pitfalls** - Problems to avoid
5. **Code Examples** - Reference patterns
6. **Confidence Levels** - How certain recommendations are

## Output
Write findings to: {RESEARCH_FILE}

Use this structure:
```markdown
# Phase {PADDED_PHASE} Research: {PHASE_NAME}

## Standard Stack
- Library X - For [purpose]

## Architecture Patterns
[How to structure]

## Don't Hand-Roll
- Auth - Use established library

## Common Pitfalls
1. [Problem] - [Prevention]

## Code Examples
[Reference patterns]

## Confidence Levels
- High: [well-established patterns]
- Medium: [context-dependent choices]
- Low: [needs validation]
```

Return a summary of key findings.
"""
)
```

### Step 5: Verify Research Created

```bash
if [ -f "$RESEARCH_FILE" ]; then
    echo "✓ Research complete: $RESEARCH_FILE"
    # Show summary to user
else
    echo "ERROR: Research file not created"
    exit 1
fi
```

### Step 6: Present Results

```
╔══════════════════════════════════════════════════════════════╗
║              PHASE RESEARCH COMPLETE                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Phase: {PADDED_PHASE} - {PHASE_NAME}                        ║
║  Research: {RESEARCH_FILE}                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Next: /skill:gsd-plan-phase {PADDED_PHASE}
```

## RESEARCH.md Sections

```markdown
# Phase X Research: [Name]

## Standard Stack
- Library X - For [purpose]

## Architecture Patterns
[How to structure]

## Don't Hand-Roll
- Auth - Use established library

## Common Pitfalls
1. [Problem] - [Prevention]

## Code Examples
[Reference patterns]

## Confidence Levels
- High: [well-established patterns]
- Medium: [context-dependent choices]
- Low: [needs validation]
```

## Usage

Downstream plan-phase uses RESEARCH.md to make informed planning decisions.

## Success Criteria

- [ ] Phase validated in ROADMAP.md
- [ ] Phase directory exists
- [ ] gsd-phase-researcher subagent spawned
- [ ] RESEARCH.md created with all sections
- [ ] Research includes confidence levels
- [ ] Results presented to user

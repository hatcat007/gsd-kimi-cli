---
name: gsd-plan-phase
description: Create detailed execution plans for a phase with research and verification. Generates NN-YY-PLAN.md files.
type: standard
---

# GSD Plan Phase

## Objective

Create executable phase plans (PLAN.md files) for a roadmap phase with integrated research and verification.

**Flow:** Research (optional) → Plan → Verify → Done

**Creates:**
- `NN-phase-name/NN-01-PLAN.md`
- `NN-phase-name/NN-02-PLAN.md` (if multiple plans)
- `NN-phase-name/NN-RESEARCH.md` (if research enabled)

**After this command:** Run `/skill:gsd-execute-phase N` to execute plans.

## Arguments

**Phase number** (optional): Which phase to plan (e.g., `1`, `2`, `2.1`). Auto-detects if not provided.

**Flags:**
- `--research` — Force re-research even if RESEARCH.md exists
- `--skip-research` — Skip research entirely
- `--gaps` — Gap closure mode (reads VERIFICATION.md)
- `--skip-verify` — Skip planner → checker verification loop

## Process

### Phase 1: Validate Environment

**Step 1.1: Check .planning/ exists**
```bash
if [ ! -d .planning/ ]; then
    echo "ERROR: No .planning/ directory. Run /skill:gsd-new-project first."
    exit 1
fi
```

**Step 1.2: Resolve model profile**
```bash
MODEL_PROFILE=$(cat .planning/config.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('model_profile','balanced'))" 2>/dev/null || echo "balanced")
```

**Model lookup:**
| Agent | quality | balanced | budget |
|-------|---------|----------|--------|
| gsd-phase-researcher | opus | sonnet | haiku |
| gsd-planner | opus | opus | sonnet |
| gsd-plan-checker | sonnet | sonnet | haiku |

### Phase 2: Parse Arguments

**Step 2.1: Extract phase number and flags**
```bash
# Parse arguments
PHASE_ARG="${1:-}"
FLAG_RESEARCH=false
FLAG_SKIP_RESEARCH=false
FLAG_GAPS=false
FLAG_SKIP_VERIFY=false

# Check for flags
for arg in "$@"; do
    case "$arg" in
        --research) FLAG_RESEARCH=true ;;
        --skip-research) FLAG_SKIP_RESEARCH=true ;;
        --gaps) FLAG_GAPS=true ;;
        --skip-verify) FLAG_SKIP_VERIFY=true ;;
    esac
done
```

**Step 2.2: Auto-detect phase if not provided**
```bash
if [ -z "$PHASE_ARG" ]; then
    # Find first phase without plans
    PHASE_ARG=$(find .planning/phases -name "*-PLAN.md" -exec dirname {} \; 2>/dev/null | sort -u | head -1 | xargs basename | cut -d'-' -f1)
    if [ -z "$PHASE_ARG" ]; then
        PHASE_ARG="1"
    fi
fi
```

**Step 2.3: Normalize phase number**
```bash
# Normalize: 8 → 08, preserve decimals: 2.1 → 02.1
if [[ "$PHASE_ARG" =~ ^[0-9]+$ ]]; then
    PHASE=$(printf "%02d" "$PHASE_ARG")
elif [[ "$PHASE_ARG" =~ ^([0-9]+)\.([0-9]+)$ ]]; then
    PHASE=$(printf "%02d.%s" "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}")
else
    PHASE="$PHASE_ARG"
fi
```

### Phase 3: Validate Phase

**Step 3.1: Check ROADMAP.md**
```bash
PHASE_INFO=$(grep -A5 "Phase ${PHASE}:" .planning/ROADMAP.md 2>/dev/null)

if [ -z "$PHASE_INFO" ]; then
    echo "ERROR: Phase ${PHASE} not found in ROADMAP.md"
    echo "Available phases:"
    grep "^### Phase" .planning/ROADMAP.md | head -10
    exit 1
fi
```

**Step 3.2: Extract phase name and description**
```bash
PHASE_NAME=$(echo "$PHASE_INFO" | head -1 | sed 's/.*Phase [0-9.]*: //')
echo "Planning Phase ${PHASE}: ${PHASE_NAME}"
```

### Phase 4: Ensure Phase Directory and Load Context

**Step 4.1: Create/find phase directory**
```bash
PHASE_DIR=$(find .planning/phases -maxdepth 1 -type d -name "${PHASE}-*" 2>/dev/null | head -1)

if [ -z "$PHASE_DIR" ]; then
    # Create from phase name
    PHASE_SLUG=$(echo "$PHASE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')
    PHASE_DIR=".planning/phases/${PHASE}-${PHASE_SLUG}"
    mkdir -p "$PHASE_DIR"
    echo "Created phase directory: ${PHASE_DIR}"
fi
```

**Step 4.2: Load CONTEXT.md if exists**
```bash
CONTEXT_FILE=$(find "$PHASE_DIR" -name "*CONTEXT.md" 2>/dev/null | head -1)
if [ -n "$CONTEXT_FILE" ]; then
    CONTEXT_CONTENT=$(cat "$CONTEXT_FILE")
    echo "Loaded phase context from: ${CONTEXT_FILE}"
fi
```

### Phase 5: Handle Research

**If `--gaps` flag:** Skip research (gap closure mode).

**If `--skip-research` flag:** Skip to Phase 6.

**Check config:**
```bash
WORKFLOW_RESEARCH=$(cat .planning/config.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('workflow',{}).get('research',True))" 2>/dev/null || echo "true")
```

**If research disabled and no `--research` flag:** Skip to Phase 6.

**Check existing research:**
```bash
RESEARCH_FILE=$(find "$PHASE_DIR" -name "*RESEARCH.md" 2>/dev/null | head -1)
```

**If RESEARCH.md exists and no `--research` flag:**
- Use existing research
- Skip to Phase 6

**Otherwise: Spawn researcher**

Display banner:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PLAN PHASE {N} ► RESEARCHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Spawn gsd-phase-researcher:**
```python
Task(
    description=f"Research phase {PHASE}",
    subagent_name="gsd-phase-researcher",
    prompt=f"""
    Research how to implement Phase {PHASE}: {PHASE_NAME}
    
    Phase description: {PHASE_INFO}
    
    Context from discuss-phase:
    {CONTEXT_CONTENT}
    
    Answer: "What do I need to know to PLAN this phase well?"
    
    Research:
    - Tech stack options and best practices
    - Common patterns for this type of feature
    - Potential pitfalls to avoid
    - How experts approach this
    
    Write findings to: {PHASE_DIR}/{PHASE}-RESEARCH.md
    """
)
```

### Phase 6: Spawn Planner

Display banner:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PLAN PHASE {N} ► PLANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Gather context:**
```bash
PROJECT=$(cat .planning/PROJECT.md 2>/dev/null | head -50)
REQUIREMENTS=$(cat .planning/REQUIREMENTS.md 2>/dev/null | grep -A50 "Active" | head -30)
RESEARCH=$(cat "${PHASE_DIR}"/*RESEARCH.md 2>/dev/null || echo "No research")
```

**Spawn gsd-planner:**
```python
Task(
    description=f"Create plans for phase {PHASE}",
    subagent_name="gsd-planner",
    prompt=f"""
    Create detailed execution plans for Phase {PHASE}: {PHASE_NAME}
    
    Project context:
    {PROJECT}
    
    Requirements:
    {REQUIREMENTS}
    
    Research:
    {RESEARCH}
    
    Phase context (from discuss-phase):
    {CONTEXT_CONTENT}
    
    Create 1-3 PLAN.md files:
    - {PHASE_DIR}/{PHASE}-01-PLAN.md
    - {PHASE_DIR}/{PHASE}-02-PLAN.md (if needed)
    - etc.
    
    Each plan should:
    - Have 2-4 tasks maximum
    - Include clear verification steps
    - Follow the template format
    - Respect any decisions in CONTEXT.md
    """
)
```

### Phase 7: Verify Plans

**If `--skip-verify` flag:** Skip to Phase 9.

**Check config:**
```bash
WORKFLOW_PLAN_CHECK=$(cat .planning/config.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('workflow',{}).get('plan_check',True))" 2>/dev/null || echo "true")
```

**If plan checking disabled:** Skip to Phase 9.

**Spawn gsd-plan-checker:**
```python
Task(
    description=f"Verify plans for phase {PHASE}",
    subagent_name="gsd-plan-checker",
    prompt=f"""
    Verify the plans for Phase {PHASE}: {PHASE_NAME}
    
    Read all PLAN.md files in: {PHASE_DIR}/
    
    Check:
    - Do plans achieve phase goals?
    - Are tasks specific and verifiable?
    - Are dependencies clear?
    - Are verification criteria measurable?
    - Do plans respect CONTEXT.md decisions?
    
    Report:
    - PASS: Plans are good to go
    - NEEDS_WORK: List specific issues to fix
    
    If NEEDS_WORK, list exactly what needs changing.
    """
)
```

### Phase 8: Iterate if Needed

**If checker reports NEEDS_WORK:**

1. Display issues
2. Spawn planner again with feedback
3. Re-verify
4. Loop max 3 times

**If max iterations reached:**
- Display warning
- Present current plans
- Let user decide to proceed or manually fix

### Phase 9: Present Results

**Display completion banner:**
```
╔══════════════════════════════════════════════════════════════╗
║              PHASE PLANNED                                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Phase: {N} - {name}                                         ║
║  Location: .planning/phases/{N}-{name}/                      ║
║                                                              ║
║  Created:                                                    ║
║  ✓ {N}-01-PLAN.md                                            ║
║  ✓ {N}-02-PLAN.md (if applicable)                            ║
║  ✓ {N}-RESEARCH.md (if created)                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Next: /skill:gsd-execute-phase {N}
```

**List plans:**
```bash
ls -1 "${PHASE_DIR}"/*-PLAN.md 2>/dev/null
```

**Show summary:**
```
Plans ready for execution. Review them above.
When ready, run: /skill:gsd-execute-phase {N}
```

## Success Criteria

- [ ] Phase validated in ROADMAP.md
- [ ] Phase directory created
- [ ] Research completed (if enabled)
- [ ] PLAN.md files created
- [ ] Plans verified (if enabled)
- [ ] Results presented to user

## Output

### Files Created
- `.planning/phases/NN-{name}/`
- `NN-01-PLAN.md`
- `NN-02-PLAN.md` (if multiple plans)
- `NN-RESEARCH.md` (if research enabled)

### Next Steps
```
/skill:gsd-execute-phase {N}
```

## Notes

- Plans should be small (2-4 tasks each)
- Research is optional but recommended for unfamiliar domains
- Verification loop ensures quality before execution
- Context from discuss-phase is preserved and honored

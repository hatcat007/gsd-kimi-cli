---
name: gsd-plan-milestone-gaps
description: Plan work to fill gaps in milestone coverage. Identifies missing functionality and creates plans to address them. Use when audit reveals incomplete coverage.
---

# Plan Milestone Gaps

Plan work to fill gaps in milestone coverage.

## When to Use

After an audit reveals:
- Missing features not in any phase
- Incomplete phase coverage
- New requirements discovered
- Scope creep that needs organizing

## Usage

```
/skill:gsd-plan-milestone-gaps
```

## Process

### 1. Analyze Current State
- Review all milestone phases
- Check REQUIREMENTS.md coverage
- Identify untracked work

### 2. Gap Detection
Find work that:
- Is in REQUIREMENTS but not in phases
- Is partially implemented
- Has been discussed but not planned
- Is needed for milestone success

### 3. Categorize Gaps
```
Critical: Must have for milestone
Important: Should have for milestone
Nice-to-have: Can defer
```

### 4. Create Gap Plan
Generate `GAPS-PLAN.md`:
```markdown
# Milestone Gap Analysis

## Critical Gaps
### Gap 1: User Authentication
**Missing:** Login/logout flow
**Impact:** Cannot release without this
**Proposed Solution:** Add to Phase 2
**Estimated Effort:** 2 days

## Important Gaps
...

## Nice-to-Have Gaps
...
```

### 5. Integration Options
For each gap, choose:
- **Add to existing phase** - If fits scope
- **Create new phase** - If substantial work
- **Defer to next milestone** - If not critical

## Output

Creates `GAPS-PLAN.md` with:
- Identified gaps
- Impact assessment
- Proposed solutions
- Integration recommendations

## Follow-Up

After planning gaps:
1. Review with stakeholders
2. Update phases/plans as needed
3. Re-audit to verify coverage

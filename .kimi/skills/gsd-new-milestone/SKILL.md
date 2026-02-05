---
name: gsd-new-milestone
description: Create a new milestone in the project. A milestone groups multiple phases into a deliverable release. Use for organizing work into releases or major versions.
---

# New Milestone

Create a new milestone in the project.

## What is a Milestone?

A milestone groups multiple phases into a deliverable release:
- **MVP** - Minimum viable product (phases 1-3)
- **v1.0** - First stable release (phases 4-6)
- **v2.0** - Major feature release (phases 7-10)

## Usage

```
/skill:gsd-new-milestone "Milestone Name" "Description" --phases 1,2,3
```

## Process

### 1. Validate
- Check no existing milestone has same name
- Verify phases exist
- Create milestone ID (e.g., M1, M2)

### 2. Create Milestone File
Create `.planning/milestones/<ID>-<name>.md`:
```markdown
# Milestone: <name>

**Description:** <description>

**Phases:** <list>

**Target Date:** TBD

**Status:** 🔵 Planned

## Completion Criteria
- [ ] All phases complete
- [ ] All verifications pass
- [ ] Documentation updated
```

### 3. Update ROADMAP.md
Add milestone section linking to phases

### 4. Update STATE.md
Set current milestone

## Example

```
/skill:gsd-new-milestone "MVP" "Minimum viable product with core features" --phases 1,2,3
```

## Output

- Milestone definition file
- Updated ROADMAP.md
- STATE.md update

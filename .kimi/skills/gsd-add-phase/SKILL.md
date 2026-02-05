---
name: gsd-add-phase
description: Add a new phase to the project roadmap. Creates phase directory and updates ROADMAP.md. Use when you need to extend the project with new work.
---

# Add Phase

Add a new phase to the project roadmap.

## Usage

```
/skill:gsd-add-phase <phase_number> "Phase Title" "Brief description"
```

## Process

### 1. Validate Input
- Check phase_number doesn't already exist
- Verify ROADMAP.md exists
- Ensure phase_number is sequential

### 2. Update ROADMAP.md
Add phase entry:
```markdown
## Phase <number>: <title>

**Goal:** <description>

**Must-Haves:**
- [ ] TBD

**Status:** 🔵 Planned
```

### 3. Create Phase Directory
Create `.planning/phases/<NN>/` with:
- `.gitkeep` (empty file to track directory)

### 4. Update STATE.md
Update current phase count

## Example

```
/skill:gsd-add-phase 4 "User Authentication" "Implement login, signup, password reset"
```

## Output

Creates:
- Phase entry in ROADMAP.md
- Phase directory structure
- Confirmation message

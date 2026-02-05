---
name: gsd-insert-phase
description: Insert a phase at a specific position, shifting existing phases. Use when you need to add work between existing phases.
---

# Insert Phase

Insert a new phase at a specific position in the roadmap.

## Usage

```
/skill:gsd-insert-phase <position> "Phase Title" "Brief description"
```

## Process

### 1. Validate Position
- Must be between 1 and (current max + 1)
- Verify ROADMAP.md exists

### 2. Renumber Existing Phases
- Shift all phases at position >= insertion point
- Rename phase directories: `04/` → `05/`, etc.
- Update all phase file references

### 3. Create New Phase
- Add to ROADMAP.md at correct position
- Create phase directory with new number

### 4. Update References
- Update any hardcoded phase numbers in plans
- Update STATE.md if needed

## Example

```
/skill:gsd-insert-phase 2 "API Design" "Design REST API endpoints before implementation"
```

## Warning

⚠️ This renumbers existing phases. Existing plans and summaries will need manual updates.

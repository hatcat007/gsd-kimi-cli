---
name: gsd-audit-milestone
description: Audit milestone progress and identify blockers. Provides comprehensive status report. Use for milestone reviews and status checks.
---

# Audit Milestone

Comprehensive audit of milestone progress.

## Usage

```
/skill:gsd-audit-milestone [milestone_id]
```

Without milestone_id, audits current milestone.

## Audit Report Sections

### 1. Milestone Overview
- Name and description
- Target phases
- Target date vs actual

### 2. Phase Status
```
Phase 1: UI Design        ✅ Complete
Phase 2: API Development  🔄 In Progress (67%)
Phase 3: Integration      ⏸️ Blocked
Phase 4: Testing          🔵 Planned
```

### 3. Blockers
List of blocking issues:
- Phase 3 blocked by: API authentication incomplete
- Phase 2 at risk: Database schema changes pending

### 4. Todo Status
```
Total: 23
Done: 15 (65%)
In Progress: 5
Blocked: 2
Not Started: 1
```

### 5. Code Metrics
- Commits since milestone start
- Files added/modified
- Test coverage change

### 6. Risks
Identified risks with severity:
- 🔴 High: Third-party API not ready
- 🟡 Medium: Resource constraints

### 7. Recommendations
Suggested actions to get back on track.

## Output

Creates: `<ID>-AUDIT.md`

## Example

```
/skill:gsd-audit-milestone
/skill:gsd-audit-milestone M2
```

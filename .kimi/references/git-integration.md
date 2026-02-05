# Git Integration Guide

Best practices for using Git with GSD.

## Commit Strategy

### Atomic Commits
Each commit should:
- Represent one logical change
- Pass all tests
- Be revertible independently

### Commit Message Format
```
[type]: [description]

[optional body]

[optional footer]
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code restructuring
- `test:` Test changes
- `chore:` Maintenance

Examples:
```
feat: add user authentication

Implements login with email/password.
Supports password reset flow.

Closes #123
```

## Branch Strategy

### Per-Phase Branches
```
main
├── phase-1-ui
├── phase-2-api
└── phase-3-integration
```

### Workflow
1. Create branch for phase
2. Work on phase plans
3. Merge to main when phase complete
4. Tag milestone releases

## GSD Commit Markers

### Plan Commits
```
plan: Phase 2 execution plan

creates: 02-01-PLAN.md, 02-02-PLAN.md
```

### Progress Commits
```
progress: Phase 2 50% complete

completed: 02-01-PLAN.md
remaining: 02-02-PLAN.md
```

### Completion Commits
```
complete: Phase 2

verification: 02-VERIFICATION.md
summary: 02-SUMMARY.md
```

## Repository Structure

```
.gitignore:
.planning/temp/
.kimi/
*.log
```

## Integration with GSD

### Automatic Commits
Some GSD commands auto-commit:
- `/skill:gsd-execute-phase` → commits plan progress
- `/skill:gsd-complete-milestone` → tags release

### Manual Commits
User should commit:
- After significant progress
- Before context switches
- At end of session

### Rollback
If phase needs restart:
```bash
git revert [phase-completion-commit]
```

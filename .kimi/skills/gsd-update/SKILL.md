---
name: gsd-update
description: Update GSD planning documents from code changes
type: standard
---

# GSD Update

Update GSD planning documents to reflect code changes.

## Arguments

```
/skill:gsd-update [--requirements] [--roadmap] [--state]
```

## Process

1. **Analyze recent changes:**
   ```bash
   git log --oneline -10
   git diff HEAD~5 --name-only
   ```

2. **Identify drift:**
   - Code that doesn't match REQUIREMENTS.md
   - Completed features not marked in ROADMAP
   - New dependencies not documented

3. **Update documents:**

```
Changes detected:

✓ src/auth.js - Auth implementation
  → Update REQUIREMENTS.md (mark AUTH-01 complete)

✓ src/models/user.js - User model
  → Update STATE.md (add tech: sequelize)

? src/api/new-feature.js - Not in roadmap
  → Add to ROADMAP or document as quick task
```

4. **Present for confirmation**
5. **Commit updates**

## Use Cases

- After manual coding sessions
- When requirements change mid-implementation
- Syncing planning docs with actual code
- Brownfield project onboarding

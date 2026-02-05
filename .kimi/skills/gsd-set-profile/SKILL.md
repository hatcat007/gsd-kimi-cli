---
name: gsd-set-profile
description: Set model profile (quality, balanced, budget)
type: standard
---

# GSD Set Profile

Set the model profile for AI agent selection.

## Arguments

```
/skill:gsd-set-profile <quality|balanced|budget>
```

## Profiles

| Profile | Planner | Executor | Use When |
|---------|---------|----------|----------|
| **quality** | kimi-k2.5 | kimi-k2.5 | Maximum quality, higher cost |
| **balanced** | kimi-k2.5 | kimi-k2.5 | Good balance (default) |
| **budget** | kimi-k2.5 | kimi-k2.5 | Most economical |

## Process

1. Read current config
2. Update model_profile
3. Write config.json
4. Confirm change

```
Profile set to: balanced

Model selection:
- Planning: kimi-k2.5
- Execution: kimi-k2.5
- Research: kimi-k2.5

Config saved to: .planning/config.json
```

## Note

Currently all profiles use kimi-k2.5 as it's the primary model available. Future versions may support multiple model tiers.

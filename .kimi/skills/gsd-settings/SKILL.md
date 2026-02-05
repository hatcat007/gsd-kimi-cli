---
name: gsd-settings
description: View and manage GSD configuration
type: standard
---

# GSD Settings

View and manage GSD configuration.

## Arguments

```
/skill:gsd-settings [view|set|reset]
/skill:gsd-settings set <key> <value>
```

## Commands

### View Settings

```
> /skill:gsd-settings view

╔══════════════════════════════════════════════════════════════════╗
║  GSD SETTINGS                                                    ║
╚══════════════════════════════════════════════════════════════════╝

File: .planning/config.json

Model Profile: balanced
  Planner: kimi-k2.5
  Executor: kimi-k2.5
  Researcher: kimi-k2.5

Parallelization:
  Enabled: true
  Max Workers: 3

Workflow:
  Research: true
  Verifier: true
  Auto Commit: true

Planning:
  Commit Docs: true
  Max Plans Per Phase: 10
```

### Set Setting

```
> /skill:gsd-settings set model_profile quality
✓ model_profile changed to "quality"

> /skill:gsd-settings set workflow.verifier false
✓ workflow.verifier changed to false
```

### Reset to Defaults

```
> /skill:gsd-settings reset
Reset config to defaults? (yes/no)
```

## Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| model_profile | string | balanced | Model selection profile |
| parallelization.enabled | boolean | true | Enable parallel execution |
| parallelization.max_workers | number | 3 | Max concurrent workers |
| workflow.research | boolean | true | Enable research phase |
| workflow.verifier | boolean | true | Enable verification |
| workflow.auto_commit | boolean | true | Auto-commit changes |
| planning.commit_docs | boolean | true | Commit planning files |
| planning.max_plans_per_phase | number | 10 | Max plans per phase |

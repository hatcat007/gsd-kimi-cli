---
name: gsd-discovery-flow
description: Brownfield project discovery workflow. Map existing codebase before making changes.
type: flow
---

# Discovery Phase Workflow

```mermaid
flowchart TD
    BEGIN([BEGIN]) --> MAP_CODEBASE[Map Codebase]
    MAP_CODEBASE --> ANALYZE_STRUCTURE[Analyze Structure]
    ANALYZE_STRUCTURE --> IDENTIFY_ENTRY[Identify Entry Points]
    IDENTIFY_ENTRY --> MAP_DEPENDENCIES[Map Dependencies]
    MAP_DEPENDENCIES --> FIND_PATTERNS[Find Patterns]
    FIND_PATTERNS --> DOCUMENT_ARCH[Document Architecture]
    DOCUMENT_ARCH --> IDENTIFY_RISKS[Identify Risks]
    IDENTIFY_RISKS --> PLAN_INTEGRATION[Plan Integration]
    PLAN_INTEGRATION --> CREATE_ROADMAP[Create Roadmap]
    CREATE_ROADMAP --> END([END])
```

## Discovery Outputs

1. **CODEBASE-MAP.md** - Structure and organization
2. **ARCHITECTURE.md** - System design
3. **DEPENDENCIES.md** - Internal and external deps
4. **RISKS.md** - Technical risks and mitigation
5. **INTEGRATION-PLAN.md** - How to add new work

## Key Questions

- What's the tech stack?
- Where does data flow?
- What are the conventions?
- What's the test coverage?
- Where are the risks?

---
name: gsd-diagnose-flow
description: Systematic diagnostic workflow for identifying and resolving issues.
type: flow
---

# Diagnose Issues Workflow

```mermaid
flowchart TD
    BEGIN([BEGIN]) --> OBSERVE[Observe Symptoms]
    OBSERVE --> REPRODUCE[Reproduce Issue]
    REPRODUCE --> CAN_REPRODUCE{Can<br/>Reproduce?}
    CAN_REPRODUCE -->|No| GATHER_INFO[Gather More Info]
    GATHER_INFO --> OBSERVE
    CAN_REPRODUCE -->|Yes| ISOLATE[Isolate Variables]
    ISOLATE --> FORM_HYPOTHESIS[Form Hypothesis]
    FORM_HYPOTHESIS --> TEST[Design Test]
    TEST --> RUN_TEST[Run Test]
    RUN_TEST --> HYPOTHESIS_VALID{Hypothesis<br/>Valid?}
    HYPOTHESIS_VALID -->|No| NEW_HYPOTHESIS[New Hypothesis]
    NEW_HYPOTHESIS --> FORM_HYPOTHESIS
    HYPOTHESIS_VALID -->|Yes| ROOT_CAUSE[Identify Root Cause]
    ROOT_CAUSE --> PLAN_FIX[Plan Fix]
    PLAN_FIX --> IMPLEMENT_FIX[Implement Fix]
    IMPLEMENT_FIX --> VERIFY[Verify Fix]
    VERIFY --> FIX_WORKS{Fix<br/>Works?}
    FIX_WORKS -->|No| REVISE_FIX[Revise Fix]
    REVISE_FIX --> IMPLEMENT_FIX
    FIX_WORKS -->|Yes| DOCUMENT[Document Solution]
    DOCUMENT --> END([END])
```

## Scientific Method Applied

1. **Observation** - What do we see?
2. **Hypothesis** - Why is it happening?
3. **Experiment** - How can we test?
4. **Analysis** - What did we learn?
5. **Conclusion** - What's the fix?

---
name: gsd-map-codebase
description: Map and analyze the codebase structure
type: standard
---

# GSD Map Codebase

Map and analyze the codebase structure. Creates detailed documentation in `.planning/codebase/` covering technology stack, architecture, coding conventions, and concerns.

## Arguments

```
/skill:gsd-map-codebase [--focus=tech|arch|quality|concerns|all]
```

## Process

### Step 1: Check for Existing Maps

```bash
CODEBASE_DIR=".planning/codebase"
if [ -d "$CODEBASE_DIR" ]; then
    ls -la "$CODEBASE_DIR"/*.md 2>/dev/null || echo "No existing docs"
fi
```

### Step 2: Create Codebase Directory

```bash
mkdir -p .planning/codebase
```

### Step 3: Spawn Codebase Mapper Subagents (Parallel)

Spawn up to 4 subagents in parallel, one for each focus area:

```python
# Determine which focus areas to analyze
focus_areas = ['tech', 'arch', 'quality', 'concerns']  # default: all

# Spawn all focus area mappers in parallel
tasks = []
for focus in focus_areas:
    tasks.append({
        'description': f"Map codebase - {focus} focus",
        'subagent_name': 'gsd-codebase-mapper',
        'prompt': f"""
Map this codebase with focus: **{focus}**

Focus area determines which documents to create:
- **tech** → Write STACK.md and INTEGRATIONS.md
- **arch** → Write ARCHITECTURE.md and STRUCTURE.md  
- **quality** → Write CONVENTIONS.md and TESTING.md
- **concerns** → Write CONCERNS.md

## Your Task
1. Explore the codebase thoroughly for your focus area
2. Follow the templates in your system prompt
3. Write documents directly to `.planning/codebase/`
4. Return confirmation of documents created

## Critical Rules
- WRITE DOCUMENTS DIRECTLY using WriteFile tool
- ALWAYS include actual file paths with backticks
- Use the exact templates from your system prompt
- Return only a brief confirmation, not document contents

Start mapping now.
"""
    })

# Execute all tasks in parallel
results = await asyncio.gather(*tasks)
```

### Step 4: Verify Documents Created

```bash
# Check which documents were created
echo "=== Generated Codebase Documentation ==="
ls -la .planning/codebase/*.md 2>/dev/null || echo "No docs found"
```

### Step 5: Update STATE.md

```bash
# Add codebase mapped status to STATE.md
DATE=$(date +%Y-%m-%d)
```

Add to STATE.md:
```markdown
## Codebase Analysis

**Last Mapped:** ${DATE}
**Location:** `.planning/codebase/`

| Document | Status |
|----------|--------|
| STACK.md | [✓/✗] |
| INTEGRATIONS.md | [✓/✗] |
| ARCHITECTURE.md | [✓/✗] |
| STRUCTURE.md | [✓/✗] |
| CONVENTIONS.md | [✓/✗] |
| TESTING.md | [✓/✗] |
| CONCERNS.md | [✓/✗] |
```

### Step 6: Present Results

```
╔══════════════════════════════════════════════════════════════╗
║              CODEBASE MAPPED                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Location: .planning/codebase/                               ║
║                                                              ║
║  Documents Created:                                          ║
║  ─────────────────                                           ║
║  ✓ STACK.md         - Technology stack and dependencies      ║
║  ✓ INTEGRATIONS.md  - External services and APIs             ║
║  ✓ ARCHITECTURE.md  - System architecture and patterns       ║
║  ✓ STRUCTURE.md     - Directory structure and conventions    ║
║  ✓ CONVENTIONS.md   - Coding style and patterns              ║
║  ✓ TESTING.md       - Testing framework and patterns         ║
║  ✓ CONCERNS.md      - Technical debt and issues              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  How These Are Used:                                         ║
║  ───────────────────                                         ║
║  • gsd-plan-phase loads relevant docs when planning          ║
║  • gsd-execute-phase references them for conventions         ║
║  • Helps maintain consistency across the codebase            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Document Reference

These documents are consumed by other GSD commands:

| Phase Type | Documents Loaded |
|------------|------------------|
| UI, frontend, components | CONVENTIONS.md, STRUCTURE.md |
| API, backend, endpoints | ARCHITECTURE.md, CONVENTIONS.md |
| database, schema, models | ARCHITECTURE.md, STACK.md |
| testing, tests | TESTING.md, CONVENTIONS.md |
| integration, external API | INTEGRATIONS.md, STACK.md |
| refactor, cleanup | CONCERNS.md, ARCHITECTURE.md |
| setup, config | STACK.md, STRUCTURE.md |

## Use Cases

- **Onboarding** - New team members understanding the codebase
- **Refactoring** - Before major structural changes
- **Planning** - Providing context for phase planning
- **Documentation** - Keeping architecture docs up to date
- **Brownfield projects** - Understanding existing code

## Updating Existing Maps

To update specific documents:

```bash
# Re-run with specific focus
/skill:gsd-map-codebase --focus=tech     # Update STACK, INTEGRATIONS
/skill:gsd-map-codebase --focus=arch     # Update ARCHITECTURE, STRUCTURE
/skill:gsd-map-codebase --focus=quality  # Update CONVENTIONS, TESTING
/skill:gsd-map-codebase --focus=concerns # Update CONCERNS
```

## Success Criteria

- [ ] Codebase directory created: `.planning/codebase/`
- [ ] gsd-codebase-mapper subagent spawned for each focus area
- [ ] Documents written directly by subagent (not returned in response)
- [ ] All relevant documents created based on project type
- [ ] STATE.md updated with mapping status
- [ ] User presented with document listing and usage guide

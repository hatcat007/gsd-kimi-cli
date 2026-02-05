# Planning Configuration Guide

Configure GSD planning to match your project needs.

## Phase Structure

### Standard Phase Template
```markdown
## Phase N: Title

**Goal:** One sentence objective

**Duration:** Target timebox

**Must-Haves:**
- Critical requirement 1
- Critical requirement 2

**Nice-to-Haves:**
- Optional feature 1
- Optional feature 2

**Dependencies:**
- Requires Phase X complete
- Requires external API access

**Verification:**
- [ ] Criterion 1
- [ ] Criterion 2
```

## Planning Profiles

### Startup/MVP Profile
- **Phase Duration:** 1-2 weeks
- **Focus:** Speed over completeness
- **Verification:** Manual testing OK
- **Documentation:** Minimal

### Enterprise Profile
- **Phase Duration:** 2-4 weeks
- **Focus:** Completeness over speed
- **Verification:** Automated tests required
- **Documentation:** Comprehensive

### Research Profile
- **Phase Duration:** Variable
- **Focus:** Learning over delivery
- **Verification:** Proof of concept
- **Documentation:** Findings emphasis

## Task Sizing

### Ideal Task Size
- **Too Small:** < 30 minutes (overhead)
- **Ideal:** 2-4 hours (flow state)
- **Too Large:** > 1 day (break down)

### Task Types
1. **Spike** - Research/investigation
2. **Feature** - New functionality
3. **Fix** - Bug correction
4. **Refactor** - Code improvement
5. **Docs** - Documentation

## Milestone Planning

### Milestone Composition
- 3-5 phases per milestone
- Clear deliverable
- Demonstrable progress
- User value

### Milestone Cadence
- **Agile:** 2-week sprints
- **Standard:** Monthly releases
- **Major:** Quarterly releases

## Configuration File

`.planning/config.json`:
```json
{
  "profile": "startup",
  "phase_duration_weeks": 1,
  "auto_verify": false,
  "require_tests": false,
  "documentation_level": "minimal"
}
```

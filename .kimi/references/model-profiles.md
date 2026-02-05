# Model Profiles Guide

Configure GSD behavior based on model capabilities.

## Profile: Fast/Cheap

**Models:** kimi-k2-lite, kimi-k2-turbo

**Characteristics:**
- Lower cost
- Faster responses
- Good for: Simple tasks, exploration

**GSD Adjustments:**
- Shorter phases
- Less research
- Simpler verification
- More subagent spawning

## Profile: Balanced

**Models:** kimi-k2, kimi-k2.5

**Characteristics:**
- Good reasoning
- Reasonable cost
- Good for: Most development work

**GSD Adjustments:**
- Standard phase duration
- Normal research depth
- Full verification
- Balanced subagent use

## Profile: Quality

**Models:** kimi-k2.5, kimi-k1.5-long

**Characteristics:**
- Best reasoning
- Higher cost
- Good for: Complex architecture, critical code

**GSD Adjustments:**
- Longer phases allowed
- Deep research
- Rigorous verification
- Careful planning

## Configuration

Set profile in `.planning/config.json`:
```json
{
  "model_profile": "balanced",
  "max_context_tokens": 128000,
  "enable_deep_research": true
}
```

Or via environment:
```bash
export GSD_MODEL_PROFILE=quality
```

## Model Selection Guidelines

### Use Fast When
- Exploring ideas
- Small fixes
- Documentation
- Testing approaches

### Use Balanced When
- Normal development
- Standard features
- Most planning

### Use Quality When
- Architecture decisions
- Complex algorithms
- Security-critical code
- Final verification

## Automatic Profile Switching

```python
# Pseudocode for automatic selection
if task_complexity == "simple":
    use_profile("fast")
elif task_complexity == "critical":
    use_profile("quality")
else:
    use_profile("balanced")
```

Use `/skill:gsd-set-profile` to switch.

# Test-Driven Development Guide

GSD approach to TDD.

## TDD Cycle

```
1. RED  → Write failing test
2. GREEN → Make test pass
3. BLUE  → Refactor
```

## GSD Integration

### Planning Phase
Include test strategy in PLAN.md:
```markdown
## Task 1: Feature X

### Implementation
- [ ] Write failing tests
- [ ] Implement feature
- [ ] Refactor

### Tests
- Unit tests for core logic
- Integration tests for API
- E2E test for critical path
```

### Execution Phase
For each task:
1. **Before code** - Review test requirements
2. **During** - Run tests frequently
3. **After** - Verify all tests pass

### Verification Phase
Check:
- [ ] Test coverage >= 80%
- [ ] All critical paths tested
- [ ] Edge cases covered
- [ ] Tests are maintainable

## Test Types

### Unit Tests
- Single function/class
- Fast (< 100ms)
- No external dependencies
- Mocked collaborators

### Integration Tests
- Multiple components
- Real dependencies
- Test interactions
- Slower acceptable

### E2E Tests
- Full user flow
- Through UI/API
- Real environment
- Critical paths only

## Test Quality

### Good Test
```python
def test_user_can_login_with_valid_credentials():
    # Arrange
    user = create_user(email="test@example.com", password="secret")
    
    # Act
    result = login(email="test@example.com", password="secret")
    
    # Assert
    assert result.success is True
    assert result.user_id == user.id
```

### Bad Test
```python
def test_login():
    result = login("test", "pass")
    assert result  # What does this test?
```

## Coverage Guidelines

- **Lines:** 80% minimum
- **Branches:** 70% minimum
- **Critical code:** 100%
- **UI/Configuration:** Flexible

## When to Skip TDD

- Spikes/prototypes
- Exploration
- Configuration-only changes
- Documentation

Use judgment. TDD is a tool, not a rule.

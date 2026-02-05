# Verification Patterns Guide

How to verify different types of work.

## Verification Principles

1. **Verify against requirements, not implementation**
2. **Test the what, not the how**
3. **Edge cases matter**
4. **User perspective first**

## Pattern: Feature Verification

```markdown
## Feature: User Login

### Happy Path
1. User enters valid credentials
2. Clicks login
3. Sees dashboard
✅ PASS if all steps work

### Edge Cases
- Invalid password → Error message
- Locked account → Appropriate message
- Network error → Graceful handling

### Security
- Password not in logs
- Rate limiting works
- Session management secure
```

## Pattern: API Verification

```markdown
## API Endpoint: POST /api/users

### Contract
- Input validation rules
- Response schema
- Error codes

### Tests
- Valid request → 201 + user object
- Invalid email → 400 + error
- Duplicate → 409 + message

### Performance
- < 200ms response time
- Handles 100 concurrent
```

## Pattern: UI Verification

```markdown
## UI Component: Login Form

### Visual
- Matches design spec
- Responsive at all sizes
- Accessible (keyboard, screen reader)

### Functional
- Validation on blur
- Submit on enter
- Loading state during submit

### Cross-browser
- Chrome, Firefox, Safari
- Mobile browsers
```

## Pattern: Integration Verification

```markdown
## Integration: Payment Flow

### End-to-End
1. Add to cart
2. Checkout
3. Payment
4. Confirmation email
5. Order in system

### Data Flow
- Order created in DB
- Inventory updated
- Payment processed
- Email queued

### Failure Recovery
- Payment fails → Cart preserved
- Email fails → Retry mechanism
- DB error → Rollback
```

## Verification Checklist by Type

### Code
- [ ] Compiles/builds
- [ ] Tests pass
- [ ] Linting passes
- [ ] No security issues
- [ ] Performance acceptable

### Documentation
- [ ] Clear and complete
- [ ] Examples provided
- [ ] Accurate to implementation
- [ ] Links work

### Deployment
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Health checks pass
- [ ] Monitoring active

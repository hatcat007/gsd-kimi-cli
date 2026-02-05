# UI/UX Guidelines

Design and UI consistency guidelines for GSD projects.

## Design Principles

1. **Clarity First** - Users should never be confused
2. **Consistency** - Same patterns everywhere
3. **Feedback** - Always show system status
4. **Efficiency** - Minimize clicks/keystrokes
5. **Accessibility** - Work for everyone

## Component Guidelines

### Forms
- Clear labels
- Inline validation
- Error messages near fields
- Tab order logical

### Buttons
- Primary action prominent
- Destructive actions red
- Disabled state clear
- Loading state during action

### Navigation
- Consistent placement
- Current location clear
- Breadcrumbs for depth
- Search available

### Tables/Lists
- Sortable columns
- Pagination for large sets
- Empty state helpful
- Actions obvious

## Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## Color Usage

### Semantic Colors
- **Success:** Green (#22c55e)
- **Error:** Red (#ef4444)
- **Warning:** Yellow (#f59e0b)
- **Info:** Blue (#3b82f6)

### GSD Brand Colors
- **Primary:** #00ff00 (GSD Green)
- **Secondary:** #0ea5e9
- **Background:** #0a0a0a (Dark) / #ffffff (Light)

## Typography

- **Headings:** System sans-serif
- **Body:** System sans-serif
- **Code:** Monospace
- **Scale:** 1.25 ratio (xs, sm, base, lg, xl, 2xl, 3xl)

## Iconography

- Use consistent icon set
- 24px default size
- Clear meaning
- Text labels for ambiguity

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader friendly
- Sufficient color contrast
- Focus indicators visible

## GSD UI Patterns

### Status Indicators
```
🔵 Planned
🔄 In Progress
✅ Complete
⏸️ Blocked
🔴 Failed
```

### Progress Display
- Percentage for quantifiable
- Steps for discrete tasks
- Spinner for indeterminate

### Confirmation Patterns
- Destructive: Modal confirmation
- Important: Inline confirmation
- Routine: No confirmation

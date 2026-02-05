---
name: gsd-list-phase-assumptions
description: Show assumptions for a phase
type: standard
---

# GSD List Phase Assumptions

Show assumptions Claude is making about a phase.

## Arguments

```
/skill:gsd-list-phase-assumptions [phase-number]
```

## Process

1. Read phase from ROADMAP
2. Analyze phase description
3. List implicit assumptions:

```
╔══════════════════════════════════════════════════════════════════╗
║  PHASE ASSUMPTIONS - Phase 03: API Development                   ║
╚══════════════════════════════════════════════════════════════════╝

Based on the phase description, I'm assuming:

## Architecture Assumptions

- RESTful API design (not GraphQL)
- JSON request/response format
- Stateless authentication (JWT)

## Technology Assumptions

- Express.js framework
- PostgreSQL database
- Redis for caching

## Scope Assumptions

- CRUD operations for main resources
- Basic pagination
- Standard HTTP status codes

## Out of Scope (Not Included)

- WebSocket real-time updates
- GraphQL
- Advanced caching strategies
```

## Use Case

Run before planning to verify assumptions or add CONTEXT.md.

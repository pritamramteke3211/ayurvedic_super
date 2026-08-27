# Agent Instructions & Guidelines

All AI agents working on `ayurvedic_super` must adhere to the **Clean Architecture and Domain-Driven Design (DDD)** principles outlined in `.agents/skills/clean-architecture-rn/SKILL.md` and `.agents/rules/architecture.md`.

## 1. Key Directory Structure
- `src/core/domain/`: Pure domain entities, value objects, domain errors, repository interfaces. Zero UI/RN dependencies.
- `src/core/application/`: Single-responsibility use cases.
- `src/infrastructure/`: API client, mock fault server, MMKV caching, offline syncQueue, concrete repositories, UseCaseFactory.
- `src/app/`: AppProviders (DI), Navigation, Zustand state stores, Theme tokens, AppWrapper HOC.
- `src/modules/`: Presentation slices (`consultation`, `shop`, `healthRecords`). Never import from sibling modules.
- `src/shared/`: Shared UI primitives (Button, Card, Skeleton, Toast, ErrorBoundary) and utility hooks.

---

## 2. Engineering OS & Behavioral Rules

### Anti-Restart Guardrail
- Novelty-seeking is a primary risk. The agent acts as a guardrail.
- Out-of-scope ideas/features belong in `.ai/BACKLOG.md`. Never derail current active phase.

### Code Comment Gate (Always Active)
- Source code edits must include why/invariants/exports comments (not line narration).
- Always verify comments before concluding any source code change.

### Mentor & Feature Workflow
- Maintain teacher/architect/pair-programmer mindset.
- Discuss design, domain invariants, and edge cases before generating large blocks of boilerplate.
- Enforce strict typing (no `any`), pure domain isolation, and 4 UI states (Loading, Empty, Error, Data).

### Verification Gates
- Code complete != Knowledge complete.
- Verify type correctness (`npx tsc --noEmit`) and domain invariant tests on every modification.


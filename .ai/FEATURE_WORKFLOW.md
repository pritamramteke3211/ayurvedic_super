# FEATURE WORKFLOW

State machine. **Do not skip states.**

```text
REQUEST
   ↓
SCOPE CHECK          → out of scope → BACKLOG → return to CURRENT_PHASE
   ↓
ROADMAP CHECK
   ↓
USER THINKS
   ↓
USER PROPOSES DESIGN
   ↓
AI REVIEWS
   ↓
CONCEPT LEARNING     (if gaps)
   ↓
USER IMPLEMENTS      (architecture / domain / use cases / business logic)
   ↓
AI AUDITS
   ↓
USER FIXES           (CRITICAL / MAJOR; AI may fix COSMETIC only)
   ↓
AI RE-AUDITS
   ↓
TEST
   ↓
NO-AI VERIFICATION
   ↓
DOCUMENT             (DECISION_LOG / journal)
   ↓
SHIP
```

## Scope check

Compare request to `CURRENT_PHASE.md`. If unrelated: do **not** implement. Follow `ANTI_RESTART.md`.

## Design questions (before any code)

When the user requests a feature (example: customer feedback), ask them to answer first:

1. Where should this feature live in the current architecture?
2. What is the domain model?
3. What data does it contain?
4. Where does the data come from?
5. Where is it stored?
6. What happens when the operation fails?
7. What validation is required?
8. What states does the UI have?
9. What API/interface would you expect?
10. What components / use cases / repositories would you create?

**No code yet.**

## After user design

Challenge Clean Architecture fit (UI → Use Case → Repository → Data Source). Ask if they want a concept explained. Teach via `LEARNING_PROTOCOL.md`. Then:

> Implement yourself: domain model, use case, repository interface, main business logic. Do not ask me to generate these yet. You may ask concept questions; I will not provide the implementation until you have attempted it.

## Ready for implementation

Only after design review + required concept checks. Boilerplate from AI only after design approval (`CORE_RULES` RULE 9).

## No-AI verification (before complete)

- Explain architecture without looking at code
- Rebuild one core part from memory
- Debug a broken version (or describe how you would)
- If requirements changed, how would you modify the architecture?

If they cannot: `STATUS: LEARNING REQUIRED` — not COMPLETE.

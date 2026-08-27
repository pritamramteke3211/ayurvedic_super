# Verification Gates & Review Protocol

## Progress Verification (`.ai/PROGRESS.md`)
- AI may **propose** only: Implementation, Tests, Documentation.
- AI must **never** mark complete: Understanding, Architecture, Knowledge scores, No-AI Learned.
- User must explicitly verify. Code complete != knowledge complete.

## Review Protocol (`.ai/REVIEW_PROTOCOL.md`)
Classify review findings into four tiers:
1. **CRITICAL**: Bugs affecting stability, data loss, security violations. (Must be resolved before shipping).
2. **MAJOR**: Architectural deviations, missing validation, state sync anomalies. (Must be resolved before shipping).
3. **MINOR**: Non-optimal performance, naming inconsistencies, edge case handling.
4. **COSMETIC**: Styling polish, comment formatting.

## Verification Checklist
- Run typechecks (`npx tsc --noEmit`).
- Verify domain invariant unit tests pass.
- Verify 4 UI states: Loading (skeleton), Error (retry), Empty, Data.

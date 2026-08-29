# REVIEW PROTOCOL

When the user says “audit my implementation” (or after they claim a feature is done):

## Check

### Architecture

- Dependency direction
- Separation of concerns
- Repository abstraction
- Business logic not leaked into UI

### TypeScript

- Strict typing
- No unnecessary `any`
- Error types

### React Native

- Component structure
- Unnecessary re-renders
- List optimization only when relevant

### Testing

- Happy path
- Failure / validation / duplicate / network (when applicable)

## Failure classification

| Class        | Meaning                            | Who fixes         |
| ------------ | ---------------------------------- | ----------------- |
| **CRITICAL** | Architecture / business / security | **User must fix** |
| **MAJOR**    | Incorrect implementation or design | **User must fix** |
| **MINOR**    | Small implementation issue         | User fixes        |
| **COSMETIC** | Formatting / naming / docs         | AI may fix        |

**If CRITICAL or MAJOR issues exist, feature cannot progress to SHIP.**

Do **not** auto-fix all issues. Report problems; let the user fix CRITICAL/MAJOR/MINOR. AI may apply COSMETIC only (or when user explicitly requests help after attempting).

## Output shape

List findings by class with file paths. Prefer problems over rewritten solutions for CRITICAL/MAJOR.

## No-AI gate

Before COMPLETE: run explain / rebuild / debug / redesign questions from `FEATURE_WORKFLOW.md`.

If failed: `STATUS: LEARNING REQUIRED`.

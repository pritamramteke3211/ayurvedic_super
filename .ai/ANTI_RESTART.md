# ANTI-RESTART PROTOCOL

The user has a known tendency to abandon the current path when discovering new technologies, ideas, architectures or projects.

The agent must actively prevent unnecessary switching.

---

## Before accepting any new direction, ask

1. Is this required for the current project?
2. Is this required for the current roadmap phase?
3. Is this required for the user's current job search?
4. Is this blocking current progress?
5. Can this be postponed?

If the answer to acting **now** is effectively **NO**:

**DO NOT START IT.**

Add the idea to `BACKLOG.md`.

Tell the user:

> This is a valid idea, but it is outside the current execution path. I have added it to the backlog. We are returning to the current task.

Never encourage restarting the roadmap.

Never create a new roadmap because of a new technology.

Never replace the current project because another project appears more interesting.

Never recommend changing the stack unless there is a strong engineering reason.

---

## Idea Interruption Protocol

Example: user is on SQLite, then says “Let's learn Zustand” or “Let's build an AI chatbot.”

Respond:

> **Interruption detected.**
>
> Current phase: _(from CURRENT_PHASE.md)_.
>
> _(Requested thing)_ is not required for the current objective.
>
> I will add it to `BACKLOG.md`.
>
> Returning to the current task.
>
> **Current task:** _(from CURRENT_PHASE.md)_.

Then append to `BACKLOG.md` and continue the current objective.

---

## Exceptions (only)

### Blocker

Something genuinely blocks the current implementation.

### Job Requirement

A technology/concept is necessary for an upcoming interview/job opportunity.

### Architectural Necessity

The current design has a serious flaw that requires changing direction.

When an exception applies:

> **Exception detected.**

Explain why. Require user approval. Log in `DECISION_LOG.md`. Then proceed narrowly — do not open the door to a full restart.

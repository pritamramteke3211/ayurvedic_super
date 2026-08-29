---
name: code-comment-gate
description: >-
  Gates file edits on sufficient code comments. After creating or updating any source file, checks whether non-obvious intent, invariants, tradeoffs, and public APIs are documented; if gaps remain, adds comments before the final reply. Use when editing code, writing or updating files, finishing an implementation, or when the user asks about comments, documentation in code, or comment quality.
---

# Code Comment Gate

## Hard rule

After **any** create/update of source files, **do not** give the final user reply until the comment gate passes.

1. List every file you created or modified in this turn (source code only).
2. Audit each file for **sufficient comments** (criteria below).
3. If anything fails → **add the missing comments in the files now**.
4. Only then write the final response.

Interpret user phrasing like “add commit before final output” in this context as **add comments** (not a git commit). Never auto-commit unless the user explicitly asks.

## What counts as “sufficient”

Comments must explain **why / constraints / non-obvious behavior**, not restate the code.

| Must comment | Skip (noise) |
| --- | --- |
| Public types, ports, use-case entry points (one-line purpose) | `i++`, obvious getters/setters |
| Invariants, pre/postconditions, domain rules | Restating the next line in English |
| Non-obvious algorithms, edge cases, race/timing | TODOs that duplicate the ticket |
| Layer boundaries / DI wiring rationale | Changelog dumps in every function |
| Workarounds, platform quirks, “do not change” traps | Commented-out dead code |

Prefer JSDoc/`/** ... */` on exported APIs; `//` for local invariants next to the decision.

Match the file’s existing comment style. Keep comments concise.

## Source file scope

Apply to: `.ts`, `.tsx`, `.js`, `.jsx`, `.kt`, `.java`, `.swift`, `.sql`, and similar app/source files.

Skip unless the user asked for docs there: lockfiles, generated code, `node_modules`, build artifacts, binary assets, pure config dumps with no logic.

## Audit checklist (per changed file)

- [ ] Every **exported** symbol has a short purpose comment (or the file already documents the module clearly).
- [ ] Non-obvious branches / edge cases say **why**.
- [ ] Domain rules and validation constraints are named in comments or clear names + comment where names alone are insufficient.
- [ ] Infrastructure quirks (SQLite, RN bridges, platform APIs) note the constraint.
- [ ] No new wall of narrating comments.

If any required box fails → edit the file and add comments. Do not only mention the gap in chat.

## Final-output gate

Before the closing message:

```
Comment gate:
- [ ] Audited all created/updated source files
- [ ] Gaps fixed in-file (not deferred)
- [ ] No auto git commit (unless user explicitly requested one)
```

In the final reply, do **not** dump a long comment report. Fix in code; keep the user-facing summary focused on the task.

## Anti-patterns

- Narrating `// increment counter` style comments
- Skipping the gate because “the code is self-explanatory” when exports or quirks are uncommented
- Saying “I’ll add comments later” and ending the turn
- Creating a git commit as a substitute for comments

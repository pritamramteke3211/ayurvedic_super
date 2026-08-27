---
name: interview-coding-practice
description: >-
  Runs interview practice from docs/interviewQA/S_RN_Interview_QA.md via docs/interviewPractice/. Tracks: Part B coding (90), Part C (72), Part A theory (239, read Q+A + discuss/append), Section 12 design (22). Coding/Part C/design = answer-first; theory = read answer.md then discuss — append clarifications to Discussion. Use when user says next coding question, check my answer, practice theory, practice Part C, practice Section 12, confused about theory, interview practice, or opens docs/interviewPractice/.
---

# Interview Practice

**Gold standard (coding):** Part B closes like **C01** (`…/coding/C01-find-min-max/`).

## Catalog (agents — do not use old 89)

| Track | Count | Path | Daily 22 Aug pace? |
| --- | --- | --- | --- |
| Part B coding | **90** | `…/coding/C##-slug/` | Yes |
| Part C predict/spot/diagnose | **72** | Sec01 `predict-output/`; else `part-c/` | Stretch row |
| **Combined coding+PartC** | **162** |  |  |
| Part A theory | **239** | `…/theory/T##-slug/` | **No** — read+discuss stretch |
| Section 12 design | **22** | `12-senior-system-design/part-a\|b/Q##/` | **No** |

Sprint coding **42** (01+02+03). Sprint+PartC **61**. Prefer sprint coding near 22 Aug. Theory = spoken-interview prep evenings.

## Read first

1. `docs/interviewPractice/CURRENT.md`
2. `docs/interviewPractice/PROGRESS.md`
3. `docs/interviewPractice/DEADLINE.md`
4. [workflow.md](workflow.md)
5. Source: `docs/interviewQA/S_RN_Interview_QA.md`

## Hard rules by track

### Shared

1. One **active** coding/Part C/design pointer in `CURRENT.md`. Theory may be browsed while coding is active.
2. Do not implement Pitern product features from interview prompts unless user explicitly asks — then Engineering OS scope checks.
3. Parallel to Phase 1–2 — don’t hijack product mid-feature.
4. Teach **term → one-line meaning → everyday picture → map to code/answer**.
5. Refresh progress trackers on open/review/next from `DEADLINE.md` + `PROGRESS.md`.
6. `Report.md` on coding/Part C/design `reviewed` close. Theory uses Discussion appends (Report optional if user asks).

### Part B coding / Part C / Sec12 design — answer first

1. **Never** paste Explanation / Example / Note / Approach into chat or `question.md` before the user attempts `my-answer.md`.
2. Coding close = C01 bar (Execution + A/B/C≥3 tables Time/Space/Technique/Algorithm/Built-ins + Learning + Report).
3. Part C close = prediction/diagnosis + Execution if runnable + Learning + Report.
4. Sec12 close = approach / architecture / trade-offs + Learning + Report (no forced C1–C3 code).

### Part A theory — read + discuss + append

1. **OK to read** `answer.md` (source Explanation/Example/Note are in the folder on purpose).
2. Optional: user answers out loud before reading — never required.
3. When user is **confused** about a theory answer:
   - Explain with term + **one-line meaning** + real-life picture + map to the source wording.
   - **Append** a dated entry under `answer.md` → **Discussion / appended explanations** (do not only leave it in chat).
   - Do **not** overwrite the Source answer block — only append under Discussion.
4. Statuses (propose; user confirms): `unread` | `reading` | `discussed` | `confident`.
5. Do not treat reading `answer.md` as mastery.

## Commands

| User intent | Agent action |
| --- | --- |
| Next coding / practice Section N coding | Next pending `C##` |
| Practice Part C | Next pending `O##` |
| Practice theory / Section N theory | Open next `unread` theory (or named T##); point to `question.md` + `answer.md` |
| Confused about … / explain theory | Teach + **append** to that theory `answer.md` Discussion |
| Practice Section 12 | Next design `Q##` |
| Check my answer | Review coding/Part C/design attempt only |
| Hint (coding/Part C) | Term + one-liner + scene — not full solution |
| Reveal coding answer without attempt | Refuse |

## Open theory

1. Pick from `PROGRESS.md` theory tables / `INDEX.md` / section `theory/README.md`.
2. Folder already has `question.md` + `answer.md`.
3. Tell user both paths; invite discussion of confusing lines.
4. Optionally set theory status `reading` in PROGRESS (do not steal coding `CURRENT` unless user asks to switch).

## Append discussion (theory)

When clarifying, append to `answer.md`:

```markdown
### YYYY-MM-DD — <what was confusing>

- **Term:** <name> — <one-line meaning>
- **Picture:** <everyday scene>
- **Clearer wording:** <plain rewrite of the sticky part>
- **Map to source:** <which sentence in Explanation this unlocks>
```

Replace `_Nothing appended yet…_` on first append.

## Real-life-first teaching

Same as before: term → one-liner → picture → map → tiny check. Applies to theory discussions too.

## File map

| Path                                                 | Role                            |
| ---------------------------------------------------- | ------------------------------- |
| `…/theory/T##/question.md`                           | Theory prompt                   |
| `…/theory/T##/answer.md`                             | Source Q&A + Discussion appends |
| `…/coding/C##/`                                      | Part B                          |
| `…/predict-output/` or `part-c/`                     | Part C                          |
| `12-senior-system-design/`                           | Design                          |
| `_templates/theory-question.md` / `theory-answer.md` | Theory templates                |

## Pitern mapping

When relevant: domain / use cases / repository / presentation / Zustand — say now vs later vs interview-only.

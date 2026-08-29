# Workflow details

Follow with [SKILL.md](SKILL.md).

## Catalog numbers

| Track             | Total   |
| ----------------- | ------- |
| Part B coding     | **90**  |
| Part C            | **72**  |
| Combined daily    | **162** |
| Sprint coding     | **42**  |
| Sprint+PartC      | **61**  |
| Part A theory     | **239** |
| Section 12 design | **22**  |

Do **not** use obsolete **89**.

## Two modes

| Mode | Tracks | Solution in folder before attempt? |
| --- | --- | --- |
| **Answer-first** | Coding, Part C, Sec12 design | **No** |
| **Read + discuss** | Theory Part A | **Yes** — `question.md` includes prompt, source Explanation, and Discussion section |

## Extracting prompts

### Coding `C#` / Part C `O#` `B#` `D#`

Stop before `Explanation:`. Never put answers in `question.md`.

### Theory `T#`

- `question.md`: prompt + full **Explanation** + **Example** + **Note** from source + Discussion section.
- Scaffold script: `_scripts/scaffold-theory.js`.

### Sec12 `Q#`

Stop before `Approach:`.

## Theory discussion append protocol

1. User points at confusing sentence / concept in theory `question.md`.
2. Agent teaches: term + one-liner + picture + map to source line.
3. Agent **edits** that file’s `## Discussion / appended explanations` — append dated block (see SKILL).
4. Propose PROGRESS status → `discussed` (user confirms `confident`).
5. Chat stays concise; the durable note lives in `question.md`.

## Deadline tracker

Sprint 01–03 coding & Part C are 100% complete. Tracker tables display:

- **Current Section**
- **Overall Coding (Part B)** (done · pending ~N/day)
- **Overall Part C (Predict/Spot)** (done · pending ~N/day)
- **Overall Combined (Coding + Part C)** (done · pending ~N/day) Sprint rows (`Sprint coding left`, `Sprint+PartC left`) are removed.

## Coding close bar (unchanged)

A/B/C≥3 with Time/Space/Technique/Algorithm/Built-ins + Learning + Report + Execution.

## Part C / Sec12 close bars

- **Attempt Tracking & History**: Keep `## Code` intact at the top as the active solution section. Always check the answer in `## Code`. If an attempt does not satisfy, log the failed attempt under `## Attempt History` (`### Try 1`, `### Try 2`), placed **below `## Notes (for me)`** in `my-answer.md`, while `## Code` remains the primary target section for the user's active attempt. Update `Tries` counter in `CURRENT.md` and `PROGRESS.md`. Never overwrite earlier attempt logs.
- **Strict Verification Gate**: 100% correct output predictions / diagnosis required. Every Part C `my-answer.md` MUST explicitly contain `- **Bugs:**` followed by a `text ` block and `- **Fix:**` followed by a `tsx ` block under `## Predicted output / diagnosis / fix`. If any part of the answer is wrong or missing, status MUST be `needs_retry`. NEVER mark `reviewed` on partial / wrong attempts.
- **Pre-populated Code Fences**: In `my-answer.md`, `## Code` (Part B coding) and `- **Fix:**` (Part C) MUST always be pre-populated with empty `tsx ` (or `ts `) code blocks when opening/scaffolding questions.

## Section folders

| Section | theory         | coding    | Part C            |
| ------- | -------------- | --------- | ----------------- |
| 01      | `theory/`      | `coding/` | `predict-output/` |
| 02–11   | `theory/`      | `coding/` | `part-c/`         |
| 12      | — (design Q##) | —         | —                 |

## Anti-patterns

- Using **89** as coding total
- Marking status as `reviewed` when an output prediction or bug diagnosis is wrong (must use `needs_retry`)
- Omitting Try count (`Try 1`, `Try 2`) in `my-answer.md`, `CURRENT.md`, and `PROGRESS.md`
- Placing `## Attempt History` above `## Approach` or `## Code` instead of below `## Notes (for me)`
- Renaming or removing the main `## Code` section into separate `## Code — Try N` headers instead of keeping `## Code` as the active target and logging history below under `## Attempt History`
- Hiding theory answers when user wants to read them (theory mode allows reading)
- Explaining theory confusion **only** in chat without appending to `question.md`
- Overwriting Source answer instead of appending Discussion
- Dumping many questions at once
- Solutions in coding `question.md` before attempt
- Pushing 162+239+22 as must-finish before 22 Aug
- Skipping tracker refresh on coding/Part C open/review in `PROGRESS.md` & `CURRENT.md`
- Leaving code collapsed inline inside `## Prompt` or leaving `(No code fence in source...)` in Part C `question.md` when code is present in the prompt (must format cleanly inside `## Snippet / scenario` code fence)

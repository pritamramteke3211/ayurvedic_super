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
| **Read + discuss** | Theory Part A | **Yes** — `answer.md` includes source Explanation |

## Extracting prompts

### Coding `C#` / Part C `O#` `B#` `D#`

Stop before `Explanation:`. Never put answers in `question.md`.

### Theory `T#`

- `question.md`: prompt only + how-to-use.
- `answer.md`: full **Explanation** + **Example** + **Note** from source + empty Discussion section.
- Scaffold script: `_scripts/scaffold-theory.js`.

### Sec12 `Q#`

Stop before `Approach:`.

## Theory discussion append protocol

1. User points at confusing sentence / concept in theory `answer.md`.
2. Agent teaches: term + one-liner + picture + map to source line.
3. Agent **edits** that file’s `## Discussion / appended explanations` — append dated block (see SKILL).
4. Propose PROGRESS status → `discussed` (user confirms `confident`).
5. Chat stays concise; the durable note lives in `answer.md`.

## Deadline tracker

Same four pace rows for coding+PartC. Also show theory total **239** as stretch (not in need/day for 42).

Delay = `on track` or `behind by B Q` only for coding/PartC rows.

## Coding close bar (unchanged)

A/B/C≥3 with Time/Space/Technique/Algorithm/Built-ins + Learning + Report + Execution.

## Part C / Sec12 close bars

See SKILL.

## Section folders

| Section | theory         | coding    | Part C            |
| ------- | -------------- | --------- | ----------------- |
| 01      | `theory/`      | `coding/` | `predict-output/` |
| 02–11   | `theory/`      | `coding/` | `part-c/`         |
| 12      | — (design Q##) | —         | —                 |

## Anti-patterns

- Using **89** as coding total
- Hiding theory answers when user wants to read them (theory mode allows reading)
- Explaining theory confusion **only** in chat without appending to `answer.md`
- Overwriting Source answer instead of appending Discussion
- Dumping many questions at once
- Solutions in coding `question.md` before attempt
- Pushing 162+239+22 as must-finish before 22 Aug
- Skipping tracker refresh on coding/Part C open/review

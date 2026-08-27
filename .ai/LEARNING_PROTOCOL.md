# LEARNING PROTOCOL

## Golden rule

AI can increase speed; it must not decrease understanding.

## Depth model (libraries / frameworks)

1. What does it do?
2. Why do I need it?
3. How does it work conceptually?
4. Trade-offs vs alternatives?
5. Can I implement the important parts myself?
6. Internals — only when relevant

Do not require reading every line of dependency source.

## Teacher mode

When teaching a concept required for the current task:

```text
Technical term (interview word)
  → One-line plain meaning (what it actually is — not a deep lecture)
  → Everyday picture (real-life scene)
  → Map picture → code / API “settings”
  → Why it exists
  → Pitfall
  → Pitern example
  → Small question
```

Wait for the user's answer. Evaluate. Do not dump long essays.

**Pair jargon with meaning.** User often uses built-ins without knowing their deeper settings — say the term, give a one-liner, then a familiar comparison. Do not hide interview vocabulary; do not use it unexplained.

Do not provide the full solution before the user has attempted the problem (`CORE_RULES` RULE 5).

## Ownership

**User owns:** architecture, domain model, interfaces, data flow, business rules, important algorithms, security decisions, error strategy.

**AI may help with (after design approval):** boilerplate, types, repetitive CRUD scaffolding, test scaffolding, docs formatting, cosmetic refactors, review, edge-case discovery.

## After major features

Run No-AI verification (see `FEATURE_WORKFLOW.md` and `REVIEW_PROTOCOL.md`). Labels: Learned / Assisted / Outsourced.

## Interview coding practice (parallel track)

Step-by-step coding drills from `docs/interviewQA/S_RN_Interview_QA.md` live in `docs/interviewPractice/`.

- Agent skill: `.cursor/skills/interview-coding-practice/SKILL.md`
- Rule: `.cursor/rules/interview-coding-practice.mdc`
- Flow: copy **question only** → user answers in `my-answer.md` → agent reviews vs source → explain technique + Pitern mapping
- Teaching style: **term + one-line meaning + real-life picture** (see interview-coding-practice skill)
- Does **not** replace Phase product work; run when the user asks to practice

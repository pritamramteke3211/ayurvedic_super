# Code Comment Gate

After creating or updating any source file, enforce the code-comment-gate standard before final reply:

1. Audit changed source files for sufficient comments:
   - **Why** decisions were made
   - **Invariants** and constraints
   - **Exports** and public APIs
   - **Edge cases / Quirks** (not simple line narration).
2. If insufficient, **add comments in the files immediately**.
3. Do not finish the turn with only a chat note about missing comments.
4. Do **not** auto git-commit; adding comments is distinct from git commit.

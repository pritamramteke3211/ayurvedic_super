# ARCHITECTURE RULES — Pitern

## Dependency direction

```text
presentation → application (use cases) → domain ← infrastructure
```

- Domain knows nothing about React Native, SQLite, navigation, or HTTP
- Use cases depend on domain ports (interfaces), not concrete infrastructure
- Infrastructure implements ports (e.g. `SQLiteTaskRepository` implements `TaskRepository`)
- Composition root / DI lives in app shell (`AppProviders`, `UseCaseFactory`)

## Folder intent

| Area                         | Role                                        |
| ---------------------------- | ------------------------------------------- |
| `src/core/domain`            | Entities, value types, ports, domain errors |
| `src/core/application`       | Use cases                                   |
| `src/infrastructure`         | SQLite, repositories, future api/native     |
| `src/modules/*/presentation` | Screens, hooks, UI components               |
| `src/app`                    | Navigation, providers, UI state, theme      |

## Required pattern for features

```text
UI → Use Case → Repository (port) → Data Source (impl)
```

Do not couple screens directly to services/API/SQLite.

## Phase discipline

New modules (sync, ai, habits, etc.) only when `CURRENT_PHASE.md` / `ROADMAP.md` allow them. Otherwise → `BACKLOG.md`.

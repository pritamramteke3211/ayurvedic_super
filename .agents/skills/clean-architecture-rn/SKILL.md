---
name: clean-architecture-rn
description: >-
  Standard Clean Architecture and Domain-Driven Design (DDD) guidelines for React Native applications.
  Use this skill whenever architecting, scaffolding, creating features, use cases, domain models,
  repositories, state management, or UI modules in React Native projects.
---

# React Native Clean Architecture & Domain-Driven Design (DDD) Standard

This skill establishes the production-grade architecture standard for React Native applications, following **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Feature-Sliced / Modular Presentation** principles.

---

## 1. Architectural Philosophy & Dependency Rule

The core rule of Clean Architecture is: **Dependencies only point inward.**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│    (src/modules/<feature>/presentation: Screens, Hooks, UI)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Layer                        │
│            (src/core/application: Use Cases)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
┌──────────────────────────────▼──────────────────────────────┐
│                       Domain Layer                          │
│     (src/core/domain: Entities, Value Objects, Contracts)   │
└──────────────────────────────▲──────────────────────────────┘
                               │ implemented by
┌──────────────────────────────┴──────────────────────────────┐
│                   Infrastructure Layer                      │
│   (src/infrastructure: API Client, DB, Concrete Repos, DI)  │
└─────────────────────────────────────────────────────────────┘
```

1. **Domain Layer (`src/core/domain`)**: Contains enterprise business rules, rich entity models, value objects, domain error classes, and repository interfaces. **Has ZERO dependencies** on React, React Native, UI components, or external libraries.
2. **Application Layer (`src/core/application`)**: Orchestrates business workflows into single-responsibility **Use Cases**. Uses domain repository interfaces to manipulate entities.
3. **Infrastructure Layer (`src/infrastructure`)**: Implements technical details (HTTP clients, SQLite/MMKV persistence, device services, concrete repositories) and wires them via `UseCaseFactory` / Dependency Injection.
4. **Application Glue & App Shell (`src/app`)**: Navigation, root providers (`AppProviders`), global reactive state stores (Zustand), theme tokens, and HOC wrappers.
5. **Modular Presentation Layer (`src/modules/<feature>`)**: Feature slices containing screens, reusable presentation components, and presentation hooks that connect use cases with state stores.

---

## 2. Directory Structure Standard

```
src/
├── app/                              # Application Composition & Configuration
│   ├── AppProviders.tsx              # Root context providers & Dependency Injection
│   ├── components/
│   │   └── hoc/
│   │       └── AppWrapper.tsx        # Top-level screen wrapper (Safe Area, ErrorBoundary, Toast)
│   ├── navigation/                   # React Navigation stacks & tabs
│   │   ├── MainNavigator.tsx         # Root navigator
│   │   ├── RoutePaths.ts             # Strongly-typed route constants
│   │   └── type.ts                   # Navigation param list types
│   ├── state/                        # Global reactive stores (Zustand)
│   │   └── <feature>Store.ts
│   └── theme/                        # Design system tokens
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
│
├── core/                             # Core Business Domain & Application Logic
│   ├── domain/                       # Pure Domain Layer (No UI dependencies)
│   │   └── <entity>/
│   │       ├── <Entity>.ts           # Rich domain model with encapsulation & validation
│   │       ├── <Entity>Repository.ts # Repository interface contract
│   │       ├── <Entity>Errors.ts     # Domain error classes
│   │       ├── <ValueObject>.ts      # Immutable value objects / enums
│   │       └── <Entity>.test.ts      # Pure domain unit tests
│   ├── application/                  # Use Cases (Single responsibility)
│   │   └── <entity>/
│   │       ├── Create<Entity>UseCase.ts
│   │       ├── Get<Entity>sUseCase.ts
│   │       ├── Update<Entity>UseCase.ts
│   │       └── Delete<Entity>UseCase.ts
│   ├── types/                        # Cross-cutting core DTOs & result types
│   └── utils/                        # Pure utility functions (formatting, date grouping, math)
│
├── infrastructure/                   # External Services & Concrete Implementations
│   ├── api/                          # HTTP client, interceptors, error parsers
│   ├── database/                     # SQLite, MMKV, Local storage clients
│   │   ├── UseCaseFactory.ts         # Repository instantiation & Use Case wiring
│   │   └── storage.ts
│   ├── repositories/                 # Concrete repository implementations
│   │   └── <Concrete><Entity>Repository.ts # Implements <Entity>Repository
│   ├── sync/                         # Offline action queue & sync manager
│   └── logging/                      # Structured logger
│
├── modules/ (or features/)           # Feature-Sliced Presentation Modules
│   └── <feature_name>/
│       ├── index.ts                  # Public barrel export
│       └── presentation/
│           ├── components/           # Feature-specific UI components
│           ├── hooks/                # Presentation hooks (bridges UI <-> Use Cases <-> Stores)
│           └── screens/              # Screen components
│
└── shared/                           # Shared UI components & utilities
    ├── components/                   # Button, Card, Input, EmptyState, Skeleton, Toast
    └── hooks/                        # Generic UI hooks (useDebounce, useNetworkStatus)
```

---

## 3. Implementation Rules & Best Practices

### Rule 1: Rich Domain Entities
Entities must encapsulate their state and enforce business invariants. Always:
- Use `private` fields with getters.
- Validate inputs in constructor and mutating methods.
- Throw strongly-typed `DomainError` instances.
- Provide a `static create(...)` factory method.
- Provide a `toJSON(): Readonly<Props>` method for serialization without leaking internal mutation.

```typescript
// Example: src/core/domain/task/Task.ts
export class Task {
  private readonly _id: string;
  private _title: string;
  private _status: TaskStatus;
  private _updatedAt: Date;

  constructor(props: TaskProps) {
    this.validateTitle(props.title);
    this._id = props.id;
    this._title = props.title.trim();
    this._status = props.status;
    this._updatedAt = props.updatedAt;
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new InvalidTaskTitleError();
    }
  }

  complete(): void {
    if (this._status === TaskStatus.COMPLETED) {
      throw new InvalidStatusTransitionError();
    }
    this._status = TaskStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get status(): TaskStatus { return this._status; }
}
```

### Rule 2: Pure Domain Repositories (Contracts)
Define repository interfaces in the domain folder:

```typescript
// src/core/domain/task/TaskRepository.ts
export interface TaskRepository {
  save(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
}
```

### Rule 3: Single-Responsibility Use Cases
Each use case should do one thing, accepting repository interfaces via constructor injection:

```typescript
// src/core/application/task/CreateTaskUseCase.ts
export class CreateTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(params: CreateTaskDTO): Promise<Task> {
    const task = Task.create(params);
    await this.repository.save(task);
    return task;
  }
}
```

### Rule 4: Dependency Injection via `UseCaseFactory` and `AppProviders`
Wire concrete repositories to use cases in `infrastructure/database/UseCaseFactory.ts`:

```typescript
// src/infrastructure/database/UseCaseFactory.ts
export const getCreateTaskUC = async () => new CreateTaskUseCase(await getTaskRepo());
```

Provide instances through React Context in `AppProviders.tsx` so presentation hooks can access them cleanly:

```typescript
// src/modules/tasks/presentation/hooks/useCreateTask.ts
export const useCreateTask = () => {
  const { createTaskUC } = useDependencies();
  const addTaskToStore = useTaskStore(state => state.addTask);

  const execute = async (title: string) => {
    const task = await createTaskUC.execute({ id: generateId(), title });
    addTaskToStore(task);
    return task;
  };

  return { execute };
};
```

### Rule 5: State & Store Separation
- Use **Zustand** stores in `src/app/state/` for client-side reactive UI state.
- Stores hold plain state and setters; they do not perform raw networking or database calls directly.
- Presentation hooks coordinate between Use Cases (domain execution) and Zustand stores (UI update).

### Rule 6: Presentation Modules Independence
- Modules under `src/modules/*` (or `src/features/*`) must never import directly from sibling modules.
- Shared domain logic lives in `src/core/`, shared infrastructure in `src/infrastructure/`, and shared UI in `src/shared/`.

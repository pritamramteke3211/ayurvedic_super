# Project Directory Structure: Ayurvedic Super App

This document provides the complete, official directory layout and architecture map for all AI agents and developers working on the `ayurvedic_super` project.

---

## 🏛️ Architecture Standards Summary
- **Clean Architecture & DDD**: Pure Domain (`src/core/domain`), Use Cases (`src/core/application`), Infrastructure (`src/infrastructure`), App Shell (`src/app`), Modular Presentation (`src/modules/*`), Shared UI (`src/shared/*`).
- **Module Independence**: Presentation modules (`consultation`, `shop`, `healthRecords`) NEVER import from each other.
- **Offline First & Scalability**: Stale-while-revalidate caching, offline queue, and FlashList virtualization for 5k/20k/10k records.

---

## 📁 Directory Tree

```
ayurvedic_super/
  ├── __tests__/
  │   └── App.test.tsx
  ├── .agents/
  │   ├── rules/
  │   │   ├── anti-restart.md
  │   │   ├── architecture.md
  │   │   ├── code-comment-gate.md
  │   │   └── verification-gates.md
  │   └── skills/
  │       ├── clean-architecture-rn/
  │       │   └── SKILL.md
  │       ├── code-comment-gate/
  │       │   └── SKILL.md
  │       ├── interview-coding-practice/
  │       │   ├── SKILL.md
  │       │   └── workflow.md
  │       ├── pritam-engineering-os/
  │       │   ├── reference.md
  │       │   └── SKILL.md
  │       └── SKILL.md
  ├── .ai/
  │   ├── rules/
  │   │   ├── anti-restart.mdc
  │   │   ├── code-comment-gate.mdc
  │   │   ├── engineering-loop.mdc
  │   │   ├── interview-coding-practice.mdc
  │   │   ├── mentor-protocol.mdc
  │   │   └── verification-gates.mdc
  │   ├── skills/
  │   │   ├── code-comment-gate/
  │   │   │   └── SKILL.md
  │   │   ├── interview-coding-practice/
  │   │   │   ├── SKILL.md
  │   │   │   └── workflow.md
  │   │   └── pritam-engineering-os/
  │   │       ├── reference.md
  │   │       └── SKILL.md
  │   ├── AI_BEHAVIOR.md
  │   ├── ANTI_RESTART.md
  │   ├── ARCHITECTURE_RULES.md
  │   ├── BACKLOG.md
  │   ├── CODING_RULES.md
  │   ├── CORE_RULES.md
  │   ├── CURRENT_PHASE.md
  │   ├── DEADLINE.md
  │   ├── DECISION_LOG.md
  │   ├── FEATURE_WORKFLOW.md
  │   ├── LEARNING_PROTOCOL.md
  │   ├── PROGRESS.md
  │   ├── REVIEW_PROTOCOL.md
  │   ├── ROADMAP_LOCK.md
  │   └── ROADMAP.md
  ├── .claude/
  │   └── settings.local.json
  ├── .cursor/
  │   ├── rules/
  │   │   ├── anti-restart.mdc
  │   │   ├── code-comment-gate.mdc
  │   │   ├── engineering-loop.mdc
  │   │   ├── interview-coding-practice.mdc
  │   │   ├── mentor-protocol.mdc
  │   │   └── verification-gates.mdc
  │   └── skills/
  │       ├── code-comment-gate/
  │       │   └── SKILL.md
  │       ├── interview-coding-practice/
  │       │   ├── SKILL.md
  │       │   └── workflow.md
  │       └── pritam-engineering-os/
  │           ├── reference.md
  │           └── SKILL.md
  ├── android/
  │   ├── .kotlin/
  │   │   └── sessions/
  │   ├── app/
  │   │   ├── src/
  │   │   │   └── main/
  │   │   │       ├── java/
  │   │   │       │   └── com/
  │   │   │       │       └── ayurvedic_super/
  │   │   │       │           ├── MainActivity.kt
  │   │   │       │           └── MainApplication.kt
  │   │   │       ├── res/
  │   │   │       │   ├── drawable/
  │   │   │       │   │   └── rn_edit_text_material.xml
  │   │   │       │   ├── mipmap-hdpi/
  │   │   │       │   │   ├── ic_launcher_round.png
  │   │   │       │   │   └── ic_launcher.png
  │   │   │       │   ├── mipmap-mdpi/
  │   │   │       │   │   ├── ic_launcher_round.png
  │   │   │       │   │   └── ic_launcher.png
  │   │   │       │   ├── mipmap-xhdpi/
  │   │   │       │   │   ├── ic_launcher_round.png
  │   │   │       │   │   └── ic_launcher.png
  │   │   │       │   ├── mipmap-xxhdpi/
  │   │   │       │   │   ├── ic_launcher_round.png
  │   │   │       │   │   └── ic_launcher.png
  │   │   │       │   ├── mipmap-xxxhdpi/
  │   │   │       │   │   ├── ic_launcher_round.png
  │   │   │       │   │   └── ic_launcher.png
  │   │   │       │   └── values/
  │   │   │       │       ├── strings.xml
  │   │   │       │       └── styles.xml
  │   │   │       └── AndroidManifest.xml
  │   │   ├── build.gradle
  │   │   ├── debug.keystore
  │   │   └── proguard-rules.pro
  │   ├── gradle/
  │   │   └── wrapper/
  │   │       ├── gradle-wrapper.jar
  │   │       └── gradle-wrapper.properties
  │   ├── build.gradle
  │   ├── gradle.properties
  │   ├── gradlew
  │   ├── gradlew.bat
  │   └── settings.gradle
  ├── approaches/
  │   ├── 01-clean-architecture-and-ddd.md
  │   ├── 02-offline-first-and-persistence.md
  │   ├── 03-large-scale-virtualization.md
  │   ├── 04-network-resilience-and-fault-injection.md
  │   ├── 05-state-management-and-data-flow.md
  │   ├── 06-design-system-and-theming.md
  │   ├── 07-testing-strategy.md
  │   └── README.md
  ├── docs/
  │   ├── Amrutam_Architecture_and_Build_Plan.md
  │   └── Amrutam_React_Native_Assignment.md
  ├── ios/
  │   ├── ayurvedic_super/
  │   │   ├── Images.xcassets/
  │   │   │   ├── AppIcon.appiconset/
  │   │   │   │   └── Contents.json
  │   │   │   └── Contents.json
  │   │   ├── AppDelegate.swift
  │   │   ├── Info.plist
  │   │   ├── LaunchScreen.storyboard
  │   │   └── PrivacyInfo.xcprivacy
  │   ├── ayurvedic_super.xcodeproj/
  │   │   ├── xcshareddata/
  │   │   │   └── xcschemes/
  │   │   │       └── ayurvedic_super.xcscheme
  │   │   └── project.pbxproj
  │   ├── .xcode.env
  │   └── Podfile
  ├── issues/
  │   ├── 01-safe-area-context-invalid-project-directory.md
  │   └── README.md
  ├── scripts/
  │   └── track-progress.js
  ├── src/
  │   ├── app/
  │   │   ├── navigation/
  │   │   │   ├── RoutePaths.ts
  │   │   │   └── type.ts
  │   │   └── theme/
  │   │       ├── colors.ts
  │   │       ├── spacing.ts
  │   │       └── typography.ts
  │   ├── core/
  │   │   ├── application/
  │   │   │   ├── consultation/
  │   │   │   │   ├── BookSlotUseCase.ts
  │   │   │   │   └── GetDoctorsUseCase.ts
  │   │   │   ├── healthRecords/
  │   │   │   │   └── GetHealthTimelineUseCase.ts
  │   │   │   └── shop/
  │   │   │       ├── AddToCartUseCase.ts
  │   │   │       └── GetProductsUseCase.ts
  │   │   ├── domain/
  │   │   │   ├── consultation/
  │   │   │   │   ├── Booking.ts
  │   │   │   │   ├── BookingStatus.ts
  │   │   │   │   ├── ConsultationErrors.ts
  │   │   │   │   ├── ConsultationRepository.ts
  │   │   │   │   ├── Doctor.ts
  │   │   │   │   ├── Slot.ts
  │   │   │   │   └── SlotConflictValidator.ts
  │   │   │   ├── healthRecords/
  │   │   │   │   ├── HealthRecord.ts
  │   │   │   │   ├── HealthRecordErrors.ts
  │   │   │   │   ├── HealthRecordRepository.ts
  │   │   │   │   ├── RecordType.ts
  │   │   │   │   └── TimelineGrouper.ts
  │   │   │   └── shop/
  │   │   │       ├── CartCalculator.ts
  │   │   │       ├── CartItem.ts
  │   │   │       ├── Product.ts
  │   │   │       ├── ShopErrors.ts
  │   │   │       └── ShopRepository.ts
  │   │   └── types/
  │   │       └── common.ts
  │   ├── infrastructure/
  │   │   ├── api/
  │   │   │   └── errors.ts
  │   │   ├── logging/
  │   │   │   └── logger.ts
  │   │   └── storage/
  │   │       ├── mmkv.ts
  │   │       └── syncQueue.ts
  │   └── modules/
  │       ├── consultation/
  │       │   └── index.ts
  │       ├── healthRecords/
  │       │   └── index.ts
  │       └── shop/
  │           └── index.ts
  ├── .eslintrc.js
  ├── .gitignore
  ├── .prettierrc.js
  ├── .watchmanconfig
  ├── AGENTS.md
  ├── app.json
  ├── App.tsx
  ├── babel.config.js
  ├── Gemfile
  ├── index.js
  ├── jest.config.js
  ├── metro.config.js
  ├── package-lock.json
  ├── package.json
  ├── README.md
  ├── structure.md
  └── tsconfig.json
```

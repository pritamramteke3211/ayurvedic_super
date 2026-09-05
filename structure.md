# Project Directory Structure: Ayurvedic Super App

This document provides the complete, official directory layout and architecture map for the `ayurvedic_super` project.

---

## 🏛️ Architecture Standards Summary
- **Clean Architecture & DDD**: Pure Domain (`src/core/domain`), Use Cases (`src/core/application`), Infrastructure (`src/infrastructure`), App Shell (`src/app`), Modular Presentation (`src/modules/*`), Shared UI & i18n (`src/shared/*`).
- **Module Independence**: Presentation modules (`consultation`, `shop`, `healthRecords`) NEVER import from each other.
- **Offline-First & Scalability**: Stale-while-revalidate caching, MMKV + SecureStorage persistence, sync queue, fault injection simulator, and FlashList virtualization.
- **Strict Verification Gates**: Unit and domain invariant tests (`*.test.ts`), E2E flow tests (`__tests__/e2e`), zero TypeScript errors (`npx tsc --noEmit`).

---

## 📁 Directory Tree

```
ayurvedic_super/
  ├── __tests__/
  │   ├── e2e/
  │   │   └── ShopBookingFlow.test.tsx
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
  │   ├── latest-screen.png
  │   ├── LEARNING_PROTOCOL.md
  │   ├── PROGRESS.md
  │   ├── REVIEW_PROTOCOL.md
  │   ├── ROADMAP_LOCK.md
  │   └── ROADMAP.md
  ├── .bundle/
  │   └── config
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
  ├── docs/
  │   ├── approaches/
  │   │   ├── 01-clean-architecture-and-ddd.md
  │   │   ├── 02-offline-first-and-persistence.md
  │   │   ├── 03-large-scale-virtualization.md
  │   │   ├── 04-network-resilience-and-fault-injection.md
  │   │   ├── 05-state-management-and-data-flow.md
  │   │   ├── 06-design-system-and-theming.md
  │   │   ├── 07-testing-strategy.md
  │   │   └── README.md
  │   ├── audits/
  │   │   └── CONSULTATION_AUDIT_TRACKER.md
  │   ├── issues/
  │   │   ├── 01-safe-area-context-invalid-project-directory.md
  │   │   ├── 02-react-native-screens-codegen-componentref-error.md
  │   │   ├── 03-emulator-offline-timeout-exception-install-hang.md
  │   │   ├── 04-mmkv-v3-nitro-modules-missing-dependency.md
  │   │   ├── 05-rn-svg-missing-viewmanager-native-rebuild.md
  │   │   └── README.md
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
  ├── scripts/
  │   ├── patch-codegen.js
  │   ├── track-progress.js
  │   └── verify-consultation-domain.js
  ├── src/
  │   ├── app/
  │   │   ├── navigation/
  │   │   │   ├── BottomTabNavigator.tsx
  │   │   │   ├── ConsultationNavigator.tsx
  │   │   │   ├── HealthRecordsNavigator.tsx
  │   │   │   ├── linking.ts
  │   │   │   ├── MainNavigator.tsx
  │   │   │   ├── RoutePaths.ts
  │   │   │   ├── ShopNavigator.tsx
  │   │   │   └── type.ts
  │   │   ├── state/
  │   │   │   ├── consultationSlice.ts
  │   │   │   ├── consultationStore.ts
  │   │   │   ├── healthRecordsSlice.ts
  │   │   │   ├── healthRecordsStore.ts
  │   │   │   ├── hooks.ts
  │   │   │   ├── shopSlice.ts
  │   │   │   ├── shopStore.ts
  │   │   │   └── store.ts
  │   │   └── theme/
  │   │       ├── colors.ts
  │   │       ├── spacing.ts
  │   │       ├── typography.ts
  │   │       └── useAppTheme.ts
  │   ├── core/
  │   │   ├── application/
  │   │   │   ├── consultation/
  │   │   │   │   ├── BookSlotUseCase.ts
  │   │   │   │   ├── CancelBookingUseCase.ts
  │   │   │   │   ├── GetDoctorSlotsUseCase.ts
  │   │   │   │   ├── GetDoctorsUseCase.ts
  │   │   │   │   └── GetUserBookingsUseCase.ts
  │   │   │   ├── healthRecords/
  │   │   │   │   ├── AddHealthRecordUseCase.ts
  │   │   │   │   ├── DeleteHealthRecordUseCase.ts
  │   │   │   │   ├── GetHealthTimelineUseCase.ts
  │   │   │   │   ├── GetRecordDetailsUseCase.ts
  │   │   │   │   └── GetRecordTagsUseCase.ts
  │   │   │   └── shop/
  │   │   │       ├── AddToCartUseCase.ts
  │   │   │       ├── CheckoutUseCase.ts
  │   │   │       ├── GetCartUseCase.ts
  │   │   │       ├── GetProductDetailsUseCase.ts
  │   │   │       ├── GetProductsUseCase.ts
  │   │   │       ├── GetWishlistUseCase.ts
  │   │   │       ├── RemoveFromCartUseCase.ts
  │   │   │       ├── ToggleWishlistUseCase.ts
  │   │   │       └── UpdateCartQuantityUseCase.ts
  │   │   ├── domain/
  │   │   │   ├── consultation/
  │   │   │   │   ├── Booking.test.ts
  │   │   │   │   ├── Booking.ts
  │   │   │   │   ├── BookingStatus.ts
  │   │   │   │   ├── ConsultationErrors.ts
  │   │   │   │   ├── ConsultationRepository.ts
  │   │   │   │   ├── Doctor.ts
  │   │   │   │   ├── Slot.ts
  │   │   │   │   ├── SlotConflictValidator.test.ts
  │   │   │   │   └── SlotConflictValidator.ts
  │   │   │   ├── healthRecords/
  │   │   │   │   ├── HealthRecord.test.ts
  │   │   │   │   ├── HealthRecord.ts
  │   │   │   │   ├── HealthRecordErrors.ts
  │   │   │   │   ├── HealthRecordRepository.ts
  │   │   │   │   ├── RecordType.ts
  │   │   │   │   ├── TimelineGrouper.test.ts
  │   │   │   │   └── TimelineGrouper.ts
  │   │   │   └── shop/
  │   │   │       ├── CartCalculator.test.ts
  │   │   │       ├── CartCalculator.ts
  │   │   │       ├── CartItem.ts
  │   │   │       ├── Product.ts
  │   │   │       ├── ShopErrors.ts
  │   │   │       └── ShopRepository.ts
  │   │   └── types/
  │   │       └── common.ts
  │   ├── infrastructure/
  │   │   ├── api/
  │   │   │   ├── client.ts
  │   │   │   ├── errors.ts
  │   │   │   ├── faultSimulator.ts
  │   │   │   ├── mockDataGenerator.ts
  │   │   │   └── mockServer.ts
  │   │   ├── logging/
  │   │   │   └── logger.ts
  │   │   ├── mock/
  │   │   │   ├── consultationMockData.ts
  │   │   │   ├── healthRecordsMockData.ts
  │   │   │   └── shopMockData.ts
  │   │   ├── network/
  │   │   │   ├── networkManager.ts
  │   │   │   └── syncManager.ts
  │   │   ├── repositories/
  │   │   │   ├── MockConsultationRepository.ts
  │   │   │   ├── MockHealthRecordRepository.ts
  │   │   │   └── MockShopRepository.ts
  │   │   └── storage/
  │   │       ├── mmkv.ts
  │   │       ├── secureStorage.test.ts
  │   │       ├── secureStorage.ts
  │   │       └── syncQueue.ts
  │   ├── modules/
  │   │   ├── consultation/
  │   │   │   ├── presentation/
  │   │   │   │   ├── components/
  │   │   │   │   │   ├── DoctorCard.tsx
  │   │   │   │   │   ├── DoctorFilterModal.tsx
  │   │   │   │   │   ├── SlotPicker.tsx
  │   │   │   │   │   └── SpecialtyFilterBar.tsx
  │   │   │   │   └── screens/
  │   │   │   │       ├── BookingScreen.tsx
  │   │   │   │       ├── DoctorDetailScreen.tsx
  │   │   │   │       ├── DoctorListScreen.tsx
  │   │   │   │       └── MyBookingsScreen.tsx
  │   │   │   └── index.ts
  │   │   ├── healthRecords/
  │   │   │   ├── presentation/
  │   │   │   │   ├── components/
  │   │   │   │   │   ├── AttachmentItem.tsx
  │   │   │   │   │   ├── HealthMetricsSummary.tsx
  │   │   │   │   │   ├── RecordCard.tsx
  │   │   │   │   │   ├── RecordFilterModal.tsx
  │   │   │   │   │   └── TimelineMonthHeader.tsx
  │   │   │   │   └── screens/
  │   │   │   │       ├── AddRecordScreen.tsx
  │   │   │   │       ├── HealthRecordsHomeScreen.tsx
  │   │   │   │       ├── HealthTimelineScreen.tsx
  │   │   │   │       └── RecordDetailScreen.tsx
  │   │   │   └── index.ts
  │   │   └── shop/
  │   │       ├── presentation/
  │   │       │   ├── components/
  │   │       │   │   ├── BillSummaryCard.tsx
  │   │       │   │   ├── CartItemRow.tsx
  │   │       │   │   ├── CategoryFilterChips.tsx
  │   │       │   │   ├── ProductCard.tsx
  │   │       │   │   └── SortFilterModal.tsx
  │   │       │   └── screens/
  │   │       │       ├── CartScreen.tsx
  │   │       │       ├── ProductDetailScreen.tsx
  │   │       │       ├── ProductListScreen.tsx
  │   │       │       └── ShopHomeScreen.tsx
  │   │       └── index.ts
  │   └── shared/
  │       ├── components/
  │       │   ├── icons/
  │       │   │   └── AyurvedicIcons.tsx
  │       │   ├── Badge.tsx
  │       │   ├── Button.tsx
  │       │   ├── Card.tsx
  │       │   ├── EmptyState.tsx
  │       │   ├── ErrorBoundary.tsx
  │       │   ├── ErrorView.tsx
  │       │   ├── FeatureStatusPlaceholder.tsx
  │       │   ├── index.ts
  │       │   ├── LanguageToggle.tsx
  │       │   ├── OfflineBanner.tsx
  │       │   ├── Skeleton.tsx
  │       │   └── Toast.tsx
  │       └── i18n/
  │           ├── en.ts
  │           ├── hi.ts
  │           ├── i18n.test.ts
  │           ├── index.ts
  │           ├── types.ts
  │           └── useTranslation.ts
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
  ├── jest.setup.js
  ├── LICENSE
  ├── metro.config.js
  ├── package-lock.json
  ├── package.json
  ├── README.md
  ├── structure.md
  └── tsconfig.json
```

---

## 📑 Core Layers Overview

| Layer | Path | Responsibility | Invariants & Rules |
| :--- | :--- | :--- | :--- |
| **Domain** | `src/core/domain/` | Entities, Value Objects, Domain Errors, Repository Interfaces | Pure TypeScript. Zero dependencies on React, React Native, or third-party storage/network. |
| **Application** | `src/core/application/` | Single-responsibility Use Cases orchestrating business logic | Calls domain repositories and validates inputs. Never references UI or framework components. |
| **Infrastructure**| `src/infrastructure/` | API client, Fault simulator, Repositories, MMKV/SecureStorage, Sync Queue | Concrete implementations of domain interfaces. Handles network resilience, caching, and serialization. |
| **App Shell** | `src/app/` | Navigators (BottomTab, Stacks), Zustand State Stores, Theme tokens | Assembles modules, manages global state, routing, and design system tokens. |
| **Modules** | `src/modules/` | Presentation screens and feature-specific components | Slice-based architecture. Sibling modules NEVER import from each other. |
| **Shared** | `src/shared/` | Reusable UI primitives, SVG icons, i18n localization (EN/HI) | Agnostic design system components with 4 UI states (Loading, Empty, Error, Data). |

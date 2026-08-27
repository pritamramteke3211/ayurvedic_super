/**
 * Ayurvedic Super App — Automated 72-Hour Progress Tracker with Subphases
 *
 * Scans the codebase, evaluates implementation status across all 16 subphases,
 * calculates milestone completion percentages, and updates .ai/PROGRESS.md & .ai/DEADLINE.md.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PROGRESS_FILE = path.join(ROOT_DIR, '.ai', 'PROGRESS.md');
const DEADLINE_FILE = path.join(ROOT_DIR, '.ai', 'DEADLINE.md');
const CURRENT_PHASE_FILE = path.join(ROOT_DIR, '.ai', 'CURRENT_PHASE.md');

// Detailed subphases definition with direct file assertions
const SUBPHASES = [
  // --- PHASE 1: FOUNDATION (DAY 1) ---
  {
    phaseId: 'Phase 1',
    phaseName: 'Foundation & Core Infrastructure (Day 1)',
    subphaseId: '1.1',
    subphaseName: 'Project Setup & Domain Architecture',
    weight: 4,
    items: [
      { id: 'ts_paths', name: 'TypeScript Strict & Path Aliases', path: 'tsconfig.json' },
      { id: 'domain_entities', name: 'Domain Models & Value Objects', path: 'src/core/domain/consultation/Doctor.ts' },
      { id: 'common_types', name: 'Core Result & Pagination Types', path: 'src/core/types/common.ts' },
    ],
  },
  {
    phaseId: 'Phase 1',
    phaseName: 'Foundation & Core Infrastructure (Day 1)',
    subphaseId: '1.2',
    subphaseName: 'API Client & Fault Injection Layer',
    weight: 4,
    items: [
      { id: 'api_errors', name: 'Typed Error Hierarchy (Network/Timeout/Api/Session)', path: 'src/infrastructure/api/errors.ts' },
      { id: 'api_client', name: 'Custom HTTP Client with Timeout/Retry', path: 'src/infrastructure/api/client.ts' },
      { id: 'fault_server', name: 'Mock Server with Chaos Fault Injection', path: 'src/infrastructure/api/mockServer.ts' },
    ],
  },
  {
    phaseId: 'Phase 1',
    phaseName: 'Foundation & Core Infrastructure (Day 1)',
    subphaseId: '1.3',
    subphaseName: 'Design System & Theming Engine',
    weight: 5,
    items: [
      { id: 'theme_tokens', name: 'Ayurvedic Theme Tokens (Light/Dark Colors)', path: 'src/app/theme/colors.ts' },
      { id: 'typography_spacing', name: 'Typography & Spacing Scales', path: 'src/app/theme/spacing.ts' },
      { id: 'ui_primitives', name: 'Shared UI Primitives (Button, Card, Skeleton, Toast)', path: 'src/shared/components/Button.tsx' },
      { id: 'error_boundary', name: 'Global Error Boundary Component', path: 'src/shared/components/ErrorBoundary.tsx' },
    ],
  },
  {
    phaseId: 'Phase 1',
    phaseName: 'Foundation & Core Infrastructure (Day 1)',
    subphaseId: '1.4',
    subphaseName: 'Navigation & Routing Architecture',
    weight: 4,
    items: [
      { id: 'route_paths', name: 'RoutePaths Constants & Type Definitions', path: 'src/app/navigation/RoutePaths.ts' },
      { id: 'nav_types', name: 'Root & Tab ParamList Types', path: 'src/app/navigation/type.ts' },
      { id: 'nav_stacks', name: 'Root & Tab Navigators Structure', path: 'src/app/navigation/MainNavigator.tsx' },
    ],
  },
  {
    phaseId: 'Phase 1',
    phaseName: 'Foundation & Core Infrastructure (Day 1)',
    subphaseId: '1.5',
    subphaseName: 'Mock Data Generators (Scale: 5k/20k/10k)',
    weight: 4,
    items: [
      { id: 'mock_generators', name: 'Faker Data Generator Scripts', path: 'src/infrastructure/api/mockDataGenerator.ts' },
    ],
  },
  {
    phaseId: 'Phase 1',
    phaseName: 'Foundation & Core Infrastructure (Day 1)',
    subphaseId: '1.6',
    subphaseName: 'Offline Layer & Sync Queue',
    weight: 4,
    items: [
      { id: 'storage_adapter', name: 'Storage / MMKV Abstraction Layer', path: 'src/infrastructure/storage/mmkv.ts' },
      { id: 'sync_queue', name: 'Offline Action SyncQueue (Persisted)', path: 'src/infrastructure/storage/syncQueue.ts' },
      { id: 'logger', name: 'Structured Diagnostic Logger', path: 'src/infrastructure/logging/logger.ts' },
    ],
  },

  // --- PHASE 2: FEATURE DEPTH (DAY 2) ---
  {
    phaseId: 'Phase 2',
    phaseName: 'Feature Depth & Module Scalability (Day 2)',
    subphaseId: '2.1',
    subphaseName: 'Shop — 20,000 Products Feed & Search',
    weight: 8,
    items: [
      { id: 'shop_entity', name: 'Product Entity & Repository Interface', path: 'src/core/domain/shop/Product.ts' },
      { id: 'get_products_uc', name: 'GetProductsUseCase (Infinite Scroll & Filters)', path: 'src/core/application/shop/GetProductsUseCase.ts' },
      { id: 'shop_store', name: 'Shop State Store (Normalized & Filtered)', path: 'src/app/state/shopStore.ts' },
      { id: 'shop_feed_screen', name: 'ProductListScreen (Virtualized FlashList)', path: 'src/modules/shop/presentation/screens/ProductListScreen.tsx' },
    ],
  },
  {
    phaseId: 'Phase 2',
    phaseName: 'Feature Depth & Module Scalability (Day 2)',
    subphaseId: '2.2',
    subphaseName: 'Shop — Product Details, Cart & Checkout',
    weight: 7,
    items: [
      { id: 'cart_item_entity', name: 'CartItem Entity & ShopErrors', path: 'src/core/domain/shop/CartItem.ts' },
      { id: 'cart_calc', name: 'Pure CartCalculator (Totals, Discounts, Delivery)', path: 'src/core/domain/shop/CartCalculator.ts' },
      { id: 'add_to_cart_uc', name: 'AddToCartUseCase & Checkout Flow', path: 'src/core/application/shop/AddToCartUseCase.ts' },
      { id: 'cart_screen', name: 'CartScreen with MMKV Persistence & Offline Sync', path: 'src/modules/shop/presentation/screens/CartScreen.tsx' },
    ],
  },
  {
    phaseId: 'Phase 2',
    phaseName: 'Feature Depth & Module Scalability (Day 2)',
    subphaseId: '2.3',
    subphaseName: 'Consultations — 5,000 Doctors Directory & Slots',
    weight: 7,
    items: [
      { id: 'doc_entity', name: 'Doctor & Slot Entities', path: 'src/core/domain/consultation/Slot.ts' },
      { id: 'get_docs_uc', name: 'GetDoctorsUseCase & Doctor Filters', path: 'src/core/application/consultation/GetDoctorsUseCase.ts' },
      { id: 'doc_list_screen', name: 'DoctorListScreen (Virtualized FlashList)', path: 'src/modules/consultation/presentation/screens/DoctorListScreen.tsx' },
    ],
  },
  {
    phaseId: 'Phase 2',
    phaseName: 'Feature Depth & Module Scalability (Day 2)',
    subphaseId: '2.4',
    subphaseName: 'Consultations — Slot Conflict Engine & Booking Flow',
    weight: 8,
    items: [
      { id: 'slot_validator', name: 'Pure SlotConflictValidator Engine', path: 'src/core/domain/consultation/SlotConflictValidator.ts' },
      { id: 'book_slot_uc', name: 'BookSlotUseCase & CancelBookingUseCase', path: 'src/core/application/consultation/BookSlotUseCase.ts' },
      { id: 'booking_screen', name: 'BookingScreen & Offline Booking Queue', path: 'src/modules/consultation/presentation/screens/BookingScreen.tsx' },
    ],
  },
  {
    phaseId: 'Phase 2',
    phaseName: 'Feature Depth & Module Scalability (Day 2)',
    subphaseId: '2.5',
    subphaseName: 'Health Records — 10,000 Patient Timeline',
    weight: 8,
    items: [
      { id: 'record_entity', name: 'HealthRecord Entity (5 Record Types)', path: 'src/core/domain/healthRecords/HealthRecord.ts' },
      { id: 'timeline_grouper', name: 'Pure TimelineGrouper (Month/Year Sections)', path: 'src/core/domain/healthRecords/TimelineGrouper.ts' },
      { id: 'timeline_uc', name: 'GetHealthTimelineUseCase & Tag Filter', path: 'src/core/application/healthRecords/GetHealthTimelineUseCase.ts' },
      { id: 'timeline_screen', name: 'HealthTimelineScreen & Attachment Thumbnail', path: 'src/modules/healthRecords/presentation/screens/HealthTimelineScreen.tsx' },
    ],
  },

  // --- PHASE 3: HARDENING & DELIVERY (DAY 3) ---
  {
    phaseId: 'Phase 3',
    phaseName: 'Hardening, Reliability & Bonus Features (Day 3)',
    subphaseId: '3.1',
    subphaseName: 'Reliability Pass & 4 UI States Verification',
    weight: 7,
    items: [
      { id: 'ui_states', name: '4 Explicit UI States (Loading, Empty, Error, Data)', path: 'src/shared/components/EmptyState.tsx' },
      { id: 'chaos_scenarios', name: 'Chaos Fault Simulator (Slow, Timeout, 500, Session)', path: 'src/infrastructure/api/faultSimulator.ts' },
    ],
  },
  {
    phaseId: 'Phase 3',
    phaseName: 'Hardening, Reliability & Bonus Features (Day 3)',
    subphaseId: '3.2',
    subphaseName: 'Performance Pass & Virtualization Profiling',
    weight: 6,
    items: [
      { id: 'flashlist_opt', name: 'FlashList Optimization & Memoized Row Cards', path: 'src/modules/shop/presentation/components/ProductCard.tsx' },
    ],
  },
  {
    phaseId: 'Phase 3',
    phaseName: 'Hardening, Reliability & Bonus Features (Day 3)',
    subphaseId: '3.3',
    subphaseName: 'Bonus Feature 1 — Secure Local Storage',
    weight: 4,
    items: [
      { id: 'secure_storage', name: 'Encrypted Storage for Session & Cart', path: 'src/infrastructure/storage/secureStorage.ts' },
    ],
  },
  {
    phaseId: 'Phase 3',
    phaseName: 'Hardening, Reliability & Bonus Features (Day 3)',
    subphaseId: '3.4',
    subphaseName: 'Bonus Feature 2 — Deep Linking',
    weight: 4,
    items: [
      { id: 'deep_linking', name: 'Deep Linking URI Configuration', path: 'src/app/navigation/linking.ts' },
    ],
  },
  {
    phaseId: 'Phase 3',
    phaseName: 'Hardening, Reliability & Bonus Features (Day 3)',
    subphaseId: '3.5',
    subphaseName: 'Bonus Feature 3 — Localization (EN / HI)',
    weight: 4,
    items: [
      { id: 'i18n', name: 'English & Hindi Translations System', path: 'src/shared/i18n/index.ts' },
    ],
  },
  {
    phaseId: 'Phase 3',
    phaseName: 'Hardening, Reliability & Bonus Features (Day 3)',
    subphaseId: '3.6',
    subphaseName: 'Unit / E2E Testing & Architectural README',
    weight: 8,
    items: [
      { id: 'unit_tests_slot', name: 'Slot Conflict & Booking Unit Tests', path: 'src/core/domain/consultation/SlotConflictValidator.test.ts' },
      { id: 'unit_tests_cart', name: 'Cart Calculator Unit Tests', path: 'src/core/domain/shop/CartCalculator.test.ts' },
      { id: 'e2e_flow_test', name: 'End-to-End User Flow Test', path: '__tests__/e2e/ShopBookingFlow.test.tsx' },
      { id: 'readme_doc', name: 'Comprehensive Production README', path: 'README.md' },
    ],
  },
];

function checkFileExists(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  return fs.existsSync(fullPath);
}

function evaluateProgress() {
  let totalScore = 0;
  let totalMax = 0;
  const detailedSubphases = [];

  for (const sp of SUBPHASES) {
    let completedCount = 0;
    const itemsWithStatus = [];

    for (const item of sp.items) {
      const exists = checkFileExists(item.path);
      if (exists) completedCount++;
      itemsWithStatus.push({ ...item, completed: exists });
    }

    const percentage = Math.round((completedCount / sp.items.length) * 100);
    const weightedScore = (percentage / 100) * sp.weight;
    totalScore += weightedScore;
    totalMax += sp.weight;

    detailedSubphases.push({
      ...sp,
      completedCount,
      totalCount: sp.items.length,
      percentage,
      items: itemsWithStatus,
    });
  }

  const overallPercentage = Math.round((totalScore / totalMax) * 100);
  return { overallPercentage, detailedSubphases };
}

function renderProgressBar(percentage, length = 20) {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percentage}%`;
}

function updateMarkdownFiles(evalData) {
  const { overallPercentage, detailedSubphases } = evalData;
  const now = new Date().toLocaleString();

  // 1. Update PROGRESS.md
  let progressMd = `# Progress Tracker — Ayurvedic Super App\n\n`;
  progressMd += `**Overall Project Completion:** \`${overallPercentage}%\`\n`;
  progressMd += `**Last Updated:** ${now}\n\n`;
  progressMd += `\`${renderProgressBar(overallPercentage, 30)}\`\n\n---\n\n`;

  progressMd += `## 📊 Subphase Breakdown (16 Subphases)\n\n`;
  progressMd += `| Subphase | Name | Progress | Status | Weight |\n`;
  progressMd += `| :--- | :--- | :--- | :--- | :--- |\n`;

  let currentPhaseGroup = '';
  for (const sp of detailedSubphases) {
    if (sp.phaseName !== currentPhaseGroup) {
      currentPhaseGroup = sp.phaseName;
      progressMd += `| **${sp.phaseId}** | **${currentPhaseGroup}** | | | |\n`;
    }
    const icon = sp.percentage === 100 ? '✅' : sp.percentage > 0 ? '🟡' : '❌';
    progressMd += `| \`${sp.subphaseId}\` | ${sp.subphaseName} | \`${renderProgressBar(sp.percentage, 10)}\` | ${icon} ${sp.completedCount}/${sp.totalCount} | ${sp.weight}% |\n`;
  }

  progressMd += `\n---\n\n## 📝 Granular Subphase Checklist\n\n`;

  for (const sp of detailedSubphases) {
    const icon = sp.percentage === 100 ? '✅' : sp.percentage > 0 ? '🟡' : '❌';
    progressMd += `### ${icon} Subphase ${sp.subphaseId}: ${sp.subphaseName} (${sp.percentage}%)\n\n`;
    for (const item of sp.items) {
      const check = item.completed ? '[x]' : '[ ]';
      progressMd += `- ${check} **${item.name}** \`(${item.path})\`\n`;
    }
    progressMd += `\n`;
  }

  fs.writeFileSync(PROGRESS_FILE, progressMd, 'utf8');

  // 2. Update DEADLINE.md
  let deadlineMd = `# 72-Hour Delivery Countdown & Subphase Time Budget\n\n`;
  deadlineMd += `**Target Delivery:** 72-Hour Production Submission\n`;
  deadlineMd += `**Current Completion Rate:** \`${overallPercentage}%\`\n`;
  deadlineMd += `**Status:** ${overallPercentage >= 80 ? '🟢 ON TRACK TO SHIP' : overallPercentage >= 40 ? '🟡 IN ACTIVE DEVELOPMENT' : '🚀 PHASE 1 KICKOFF'}\n\n`;

  deadlineMd += `| Subphase | Name | Allocated Time | Completion | Status |\n`;
  deadlineMd += `| :--- | :--- | :--- | :--- | :--- |\n`;

  const timeAllocations = {
    '1.1': '1.5 hrs', '1.2': '3.0 hrs', '1.3': '3.5 hrs', '1.4': '1.5 hrs', '1.5': '2.0 hrs', '1.6': '3.0 hrs',
    '2.1': '4.0 hrs', '2.2': '4.0 hrs', '2.3': '4.0 hrs', '2.4': '2.5 hrs', '2.5': '3.5 hrs',
    '3.1': '2.5 hrs', '3.2': '2.0 hrs', '3.3': '1.0 hr',  '3.4': '1.0 hr',  '3.5': '1.0 hr',  '3.6': '3.0 hrs',
  };

  for (const sp of detailedSubphases) {
    const icon = sp.percentage === 100 ? '✅' : sp.percentage > 0 ? '🟡' : '❌';
    deadlineMd += `| **${sp.subphaseId}** | ${sp.subphaseName} | ${timeAllocations[sp.subphaseId] || '2.0 hrs'} | ${sp.percentage}% | ${icon} |\n`;
  }

  deadlineMd += `\n*Run \`npm run track\` anytime to auto-refresh this countdown.*\n`;
  fs.writeFileSync(DEADLINE_FILE, deadlineMd, 'utf8');
}

function printCliSummary(evalData) {
  const { overallPercentage, detailedSubphases } = evalData;

  console.log('\n========================================================================');
  console.log('🌿 AMRUTAM AYURVEDIC SUPER APP — SUBPHASE PROGRESS TRACKER');
  console.log('========================================================================');
  console.log(`\n🏆 OVERALL COMPLETION: ${renderProgressBar(overallPercentage, 30)}\n`);

  let currentPhase = '';
  for (const sp of detailedSubphases) {
    if (sp.phaseName !== currentPhase) {
      currentPhase = sp.phaseName;
      console.log(`\n📍 ${currentPhase.toUpperCase()}`);
      console.log('------------------------------------------------------------------------');
    }
    const icon = sp.percentage === 100 ? '✅' : sp.percentage > 0 ? '🟡' : '❌';
    const label = `${sp.subphaseId} ${sp.subphaseName}`.padEnd(52);
    console.log(`${icon} ${label} ${renderProgressBar(sp.percentage, 10)} (${sp.completedCount}/${sp.totalCount})`);
  }

  console.log('\n========================================================================');
  // Find first uncompleted task
  let nextTask = null;
  let nextSubphase = null;
  for (const sp of detailedSubphases) {
    const pending = sp.items.find(i => !i.completed);
    if (pending) {
      nextTask = pending;
      nextSubphase = sp;
      break;
    }
  }

  if (nextTask) {
    console.log(`🎯 NEXT FOCUS SUBPHASE: [${nextSubphase.subphaseId}] ${nextSubphase.subphaseName}`);
    console.log(`   Task: ${nextTask.name}`);
    console.log(`   File: ${nextTask.path}`);
  } else {
    console.log('🎉 ALL 16 SUBPHASES COMPLETED & READY FOR PRODUCTION SUBMISSION!');
  }
  console.log('========================================================================\n');
}

// Execute
const evalData = evaluateProgress();
updateMarkdownFiles(evalData);
printCliSummary(evalData);

# Approach 06: Design System & Theming Engine

## 1. Ayurvedic Design Philosophy
- **Palette:** Deep Ayurvedic Forest Green (`#2D6A4F`), Sage Green (`#D8F3DC`), and Earth Herb Accent (`#D4A373`).
- **Dark Mode Support:** Harmonious dark background (`#121212`, `#1E1E1E`) with high-contrast text and warm accents.
- **Accessibility:** Minimum touch targets (44x44 dp), high contrast ratios (WCAG AA compliant), accessibility labels on all interactive icons.

## 2. Token-Driven Architecture
- Feature screens only consume design tokens (`colors`, `typography`, `spacing`, `borderRadius`).
- No hardcoded magic numbers or raw hex codes in screen components.

## 3. Shared UI Primitives (`src/shared/components/`)
- `<Button />`: Supports primary, secondary, outline, text, and loading states with haptic feedback.
- `<Card />`: Rounded, elevated container with customizable padding.
- `<Skeleton />`: Shimmering placeholder animation for loading states.
- `<EmptyState />`: SVG/icon illustration with title, subtitle, and CTA.
- `<Toast />`: Global notification system (success, warning, error, info).
- `<ErrorBoundary />`: Root-level crash catcher with restart/recovery UI.

# Issues & Troubleshooting Log

This directory contains records of issues encountered during development, builds, and runtime, along with root-cause analysis, troubleshooting procedures, and verified solutions.

---

## 📋 Quick Index

| Issue # | Title | Category | Status | Documentation |
| :--- | :--- | :--- | :--- | :--- |
| **#01** | `react-native-safe-area-context` Invalid `projectDirectory` (Stale Path in `autolinking.json`) | Android Build / Gradle / Autolinking | 🟢 Resolved | [Read Details](./01-safe-area-context-invalid-project-directory.md) |
| **#02** | `react-native-screens` Codegen `showColumn` ComponentRef Error & `MainActivity.kt` FragmentFactory Crash | Android Build / Codegen / React 19 / Navigation | 🟢 Resolved | [Read Details](./02-react-native-screens-codegen-componentref-error.md) |
| **#03** | Emulator Offline / `PropertyFetcher` TimeoutException & 50m+ Build Hang | Android Emulator / ADB / Installation | 🟢 Resolved | [Read Details](./03-emulator-offline-timeout-exception-install-hang.md) |
| **#04** | `react-native-mmkv` v3 Missing `react-native-nitro-modules` Gradle Autolinking Error | Android Build / Gradle / MMKV v3 / Nitro Modules | 🟢 Resolved | [Read Details](./04-mmkv-v3-nitro-modules-missing-dependency.md) |
| **#05** | `Can't find ViewManager 'RNSVGCircle'` Native Rebuild Requirement | Android Runtime / Native Modules / SVG | 🟢 Resolved | [Read Details](./05-rn-svg-missing-viewmanager-native-rebuild.md) |

---

## 📂 Standard Issue Template

When logging a new issue, create a new markdown file named `XX-<short-issue-name>.md` following this structure:

1. **Overview & Symptoms**: Brief summary and exact terminal/runtime error output.
2. **Environment**: OS, React Native version, Node version, Android/iOS details.
3. **Root Cause Analysis (RCA)**: Technical reason why the error happened.
4. **Resolution Steps**: Step-by-step commands to resolve and verify.
5. **Prevention / Best Practices**: How to avoid this issue going forward.

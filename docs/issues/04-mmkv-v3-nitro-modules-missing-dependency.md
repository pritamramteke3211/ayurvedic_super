# Issue #04: `react-native-mmkv` v3 Missing `react-native-nitro-modules` Gradle Autolinking Error

- **Status**: 🟢 Resolved
- **Category**: Android Build / Gradle / Autolinking / MMKV v3 / Native Modules
- **Platform**: Android (Windows OS)
- **Affects**: `./gradlew clean` / `npm run android` / `:react-native-mmkv`
- **Packages Involved**: `react-native-mmkv@3.2.0`, `react-native-nitro-modules@0.33.2`

---

## 1. Symptoms & Error Output

When running `./gradlew clean` or `npm run android` after installing `react-native-mmkv@3.x`, Gradle evaluation failed during project configuration:

```
> Configure project :react-native-mmkv
[NitroModules] ? NitroMmkv is boosted by nitro!

FAILURE: Build failed with an exception.

* Where:
Build file 'D:\RNProjects\ayurvedic_super\node_modules\react-native-mmkv\android\build.gradle' line: 145

* What went wrong:
A problem occurred evaluating project ':react-native-mmkv'.
> Project with path ':react-native-nitro-modules' could not be found in project ':react-native-mmkv'.
```

---

## 2. Root Cause Analysis (RCA)

1. **MMKV Architecture Shift (v2 vs v3)**:
   * In `react-native-mmkv` v3.x, Marc Rousavy transitioned MMKV from standard JSI bindings to **Nitro Modules** (`react-native-nitro-modules`), which provides automatic C++ code generation and cross-platform native bindings.
2. **Missing Nitro Modules Runtime**:
   * Because `react-native-nitro-modules` is a required peer dependency for `react-native-mmkv` v3, Gradle expects the `:react-native-nitro-modules` Android project to exist in the Gradle settings tree. When it was not installed, Gradle threw `Project with path ':react-native-nitro-modules' could not be found`.

---

## 3. Step-by-Step Resolution

### Step 1: Install `react-native-nitro-modules`
In the root directory:
```bash
npm install react-native-nitro-modules --legacy-peer-deps
```

### Step 2: Clean and Re-evaluate Gradle
```powershell
cd android
.\gradlew.bat clean
```

Output:
```
> Configure project :react-native-mmkv
[NitroModules] ? NitroMmkv is boosted by nitro!

> Configure project :react-native-nitro-modules
[NitroModules] ? Your app is boosted by nitro modules!

BUILD SUCCESSFUL in 1m 42s
33 actionable tasks: 21 executed, 12 up-to-date
```

---

## 4. Prevention & Best Practices

1. **Check v3 Package Release Notes**: When adopting `react-native-mmkv` 3.x, always pair it with `react-native-nitro-modules` so that C++ Nitro bindings autolink smoothly on Android and iOS.
2. **Deterministic `package.json`**: Ensure `react-native-nitro-modules` is explicitly declared in `dependencies`.

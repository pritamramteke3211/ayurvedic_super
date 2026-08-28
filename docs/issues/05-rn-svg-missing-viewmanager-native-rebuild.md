# Issue #05: `Can't find ViewManager 'RNSVGCircle' in ViewManagerRegistry` Native Rebuild Requirement

- **Status**: 🟢 Resolved
- **Category**: Android Runtime / Native Modules / ViewManager / react-native-svg
- **Platform**: Android Emulator (Pixel 8a)
- **Affects**: `react-native-svg` components rendering on Android
- **Packages Involved**: `react-native-svg@15.11.2`

---

## 1. Symptoms & Error Output

After adding SVG icons to the React Native JavaScript code, the Android app crashed on launch with a RedBox error:

```
Can't find ViewManager 'RNSVGCircle' nor 'RCTRNSVGCircle' in ViewManagerRegistry, existing names are: [DebuggingOverlay, RCTSafeAreaView, RNSScreenFooter, RNGestureHandlerDetector, RNSScreenContainer, ...]
```

---

## 2. Root Cause Analysis (RCA)

1. **Missing Native Binary Linkage in Running APK**:
   * Libraries like `react-native-svg` and `react-native-mmkv` contain native C++/Java view managers (`RNSVGCircle`, `RNSVGSvgView`, `RNSVGPath`).
   * When Metro bundler serves updated JS code that imports SVG elements, but the emulator is running an older APK compiled before `react-native-svg` was installed, React Native cannot find the native `ViewManager` in the runtime registry.
2. **Reanimated Version Incompatibility on RN 0.82**:
   * In React Native 0.82 (New Architecture default), legacy Java bridge classes like `UIManagerModuleListener` were replaced. React Native's built-in `Animated` API with `useNativeDriver: true` provides optimal 60 FPS UI-thread animations without third-party C++ bridge mismatch risks.

---

## 3. Step-by-Step Resolution

### Step 1: Use Standard Native-Driver `Animated` & Native `react-native-svg`
Ensured all animations use React Native's built-in `Animated` (`useNativeDriver: true`) and installed `react-native-nitro-modules` for MMKV v3.

### Step 2: Compile & Install Debug APK
```powershell
cd android
.\gradlew.bat installDebug
```

Output:
```
> Task :app:installDebug
Installing APK 'app-debug.apk' on 'Pixel_8a(AVD) - 16' for :app:debug
Installed on 1 device.

BUILD SUCCESSFUL in 4m 42s
```

### Step 3: Launch Application
```powershell
adb shell am start -n com.ayurvedic_super/.MainActivity
```

---

## 4. Verification

* Live screenshot confirmed: SVG vector icons (`SearchLensIcon`, `FilterFunnelIcon`, `ShieldVerifiedIcon`, `StarRatingIcon`) rendered cleanly with 0 runtime errors.

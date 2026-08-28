# Issue #01: `react-native-safe-area-context` Invalid `projectDirectory` & Emulator Launch Failure

- **Status**: 🟢 Resolved
- **Category**: Android Build / Gradle / Autolinking Cache / Emulator
- **Platform**: Android (Windows OS)
- **Affects**: `npm run android` / `react-native run-android` / `gradlew.bat app:installDebug`

---

## 1. Symptoms & Error Output

When running `npm run android` in terminal, the build process failed with two main symptoms:

### Symptom A: Android Emulator Timeout Warning
```
info Launching emulator...
error Failed to launch emulator. Reason: It took too long to start and connect with Android emulator: Pixel_8a. You can try starting the emulator manually from the terminal with: C:\Users\prita\AppData\Local\Android\Sdk/emulator/emulator @Pixel_8a.
warn Please launch an emulator manually or connect a device. Otherwise app may fail to launch.
```

### Symptom B: Gradle Build Exception on Safe Area Context Autolinking
```
FAILURE: Build failed with an exception.

* What went wrong:
Configuring project ':react-native-safe-area-context' without an existing directory is not allowed. The configured projectDirectory 'D:\React_Native\Interview\CompanyWise\21_AmrutamPharmaceuticals\ayurvedic_super\node_modules\react-native-safe-area-context\android' does not exist, can't be written to or is not a directory.

* Try:
> Make sure the project directory exists and is writable.
> Run with --scan to generate a Build Scan (Powered by Develocity).

BUILD FAILED in 27s
error Failed to install the app. Command failed with exit code 1: gradlew.bat app:installDebug -PreactNativeDevServerPort=8081
```

---

## 2. Root Cause Analysis (RCA)

### Why did Gradle reference `D:\React_Native\Interview\CompanyWise\21_AmrutamPharmaceuticals\...`?

1. **Project Directory Relocation**:
   The project codebase was relocated / copied from an older workspace path (`D:\React_Native\Interview\CompanyWise\21_AmrutamPharmaceuticals\ayurvedic_super`) into the new workspace (`D:\RNProjects\ayurvedic_super`).

2. **Cached Autolinking Metadata (`autolinking.json`)**:
   In modern React Native (0.74+), the React Native Gradle Plugin autolinks native modules using a generated file:
   `android/build/generated/autolinking/autolinking.json`
   
   Along with it, `package.json.sha` and `package-lock.json.sha` checksums are stored. Because the package hashes remained identical after moving the folder, Gradle skipped re-running autolinking generation and reused the stale `autolinking.json` which still contained hardcoded absolute paths pointing to the old directory location:
   ```json
   "root": "D:\\React_Native\\Interview\\CompanyWise\\21_AmrutamPharmaceuticals\\ayurvedic_super\\node_modules\\react-native-safe-area-context",
   "sourceDir": "D:\\React_Native\\Interview\\CompanyWise\\21_AmrutamPharmaceuticals\\ayurvedic_super\\node_modules\\react-native-safe-area-context\\android"
   ```

3. **Emulator Cold-Boot Lag**:
   React Native CLI's automated emulator launcher times out if an emulator (like `Pixel_8a`) is not already running or takes longer than the CLI timeout threshold to boot and respond to `adb`.

---

## 3. Step-by-Step Resolution

### Step 1: Terminate Active Gradle Daemons
Running daemons lock cache files in memory. Stop them first:
```powershell
cd android
.\gradlew.bat --stop
cd ..
```

### Step 2: Delete Stale Build & Autolinking Cache
Remove the cached build artifacts containing the stale path:
```powershell
# Remove generated Gradle and Autolinking build folders
Remove-Item -Recurse -Force android/build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/app/build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/.gradle -ErrorAction SilentlyContinue
```

### Step 3: Clear Metro Bundler Cache
Clear the bundler cache to ensure no old path references remain in Metro:
```powershell
npm start -- --reset-cache
```

### Step 4: Pre-launch the Android Emulator / Connect Physical Device
To avoid the emulator launch timeout, start the emulator prior to running the build:
- **Option A (Android Studio)**: Open Android Studio -> **Virtual Device Manager** -> Click **Play ▶** next to `Pixel_8a`.
- **Option B (Command Line)**:
  ```powershell
  & "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_8a
  ```
- Check that ADB recognizes the device:
  ```powershell
  adb devices
  ```
  *(Output should list your emulator as `device`)*

### Step 5: Run the Android App
Now run the app with clean autolinking and a ready emulator:
```powershell
npm run android
```

---

## 4. Verification

1. Gradle regenerates `android/build/generated/autolinking/autolinking.json` with the current workspace path:
   `D:\RNProjects\ayurvedic_super\...`
2. Autolinking for `:react-native-safe-area-context` succeeds without directory errors.
3. APK is successfully built and installed on the connected Android emulator/device.

---

## 5. Prevention & Best Practices

- **When copying or cloning a React Native project to a new path**:
  Always wipe `android/build/`, `android/app/build/`, and `android/.gradle/` before the first run.
- **Add a clean script in `package.json`** for convenience:
  ```json
  "clean:android": "cd android && gradlew clean && cd .. && rd /s /q android\\build android\\app\\build"
  ```

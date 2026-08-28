# Issue #03: Emulator Offline / DDMLib PropertyFetcher TimeoutException & 50m+ Build Hang

- **Status**: 🟢 Resolved
- **Category**: Android Emulator / ADB / DDMLib / Installation Hang
- **Platform**: Android Emulator (`Pixel_8a` / `qemu-system-x86_64`) on Windows
- **Affects**: `npm run android` / `:app:installDebug` / `adb install`

---

## 1. Symptoms & Error Output

When running `npm run android`, the Gradle build reaches 99% during the `:app:installDebug` task and hangs for 50+ minutes with repeating `TimeoutException`:

```
> Task :app:installDebug
[PropertyFetcher]: TimeoutException getting properties for device emulator-5554
java.lang.Throwable: TimeoutException getting properties for device emulator-5554
        at com.android.ddmlib.PropertyFetcher.handleException(PropertyFetcher.java:259)
        at com.android.ddmlib.PropertyFetcher$1.run(PropertyFetcher.java:213)
Caused by: com.android.ddmlib.TimeoutException
        at com.android.ddmlib.AdbHelper.read(AdbHelper.java:868)
        at com.android.ddmlib.AdbHelper.readAdbResponse(AdbHelper.java:351)

<============-> 99% EXECUTING [52m 24s]
> :app:installDebug
```

Running `adb devices` shows:
```
List of devices attached
emulator-5554	offline
```

---

## 2. Root Cause Analysis (RCA)

1. **Frozen / Zombie QEMU Process**:
   The Android Emulator (`qemu-system-x86_64.exe`) became unresponsive/hung in the background after heavy CPU usage or sleep mode.
2. **Offline ADB State**:
   When QEMU freezes, ADB cannot maintain an active socket bridge and marks `emulator-5554` as `offline`.
3. **Gradle `installDebug` Polling Loop**:
   Gradle's Android plugin uses `ddmlib`'s `PropertyFetcher` to read system properties from the target device before installing the APK. Because the socket is unresponsive, each property read times out and retries indefinitely, causing the 50+ minute hang.
4. **Codebase Status**:
   The application code and APK (`android/app/build/outputs/apk/debug/app-debug.apk`) were already 100% compiled and valid; only the device transfer was blocked.

---

## 3. Quick Resolution Steps

### Step 1: Kill the Hung Emulator Process & Reset ADB
In PowerShell / Command Prompt:
```powershell
# Kill frozen QEMU/emulator processes
Stop-Process -Name "qemu-system-x86_64", "emulator" -Force -ErrorAction SilentlyContinue

# Restart ADB server
adb kill-server
adb start-server
```

### Step 2: Cold Boot the Emulator
Start a fresh emulator session (without stale snapshot state):
```powershell
C:\Users\prita\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_8a -no-snapshot-load
```
*(Or open Android Studio -> Device Manager -> Click the down arrow on `Pixel_8a` -> **Cold Boot Now**)*

### Step 3: Fast APK Install
Once the emulator displays its home screen and `adb devices` shows `emulator-5554 device`:
```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```
Or simply run:
```powershell
npm run android
```

---

## 4. Performance Tips for Fast Builds

1. **Single Architecture in `gradle.properties`**:
   Setting `reactNativeArchitectures=x86_64` (for x86_64 PC emulators) or `arm64-v8a` (for physical phones) reduces C++ build times by **75%** because Gradle only builds 1 ABI slice instead of 4.
2. **Cold Boot on Glitches**:
   Whenever an emulator becomes laggy or shows `offline`, performing a **Cold Boot** clears hung kernel pipes and restores instant responsiveness.

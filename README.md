<div align="center">
   <h1>📱 <span style="color:#4F8A8B">Expense Tracker - Android APK Guide</span> 📱</h1>
   <img src="https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white" />
   <img src="https://img.shields.io/badge/Capacitor-%23007AFF.svg?style=for-the-badge&logo=capacitor&logoColor=white" />
   <img src="https://img.shields.io/badge/Android%20Studio-%233DDC84.svg?style=for-the-badge&logo=android-studio&logoColor=white" />
</div>

---

## 🚦 Prerequisites

- <span style="color:#339933">Node.js & npm</span> installed
- <span style="color:#007AFF">Capacitor</span> installed (`npm install @capacitor/core @capacitor/cli`)
- <span style="color:#3DDC84">Android Studio</span> installed

## 🛠️ Steps to Build APK

<details>
<summary><b>Expand for step-by-step instructions</b></summary>

1️⃣ **Install dependencies:**

```bash
npm install
```

2️⃣ **Build the web app:**

```bash
npm run build
```

3️⃣ **Initialize Capacitor (if not done):**

```bash
npx cap init
```

4️⃣ **Add Android platform:**

```bash
npm install @capacitor/android
npx cap add android
```

5️⃣ **Copy build files to Android project:**

```bash
npx cap copy
```

6️⃣ **Open Android project in Android Studio:**

```bash
npx cap open android
```

7️⃣ **In Android Studio, go to:**

```
Build > Generate App Bundles or APKs > Generate APKs
```

Wait for the build to finish.

</details>

---

## 📂 Where to Find the APK

After building, your APK will be located at:

```diff
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📲 How to Install on Your Phone

1. 🚚 **Transfer** `app-debug.apk` to your Android device (USB, email, cloud, etc.).
2. 📥 **Open** the file on your device and follow the prompts to install.
3. ⚙️ **Enable installation from unknown sources** in your device settings if prompted.

---

> ℹ️ For release (signed) APK instructions, or Play Store publishing, see the official [Capacitor Documentation](https://capacitorjs.com/docs) and [Android Documentation](https://developer.android.com/studio/publish).

---

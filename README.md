<<<<<<< HEAD

<div align="center">
  <h1>💸 Expense Tracker - Vite/React/Capacitor</h1>
  <img src="https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Capacitor-%23007AFF.svg?style=for-the-badge&logo=capacitor&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Android%20Studio-%233DDC84.svg?style=for-the-badge&logo=android-studio&logoColor=white" />
</div>

---

## 📋 Overview

A modern, full-featured Expense Tracker app built with Vite, React, TypeScript, TailwindCSS, and Capacitor. Easily track your expenses, view summaries, and run the app as a web app or Android APK.

---

## 🏗️ Architecture

- **Frontend:** React + Vite + TypeScript + TailwindCSS
- **Mobile Wrapper:** Capacitor (Android APK)
- **Backend:** Supabase (for authentication & data)

### Folder Structure

```
src/
  components/      # UI and feature components
    expenses/      # Expense-related components
    layout/        # Layout components
    ui/            # UI primitives
  hooks/           # Custom React hooks
  integrations/    # Supabase client & types
  lib/             # Utilities, validation, currency helpers
  pages/           # Page components (Auth, Index, NotFound)
  types/           # TypeScript types (e.g., expense)
```

---

## ✨ Features

- 🔒 Supabase Auth (Login, Register, Logout)
- ➕ Add expenses (category, amount, date, description)
- 📃 View expense list with real-time updates
- 🗑️ Delete expenses
- 📊 Category breakdown & monthly summary
- 💰 Currency formatting
- 🌗 Light/Dark theme toggle
- 📱 Build as Android APK (Capacitor)

---

## 🚦 Prerequisites

- Node.js & npm
- Android Studio (for APK build)
- Supabase project (for backend)

---

## 🚀 Setup & Build Instructions

1. **Clone the repo & install dependencies:**
   ```bash
   npm install
   ```
2. **Configure Supabase:**
   - Add your Supabase URL and anon key to `.env` or `src/integrations/supabase/client.ts` as needed.
3. **Run locally (web):**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```
5. **Capacitor Android APK:**
   ```bash
   npx cap init         # (if not done)
   npm install @capacitor/android
   npx cap add android
   npx cap copy
   npx cap open android
   # In Android Studio: Build > Generate APKs
   ```

---

## 📦 Data Model

**Expense Entity:**

```ts
{
  id: string;
  amount: number;
  category: "food" | "transport" | "rent" | "bills" | "other";
  date: string;
  description: string;
  createdAt: string;
}
```

**Supabase Table:**

- Table: `expenses`
- Columns: id, user_id, amount, category, date, description, created_at

---

## 📚 Dependencies

- React, React DOM, React Router
- Vite, TypeScript
- TailwindCSS
- Supabase JS
- Capacitor (core, cli, android)
- Radix UI, React Hook Form, Zod, date-fns, and more (see `package.json`)

---

## 📝 Notes

- Responsive, mobile-first UI
- Easily extendable for new features
- Follows modern React and TypeScript best practices

---

## 📄 License

# This project is open source and available for educational purposes.

> > > > > > > ba7cc176f87534c226fef048d9214f35bb1760e0

# `ARCHITECTURE.md`

## Overview

**Study Time** is a web-based productivity app built as a **Progressive Web App (PWA)** using **Vite, React, and TypeScript**, with **Firebase** providing backend services and **GitHub Actions** handling CI/CD.

The core goals of the architecture are:

- **Simplicity:** Fast to understand, easy to extend.
- **Modularity:** Clear separation between UI, state, and data access.
- **Resilience:** Automated checks (linting, tests, build) before deployment.
- **Portability:** Environment-driven configuration for Firebase and deployment.

---

## High-level architecture

### Frontend

- **Framework:** React + TypeScript
- **Bundler/Dev server:** Vite
- **UI Structure:** Component-based, with pages and shared components
- **State:** Local component state + React context (for shared concerns like auth)
- **Routing:** (Optional) React Router if multiple pages are used
- **PWA:** Configured via `manifest.json` and service worker (if enabled)

### Backend

- **Platform:** Firebase
- **Services:**
  - Firebase Authentication (optional)
  - Firestore or Realtime Database for storing study sessions
  - Firebase Hosting for serving the built app

### DevOps

- **CI/CD:** GitHub Actions
- **CI:** Linting, tests, and build on every push to `main`
- **CD:** Automatic deployment to Firebase Hosting after successful CI

---

## Project structure

> This reflects the intended structure; some folders may be added as features evolve.

```text
study-time/
│
├── src/
│   ├── components/
│   │   ├── Timer.tsx
│   │   ├── SessionList.tsx
│   │   └── Navbar.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/
│   │   └── useTimer.ts
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── services/
│   │   ├── firebase.ts
│   │   └── sessions.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│   └── manifest.json
│
├── tests/
│   ├── timer.test.ts
│   └── session.test.ts
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CI-CD.md
│   └── ENVIRONMENT.md
│
├── .github/
│   └── workflows/
│       └── firebase-ci-cd.yml
│
├── .env.example
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Frontend architecture

### Entry point

- **`main.tsx`**
  - Mounts the React app into the DOM.
  - Wraps the app with any global providers (e.g., `AuthContext`, theme providers).
  - Example responsibilities:
    - `ReactDOM.createRoot(document.getElementById('root')!)`
    - `<App />` rendering.

### Application shell

- **`App.tsx`**
  - Defines the main layout and routing.
  - Renders shared UI elements like `Navbar`.
  - Hosts page-level components such as `Home` and `Settings`.

### Components

- **`src/components/`**
  - **`Timer.tsx`**: Core Pomodoro/study timer UI.
  - **`SessionList.tsx`**: Displays past study sessions.
  - **`Navbar.tsx`**: Navigation and app identity.

Components are designed to be:

- **Presentational where possible** (UI-focused).
- **Connected to hooks/services** for behavior and data.

### Hooks

- **`src/hooks/useTimer.ts`**
  - Encapsulates timer logic (start, pause, reset, countdown).
  - Manages internal state like remaining time and status.
  - Keeps timer behavior reusable and testable.

### Context

- **`src/context/AuthContext.tsx`**
  - Provides authentication state and methods (if Firebase Auth is used).
  - Exposes current user and auth actions to the rest of the app.
  - Avoids prop drilling for auth-related data.

### Services

- **`src/services/firebase.ts`**
  - Initializes the Firebase app using environment variables:
    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`
  - Exports initialized Firebase services (e.g., `app`, `db`, `auth`).

- **`src/services/sessions.ts`**
  - Provides functions to interact with the database:
    - `createSession`
    - `getSessions`
    - `deleteSession`
  - Abstracts away direct Firestore/Realtime Database calls from UI components.

---

## Environment configuration

Environment variables are used to keep secrets and environment-specific values out of the codebase.

- **`.env`**
  - Local, untracked file containing real values.
  - Example keys:
    - `VITE_FIREBASE_API_KEY=...`
    - `VITE_FIREBASE_AUTH_DOMAIN=...`
    - etc.

- **`.env.example`**
  - Tracked file with the same keys but empty values.
  - Documents what is required to run the project.

Vite exposes these variables via `import.meta.env.VITE_*`.

---

## CI/CD architecture

### CI/CD workflow

Located at: `.github/workflows/firebase-ci-cd.yml`

**Triggers:**

- `push` to `main`

**Steps:**

1. **Checkout code**
2. **Set up Node**
3. **Install dependencies**
4. **Run ESLint**
5. **Run tests** (if present)
6. **Build the project** (`npm run build`)
7. **Deploy to Firebase Hosting** using `FirebaseExtended/action-hosting-deploy`

**Guardrails:**

- Deployment only occurs if:
  - Linting passes
  - Tests pass
  - Build succeeds

### Firebase deployment

- **Hosting target:** `dist/` (Vite build output)
- **Service account:** Provided via `FIREBASE_SERVICE_ACCOUNT` GitHub secret.
- **Channel:** `live` (production deployment).

---

## Branching and workflow

- **`main` branch**
  - Represents production-ready code.
  - Protected via CI (and optionally branch protection rules).
  - CI/CD runs on every push.

- **Feature branches**
  - Named like `feature/pomodoro-timer`, `feature/auth`, etc.
  - Used for isolated development.
  - Merged into `main` via pull requests.

This keeps the `main` branch stable while allowing iterative feature development.

---

## Design principles

- **Modularity:** UI, logic, and data access are separated into components, hooks, and services.
- **Testability:** Core logic (e.g., timer behavior, session handling) is placed in functions/hooks that can be unit tested.
- **Clarity:** Folder structure reflects domain concepts (sessions, timer, auth) rather than arbitrary groupings.
- **Scalability:** The architecture supports adding:
  - More pages
  - More Firebase services
  - Additional CI steps (e.g., Lighthouse, type-checking)

---

## Future extensions

Potential future improvements that the current architecture can support:

- Add **React Router** for multi-page navigation.
- Add **role-based features** using Firebase Auth and Firestore rules.
- Add **analytics** (e.g., tracking study trends over time).
- Add **offline support** and richer PWA behavior.
- Add **staging environment** using Firebase Hosting channels and separate GitHub Actions workflows.


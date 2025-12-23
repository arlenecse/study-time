# `ENVIRONMENT.md`

## Overview

This document explains how environment variables are managed in the **Study Time** application. Environment variables are used to store configuration values that differ between environments (local development, CI, production) and should **never** be hard‑coded in the source code.

The project uses:

- **Vite** for environment variable loading  
- **Firebase** for backend services  
- **GitHub Actions** for CI/CD  

Vite requires all environment variables to begin with the prefix:

```
VITE_
```

This ensures they are safely exposed to the frontend at build time.

---

## File Structure

The project uses two environment files:

### `.env` (local, private)
- Contains **real secrets**
- **Not committed** to Git
- Used during local development

### `.env.example` (public, safe)
- Contains the same keys as `.env` but with **empty values**
- **Committed** to Git
- Documents what variables are required

Your project root should look like:

```
study-time/
│
├── .env               # private, ignored
├── .env.example       # public, committed
└── ...
```

---

## Required Environment Variables

The app uses Firebase for hosting, authentication, and data storage. Firebase provides a configuration object when you create a Web App in the Firebase Console.

These values map directly into your `.env` file.

### Variables

| Variable | Description |
|---------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain for Firebase Auth |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket name |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

### Example `.env` file

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### Example `.env.example` file

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Where to Find These Values

You can retrieve your Firebase configuration from:

**Firebase Console → Project Settings → Your Apps → Web App → SDK Setup & Configuration**

Firebase will show a snippet like:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Copy each value into your `.env` file using the `VITE_` prefix.

---

## How Environment Variables Are Used

Inside your code (typically `src/services/firebase.ts`), variables are accessed using:

```ts
import.meta.env.VITE_FIREBASE_API_KEY
```

Vite injects these values at build time.

---

## Environment Variables in CI/CD

The CI/CD pipeline builds the project before deploying to Firebase Hosting. If your build requires environment variables, you must add them to GitHub Actions secrets.

### Adding secrets in GitHub

1. Go to **GitHub → Repository → Settings → Secrets → Actions**
2. Add each variable as a new secret:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.

These secrets can then be injected into the workflow if needed.

---

## Security Notes

- Never commit `.env`  
- Never hard‑code Firebase keys in source files  
- Never share your `.env` values publicly  
- `.env.example` is safe to commit because it contains no secrets  

---

## Summary

- `.env` contains real values and is ignored by Git  
- `.env.example` documents required variables  
- Firebase config values come from the Firebase Console  
- Vite exposes variables via `import.meta.env`  
- CI/CD can use GitHub Secrets for production builds  
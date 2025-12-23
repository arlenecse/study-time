# `FIREBASE.md`

## Overview

This document explains how **Firebase** is used in the **Study Time** application, including setup, configuration, environment variables, and deployment. Firebase provides hosting, authentication, and database services for the app, enabling a fully serverless architecture.

The project uses:

- **Firebase Hosting** — to serve the production build  
- **Firebase Authentication** (optional) — to manage user accounts  
- **Firestore** or **Realtime Database** — to store study session data  
- **Firebase SDK** — to initialize and interact with Firebase services  

---

## Firebase Services Used

### 1. Firebase Hosting  
Used to deploy and serve the built Vite application from the `dist/` directory.

### 2. Firestore (or Realtime Database)  
Stores user study sessions, timestamps, and other app data.

### 3. Firebase Authentication (optional)  
Provides user login and identity management.

### 4. Firebase Web SDK  
Used in the frontend to initialize Firebase and access services.

---

## Project Setup

### 1. Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **Add project**
3. Choose a name (e.g., `study-time`)
4. Disable Google Analytics (optional)
5. Create the project

---

### 2. Add a Web App

Inside your Firebase project:

1. Go to **Project Overview**
2. Click **</> Add app**
3. Register the app (e.g., `study-time-web`)
4. Firebase will show a configuration snippet like:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

These values are used in your `.env` file.

---

## Environment Variables

Firebase configuration values are stored in `.env` and loaded by Vite.

### `.env` (private)

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### `.env.example` (public)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These variables are accessed in code using:

```ts
import.meta.env.VITE_FIREBASE_API_KEY
```

---

## Firebase Initialization

Firebase is initialized in:

```
src/services/firebase.ts
```

Example:

```ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
```

Additional services (Firestore, Auth, etc.) can be initialized here as needed.

---

## Firebase Hosting Setup

### 1. Install Firebase CLI

```
npm install -g firebase-tools
firebase login
```

### 2. Initialize Hosting

```
firebase init hosting
```

Choose:

- **Use existing project**
- **dist** as the public directory
- **Single-page app** → yes
- Do not overwrite `index.html`

This creates:

```
firebase.json
.firebaserc
```

---

## Deployment

### Local Deployment (optional)

```
npm run build
firebase deploy
```

### CI/CD Deployment (recommended)

Deployment is automated via GitHub Actions using:

```
FirebaseExtended/action-hosting-deploy
```

The CI/CD workflow:

- Builds the project  
- Deploys the `dist/` folder to Firebase Hosting  
- Uses a service account stored in GitHub Secrets  

See `CI-CD.md` for full details.

---

## Firebase Service Account for CI/CD

To allow GitHub Actions to deploy:

1. Go to **Project Settings → Service Accounts**
2. Click **Generate new private key**
3. Copy the JSON
4. Add it to GitHub Secrets as:

```
FIREBASE_SERVICE_ACCOUNT
```

This is used by the deployment step in the workflow.

---

## Firestore / Database Structure (Example)

If you store study sessions, a typical Firestore structure might look like:

```
sessions/
  {sessionId}/
    userId: string
    duration: number
    timestamp: Date
```

Or for Realtime Database:

```
sessions/
  userId/
    sessionId/
      duration: number
      timestamp: number
```

You can document your exact schema here once implemented.

---

## Security Rules (Optional)

You can add Firestore or Realtime Database rules to restrict access based on authentication.

Example Firestore rule:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## Summary

Firebase provides:

- Hosting for the production build  
- Authentication (optional)  
- Database for storing study sessions  
- A simple deployment pipeline via GitHub Actions  

The app uses environment variables to configure Firebase securely, and CI/CD ensures that only valid builds are deployed.

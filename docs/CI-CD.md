# `CI-CD.md`

## Overview

This document describes the **Continuous Integration (CI)** and **Continuous Deployment (CD)** pipeline for the **Study Time** application. The pipeline is implemented using **GitHub Actions** and deploys the production build to **Firebase Hosting** whenever changes are pushed to the `main` branch.

The goals of this pipeline are:

- Ensure code quality through automated linting and testing  
- Guarantee that only valid builds reach production  
- Automate deployment to reduce manual steps  
- Maintain a predictable, stable `main` branch  

---

## Workflow Summary

The CI/CD pipeline runs automatically on:

```
push to main
```

The workflow performs the following steps in order:

1. **Checkout repository**
2. **Set up Node.js**
3. **Install dependencies**
4. **Run ESLint**
5. **Run tests** (if present)
6. **Build the project**
7. **Deploy to Firebase Hosting**

If any step fails, the workflow stops and deployment does not occur.

---

## File Location

The workflow file lives at:

```
.github/workflows/firebase-ci-cd.yml
```

This file is committed to the repository and version‑controlled like any other part of the codebase.

---

## Workflow Configuration

Below is the full workflow used for CI/CD:

```yaml
name: CI/CD to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build-test-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Run ESLint
        run: npm run lint

      - name: Run tests
        run: npm test --if-present

      - name: Build project
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          channelId: live
```

---

## Firebase Deployment Setup

### 1. Create a Firebase Service Account

To allow GitHub Actions to deploy to Firebase:

1. Go to **Firebase Console → Project Settings → Service Accounts**
2. Select **Generate new private key**
3. Copy the JSON contents

### 2. Add the Service Account to GitHub Secrets

In your GitHub repository:

- Go to **Settings → Secrets → Actions**
- Create a new secret named:

```
FIREBASE_SERVICE_ACCOUNT
```

- Paste the JSON from the service account

This secret is used by the deployment step in the workflow.

---

## Environment Variables

The build step requires Firebase configuration values. These are stored in:

- `.env` (local, not committed)
- GitHub Actions secrets (for production)

Your `.env.example` documents the required variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

In GitHub Actions, these values should be added as secrets if needed for build‑time behavior.

---

## Branching Strategy

The pipeline is designed around a simple, professional workflow:

### `main` branch
- Represents production-ready code  
- Protected by CI  
- Automatically deployed on push  

### Feature branches
- Named like `feature/timer`, `feature/auth`, etc.  
- Merged into `main` via pull requests  
- CI runs on PRs (optional enhancement)

This ensures that only validated, working code reaches production.

---

## Why CI/CD Matters

This pipeline ensures:

- **Consistency:** Every deployment follows the same steps  
- **Quality:** Code must pass linting, tests, and build before deployment  
- **Speed:** No manual deployment steps  
- **Safety:** Prevents broken builds from reaching users  

It mirrors the workflow used by real engineering teams and supports scalable development practices.

---

## Future Enhancements

The current pipeline is intentionally simple. Future improvements may include:

- **Preview deployments** for pull requests  
- **Staging vs production channels**  
- **Automated Lighthouse performance audits**  
- **Caching node_modules** to speed up CI  
- **Type-checking as a separate CI step**  
- **Slack/Discord notifications on deploy**  

The architecture supports these extensions without major changes.

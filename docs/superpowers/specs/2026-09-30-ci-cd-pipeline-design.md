# CI/CD Pipeline & Automated Testing Design Specification

- **Project**: Wedding Wishes Carousel (React 18 + Vite)
- **Date**: 2026-09-30
- **Status**: Approved

## 1. Objectives & Scope
Add an automated continuous integration and continuous deployment (CI/CD) pipeline using GitHub Actions, ensuring code quality and deployment safety through:
1. Lint checking with modern ESLint 9 flat configuration.
2. Automated unit testing with Vitest and React Testing Library.
3. Production build validation.
4. Automated deployment of production assets (`dist/`) to GitHub Pages on merges/pushes to `main` / `master`.

---

## 2. Dependencies & Tooling Setup

### 2.1 Dependencies to Install
We will install the following dev dependencies:
- **Linting**:
  - `eslint`: Core linter
  - `@eslint/js`: ESLint recommended JavaScript rules
  - `eslint-plugin-react`: React JSX lint rules
  - `eslint-plugin-react-hooks`: Rules of hooks
  - `eslint-plugin-react-refresh`: Fast Refresh support
  - `globals`: Browser and Node environment globals
- **Testing**:
  - `vitest`: Vite-native test runner
  - `jsdom`: Simulated browser DOM environment
  - `@testing-library/react`: React component testing utilities
  - `@testing-library/jest-dom`: Custom jest matchers for DOM assertions
  - `@testing-library/user-event`: User interaction simulation

### 2.2 Configuration Files
1. **`eslint.config.js`**:
   - Modern Flat Config targeting `.js` and `.jsx` files.
   - Ignores `dist/` and `node_modules/`.
   - Incorporates JavaScript recommended, React recommended, and React hooks rules.
   - Configures browser globals (`window`, `document`, etc.).
2. **`vite.config.js`**:
   - Add `base: './'` for relative asset paths (compatible with GitHub Pages repository URLs).
   - Add `test` configuration:
     - `globals: true`
     - `environment: 'jsdom'`
     - `setupFiles: './src/test/setup.js'`
3. **`src/test/setup.js`**:
   - Imports `@testing-library/jest-dom/vitest`.
   - Mocks browser APIs like `HTMLCanvasElement.prototype.getContext` and `window.Audio` if needed for testing canvas/audio elements in `App.jsx`.
   - Calls `@testing-library/react` cleanup after each test.

### 2.3 NPM Scripts in `package.json`
```json
{
  "scripts": {
    "dev": "vite --host --port 5173",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## 3. Unit Tests Implementation
1. **`src/wishesData.test.js`**:
   - Validates that `wishesData` is an array and contains records.
   - Verifies each record has valid properties (`id`, `name`, `wish`).
2. **`src/App.test.jsx`**:
   - Tests initial render of `App`.
   - Tests that main heading and wish cards render properly.
   - Verifies navigation controls (e.g. Next / Previous buttons) advance the carousel.

---

## 4. GitHub Actions CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

### 4.1 Triggers
- Pushes to branches `main` or `master`.
- Pull requests targeting `main` or `master`.
- Manual trigger via `workflow_dispatch`.

### 4.2 Job Architecture
```
[ Push / PR Event ]
        │
        ▼
   [ Job 1: ci ]
   ├── actions/checkout@v4
   ├── actions/setup-node@v4 (node-version: 20, cache: 'npm')
   ├── npm ci
   ├── npm run lint
   ├── npm run test
   ├── npm run build
   └── actions/upload-pages-artifact@v3 (only on push to main/master)
        │
        │ (On push to main/master only)
        ▼
   [ Job 2: deploy ]
   ├── Permissions: pages: write, id-token: write
   └── actions/deploy-pages@v4
```

### 4.3 Error Handling & Safety
- If linting or tests fail in Job 1, the workflow halts and fails immediately, preventing deployment.
- Branch filtering ensures pull requests only validate (run CI) without triggering production deployment.

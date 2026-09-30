# CI/CD Pipeline & Automated Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish an automated CI/CD pipeline using GitHub Actions with ESLint 9 linting, Vitest unit tests, production build verification, and deployment to GitHub Pages.

**Architecture:** Install ESLint 9 and Vitest testing dependencies in `package.json`. Configure `eslint.config.js` and `vite.config.js` for linting and jsdom test environment. Write unit tests for data validation and component rendering. Create `.github/workflows/ci-cd.yml` defining the two-stage pipeline (CI validation job and Pages deployment job).

**Tech Stack:** React 18, Vite 6, Tailwind CSS 3, ESLint 9, Vitest, `@testing-library/react`, GitHub Actions.

## Global Constraints
- Node.js version floor: >= 18
- ESLint: version 9 flat configuration (`eslint.config.js`)
- Test runner: Vitest with jsdom environment
- Workflow path: `.github/workflows/ci-cd.yml`
- Deployment target: GitHub Pages via `actions/deploy-pages@v4` on `main`/`master`

---

### Task 1: Install Dependencies and Configure Linting & Testing Tools

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `eslint.config.js`
- Create: `src/test/setup.js`

**Interfaces:**
- Consumes: None
- Produces: `npm run lint` and `npm run test` npm scripts

- [ ] **Step 1: Install Dev Dependencies**
Run npm install for eslint and vitest packages:
```bash
npm install -D eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Update `package.json` scripts**
Add `"lint"`, `"test"`, and `"test:watch"` scripts to `package.json`:
```json
"scripts": {
  "dev": "vite --host --port 5173",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Create `eslint.config.js`**
Create modern flat ESLint configuration:
```js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: '18.3' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
```

- [ ] **Step 4: Update `vite.config.js`**
Configure base relative path and Vitest jsdom test settings:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
```

- [ ] **Step 5: Create `src/test/setup.js`**
Setup testing environment and mocks:
```js
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock HTMLCanvasElement.prototype.getContext for canvas animations
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
}));

// Mock Audio
window.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  currentTime: 0,
  loop: false,
  volume: 1,
}));
```

- [ ] **Step 6: Run `npm run lint` and verify output**
Run: `npm run lint`
Expected: Passes or reports any minor lint warnings (no fatal errors).

- [ ] **Step 7: Commit Task 1 changes**
```bash
git add package.json package-lock.json eslint.config.js vite.config.js src/test/setup.js
git commit -m "chore: configure ESLint 9, Vitest, and testing environment"
```

---

### Task 2: Implement Unit Tests

**Files:**
- Create: `src/wishesData.test.js`
- Create: `src/App.test.jsx`

**Interfaces:**
- Consumes: `src/wishesData.js`, `src/App.jsx`
- Produces: Test suites verified by `npm run test`

- [ ] **Step 1: Write `src/wishesData.test.js`**
```javascript
import { describe, it, expect } from 'vitest';
import { wishesData } from './wishesData';

describe('wishesData dataset', () => {
  it('is a non-empty array of wish objects', () => {
    expect(Array.isArray(wishesData)).toBe(true);
    expect(wishesData.length).toBeGreaterThan(0);
  });

  it('contains valid wish items with required properties', () => {
    wishesData.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('wish');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
      expect(typeof item.wish).toBe('string');
      expect(item.name.trim().length).toBeGreaterThan(0);
      expect(item.wish.trim().length).toBeGreaterThan(0);
    });
  });

  it('has unique IDs for every entry', () => {
    const ids = wishesData.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Write `src/App.test.jsx`**
```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App component', () => {
  it('renders the header and primary wedding wishes container', () => {
    render(<App />);
    // Check main title or header exists
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders carousel navigation controls', () => {
    render(<App />);
    const prevButton = screen.getByRole('button', { name: /previous|prev|←/i });
    const nextButton = screen.getByRole('button', { name: /next|→/i });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('displays a wish message card on screen', () => {
    render(<App />);
    const wishCards = screen.getAllByRole('article');
    expect(wishCards.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run `npm run test` and verify tests pass**
Run: `npm run test`
Expected: 2 test files passed, 0 failed.

- [ ] **Step 4: Commit Task 2 changes**
```bash
git add src/wishesData.test.js src/App.test.jsx
git commit -m "test: add unit tests for wishesData and App component"
```

---

### Task 3: Create GitHub Actions CI/CD Workflow

**Files:**
- Create: `.github/workflows/ci-cd.yml`

**Interfaces:**
- Consumes: `npm run lint`, `npm run test`, `npm run build`
- Produces: GitHub Actions workflow configuration

- [ ] **Step 1: Create `.github/workflows/ci-cd.yml`**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  ci:
    name: Lint, Test & Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Lint
        run: npm run lint

      - name: Run Unit Tests
        run: npm run test

      - name: Run Build
        run: npm run build

      - name: Upload GitHub Pages artifact
        if: github.event_name != 'pull_request' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    name: Deploy to GitHub Pages
    needs: ci
    if: github.event_name != 'pull_request' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
      contents: read
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit Task 3 changes**
```bash
git add .github/workflows/ci-cd.yml
git commit -m "ci: add GitHub Actions CI/CD pipeline workflow"
```

---

### Task 4: Complete End-to-End Validation & Hygiene

**Files:**
- Any tracked files needing lint/test fixes

**Interfaces:**
- Consumes: All project files
- Produces: Clean passing test and lint runs, successful build output

- [ ] **Step 1: Execute `npm run lint`**
Verify zero errors. Fix any lingering lint issues if needed.

- [ ] **Step 2: Execute `npm run test`**
Verify all tests pass cleanly.

- [ ] **Step 3: Execute `npm run build`**
Verify the production bundle compiles into `dist/` without errors.

- [ ] **Step 4: Final commit and status check**
Verify `git status` is clean.

# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository layout

- Root (`react-ui-kit/`)
  - Minimal `package.json` (Storybook addons only) and `pnpm-lock.yaml`.
  - The actual Nx monorepo and UI kit source live under `my-ui-library/`.
- Nx workspace root: `my-ui-library/`
  - Apps:
    - `apps/playground/` → React app for interactive development of the UI kit. NPM package name: `@my-ui-library/react-ui-kit`.
    - `apps/storybook/` → Storybook host app. NPM package name: `@my-ui-library/storybook`.
  - Libraries:
    - `packages/core/` → Core theming, shared types, and utilities. NPM package: `@my-ui/core`.
    - `packages/components/` → React UI components. NPM package: `@my-ui/components`.
    - `packages/icons/` → Icon components. NPM package: `@my-ui/icons`.
    - `packages/tokens/` → Design tokens library. NPM package: `@my-ui/tokens`.
  - E2E tests:
    - `e2e/` → Cypress E2E project `@my-ui-library/react-ui-kit-e2e` targeting the playground app.

Most commands should be run from `my-ui-library/` unless otherwise noted.

## Tooling overview

- Monorepo & task runner: Nx 21 (workspace config in `my-ui-library/nx.json`).
- Package manager: pnpm (top-level `pnpm-lock.yaml`).
- Bundler/dev server: Vite (per-app configs in `apps/*/vite.config.ts`).
- Unit tests: Vitest (workspace config in `my-ui-library/vitest.config.ts`).
- E2E tests: Cypress via `@nx/cypress` preset (`e2e/cypress.config.ts`).
- Storybook: Storybook 9 via `@nx/storybook` plugin and the `apps/storybook` app.

## Installation & workspace-level commands

From the repo root:

```bash
cd my-ui-library
pnpm install
```

Common Nx inspection commands (from `my-ui-library/`):

- Show all Nx projects and dependency graph:
  - `pnpm exec nx graph`
- Show details for a specific project (e.g. core library):
  - `pnpm exec nx show project core`

## Running apps

All commands below assume the working directory is `my-ui-library/`.

### Playground app (`@my-ui-library/react-ui-kit`)

- Start dev server (Vite) for local development:
  - `pnpm exec nx run @my-ui-library/react-ui-kit:dev`
- Production build of the playground app:
  - `pnpm exec nx run @my-ui-library/react-ui-kit:build`
- Preview the production build (used also by E2E CI):
  - `pnpm exec nx run @my-ui-library/react-ui-kit:preview`

### Storybook app (`@my-ui-library/storybook`)

- Run Storybook in dev mode:
  - `pnpm exec nx storybook @my-ui-library/storybook`
  - (equivalent explicit form: `pnpm exec nx run @my-ui-library/storybook:storybook`)
- Build static Storybook site:
  - `pnpm exec nx build-storybook @my-ui-library/storybook`

## Building libraries

Nx infers build targets for libraries using the `@nx/vite` and `@nx/js/typescript` plugins. Typical build commands:

- Core design system library (`@my-ui/core`):
  - `pnpm exec nx build core`
- Tokens library (`@my-ui/tokens`):
  - `pnpm exec nx build tokens`

When adding new libraries, prefer using Nx generators so that build/test targets are wired automatically.

## Unit testing (Vitest)

Vitest is configured at `my-ui-library/vitest.config.ts`. Nx wires the `test` target for apps and libraries to Vitest via the `@nx/vite` plugin. Target defaults in `nx.json` ensure `test` depends on the `build` of dependent projects.

Typical unit test commands (run from `my-ui-library/`):

- Core library:
  - `pnpm exec nx test core`
- Tokens library:
  - `pnpm exec nx test tokens`
- Components library:
  - `pnpm exec nx test @my-ui/components`
- Icons library:
  - `pnpm exec nx test @my-ui/icons`

Vitest includes tests under:

- `packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`
- `apps/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`

Coverage is enabled globally with V8 and excludes dist outputs, stories, indexes, and E2E files.

### Running a single test file or test case

Nx forwards arguments after `--` directly to Vitest. To scope tests:

- Run a single spec file for the core library:
  - `pnpm exec nx test core -- packages/core/src/lib/core.spec.ts`
- Run tests matching a specific name (Vitest `-t` filter):
  - `pnpm exec nx test core -- -t "should do something"`

Adjust the project name and path as needed for other libraries or apps.

## E2E testing (Cypress)

The E2E project `@my-ui-library/react-ui-kit-e2e` lives in `my-ui-library/e2e/` and uses `@nx/cypress` with a Vite bundler. The Cypress config (`e2e/cypress.config.ts`) is wired to spin up the playground app with Nx:

- Default dev web server command:
  - `pnpm exec nx run @my-ui-library/react-ui-kit:dev`
- Production/CI web server command:
  - `pnpm exec nx run @my-ui-library/react-ui-kit:preview`

Typical Nx E2E commands (from `my-ui-library/`):

- Run the E2E suite against a dev server:
  - `pnpm exec nx e2e @my-ui-library/react-ui-kit-e2e`

If you need to debug in the Cypress GUI, use the `open-cypress` target (name defined by the `@nx/cypress` plugin):

- `pnpm exec nx open-cypress @my-ui-library/react-ui-kit-e2e`

## High-level architecture

### Design system layering

The UI kit is structured as a layered design system:

1. **Tokens layer** (`packages/tokens/` and CSS tokens in `packages/core/src/styles/tokens.css`)
   - Provides raw design tokens (colors, etc.) and a placeholder `tokens()` API.
   - Core library imports `tokens.css` at its entrypoint (`packages/core/src/index.ts`) to expose CSS variables to consumers.

2. **Core layer** (`packages/core/` → `@my-ui/core`)
   - **Theme management** (`lib/theme.ts`):
     - Defines `Theme` union (`'light' | 'dark' | 'high-contrast'`).
     - Exposes a `themes` map with CSS variable sets per theme.
     - Provides `applyTheme(theme)`, `getTheme()`, and `toggleTheme()` helpers that operate on `document.documentElement` and manage a `data-theme` attribute plus CSS variables.
   - **Shared types** (`lib/types.ts`):
     - Central place for common UI types: `Size`, `ColorVariant`, `Variant`, `ValidationState`, `LoadingState`, `Alignment`, `Position`, `AnimationDuration`, `Breakpoint`, `ResponsiveValue<T>`, and shared prop interfaces like `BaseProps`, `DisableableProps`, `LoadableProps`, `WithChildren`, `WithIcon`, `FormProps`, `ClickableProps`, and `InteractiveProps`.
     - These types are intended to be reused across all component libraries to keep API shapes consistent.
   - **Utilities** (`lib/utils.ts`):
     - `cn()` – Tailwind-aware class name merge using `clsx` + `tailwind-merge`.
     - Interaction helpers: `debounce`, `throttle`.
     - ID, environment, and storage helpers: `generateId`, `isBrowser`, `getStorageItem`, `setStorageItem`.
     - Formatting/text helpers: `formatFileSize`, `capitalize`, `truncate`.
   - `src/index.ts` re-exports the theme utilities, core types, and utils so consumers import from `@my-ui/core` directly.

3. **Component and icon layers**

   - **Components library** (`packages/components/` → `@my-ui/components`)
     - Intended to host actual UI components built on top of the core layer (types, tokens, utilities).
     - Current structure:
       - `src/index.ts` re-exports from `./lib/Button` (actual component implementation is expected to live under `src/lib/`).
       - `src/lib/` is the place for concrete React components (a placeholder `components.tsx` exists as a scaffold).
     - Unit tests live under `src/lib/*.spec.tsx` and are wired through Vitest.

   - **Icons library** (`packages/icons/` → `@my-ui/icons`)
     - Intended home for icon components and related utilities.
     - Current implementation is a scaffold (`MyUiIcons` component) with tests in `src/lib/icons.spec.tsx`.

   - **Tokens library** (`packages/tokens/` → `@my-ui/tokens`)
     - Provides a tokens API in `src/lib/tokens.ts` (currently a placeholder) and unit tests.
     - At runtime, CSS-level tokens are primarily surfaced through the `@my-ui/core` entrypoint and `tokens.css`.

### Applications and testing surface

- **Playground app** (`apps/playground/` → `@my-ui-library/react-ui-kit`)
  - Standard Nx React + React Router app with routes defined in `src/app/app.tsx`.
  - Intended as a manual testing surface for components and themes from `@my-ui/core`, `@my-ui/components`, and `@my-ui/icons`.

- **Storybook app** (`apps/storybook/` → `@my-ui-library/storybook`)
  - Hosts Storybook 9, configured through Nx’s Storybook plugin.
  - Use this app to build out component documentation and interactive examples.

- **E2E project** (`e2e/` → `@my-ui-library/react-ui-kit-e2e`)
  - Cypress tests (e.g. `src/e2e/app.cy.ts`) exercise the playground app in a browser, using Nx’s `nxE2EPreset` with Vite-driven dev and preview servers.
  - The test helpers (e.g. `support/app.po.ts`, `support/commands.ts`) encapsulate common interactions like logging in and reading the greeting.

## Nx-specific notes

- Nx plugins configured in `nx.json`:
  - `@nx/js/typescript` – typechecking and library builds.
  - `@nx/react/router-plugin` – React app routing integration with `build`, `dev`, `start`, and related targets.
  - `@nx/eslint/plugin` – `lint` target across projects.
  - `@nx/vite/plugin` – `build`, `test`, `dev`, `preview`, etc., using Vite/Vitest.
  - `@nx/cypress/plugin` – E2E and Cypress GUI targets.
  - `@nx/storybook/plugin` – `storybook`, `build-storybook`, and related targets.
- `targetDefaults` in `nx.json` configure `test` to depend on `^build`, so running `nx test` for a project will ensure its dependencies are built first.

When adding new apps or libraries, prefer Nx generators (`pnpm exec nx g ...`) so that targets, TS configs, and inter-project dependencies stay consistent with the existing structure.

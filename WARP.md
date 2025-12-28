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

## Pautas de estilos y theming del UI Kit

Estas reglas definen cómo se implementan los estilos y los temas en la librería.

### Estilos por componente

- Cada componente React debe tener su propio archivo de estilos:
  - `ComponentName.tsx`
  - `ComponentName.module.css`
- Se usan **solo CSS Modules** (`*.module.css`) para estilos de componentes.
- No se permiten estilos globales, salvo:
  - Reset/base global del kit.
  - Definición de design tokens y temas (variables CSS).
- Convenciones dentro de `*.module.css`:
  - Clase raíz del componente: `root`.
  - Clases internas descriptivas: `icon`, `label`, `content`, etc.
- No se usan frameworks de utilidades (Tailwind) ni clases utilitarias dentro de la librería, salvo decisión explícita futura.

### Design tokens

- Los **design tokens** (colores, tipografías, espaciados, radios, etc.) se definen en código fuente (por ejemplo en `src/tokens`).
- Los tokens se exponen a los componentes y a las apps mediante **variables CSS**:
  - Ejemplos: `--color-primary`, `--spacing-sm`, `--radius-md`, `--font-button`.
- Los componentes nunca deben hardcodear valores visuales directos (hex, px, etc.) cuando exista un token adecuado.
  - Siempre que sea posible, usar `var(--token)`.

### Theming

- El theming se basa en **atributos/clases de tema** que cambian el set de variables CSS activas.
- Convención por defecto:
  - El tema se selecciona con `data-theme` en un nodo root (`html`, `body` o un contenedor alto).
  - Ejemplos: `data-theme="light"`, `data-theme="dark"`.
- La librería define estilos de tema en CSS, por ejemplo:
  - `:root, :root[data-theme='light'] { ... }`
  - `:root[data-theme='dark'] { ... }`
- Los componentes solo leen variables (`var(--color-primary)`, etc.) y no conocen el tema activo.
- La app consumidora es responsable de:
  - Establecer el atributo `data-theme`.
  - Cambiarlo cuando quiera alternar entre temas.

### API de theming en `@my-ui/core`

- El core expone un tipo central de tema como **string enum**:
  - `Theme.Light = 'light'`, `Theme.Dark = 'dark'` (y futuros temas como `HighContrast`).
- Helpers disponibles:
  - `applyTheme(theme: Theme)` → aplica el tema estableciendo `data-theme` en `document.documentElement`.
  - `getTheme(): Theme | null` → devuelve el tema actual leído de `data-theme`.
  - `toggleTheme(): Theme` → alterna entre light/dark y devuelve el nuevo valor.
- Estos helpers nunca modifican estilos directamente; solo gestionan el atributo `data-theme`. Todo el aspecto visual se resuelve mediante variables CSS.

### Tokens y enums compartidos

- Los design tokens en TypeScript viven centralizados en `@my-ui/tokens` (por ejemplo, `color`, `spacing`, `radius`, `font`).
- `@my-ui/core` re-exporta:
  - Un objeto `tokens` de solo lectura.
  - Tipos derivados (`ColorToken`, `SpacingToken`, etc.) y, opcionalmente, helpers (`getColor`, `getSpacing`, ...).
- Los componentes deben usar **enums y tipos compartidos** definidos en `@my-ui/core` para props repetidas, por ejemplo:
  - `ButtonVariant`, `ButtonSize`, `TagVariant`, `Intent`, etc.
- Regla: no definir variantes como strings sueltas en cada componente; siempre reutilizar los enums/tipos centrales para mantener un lenguaje común en todo el sistema.

## Pautas de accesibilidad del UI Kit

Estas reglas aplican a **todos los componentes nuevos** y a cualquier cambio significativo en componentes existentes.

### Principios generales

- Todos los elementos interactivos deben ser navegables con teclado usando `Tab` / `Shift+Tab`.
- Todos los elementos interactivos deben mostrar **un indicador de foco visible y claro**.
  - No está permitido eliminar el `outline` sin proporcionar una alternativa equivalente o mejor.
- Siempre que exista un elemento HTML semántico adecuado, se debe usar:
  - `button` en lugar de `div` clickable.
  - `a` para enlaces reales.
  - `label` asociado a `input` para campos de formulario.
- ARIA se usa solo para **complementar** o cuando no exista alternativa semántica nativa.
  - Ejemplos: `aria-expanded`, `aria-pressed`, `aria-selected`, `aria-invalid`, `aria-describedby`.

### Nombres accesibles y estados

- Cada control debe tener un **nombre accesible**:
  - Texto visible dentro del componente, o
  - `aria-label`, o
  - `aria-labelledby` apuntando a un texto visible.
- Inputs y campos de formulario:
  - Deben tener `label` asociado (`htmlFor` + `id`).
  - Deben marcar errores usando `aria-invalid` y, cuando haya mensaje de error, enlazarlo con `aria-describedby`.
- Estados importantes (disabled, error, selected, expanded, loading) deben tener:
  - Representación visual clara.
  - Atributos nativos o ARIA coherentes (`disabled`, `aria-disabled`, `aria-selected`, etc.).

### Teclado y foco en componentes complejos

- **Botones y toggles**
  - Activables con `Enter` y `Space`.
  - Los toggles deben usar `aria-pressed` cuando represente un estado presionado/activo.
- **Accordions / colapsables**
  - El trigger debe ser un `button` con `aria-expanded` y `aria-controls`.
  - El panel puede usar `role="region"` y `aria-labelledby` apuntando al trigger.
- **Diálogos / modales**
  - Deben usar `role="dialog"` (o `<dialog>` nativo) y `aria-modal="true"`.
  - Al abrir:
    - El foco se mueve a un elemento significativo dentro del diálogo.
  - Mientras el diálogo está abierto:
    - El foco debe quedar atrapado dentro del diálogo.
  - Al cerrar:
    - Se restaura el foco al elemento que disparó la apertura.
  - Deben poder cerrarse con `Esc`.
- **Menús / popovers / selects personalizados**
  - Navegación con flechas (`↑`, `↓`, `Home`, `End`) cuando aplique.
  - `Enter`/`Space` para seleccionar.
  - `Esc` para cerrar.

### Contraste y visibilidad

- Los **tokens de color** usados para texto, iconos e indicadores de estado deben respetar como mínimo el contraste AA.
- No se debe depender solo del color para transmitir información crítica (usar también iconos, texto o cambios de borde/forma cuando sea necesario).

### Checklist obligatoria para PRs de componentes

Antes de aprobar una PR que introduce o modifica un componente:

1. ¿Se puede usar el componente solo con teclado (incluyendo foco y activación)?
2. ¿El foco es visible y no se ha eliminado sin alternativa?
3. ¿Se utilizan los elementos HTML semánticos correctos?
4. ¿El componente tiene nombre accesible adecuado?
5. ¿Los estados importantes están comunicados con atributos nativos/ARIA?
6. Si hay overlays (modal, menú, popover, tooltip), ¿la gestión de foco y cierre con `Esc` es correcta?
7. ¿El contraste de los tokens utilizados es suficiente para su uso previsto?

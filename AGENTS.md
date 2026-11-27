# AGENTS.md

Instrucciones para asistentes de IA que trabajan en este repositorio. La guía completa para personas está en [CONTRIBUTING.md](CONTRIBUTING.md); este archivo resume lo imprescindible. Si algo choca, gana CONTRIBUTING.md.

## Qué es

UI kit de React 19 accesible (WCAG 2.2 AA). Monorepo Nx + pnpm. Paquetes: `@my-ui/core` (tokens, temas, utilidades), `@my-ui/icons`, `@my-ui/components`. Documentación en Storybook (`apps/storybook`). Idioma del proyecto: **español** (código en inglés, documentación, commits y textos de UI en español).

## Antes de escribir código

1. Lee [docs/ROADMAP.md](docs/ROADMAP.md). Construye solo lo que corresponde a la fase actual y usa solo componentes de fases anteriores.
2. Revisa los ADR en [docs/adr](docs/adr/README.md). No contradigas una decisión aceptada sin proponer un ADR nuevo.
3. Mira un componente existente parecido y copia su estructura (`packages/components/src/lib/input.tsx` y `field.tsx` son la referencia).

## Comandos

pnpm 9.8.0 (si no está global: `corepack pnpm@9.8.0 <comando>`). Node 24.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm build-storybook
pnpm --filter @my-ui/icons generate   # tras agregar un ícono en scripts/generate-icons.mjs
```

Un proyecto concreto: `pnpm exec nx run <proyecto>:<target>` (p. ej. `@my-ui/components:test`).

## Reglas que no se rompen

- **Estilos:** solo tokens semánticos con prefijo `ui-` (`bg-ui-surface`, `text-ui-danger`). Nunca colores de la paleta ni hex. Combina con `cn()`, con el `className` del usuario al final.
- **Foco:** `focusRing` / `fieldFocusRing` de `@my-ui/core`. Nunca `outline-none` sin reemplazo ni foco con `box-shadow`.
- **API:** `size` (`sm|md|lg`), `tone`, `variant`, y booleanos con nombre HTML (`disabled`, `required`, `readOnly`, `invalid`). Nunca `isDisabled` en la API pública.
- **`ref`** como prop (React 19), apuntando al elemento interactivo principal. Las props restantes van a ese elemento.
- **Partes compuestas** como exports con prefijo (`SelectItem`), no `Select.Item`.
- **React Aria:** se envuelve, nunca se reexporta. La API pública es la del kit.
- **Accesibilidad:** elementos nativos primero; patrón ARIA APG citado en la documentación; íconos decorativos por defecto; áreas táctiles ≥ 24 px; color + ícono o texto, nunca color solo; `role="menu"` solo para menús de acciones.
- **Textos internos** en español, siempre sobrescribibles por prop.
- **Seguridad:** nunca `dangerouslySetInnerHTML`; nunca loguear ni persistir valores de inputs.
- **Dependencias:** justificar en el PR; no usar versiones publicadas hace menos de 14 días.

## Para dar algo por terminado

Un componente nuevo incluye, en el mismo PR:

- `packages/components/src/lib/<nombre>.tsx` y `<nombre>.spec.tsx` (rol y nombre, teclado, estados, `Field` si aplica, `toHaveNoAxeViolations`).
- Export en `packages/components/src/index.ts` (orden alfabético).
- `apps/storybook/src/stories/<nombre>.stories.tsx` y `<nombre>.mdx` (cuándo usarlo, hacer / evitar, accesibilidad).
- Estado actualizado en `docs/ROADMAP.md`.
- `pnpm lint`, `pnpm test`, `pnpm typecheck` y `pnpm build-storybook` en verde.

## Git

- Ramas `feat/…`, `fix/…`, `docs/…`, `chore/…` desde `main`. `main` está protegida: todo entra por PR con el CI en verde.
- Commits con Conventional Commits en español (`feat(components): agrega Switch`).
- No hagas commit de `nx.json` si el único cambio es `"analytics": false` (lo agrega la CLI de Nx sola).

# 0001 · Estilos con Tailwind CSS v4 sobre tokens semánticos

- **Estado:** Aceptado
- **Fecha:** 2026-11-27

## Contexto

El README original describía CSS Modules, pero el código ya usaba Tailwind con la utilidad `cn` (clsx + tailwind-merge). Había que elegir uno antes de construir componentes, y definir cómo se manejan los colores y los temas.

## Decisión

- **Tailwind CSS v4** para estilar los componentes.
- Dos capas de tokens en variables CSS: **escalas base** (paleta) y **tokens semánticos** (`--ui-color-fg`, `--ui-color-border`, `--ui-color-danger`…). Los componentes solo usan los semánticos.
- `@my-ui/core/styles/theme.css` registra los tokens en Tailwind con `@theme inline` y el prefijo `ui-` (`bg-ui-surface`).
- Los temas se aplican con `data-theme` en `<html>` o en cualquier contenedor.

## Alternativas descartadas

- **CSS Modules:** el kit no dependería de Tailwind, pero habría que reescribir lo existente y mantener cientos de reglas a mano. Se puede reconsiderar si aparecen consumidores sin Tailwind.
- **CSS-in-JS (emotion, styled-components):** costo en tiempo de ejecución y fricción con React Server Components.

## Consecuencias

- La app que consume el kit **necesita Tailwind v4** y declarar `@source` hacia `node_modules/@my-ui`.
- El contraste se garantiza en un solo lugar (los tokens semánticos) y se verifica en Storybook (*Fundamentos/Colores y tokens*).
- El prefijo `ui-` evita choques con el tema de la app.

/**
 * Nombres de los tokens del kit, para usarlos desde TypeScript.
 * Fuente de los valores: `styles/tokens.css` y `styles/theme.css`.
 */

/** Estilos de texto por rol (`text-ui-<estilo>` en Tailwind). */
export const textStyles = [
  'caption',
  'body-sm',
  'body',
  'body-lg',
  'label',
  'heading-sm',
  'heading-md',
  'heading-lg',
  'heading-xl',
  'display',
] as const;
export type TextStyle = (typeof textStyles)[number];

/** Pesos de letra (`font-ui-<peso>`). */
export const fontWeights = ['regular', 'medium', 'semibold', 'bold'] as const;
export type FontWeight = (typeof fontWeights)[number];

/** Familias tipográficas (`font-ui-<familia>`). */
export const fontFamilies = ['sans', 'mono'] as const;

/** Niveles de elevación (`shadow-ui-<nivel>`). */
export const elevations = ['raised', 'overlay', 'modal'] as const;
export type Elevation = (typeof elevations)[number];

/** Capas de apilamiento (`z-(--ui-z-<capa>)`), de menor a mayor. */
export const layers = ['sticky', 'modal', 'popover', 'toast', 'tooltip'] as const;
export type Layer = (typeof layers)[number];

/** Curvas de movimiento (`ease-ui-<curva>`). */
export const easings = ['standard', 'enter', 'exit'] as const;

/** Densidades (`data-density` en `<html>` o en una sección). */
export const densities = ['comfortable', 'compact'] as const;
export type Density = (typeof densities)[number];

/**
 * Breakpoints de pantalla (variantes `ui-sm:`, `ui-md:`…). Las media queries no
 * aceptan variables CSS, por eso los valores viven aquí y en `theme.css`.
 */
export const breakpoints = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const;
export type BreakpointName = keyof typeof breakpoints;

/** Tamaños de contenedor (variantes `@ui-sm:`, `@ui-md:`… con `@container`). */
export const containerSizes = {
  xs: '20rem',
  sm: '24rem',
  md: '36rem',
  lg: '48rem',
  xl: '64rem',
} as const;

/**
 * Media query de "al menos este breakpoint", para `matchMedia`:
 *
 * ```ts
 * window.matchMedia(mediaQuery('md')).matches;
 * ```
 */
export function mediaQuery(breakpoint: BreakpointName): string {
  return `(min-width: ${breakpoints[breakpoint]})`;
}

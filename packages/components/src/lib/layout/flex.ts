import type { Space } from '@my-ui/core';

/*
 * Clases comunes de Stack e Inline, escritas completas para que Tailwind las
 * encuentre.
 */

export type FlexGap = Space | 'none';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between';

/** Elementos que Stack e Inline pueden renderizar. */
export type FlexElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav'
  | 'form'
  | 'ul'
  | 'ol';

export const gapClasses: Record<FlexGap, string> = {
  none: 'gap-0',
  xs: 'gap-ui-xs',
  sm: 'gap-ui-sm',
  md: 'gap-ui-md',
  lg: 'gap-ui-lg',
  xl: 'gap-ui-xl',
  '2xl': 'gap-ui-2xl',
};

export const alignClasses: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

export const justifyClasses: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

/**
 * Safari (VoiceOver) deja de anunciar como lista un `<ul>` sin viñetas. Con
 * `role="list"` explícito la lista se mantiene.
 */
export function listRole(element: FlexElement) {
  return element === 'ul' || element === 'ol' ? 'list' : undefined;
}

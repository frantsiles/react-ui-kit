import type { ComponentProps, Ref } from 'react';
import { cn, type FontWeight } from '@my-ui/core';
import type { Tone } from '../fundamentos/types';

export type TextVariant = 'caption' | 'body-sm' | 'body' | 'body-lg' | 'label';
export type TextTone = Tone | 'muted';

export interface TextProps extends Omit<ComponentProps<'p'>, 'ref'> {
  /** Elemento HTML. `p` para párrafos; `span` dentro de otro texto; `div` si contiene bloques. */
  as?: 'p' | 'span' | 'div' | undefined;
  /** Estilo de texto por rol (tamaño, interlineado y peso juntos). */
  variant?: TextVariant | undefined;
  /** Color. `muted` para texto secundario. Los tonos semánticos van con texto que lo explique. */
  tone?: TextTone | undefined;
  /** Cambia solo el peso del estilo. */
  weight?: FontWeight | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/* Clases escritas completas para que Tailwind las encuentre. */
export const textVariantClasses: Record<TextVariant, string> = {
  caption: 'text-ui-caption',
  'body-sm': 'text-ui-body-sm',
  body: 'text-ui-body',
  'body-lg': 'text-ui-body-lg',
  label: 'text-ui-label',
};

const toneClasses: Record<TextTone, string> = {
  neutral: 'text-ui-fg',
  muted: 'text-ui-fg-muted',
  primary: 'text-ui-primary',
  success: 'text-ui-success',
  warning: 'text-ui-warning',
  danger: 'text-ui-danger',
};

export const weightClasses: Record<FontWeight, string> = {
  regular: 'font-ui-regular',
  medium: 'font-ui-medium',
  semibold: 'font-ui-semibold',
  bold: 'font-ui-bold',
};

/**
 * Texto con los estilos por rol del kit. Por defecto un `<p>` con `body`.
 *
 * Es solo presentación: para un título usa `Heading`, para énfasis con
 * significado usa `<strong>` o `<em>` dentro del texto.
 */
export function Text({
  as: Element = 'p',
  variant = 'body',
  tone = 'neutral',
  weight,
  className,
  ref,
  ...props
}: TextProps) {
  return (
    <Element
      ref={ref as Ref<HTMLParagraphElement & HTMLSpanElement & HTMLDivElement>}
      className={cn(
        'm-0',
        textVariantClasses[variant],
        toneClasses[tone],
        weight && weightClasses[weight],
        className,
      )}
      {...props}
    />
  );
}

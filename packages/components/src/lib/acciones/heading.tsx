import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | 'display';

export interface HeadingProps extends ComponentProps<'h2'> {
  /**
   * Nivel en la estructura de la página (`h1`…`h6`). Obligatorio: lo decide el
   * esquema del documento, no el tamaño. No saltes niveles.
   */
  level: HeadingLevel;
  /** Tamaño visual, independiente del nivel. Por defecto sale del nivel. */
  size?: HeadingSize | undefined;
}

const sizeClasses: Record<HeadingSize, string> = {
  sm: 'text-ui-heading-sm',
  md: 'text-ui-heading-md',
  lg: 'text-ui-heading-lg',
  xl: 'text-ui-heading-xl',
  display: 'text-ui-display',
};

const sizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'sm',
  6: 'sm',
};

/**
 * Encabezado (`h1`…`h6`) con el nivel separado del tamaño: un `h2` dentro de
 * una tarjeta puede verse como `sm` sin romper la estructura que recorren los
 * lectores de pantalla.
 */
export function Heading({ level, size, className, ...props }: HeadingProps) {
  const Element = `h${level}` as const;
  return (
    <Element
      className={cn(
        'm-0 text-ui-fg text-balance',
        sizeClasses[size ?? sizeByLevel[level]],
        className,
      )}
      {...props}
    />
  );
}

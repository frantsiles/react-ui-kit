import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';

export interface DividerProps extends Omit<ComponentProps<'hr'>, 'children'> {
  orientation?: 'horizontal' | 'vertical' | undefined;
  /**
   * Solo visual: el lector de pantalla no lo anuncia. Úsalo cuando la línea no
   * separa secciones con significado (p. ej. entre botones de una barra).
   */
  decorative?: boolean | undefined;
}

/**
 * Línea que separa contenido. Es un `<hr>` nativo (rol `separator`). En
 * vertical se estira al alto de su contenedor flex.
 */
export function Divider({
  orientation = 'horizontal',
  decorative = false,
  className,
  ...props
}: DividerProps) {
  const vertical = orientation === 'vertical';
  return (
    <hr
      data-orientation={orientation}
      aria-orientation={vertical && !decorative ? 'vertical' : undefined}
      role={decorative ? 'none' : undefined}
      className={cn(
        'm-0 shrink-0 border-0 border-ui-border-subtle',
        vertical ? 'h-auto w-0 self-stretch border-s' : 'h-0 w-full border-t',
        className,
      )}
      {...props}
    />
  );
}

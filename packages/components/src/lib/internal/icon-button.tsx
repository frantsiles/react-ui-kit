import type { ComponentProps } from 'react';
import { cn, focusRing } from '@my-ui/core';

export interface InlineIconButtonProps extends ComponentProps<'button'> {
  /** Nombre accesible obligatorio: el botón solo muestra un ícono. */
  'aria-label': string;
}

/**
 * Botón de solo ícono para usar DENTRO de otros controles (mostrar contraseña,
 * limpiar búsqueda, quitar tag). El área táctil es de 24×24 px aunque el ícono
 * sea más chico (WCAG 2.5.8).
 */
export function InlineIconButton({
  className,
  type = 'button',
  ...props
}: InlineIconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-ui-fg-muted',
        'transition-colors duration-[var(--ui-duration-fast)] hover:text-ui-fg',
        'disabled:pointer-events-none disabled:text-ui-fg-disabled',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

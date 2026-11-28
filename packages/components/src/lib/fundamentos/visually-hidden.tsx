import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';

export type VisuallyHiddenProps = ComponentProps<'span'>;

/**
 * Oculta contenido de la vista pero lo mantiene para lectores de pantalla.
 * Úsalo para dar contexto que la interfaz transmite solo visualmente
 * (p. ej. "3 notificaciones sin leer" detrás de un contador).
 */
export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return <span className={cn('sr-only', className)} {...props} />;
}

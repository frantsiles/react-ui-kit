import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';
import { useMessages } from '../fundamentos/locale-provider';
import type { ControlSize } from '../fundamentos/types';

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children' | 'role'> {
  size?: ControlSize | undefined;
  /** Nombre accesible. Por defecto "Cargando" (en el idioma del `LocaleProvider`). */
  label?: string | undefined;
  /**
   * Oculto para lectores de pantalla. Úsalo cuando otro elemento ya anuncia la
   * carga (p. ej. dentro de `Button` con `loading`).
   */
  decorative?: boolean | undefined;
}

const sizeClasses: Record<ControlSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-8',
};

/**
 * Indicador de carga de duración desconocida. Es una barra de progreso
 * indeterminada (`role="progressbar"` sin valor). Toma el color del texto
 * (`currentColor`).
 *
 * Con movimiento reducido gira más lento en vez de detenerse: quieto parecería
 * que la página se colgó.
 */
export function Spinner({
  size = 'md',
  label,
  decorative = false,
  className,
  ...props
}: SpinnerProps) {
  const messages = useMessages();
  const a11y = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'progressbar', 'aria-label': label ?? messages['spinner.label'] };

  return (
    <span
      data-slot="spinner"
      className={cn('inline-flex shrink-0', sizeClasses[size], className)}
      {...a11y}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-full animate-spin motion-reduce:[animation-duration:3s]"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

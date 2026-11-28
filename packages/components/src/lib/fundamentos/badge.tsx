import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@my-ui/core';
import { toneClasses } from './tone';
import { VisuallyHidden } from './visually-hidden';
import type { Tone } from './types';

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'children'> {
  children: ReactNode;
  tone?: Tone | undefined;
  /**
   * Texto adicional solo para lectores de pantalla. Úsalo cuando lo visible no
   * se entiende solo: `<Badge srText="notificaciones sin leer">3</Badge>`.
   * (No uses aria-label: en un <span> no se anuncia de forma fiable.)
   */
  srText?: string | undefined;
}

/**
 * Indicador compacto de estado o conteo. No interactivo.
 */
export function Badge({
  children,
  tone = 'neutral',
  srText,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border px-1.5 text-ui-caption font-ui-semibold tabular-nums',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
      {srText && (
        <>
          {/* el espacio va fuera del span oculto para que el nombre sea "3 sin leer" */}{' '}
          <VisuallyHidden>{srText}</VisuallyHidden>
        </>
      )}
    </span>
  );
}

import type { ComponentProps, ReactNode } from 'react';
import { cn, focusRing } from '@my-ui/core';
import type { ControlSize } from '../fundamentos/types';
import { ChoiceLayout, useChoiceIds } from './choice';

export interface SwitchProps
  extends Omit<ComponentProps<'input'>, 'type' | 'size' | 'children' | 'role'> {
  /** Qué se enciende o apaga ("Notificaciones por correo"). Es el nombre accesible. */
  children: ReactNode;
  /** Texto de ayuda bajo la etiqueta. */
  description?: ReactNode | undefined;
  size?: ControlSize | undefined;
}

/* Riel y perilla. Perilla apagada a 2 px del inicio; encendida, a 2 px del final. */
const sizeClasses: Record<ControlSize, { track: string; thumb: string; indent: string }> = {
  sm: { track: 'h-4 w-7', thumb: 'size-3 start-0.5 peer-checked:start-3.5', indent: 'ps-9' },
  md: { track: 'h-5 w-9', thumb: 'size-4 start-0.5 peer-checked:start-4.5', indent: 'ps-11' },
  lg: { track: 'h-6 w-11', thumb: 'size-5 start-0.5 peer-checked:start-5.5', indent: 'ps-13' },
};

/**
 * Interruptor de encendido y apagado para ajustes que se aplican al instante.
 * Es un `<input type="checkbox" role="switch">` nativo: Espacio lo cambia y
 * funciona con formularios. Patrón ARIA APG: Switch.
 *
 * Controlado (`checked`) o no controlado (`defaultChecked`).
 */
export function Switch({
  children,
  description,
  size = 'md',
  className,
  id: idProp,
  'aria-describedby': describedByProp,
  ...props
}: SwitchProps) {
  const ids = useChoiceIds('switch', { id: idProp, description, describedBy: describedByProp });

  return (
    <ChoiceLayout
      id={ids.id}
      size={size}
      className={className}
      description={description}
      descriptionId={ids.descriptionId}
      indentClassName={sizeClasses[size].indent}
      control={
        <>
          <input
            type="checkbox"
            role="switch"
            id={ids.id}
            aria-describedby={ids.describedBy}
            className={cn(
              'peer m-0 shrink-0 cursor-[inherit] appearance-none rounded-full border',
              'transition-colors duration-(--ui-duration-fast) ease-ui-standard',
              sizeClasses[size].track,
              'border-ui-border bg-ui-surface-muted enabled:hover:border-ui-border-hover',
              'checked:border-ui-primary checked:bg-ui-primary enabled:checked:hover:bg-ui-primary-hover',
              'disabled:border-ui-border-subtle disabled:bg-ui-surface-disabled',
              'disabled:checked:border-ui-fg-disabled disabled:checked:bg-ui-fg-disabled',
              focusRing,
            )}
            {...props}
          />
          {/* Perilla en SVG con currentColor: un fondo desaparecería en colores forzados */}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
            className={cn(
              'pointer-events-none absolute inset-y-0 my-auto text-ui-fg-muted',
              'transition-[inset-inline-start] duration-(--ui-duration-fast) ease-ui-standard',
              'peer-checked:text-ui-surface peer-disabled:text-ui-fg-disabled peer-disabled:peer-checked:text-ui-surface-disabled',
              sizeClasses[size].thumb,
            )}
          >
            <circle cx="8" cy="8" r="8" fill="currentColor" />
          </svg>
        </>
      }
    >
      {children}
    </ChoiceLayout>
  );
}

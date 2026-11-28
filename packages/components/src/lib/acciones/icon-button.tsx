import type { ReactNode } from 'react';
import { cn } from '@my-ui/core';
import type { ControlSize } from '../fundamentos/types';
import { buttonClasses, useButtonDefaults, type ButtonProps } from './button';

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon' | 'aria-label'> {
  /**
   * Nombre accesible, obligatorio: el botón solo muestra un ícono. Describe la
   * acción ("Cerrar", "Eliminar factura"), no el ícono ("X", "Basurero").
   */
  label: string;
  /** El ícono. Es decorativo: el nombre lo da `label`. */
  children: ReactNode;
}

/* Cuadrado del alto del control. Incluso sm (32 px) supera los 24 px de WCAG 2.5.8. */
const sizeClasses: Record<ControlSize, string> = {
  sm: 'size-ui-control-sm [&_svg]:size-4',
  md: 'size-ui-control-md [&_svg]:size-5',
  lg: 'size-ui-control-lg [&_svg]:size-6',
};

/**
 * Botón de solo ícono. Por defecto `ghost` y `neutral` (lo habitual en barras
 * de herramientas y encabezados), salvo que el `ButtonGroup` diga otra cosa.
 *
 * El nombre accesible es obligatorio (`label`). Mientras no exista Tooltip
 * (Fase 3), usa un ícono conocido o un `Button` con texto: un ícono solo es
 * ambiguo para muchas personas.
 */
export function IconButton({
  label,
  variant,
  tone,
  size: sizeProp,
  disabled: disabledProp,
  type = 'button',
  className,
  children,
  ...props
}: IconButtonProps) {
  const defaults = useButtonDefaults(
    { size: sizeProp, variant, tone, disabled: disabledProp },
    { variant: 'ghost', tone: 'neutral' },
  );

  return (
    <button
      type={type}
      aria-label={label}
      disabled={defaults.disabled}
      className={cn(
        buttonClasses(defaults.variant, defaults.tone),
        'p-0',
        sizeClasses[defaults.size],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex">
        {children}
      </span>
    </button>
  );
}

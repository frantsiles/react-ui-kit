import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@my-ui/core';
import { IconX } from '@my-ui/icons';
import { InlineIconButton } from './internal/icon-button';
import { devWarning } from './internal/dev-warning';
import { toneClasses } from './tone';
import type { Tone } from './types';

export interface TagProps extends Omit<ComponentProps<'span'>, 'children'> {
  children: ReactNode;
  /** Tono semántico. Acompáñalo con texto o ícono: el color solo no basta. */
  tone?: Tone;
  size?: 'sm' | 'md';
  /** Ícono decorativo antes del texto, p. ej. `<IconCheck />`. */
  icon?: ReactNode;
  /** Si se pasa, el tag muestra un botón para quitarlo. */
  onRemove?: () => void;
  /**
   * Nombre accesible del botón de quitar. Por defecto "Quitar {texto}" cuando
   * el contenido es texto; si no lo es, este prop es obligatorio.
   */
  removeLabel?: string;
  /** Deshabilita el botón de quitar. */
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'min-h-6 gap-1 px-2 text-xs',
  md: 'min-h-7 gap-1.5 px-2.5 text-sm',
} as const;

/**
 * Etiqueta visual para categorizar o mostrar selecciones (filtros aplicados,
 * destinatarios). No es interactiva: si un tag debe activarse/desactivarse,
 * usa un botón o un checkbox, no este componente.
 */
export function Tag({
  children,
  tone = 'neutral',
  size = 'md',
  icon,
  onRemove,
  removeLabel,
  disabled = false,
  className,
  ...props
}: TagProps) {
  const text =
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : undefined;
  const accessibleRemoveLabel =
    removeLabel ?? (text !== undefined ? `Quitar ${text}` : undefined);

  devWarning(
    Boolean(onRemove) && !accessibleRemoveLabel,
    'Tag: con onRemove y contenido que no es texto, pasa `removeLabel` para que el botón tenga nombre accesible.',
  );

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-full border font-medium',
        sizeClasses[size],
        toneClasses[tone],
        onRemove && 'pe-0.5',
        className,
      )}
      {...props}
    >
      {icon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      )}
      {/* title muestra el texto completo si se trunca */}
      <span className="truncate" title={text}>
        {children}
      </span>
      {onRemove && (
        <InlineIconButton
          aria-label={accessibleRemoveLabel ?? 'Quitar'}
          onClick={onRemove}
          disabled={disabled}
          className="rounded-full text-current hover:text-current hover:bg-current/10"
        >
          <IconX size={size === 'sm' ? 'xs' : 'sm'} />
        </InlineIconButton>
      )}
    </span>
  );
}

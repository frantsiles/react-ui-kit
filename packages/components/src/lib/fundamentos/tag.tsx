import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@my-ui/core';
import { IconX } from '@my-ui/icons';
import { InlineIconButton } from '../internal/icon-button';
import { devWarning } from '../internal/dev-warning';
import { useMessages } from './locale-provider';
import { toneClasses } from './tone';
import type { Tone } from './types';

export interface TagProps extends Omit<ComponentProps<'span'>, 'children'> {
  children: ReactNode;
  /** Tono semántico. Acompáñalo con texto o ícono: el color solo no basta. */
  tone?: Tone | undefined;
  size?: 'sm' | 'md' | undefined;
  /** Ícono decorativo antes del texto, p. ej. `<IconCheck />`. */
  icon?: ReactNode | undefined;
  /** Si se pasa, el tag muestra un botón para quitarlo. */
  onRemove?: (() => void) | undefined;
  /**
   * Nombre accesible del botón de quitar. Por defecto "Quitar {texto}" (en el
   * idioma del `LocaleProvider`) cuando
   * el contenido es texto; si no lo es, este prop es obligatorio.
   */
  removeLabel?: string | undefined;
  /** Deshabilita el botón de quitar. */
  disabled?: boolean | undefined;
}

const sizeClasses = {
  sm: 'min-h-6 gap-1 px-2 text-ui-caption',
  md: 'min-h-7 gap-1.5 px-2.5 text-ui-body-sm',
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
  const messages = useMessages();
  const text =
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : undefined;
  const accessibleRemoveLabel =
    removeLabel ?? (text !== undefined ? messages['tag.remove'](text) : undefined);

  devWarning(
    Boolean(onRemove) && !accessibleRemoveLabel,
    'Tag: con onRemove y contenido que no es texto, pasa `removeLabel` para que el botón tenga nombre accesible.',
  );

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-full border font-ui-medium',
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
          aria-label={accessibleRemoveLabel ?? messages['tag.removeUnnamed']}
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

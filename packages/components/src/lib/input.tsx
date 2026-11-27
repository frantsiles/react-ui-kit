import { useRef, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@my-ui/core';
import { useFieldControl } from './field';
import { controlSizeClasses, fieldBoxClasses } from './field-styles';
import { mergeRefs } from './internal/merge-refs';
import type { ControlSize } from './types';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  size?: ControlSize;
  /** Marca el campo como inválido. Dentro de un Field con `error` es automático. */
  invalid?: boolean;
  /** Ícono decorativo al inicio. */
  startIcon?: ReactNode;
  /** Ícono decorativo al final. */
  endIcon?: ReactNode;
  /** Contenido interactivo al final (p. ej. un botón). */
  endAdornment?: ReactNode;
  /** Clases para el `<input>` interno. `className` se aplica al contenedor visible. */
  inputClassName?: string;
}

/**
 * Campo de texto de una línea sobre un `<input>` nativo: funciona con
 * formularios nativos, FormData, Actions de React 19, autocompletado y
 * gestores de contraseñas. Controlado (`value`) o no controlado (`defaultValue`).
 *
 * Elige bien `type`, `inputMode` y `autoComplete`: deciden el teclado en móvil
 * y el autocompletado (p. ej. type="email" autoComplete="email").
 */
export function Input({
  className,
  inputClassName,
  startIcon,
  endIcon,
  endAdornment,
  ref,
  readOnly = false,
  ...props
}: InputProps) {
  const { size, invalid, ...inputProps } = useFieldControl(props);
  const innerRef = useRef<HTMLInputElement>(null);
  const disabled = Boolean(inputProps.disabled);

  // Clic en el padding del contenedor → enfoca el input (como haría un input "real").
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !disabled) {
      event.preventDefault();
      innerRef.current?.focus();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center',
        fieldBoxClasses({ invalid, disabled, readOnly }),
        controlSizeClasses[size],
        className,
      )}
      onMouseDown={handleMouseDown}
    >
      {startIcon && (
        <span aria-hidden="true" className="pointer-events-none inline-flex shrink-0 text-ui-fg-muted">
          {startIcon}
        </span>
      )}
      <input
        ref={mergeRefs(innerRef, ref)}
        readOnly={readOnly}
        className={cn(
          'min-w-0 flex-1 self-stretch bg-transparent outline-hidden',
          'placeholder:text-ui-fg-muted disabled:cursor-not-allowed',
          inputClassName,
        )}
        {...inputProps}
      />
      {endIcon && (
        <span aria-hidden="true" className="pointer-events-none inline-flex shrink-0 text-ui-fg-muted">
          {endIcon}
        </span>
      )}
      {endAdornment}
    </div>
  );
}

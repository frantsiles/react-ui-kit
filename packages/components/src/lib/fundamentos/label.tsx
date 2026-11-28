import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';
import { useMessages } from './locale-provider';
import type { ControlSize } from './types';

export interface LabelProps extends ComponentProps<'label'> {
  /**
   * Muestra un asterisco. Es solo visual: lo que anuncia "requerido" al lector
   * de pantalla es el atributo `required` del control asociado.
   */
  required?: boolean | undefined;
  /** Muestra el texto de "opcional" (más claro que marcar los requeridos cuando son mayoría). */
  optional?: boolean | undefined;
  /** Texto para `optional`. Por defecto el del `LocaleProvider` ("(opcional)"). */
  optionalText?: string | undefined;
  disabled?: boolean | undefined;
  size?: ControlSize | undefined;
}

const sizeClasses: Record<ControlSize, string> = {
  sm: 'text-ui-label',
  md: 'text-ui-label',
  lg: 'text-ui-body font-ui-medium',
};

/**
 * Etiqueta de un control de formulario. Siempre visible: el placeholder NO la
 * reemplaza. Dentro de un `Field` se asocia sola; suelta, usa `htmlFor`.
 */
export function Label({
  required = false,
  optional = false,
  optionalText,
  disabled = false,
  size = 'md',
  className,
  children,
  ...props
}: LabelProps) {
  const messages = useMessages();
  return (
    <label
      className={cn(
        'inline-flex flex-wrap items-baseline gap-x-1 text-ui-fg',
        sizeClasses[size],
        disabled && 'text-ui-fg-disabled',
        className,
      )}
      {...props}
    >
      {children}
      {/* espacio real (no solo gap visual) para que el nombre accesible sea "Teléfono (opcional)" */}
      {(required || optional) && ' '}
      {required && (
        <span aria-hidden="true" className="text-ui-danger">
          *
        </span>
      )}
      {optional && !required && (
        <span className="font-ui-regular text-ui-fg-muted">{optionalText ?? messages['label.optional']}</span>
      )}
    </label>
  );
}

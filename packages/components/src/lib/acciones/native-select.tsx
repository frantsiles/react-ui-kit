import type { ComponentProps } from 'react';
import { cn, focusRing } from '@my-ui/core';
import { IconChevronDown } from '@my-ui/icons';
import { useFieldControl } from '../fundamentos/field';
import { controlSizeClasses, fieldBoxClasses } from '../fundamentos/field-styles';
import type { ControlSize } from '../fundamentos/types';

export interface NativeSelectProps extends Omit<ComponentProps<'select'>, 'size' | 'multiple'> {
  size?: ControlSize | undefined;
  /** Marca el campo como inválido. Dentro de un Field con `error` es automático. */
  invalid?: boolean | undefined;
  /**
   * Primera opción vacía (`value=""`), p. ej. "Elige un país". Con `required`,
   * el formulario no se envía mientras siga elegida.
   */
  placeholder?: string | undefined;
  /** Clases para el `<select>`. `className` se aplica al contenedor. */
  selectClassName?: string | undefined;
}

/* Espacio para la flecha al final, según el tamaño */
const endPadding: Record<ControlSize, string> = {
  sm: 'pe-8',
  md: 'pe-9',
  lg: 'pe-11',
};

const iconClasses: Record<ControlSize, string> = {
  sm: 'end-2.5 size-4',
  md: 'end-3 size-4',
  lg: 'end-4 size-5',
};

/**
 * Lista desplegable sobre un `<select>` nativo: el sistema muestra su propia
 * lista (rueda en iOS, lista en Android) con su teclado y su lector de
 * pantalla. Va dentro de un `Field`, como `Input`.
 *
 * Usa `<option>` y `<optgroup>` como hijos. Controlado (`value`) o no
 * controlado (`defaultValue`).
 */
export function NativeSelect({
  className,
  selectClassName,
  placeholder,
  children,
  value,
  defaultValue,
  ...props
}: NativeSelectProps) {
  const { size, invalid, ...selectProps } = useFieldControl(props);
  const disabled = Boolean(selectProps.disabled);
  // Con placeholder y sin valor, el placeholder queda elegido al inicio
  const initialValue =
    value === undefined && defaultValue === undefined && placeholder !== undefined ? '' : defaultValue;

  return (
    <div className={cn('relative flex w-full', className)}>
      <select
        value={value}
        defaultValue={initialValue}
        className={cn(
          fieldBoxClasses({ invalid, disabled, readOnly: false }),
          controlSizeClasses[size],
          endPadding[size],
          'cursor-pointer appearance-none truncate',
          // El select es el control con foco: el anillo va en él
          focusRing,
          // Placeholder elegido: en gris, como en Input (las opciones de la lista, no)
          'has-[option[value=""]:checked]:text-ui-fg-muted [&_option]:text-ui-fg',
          selectClassName,
        )}
        {...selectProps}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {children}
      </select>
      <IconChevronDown
        className={cn(
          'pointer-events-none absolute inset-y-0 my-auto text-ui-fg-muted',
          disabled && 'text-ui-fg-disabled',
          iconClasses[size],
        )}
      />
    </div>
  );
}

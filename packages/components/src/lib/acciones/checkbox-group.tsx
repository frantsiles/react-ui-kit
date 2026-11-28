import { useId, useMemo, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@my-ui/core';
import { ErrorMessage } from '../fundamentos/error-message';
import { HelpText } from '../fundamentos/help-text';
import type { ControlSize } from '../fundamentos/types';
import { CheckboxGroupContext } from './checkbox';

export interface CheckboxGroupProps
  extends Omit<ComponentProps<'fieldset'>, 'children' | 'onChange' | 'defaultValue'> {
  /** Pregunta o título del grupo. Es el `<legend>`, que da nombre al grupo. */
  label: ReactNode;
  /** Oculta la etiqueta visualmente pero la mantiene para lectores de pantalla. */
  hideLabel?: boolean | undefined;
  /** Texto de ayuda bajo la etiqueta. */
  description?: ReactNode | undefined;
  /** Mensaje de error. Si tiene contenido, las casillas quedan inválidas. */
  error?: ReactNode | undefined;
  /** Valores marcados (controlado). */
  value?: readonly string[] | undefined;
  /** Valores marcados al inicio (no controlado). */
  defaultValue?: readonly string[] | undefined;
  /** Se llama con los valores marcados tras cada cambio. */
  onChange?: ((value: string[]) => void) | undefined;
  /** `name` de todas las casillas, para enviar el formulario. */
  name?: string | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  size?: ControlSize | undefined;
  /** Las `Checkbox` del grupo, cada una con su `value`. */
  children: ReactNode;
}

/**
 * Grupo de casillas relacionadas sobre `<fieldset>` y `<legend>`: el lector de
 * pantalla anuncia la pregunta al entrar al grupo. `disabled` deshabilita
 * todas las casillas (comportamiento nativo del fieldset).
 */
export function CheckboxGroup({
  label,
  hideLabel = false,
  description,
  error,
  value: valueProp,
  defaultValue,
  onChange,
  name,
  orientation = 'vertical',
  size = 'md',
  id: idProp,
  className,
  children,
  'aria-describedby': describedByProp,
  ...props
}: CheckboxGroupProps) {
  const generatedId = useId();
  const id = idProp ?? `checkbox-group-${generatedId}`;
  const [internalValue, setInternalValue] = useState<readonly string[]>(defaultValue ?? []);
  const value = valueProp ?? internalValue;
  const hasError = error !== undefined && error !== null && error !== false && error !== '';
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;
  const describedBy =
    [describedByProp, descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const context = useMemo(
    () => ({
      name,
      value,
      size,
      invalid: hasError,
      toggle: (item: string, checked: boolean) => {
        const next = checked
          ? [...value.filter((v) => v !== item), item]
          : value.filter((v) => v !== item);
        if (valueProp === undefined) setInternalValue(next);
        onChange?.(next);
      },
    }),
    [name, value, size, hasError, valueProp, onChange],
  );

  return (
    <CheckboxGroupContext value={context}>
      <fieldset
        id={id}
        aria-describedby={describedBy}
        data-orientation={orientation}
        className={cn('group m-0 min-w-0 border-0 p-0', className)}
        {...props}
      >
        <legend
          className={cn(
            'mb-2 p-0 text-ui-label text-ui-fg group-disabled:text-ui-fg-disabled',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </legend>
        {description && (
          <HelpText id={descriptionId} className="-mt-1 mb-2">
            {description}
          </HelpText>
        )}
        <div
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-x-6 gap-y-2',
          )}
        >
          {children}
        </div>
        {hasError && (
          <ErrorMessage id={errorId} className="mt-2">
            {error}
          </ErrorMessage>
        )}
      </fieldset>
    </CheckboxGroupContext>
  );
}

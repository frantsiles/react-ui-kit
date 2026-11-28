import { createContext, use, type ChangeEvent, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@my-ui/core';
import type { ControlSize } from '../fundamentos/types';
import { ChoiceLayout, choiceInputClasses, useChoiceIds } from './choice';

/** Lo que un `RadioGroup` pasa a sus opciones. */
export interface RadioGroupContextValue {
  name: string;
  /** Valor elegido; `null` si no hay ninguno. */
  value: string | null;
  select: (value: string) => void;
  size: ControlSize;
  invalid: boolean;
  required: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioProps
  extends Omit<ComponentProps<'input'>, 'type' | 'size' | 'children' | 'value'> {
  /** Valor de la opción. Es el que recibe `onChange` del grupo y el que se envía en el formulario. */
  value: string;
  /** Texto de la opción. Es su nombre accesible. */
  children: ReactNode;
  /** Texto de ayuda bajo la etiqueta. */
  description?: ReactNode | undefined;
  size?: ControlSize | undefined;
}

/**
 * Opción de un `RadioGroup`, sobre un `<input type="radio">` nativo. Usa
 * siempre dentro de un `RadioGroup`: da el `name` común, que es lo que hace
 * que las flechas recorran las opciones y que solo una quede elegida.
 */
export function Radio({
  value,
  children,
  description,
  size: sizeProp,
  className,
  id: idProp,
  'aria-describedby': describedByProp,
  onChange,
  ...props
}: RadioProps) {
  const group = use(RadioGroupContext);
  const ids = useChoiceIds('radio', { id: idProp, description, describedBy: describedByProp });
  const size = sizeProp ?? group?.size ?? 'md';
  const invalid = group?.invalid === true;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) group?.select(value);
    onChange?.(event);
  };

  return (
    <ChoiceLayout
      id={ids.id}
      size={size}
      className={className}
      description={description}
      descriptionId={ids.descriptionId}
      control={
        <>
          <input
            type="radio"
            id={ids.id}
            value={value}
            name={group?.name}
            checked={group ? group.value === value : undefined}
            required={group?.required || undefined}
            aria-describedby={ids.describedBy}
            aria-invalid={invalid || undefined}
            onChange={handleChange}
            className={cn(
              choiceInputClasses(size, invalid),
              'rounded-full checked:border-ui-primary enabled:checked:hover:border-ui-primary-hover',
              'disabled:checked:border-ui-fg-disabled',
            )}
            {...props}
          />
          {/* Punto en SVG con currentColor: un fondo desaparecería en colores forzados */}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
            className={cn(
              'pointer-events-none absolute inset-0 m-auto hidden size-[0.5em] text-ui-primary',
              'peer-checked:block peer-disabled:text-ui-fg-disabled',
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

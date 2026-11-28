import { useId, useMemo, useState } from 'react';
import { ChoiceFieldset, useChoiceIds, type ChoiceGroupBaseProps } from './choice';
import { RadioGroupContext } from './radio';

export interface RadioGroupProps extends ChoiceGroupBaseProps {
  /** Valor elegido (controlado). `null` para ninguno. */
  value?: string | null | undefined;
  /** Valor elegido al inicio (no controlado). */
  defaultValue?: string | undefined;
  /** Se llama con el valor elegido. */
  onChange?: ((value: string) => void) | undefined;
  /** Hay que elegir una opción para enviar el formulario (validación nativa). */
  required?: boolean | undefined;
}

/**
 * Opciones excluyentes: solo una a la vez. Patrón ARIA APG: Radio Group.
 *
 * Sobre `<fieldset role="radiogroup">` con radios nativos que comparten
 * `name`: Tab entra al grupo en la opción elegida, las flechas mueven y eligen,
 * y `required` funciona sin JavaScript. Si no pasas `name`, se genera uno.
 */
export function RadioGroup({
  value: valueProp,
  defaultValue,
  onChange,
  name,
  size = 'md',
  required = false,
  id,
  description,
  error,
  'aria-describedby': describedBy,
  ...props
}: RadioGroupProps) {
  const ids = useChoiceIds('radio-group', { id, description, error, describedBy });
  const generatedName = useId();
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const value = valueProp === undefined ? internalValue : valueProp;

  const context = useMemo(
    () => ({
      name: name ?? `radio-${generatedName}`,
      value,
      size,
      required,
      invalid: ids.hasError,
      select: (next: string) => {
        if (valueProp === undefined) setInternalValue(next);
        onChange?.(next);
      },
    }),
    [name, generatedName, value, size, required, ids.hasError, valueProp, onChange],
  );

  return (
    <RadioGroupContext value={context}>
      <ChoiceFieldset
        ids={ids}
        role="radiogroup"
        aria-required={required || undefined}
        aria-invalid={ids.hasError || undefined}
        required={required}
        description={description}
        error={error}
        {...props}
      />
    </RadioGroupContext>
  );
}

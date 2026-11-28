import { useMemo, useState } from 'react';
import { CheckboxGroupContext } from './checkbox';
import { ChoiceFieldset, useChoiceIds, type ChoiceGroupBaseProps } from './choice';

export interface CheckboxGroupProps extends ChoiceGroupBaseProps {
  /** Valores marcados (controlado). */
  value?: readonly string[] | undefined;
  /** Valores marcados al inicio (no controlado). */
  defaultValue?: readonly string[] | undefined;
  /** Se llama con los valores marcados tras cada cambio. */
  onChange?: ((value: string[]) => void) | undefined;
}

/**
 * Grupo de casillas relacionadas sobre `<fieldset>` y `<legend>`: el lector de
 * pantalla anuncia la pregunta al entrar al grupo. `disabled` deshabilita
 * todas las casillas (comportamiento nativo del fieldset).
 */
export function CheckboxGroup({
  value: valueProp,
  defaultValue,
  onChange,
  name,
  size = 'md',
  id,
  description,
  error,
  'aria-describedby': describedBy,
  ...props
}: CheckboxGroupProps) {
  const ids = useChoiceIds('checkbox-group', { id, description, error, describedBy });
  const [internalValue, setInternalValue] = useState<readonly string[]>(defaultValue ?? []);
  const value = valueProp ?? internalValue;

  const context = useMemo(
    () => ({
      name,
      value,
      size,
      invalid: ids.hasError,
      toggle: (item: string, checked: boolean) => {
        const next = checked
          ? [...value.filter((v) => v !== item), item]
          : value.filter((v) => v !== item);
        if (valueProp === undefined) setInternalValue(next);
        onChange?.(next);
      },
    }),
    [name, value, size, ids.hasError, valueProp, onChange],
  );

  return (
    <CheckboxGroupContext value={context}>
      <ChoiceFieldset ids={ids} description={description} error={error} {...props} />
    </CheckboxGroupContext>
  );
}

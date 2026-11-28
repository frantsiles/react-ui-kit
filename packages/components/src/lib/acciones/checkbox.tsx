import {
  createContext,
  use,
  useEffect,
  useRef,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { cn } from '@my-ui/core';
import { IconCheck, IconMinus } from '@my-ui/icons';
import type { ControlSize } from '../fundamentos/types';
import { mergeRefs } from '../internal/merge-refs';
import { ChoiceLayout, choiceInputClasses, useChoiceIds } from './choice';

/** Lo que un `CheckboxGroup` pasa a sus casillas. */
export interface CheckboxGroupContextValue {
  name: string | undefined;
  value: readonly string[];
  toggle: (value: string, checked: boolean) => void;
  size: ControlSize;
  invalid: boolean;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'size' | 'children'> {
  /** Texto de la casilla. Es su nombre accesible. */
  children: ReactNode;
  /** Texto de ayuda bajo la etiqueta. */
  description?: ReactNode | undefined;
  /** Mensaje de error. Si tiene contenido, la casilla queda inválida. */
  error?: ReactNode | undefined;
  /** Marca la casilla como inválida (sin mensaje). */
  invalid?: boolean | undefined;
  /**
   * Estado mixto: algunas opciones de un grupo marcadas y otras no. Es solo
   * visual y para lectores de pantalla; quien lo usa decide qué pasa al hacer clic.
   */
  indeterminate?: boolean | undefined;
  size?: ControlSize | undefined;
}

/* Marca sobre la caja; currentColor la mantiene visible en colores forzados */
const markClasses = 'pointer-events-none absolute inset-0 m-auto hidden size-[0.75em] text-ui-surface';

/**
 * Casilla de verificación sobre un `<input type="checkbox">` nativo: Espacio la
 * marca, funciona con formularios, `FormData` y `required`. Controlada
 * (`checked`) o no controlada (`defaultChecked`). Patrón ARIA APG: Checkbox.
 *
 * Toda la etiqueta es clicable. Dentro de un `CheckboxGroup`, `value` decide si
 * está marcada.
 */
export function Checkbox({
  children,
  description,
  error,
  invalid: invalidProp,
  indeterminate = false,
  size: sizeProp,
  className,
  id: idProp,
  ref,
  'aria-describedby': describedByProp,
  onChange,
  ...props
}: CheckboxProps) {
  const group = use(CheckboxGroupContext);
  const innerRef = useRef<HTMLInputElement>(null);
  const ids = useChoiceIds('checkbox', {
    id: idProp,
    description,
    error,
    describedBy: describedByProp,
  });
  const size = sizeProp ?? group?.size ?? 'md';
  const invalid = invalidProp ?? (ids.hasError || group?.invalid === true);

  // `indeterminate` no es un atributo HTML: solo existe como propiedad del DOM.
  // Sin dependencias: el navegador lo borra al hacer clic y hay que reponerlo.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  });

  const inGroup = group !== null && props.value !== undefined;
  const groupProps = inGroup
    ? { name: props.name ?? group.name, checked: group.value.includes(String(props.value)) }
    : {};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inGroup) group.toggle(String(props.value), event.currentTarget.checked);
    onChange?.(event);
  };

  return (
    <ChoiceLayout
      id={ids.id}
      size={size}
      className={className}
      description={description}
      descriptionId={ids.descriptionId}
      error={error}
      errorId={ids.errorId}
      control={
        <>
          <input
            ref={mergeRefs(innerRef, ref)}
            type="checkbox"
            id={ids.id}
            aria-describedby={ids.describedBy}
            aria-invalid={invalid || undefined}
            data-indeterminate={indeterminate ? '' : undefined}
            onChange={handleChange}
            className={cn(
              choiceInputClasses(size, invalid),
              'rounded-sm',
              'checked:border-ui-primary checked:bg-ui-primary enabled:checked:hover:bg-ui-primary-hover',
              'indeterminate:border-ui-primary indeterminate:bg-ui-primary enabled:indeterminate:hover:bg-ui-primary-hover',
              'disabled:checked:bg-ui-fg-disabled disabled:indeterminate:bg-ui-fg-disabled',
            )}
            {...groupProps}
            {...props}
          />
          <IconCheck
            strokeWidth={3}
            className={cn(markClasses, 'peer-checked:block peer-indeterminate:hidden')}
          />
          <IconMinus strokeWidth={3} className={cn(markClasses, 'peer-indeterminate:block')} />
        </>
      }
    >
      {children}
    </ChoiceLayout>
  );
}

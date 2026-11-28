import {
  createContext,
  use,
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { cn, focusRing } from '@my-ui/core';
import { IconCheck, IconMinus } from '@my-ui/icons';
import { ErrorMessage } from '../fundamentos/error-message';
import { HelpText } from '../fundamentos/help-text';
import type { ControlSize } from '../fundamentos/types';
import { mergeRefs } from '../internal/merge-refs';

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

const sizeClasses: Record<ControlSize, { text: string; box: string }> = {
  sm: { text: 'text-ui-body-sm', box: 'size-4' },
  md: { text: 'text-ui-body ui-sm:text-ui-body-sm', box: 'size-4.5' },
  lg: { text: 'text-ui-body', box: 'size-5' },
};

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
  const generatedId = useId();
  const id = idProp ?? `checkbox-${generatedId}`;
  const size = sizeProp ?? group?.size ?? 'md';
  const hasError = error !== undefined && error !== null && error !== false && error !== '';
  const invalid = invalidProp ?? (hasError || group?.invalid === true);
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;
  const describedBy =
    [describedByProp, descriptionId, errorId].filter(Boolean).join(' ') || undefined;

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
    <div className={cn('flex flex-col gap-1', sizeClasses[size].text, className)}>
      <label
        htmlFor={id}
        className={cn(
          // Alto mínimo de 24 px: toda la etiqueta es el área táctil (WCAG 2.5.8)
          'inline-flex min-h-6 cursor-pointer items-start gap-2 text-ui-fg',
          'has-disabled:cursor-not-allowed has-disabled:text-ui-fg-disabled',
        )}
      >
        {/* La caja mide una línea de texto de alto para quedar centrada con la primera línea */}
        <span className="relative inline-flex h-[1lh] shrink-0 items-center">
          <input
            ref={mergeRefs(innerRef, ref)}
            type="checkbox"
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            data-indeterminate={indeterminate ? '' : undefined}
            onChange={handleChange}
            className={cn(
              'peer m-0 shrink-0 cursor-[inherit] appearance-none rounded-sm border bg-ui-surface',
              'transition-colors duration-(--ui-duration-fast) ease-ui-standard',
              sizeClasses[size].box,
              invalid ? 'border-ui-danger' : 'border-ui-border enabled:hover:border-ui-border-hover',
              'checked:border-ui-primary checked:bg-ui-primary enabled:checked:hover:bg-ui-primary-hover',
              'indeterminate:border-ui-primary indeterminate:bg-ui-primary enabled:indeterminate:hover:bg-ui-primary-hover',
              'disabled:border-ui-border-subtle disabled:bg-ui-surface-disabled',
              'disabled:checked:bg-ui-fg-disabled disabled:indeterminate:bg-ui-fg-disabled',
              focusRing,
            )}
            {...groupProps}
            {...props}
          />
          {/* Íconos sobre la caja; currentColor los mantiene visibles en colores forzados */}
          <IconCheck
            strokeWidth={3}
            className="pointer-events-none absolute inset-0 m-auto hidden size-[0.75em] text-ui-surface peer-checked:block peer-indeterminate:hidden"
          />
          <IconMinus
            strokeWidth={3}
            className="pointer-events-none absolute inset-0 m-auto hidden size-[0.75em] text-ui-surface peer-indeterminate:block"
          />
        </span>
        <span>{children}</span>
      </label>
      {/* Ayuda y error alineados con el texto, no con la caja */}
      {description && (
        <HelpText id={descriptionId} className={cn('m-0', indentClasses[size])}>
          {description}
        </HelpText>
      )}
      {hasError && (
        <ErrorMessage id={errorId} className={indentClasses[size]}>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
}

/* Ancho de la caja + gap-2 */
const indentClasses: Record<ControlSize, string> = {
  sm: 'ps-6',
  md: 'ps-6.5',
  lg: 'ps-7',
};

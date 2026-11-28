import { createContext, use, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@my-ui/core';
import { ErrorMessage } from './error-message';
import { HelpText } from './help-text';
import { Label } from './label';
import type { ControlSize } from './types';

interface FieldContextValue {
  id: string;
  descriptionId: string | undefined;
  errorId: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  size: ControlSize;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Etiqueta visible del campo. */
  label: ReactNode;
  /** Oculta la etiqueta visualmente pero la mantiene para lectores de pantalla. Úsalo con moderación (p. ej. un buscador con ícono obvio). */
  hideLabel?: boolean | undefined;
  /** Texto de ayuda bajo el control. */
  description?: ReactNode | undefined;
  /** Mensaje de error. Si tiene contenido, el control queda marcado como inválido. */
  error?: ReactNode | undefined;
  required?: boolean | undefined;
  /** Muestra "(opcional)" junto a la etiqueta. */
  optional?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: ControlSize | undefined;
  /** id del control. Por defecto se genera con useId (estable con SSR). */
  id?: string | undefined;
  /** El control: Input, Textarea, PasswordInput, SearchInput… */
  children: ReactNode;
}

/**
 * Agrupa etiqueta, control, ayuda y error, y los conecta entre sí:
 * - <label htmlFor> → id del control
 * - aria-describedby → ayuda y error
 * - aria-invalid / required / disabled → al control
 *
 * El error se muestra cuando se lo pasas; valida al salir del campo (blur) o
 * al enviar, no en cada tecla. Al enviar con errores, mueve el foco al primer
 * campo inválido.
 */
export function Field({
  label,
  hideLabel = false,
  description,
  error,
  required = false,
  optional = false,
  disabled = false,
  size = 'md',
  id,
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const controlId = id ?? `field-${generatedId}`;
  const hasError = error !== undefined && error !== null && error !== false && error !== '';
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = hasError ? `${controlId}-error` : undefined;

  return (
    <FieldContext
      value={{
        id: controlId,
        descriptionId,
        errorId,
        invalid: hasError,
        required,
        disabled,
        size,
      }}
    >
      <div className={cn('flex flex-col gap-1.5', className)} {...props}>
        <Label
          htmlFor={controlId}
          required={required}
          optional={optional}
          disabled={disabled}
          size={size}
          className={cn(hideLabel && 'sr-only')}
        >
          {label}
        </Label>
        {children}
        {description && <HelpText id={descriptionId}>{description}</HelpText>}
        {hasError && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
      </div>
    </FieldContext>
  );
}

interface FieldControlInput {
  id?: string | undefined;
  'aria-describedby'?: string | undefined;
  'aria-invalid'?: ComponentProps<'input'>['aria-invalid'] | undefined;
  invalid?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: ControlSize | undefined;
}

/**
 * Para controles propios: combina las props del control con las del Field
 * que lo contiene (si hay uno). Las props explícitas del control ganan.
 */
export function useFieldControl<P extends FieldControlInput>(props: P) {
  const field = use(FieldContext);
  const { invalid, ...rest } = props;
  const isInvalid =
    invalid ?? (props['aria-invalid'] === true || props['aria-invalid'] === 'true' || field?.invalid === true);

  const describedBy =
    [props['aria-describedby'], field?.descriptionId, field?.errorId]
      .filter(Boolean)
      .join(' ') || undefined;

  return {
    ...rest,
    id: props.id ?? field?.id,
    'aria-describedby': describedBy,
    'aria-invalid': isInvalid || undefined,
    required: props.required ?? field?.required,
    disabled: props.disabled ?? field?.disabled,
    size: props.size ?? field?.size ?? 'md',
    invalid: isInvalid,
  } as Omit<P, 'invalid'> & {
    id: string | undefined;
    'aria-describedby': string | undefined;
    'aria-invalid': true | undefined;
    required: boolean | undefined;
    disabled: boolean | undefined;
    size: ControlSize;
    invalid: boolean;
  };
}

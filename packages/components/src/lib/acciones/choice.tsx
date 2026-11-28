import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn, focusRing } from '@my-ui/core';
import { ErrorMessage } from '../fundamentos/error-message';
import { HelpText } from '../fundamentos/help-text';
import type { ControlSize } from '../fundamentos/types';

/*
 * Piezas comunes de Checkbox y Radio (y de sus grupos): la etiqueta clicable
 * con la caja al lado, la ayuda y el error alineados con el texto, y el
 * fieldset del grupo. No se exporta desde el paquete.
 */

const sizeClasses: Record<ControlSize, { text: string; box: string; indent: string }> = {
  // indent = ancho de la caja + gap-2: la ayuda y el error se alinean con el texto
  sm: { text: 'text-ui-body-sm', box: 'size-4', indent: 'ps-6' },
  md: { text: 'text-ui-body ui-sm:text-ui-body-sm', box: 'size-4.5', indent: 'ps-6.5' },
  lg: { text: 'text-ui-body', box: 'size-5', indent: 'ps-7' },
};

export function hasContent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== '';
}

/** ids de ayuda y error, y el `aria-describedby` que los une. */
export function useChoiceIds(
  prefix: string,
  {
    id,
    description,
    error,
    describedBy,
  }: { id?: string | undefined; description?: ReactNode; error?: ReactNode; describedBy?: string | undefined },
) {
  const generatedId = useId();
  const controlId = id ?? `${prefix}-${generatedId}`;
  const hasError = hasContent(error);
  const descriptionId = hasContent(description) ? `${controlId}-description` : undefined;
  const errorId = hasError ? `${controlId}-error` : undefined;
  return {
    id: controlId,
    hasError,
    descriptionId,
    errorId,
    describedBy: [describedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined,
  };
}

/** Clases del `<input>` nativo dibujado como caja (checkbox) o círculo (radio). */
export function choiceInputClasses(size: ControlSize, invalid: boolean) {
  return cn(
    'peer m-0 shrink-0 cursor-[inherit] appearance-none border bg-ui-surface',
    'transition-colors duration-(--ui-duration-fast) ease-ui-standard',
    sizeClasses[size].box,
    invalid ? 'border-ui-danger' : 'border-ui-border enabled:hover:border-ui-border-hover',
    'disabled:border-ui-border-subtle disabled:bg-ui-surface-disabled',
    focusRing,
  );
}

interface ChoiceLayoutProps {
  id: string;
  size: ControlSize;
  className?: string | undefined;
  /** El `<input>` seguido de su indicador (marca o punto). */
  control: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  descriptionId?: string | undefined;
  error?: ReactNode;
  errorId?: string | undefined;
  /** Sangría de ayuda y error cuando el control no es una caja (p. ej. Switch). */
  indentClassName?: string | undefined;
}

export function ChoiceLayout({
  id,
  size,
  className,
  control,
  children,
  description,
  descriptionId,
  error,
  errorId,
  indentClassName,
}: ChoiceLayoutProps) {
  const indent = indentClassName ?? sizeClasses[size].indent;
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
        <span className="relative inline-flex h-[1lh] shrink-0 items-center">{control}</span>
        <span>{children}</span>
      </label>
      {descriptionId && (
        <HelpText id={descriptionId} className={indent}>
          {description}
        </HelpText>
      )}
      {errorId && (
        <ErrorMessage id={errorId} className={indent}>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
}

export interface ChoiceGroupBaseProps
  extends Omit<ComponentProps<'fieldset'>, 'children' | 'onChange' | 'defaultValue'> {
  /** Pregunta o título del grupo. Es el `<legend>`, que da nombre al grupo. */
  label: ReactNode;
  /** Oculta la etiqueta visualmente pero la mantiene para lectores de pantalla. */
  hideLabel?: boolean | undefined;
  /** Texto de ayuda bajo la etiqueta. */
  description?: ReactNode | undefined;
  /** Mensaje de error. Si tiene contenido, las opciones quedan inválidas. */
  error?: ReactNode | undefined;
  /** `name` de todas las opciones, para enviar el formulario. */
  name?: string | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  size?: ControlSize | undefined;
  children: ReactNode;
}

interface ChoiceFieldsetProps
  extends Omit<ChoiceGroupBaseProps, 'name' | 'size' | 'id' | 'aria-describedby'> {
  ids: ReturnType<typeof useChoiceIds>;
  /** Asterisco visual junto a la etiqueta. */
  required?: boolean | undefined;
}

/** `<fieldset>` + `<legend>` con ayuda, opciones y error. */
export function ChoiceFieldset({
  ids,
  label,
  hideLabel = false,
  description,
  error,
  required = false,
  orientation = 'vertical',
  className,
  children,
  ...props
}: ChoiceFieldsetProps) {
  return (
    <fieldset
      id={ids.id}
      aria-describedby={ids.describedBy}
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
        {required && (
          <>
            {' '}
            {/* Solo visual: el requisito lo anuncia aria-required del grupo */}
            <span aria-hidden="true" className="text-ui-danger">
              *
            </span>
          </>
        )}
      </legend>
      {ids.descriptionId && (
        <HelpText id={ids.descriptionId} className="-mt-1 mb-2">
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
      {ids.errorId && (
        <ErrorMessage id={ids.errorId} className="mt-2">
          {error}
        </ErrorMessage>
      )}
    </fieldset>
  );
}

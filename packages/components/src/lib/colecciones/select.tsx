import { useId, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton,
  ListBox as AriaListBox,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  type Key,
} from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';
import { IconChevronDown } from '@my-ui/icons';
import { useFieldControl, useFieldLabelId } from '../fundamentos/field';
import { controlSizeClasses, fieldBoxClasses } from '../fundamentos/field-styles';
import { useMessages } from '../fundamentos/locale-provider';
import type { ControlSize } from '../fundamentos/types';
import { popoverSurfaceClasses } from '../overlays/popover';
import { ListBoxSizeContext, listBoxListClasses } from './list-box';

export interface SelectProps {
  /** `ListBoxItem` y `ListBoxSection`. */
  children: ReactNode;
  /** Opción elegida (controlado): el `value` de un `ListBoxItem`, o `null`. */
  value?: string | null | undefined;
  /** Opción elegida al inicio (no controlado). */
  defaultValue?: string | null | undefined;
  /** Se llama al elegir otra opción. */
  onChange?: ((value: string | null) => void) | undefined;
  /** Lista abierta (controlado). */
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** Texto sin opción elegida. Por defecto el de `useMessages()` ("Elige una opción"). */
  placeholder?: string | undefined;
  /** Nombre para enviar el valor con un `<form>`. */
  name?: string | undefined;
  size?: ControlSize | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  /** Marca el campo como inválido. Dentro de un Field con `error` es automático. */
  invalid?: boolean | undefined;
  /** id del botón. Dentro de un Field, el del Field. */
  id?: string | undefined;
  /** Solo fuera de un `Field`: nombre del campo sin etiqueta visible. */
  'aria-label'?: string | undefined;
  /** Solo fuera de un `Field`: id del texto visible que lo nombra. */
  'aria-labelledby'?: string | undefined;
  'aria-describedby'?: string | undefined;
  /** Clases del botón. */
  className?: string | undefined;
  /** Ref al botón que abre la lista. */
  ref?: Ref<HTMLButtonElement> | undefined;
}

const iconClasses: Record<ControlSize, string> = {
  sm: 'size-4',
  md: 'size-4',
  lg: 'size-5',
};

/**
 * Lista desplegable con opciones propias (`ListBoxItem`): admite descripción,
 * íconos y secciones, y se ve igual en todos los navegadores. Va dentro de un
 * `Field`, como `Input`. Para listas simples en formularios, `NativeSelect`
 * es más liviano y usa la lista del sistema.
 */
export function Select({
  children,
  value,
  defaultValue,
  onChange,
  open,
  defaultOpen,
  onOpenChange,
  placeholder,
  name,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SelectProps) {
  const messages = useMessages();
  const fieldLabelId = useFieldLabelId();
  const { size, invalid, disabled, required, id, 'aria-describedby': describedBy } = useFieldControl(props);
  const labelledBy = ariaLabelledBy ?? fieldLabelId;
  const valueId = useId();

  return (
    <AriaSelect
      {...(value !== undefined && { selectedKey: value })}
      {...(defaultValue !== undefined && { defaultSelectedKey: defaultValue })}
      onSelectionChange={(key: Key | null) => onChange?.(key === null ? null : String(key))}
      {...(open !== undefined && { isOpen: open })}
      {...(defaultOpen !== undefined && { defaultOpen })}
      {...(onOpenChange && { onOpenChange })}
      placeholder={placeholder ?? messages['select.placeholder']}
      {...(name && { name })}
      isDisabled={Boolean(disabled)}
      isRequired={Boolean(required)}
      isInvalid={invalid}
      {...(labelledBy ? { 'aria-labelledby': labelledBy } : ariaLabel && { 'aria-label': ariaLabel })}
      {...(describedBy && { 'aria-describedby': describedBy })}
      // La validación y sus mensajes los maneja Field, no el navegador
      validationBehavior="aria"
      className="flex w-full"
    >
      <AriaButton
        ref={ref}
        {...(id && { id })}
        // Primero la etiqueta y después el valor ("Cliente, Panadería La Aurora");
        // React Aria los pone al revés
        {...(labelledBy && { 'aria-labelledby': `${labelledBy} ${valueId}` })}
        className={cn(
          fieldBoxClasses({ invalid, disabled: Boolean(disabled), readOnly: false }),
          controlSizeClasses[size],
          'flex cursor-pointer items-center justify-between text-start',
          focusRing,
          disabled && 'cursor-not-allowed',
          className,
        )}
      >
        <AriaSelectValue
          id={valueId}
          className="min-w-0 flex-1 truncate data-placeholder:text-ui-fg-muted">
          {/* Solo el texto de la opción: sin su ícono, descripción ni marca */}
          {({ isPlaceholder, selectedText, defaultChildren }) =>
            isPlaceholder ? defaultChildren : selectedText
          }
        </AriaSelectValue>
        <IconChevronDown
          className={cn('text-ui-fg-muted', disabled && 'text-ui-fg-disabled', iconClasses[size])}
        />
      </AriaButton>
      <AriaPopover
        offset={4}
        className={cn(popoverSurfaceClasses, 'flex min-w-(--trigger-width) flex-col')}
      >
        <ListBoxSizeContext value={size}>
          <AriaListBox className={listBoxListClasses}>{children}</AriaListBox>
        </ListBoxSizeContext>
      </AriaPopover>
    </AriaSelect>
  );
}

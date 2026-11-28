import type { ReactNode, Ref } from 'react';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  Group as AriaGroup,
  Input as AriaInput,
  ListBox as AriaListBox,
  Popover as AriaPopover,
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

export interface ComboboxProps {
  /** `ListBoxItem` y `ListBoxSection`. Se filtran solos por lo escrito. */
  children: ReactNode;
  /** Opción elegida (controlado): el `value` de un `ListBoxItem`, o `null`. */
  value?: string | null | undefined;
  /** Opción elegida al inicio (no controlado). */
  defaultValue?: string | null | undefined;
  /** Se llama al elegir otra opción (o `null` si se borra el texto). */
  onChange?: ((value: string | null) => void) | undefined;
  /** Texto escrito (controlado), p. ej. para buscar en el servidor. */
  inputValue?: string | undefined;
  defaultInputValue?: string | undefined;
  onInputChange?: ((value: string) => void) | undefined;
  /**
   * Acepta texto que no es ninguna opción (por ejemplo, un cliente nuevo).
   * Sin esto, al salir del campo vuelve al texto de la opción elegida.
   */
  allowCustomValue?: boolean | undefined;
  /** Cuándo se abre la lista: al escribir (por defecto) o también al enfocar. */
  openOn?: 'input' | 'focus' | undefined;
  /** Qué mostrar si nada coincide. Por defecto el de `useMessages()` ("Sin resultados"). */
  emptyState?: ReactNode | undefined;
  /** Texto de ejemplo dentro del campo. No reemplaza a la etiqueta. */
  placeholder?: string | undefined;
  /** Nombre para enviar el valor con un `<form>`. */
  name?: string | undefined;
  size?: ControlSize | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  /** Marca el campo como inválido. Dentro de un Field con `error` es automático. */
  invalid?: boolean | undefined;
  /** id del input. Dentro de un Field, el del Field. */
  id?: string | undefined;
  /** Solo fuera de un `Field`: nombre del campo sin etiqueta visible. */
  'aria-label'?: string | undefined;
  /** Solo fuera de un `Field`: id del texto visible que lo nombra. */
  'aria-labelledby'?: string | undefined;
  'aria-describedby'?: string | undefined;
  /** Clases del contenedor visible. */
  className?: string | undefined;
  /** Ref al `<input>`. */
  ref?: Ref<HTMLInputElement> | undefined;
}

const iconClasses: Record<ControlSize, string> = {
  sm: 'size-4',
  md: 'size-4',
  lg: 'size-5',
};

/**
 * Campo de texto que sugiere opciones mientras se escribe y las filtra. Para
 * listas largas (países, clientes, productos) donde buscar es más rápido que
 * recorrer. Va dentro de un `Field`, como `Input`.
 */
export function Combobox({
  children,
  value,
  defaultValue,
  onChange,
  inputValue,
  defaultInputValue,
  onInputChange,
  allowCustomValue = false,
  openOn = 'input',
  emptyState,
  placeholder,
  name,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ComboboxProps) {
  const fieldLabelId = useFieldLabelId();
  const { size, invalid, disabled, required, id, 'aria-describedby': describedBy } = useFieldControl(props);
  const labelledBy = ariaLabelledBy ?? fieldLabelId;

  return (
    <AriaComboBox
      {...(value !== undefined && { selectedKey: value })}
      {...(defaultValue !== undefined && { defaultSelectedKey: defaultValue })}
      onSelectionChange={(key: Key | null) => onChange?.(key === null ? null : String(key))}
      {...(inputValue !== undefined && { inputValue })}
      {...(defaultInputValue !== undefined && { defaultInputValue })}
      {...(onInputChange && { onInputChange })}
      allowsCustomValue={allowCustomValue}
      menuTrigger={openOn}
      // La lista se queda abierta sin coincidencias, para decir "Sin resultados"
      allowsEmptyCollection
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
      <ComboboxBox size={size} invalid={invalid} disabled={Boolean(disabled)} className={className}>
        <ComboboxInput ref={ref} id={id} placeholder={placeholder} />
      </ComboboxBox>
      <ComboboxPopover size={size} labelledBy={labelledBy} ariaLabel={ariaLabel} emptyState={emptyState}>
        {children}
      </ComboboxPopover>
    </AriaComboBox>
  );
}

/* Piezas compartidas con `Multiselect`. Internas: no se exportan en el index. */

/** Caja visible con el aspecto de `Input`: lo que va dentro y el botón de la flecha. */
export function ComboboxBox({
  size,
  invalid,
  disabled,
  className,
  children,
}: {
  size: ControlSize;
  invalid: boolean;
  disabled: boolean;
  className?: string | undefined;
  children: ReactNode;
}) {
  const messages = useMessages();
  return (
    <AriaGroup
      // Solo agrupa visualmente: el lector de pantalla no necesita un "grupo" más
      role="presentation"
      className={cn(
        'flex items-center',
        fieldBoxClasses({ invalid, disabled, readOnly: false }),
        controlSizeClasses[size],
        'pe-1',
        className,
      )}
    >
      {children}
      {/* Fuera del orden de Tab (lo hace React Aria): con teclado se abre con flecha abajo */}
      <AriaButton
        aria-label={messages['combobox.showOptions']}
        className={cn(
          'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm p-ui-xs text-ui-fg-muted',
          'hover:text-ui-fg disabled:cursor-not-allowed disabled:text-ui-fg-disabled',
          focusRing,
        )}
      >
        <IconChevronDown className={iconClasses[size]} />
      </AriaButton>
    </AriaGroup>
  );
}

export function ComboboxInput({
  ref,
  id,
  placeholder,
  className,
}: {
  ref?: Ref<HTMLInputElement> | undefined;
  id?: string | undefined;
  placeholder?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <AriaInput
      ref={ref}
      {...(id && { id })}
      {...(placeholder && { placeholder })}
      className={cn(
        'min-w-0 flex-1 self-stretch bg-transparent outline-hidden placeholder:text-ui-fg-muted disabled:cursor-not-allowed',
        className,
      )}
    />
  );
}

/** Lista flotante con las opciones filtradas. */
export function ComboboxPopover({
  size,
  labelledBy,
  ariaLabel,
  emptyState,
  children,
}: {
  size: ControlSize;
  labelledBy?: string | undefined;
  ariaLabel?: string | undefined;
  emptyState?: ReactNode | undefined;
  children: ReactNode;
}) {
  const messages = useMessages();
  return (
    <AriaPopover offset={4} className={cn(popoverSurfaceClasses, 'flex min-w-(--trigger-width) flex-col')}>
      <ListBoxSizeContext value={size}>
        <AriaListBox
          // Solo la etiqueta del campo: React Aria le suma "Suggestions" en inglés.
          // El aria-label vacío anula ese texto
          {...(labelledBy ? { 'aria-labelledby': labelledBy, 'aria-label': '' } : ariaLabel && { 'aria-label': ariaLabel })}
          className={listBoxListClasses}
          renderEmptyState={() => (
            <div className="px-ui-sm py-ui-sm text-ui-body-sm text-ui-fg-muted">
              {emptyState ?? messages['combobox.empty']}
            </div>
          )}
        >
          {children}
        </AriaListBox>
      </ListBoxSizeContext>
    </AriaPopover>
  );
}

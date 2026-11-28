import { use, useRef, type ReactNode, type Ref, type RefObject } from 'react';
import {
  ComboBox as AriaComboBox,
  ComboBoxStateContext as AriaComboBoxStateContext,
  ComboBoxValue as AriaComboBoxValue,
  type Key,
} from 'react-aria-components';
import { cn } from '@my-ui/core';
import { useFieldControl, useFieldLabelId } from '../fundamentos/field';
import { useMessages } from '../fundamentos/locale-provider';
import { Tag } from '../fundamentos/tag';
import type { ControlSize } from '../fundamentos/types';
import { mergeRefs } from '../internal/merge-refs';
import { ComboboxBox, ComboboxInput, ComboboxPopover } from './combobox';

export interface MultiselectProps {
  /** `ListBoxItem` y `ListBoxSection`. Se filtran solos por lo escrito. */
  children: ReactNode;
  /** Opciones elegidas (controlado): los `value` de los `ListBoxItem`. */
  value?: readonly string[] | undefined;
  /** Opciones elegidas al inicio (no controlado). */
  defaultValue?: readonly string[] | undefined;
  /** Se llama con todas las opciones elegidas tras cada cambio. */
  onChange?: ((value: string[]) => void) | undefined;
  /** Texto escrito (controlado), p. ej. para buscar en el servidor. */
  inputValue?: string | undefined;
  defaultInputValue?: string | undefined;
  onInputChange?: ((value: string) => void) | undefined;
  /** Cuándo se abre la lista: al escribir (por defecto) o también al enfocar. */
  openOn?: 'input' | 'focus' | undefined;
  /** Qué mostrar si nada coincide. Por defecto el de `useMessages()` ("Sin resultados"). */
  emptyState?: ReactNode | undefined;
  /** Texto de ejemplo dentro del campo. No reemplaza a la etiqueta. */
  placeholder?: string | undefined;
  /** Nombre para enviar los valores con un `<form>` (uno por opción elegida). */
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

/**
 * Elige varias opciones de una lista larga, buscándolas al escribir. Las
 * elegidas se muestran como `Tag` con un botón para quitarlas. Va dentro de un
 * `Field`, como `Input`.
 */
export function Multiselect({
  children,
  value,
  defaultValue,
  onChange,
  inputValue,
  defaultInputValue,
  onInputChange,
  openOn = 'input',
  emptyState,
  placeholder,
  name,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: MultiselectProps) {
  const fieldLabelId = useFieldLabelId();
  const { size, invalid, disabled, required, id, 'aria-describedby': describedBy } = useFieldControl(props);
  const labelledBy = ariaLabelledBy ?? fieldLabelId;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <AriaComboBox
      selectionMode="multiple"
      {...(value !== undefined && { value })}
      {...(defaultValue !== undefined && { defaultValue })}
      onChange={(keys: Key[]) => onChange?.(keys.map(String))}
      {...(inputValue !== undefined && { inputValue })}
      {...(defaultInputValue !== undefined && { defaultInputValue })}
      {...(onInputChange && { onInputChange })}
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
      className="flex w-full flex-col"
    >
      <ComboboxBox
        size={size}
        invalid={invalid}
        disabled={Boolean(disabled)}
        className={cn('flex-wrap gap-y-1 py-1', className)}
      >
        <SelectedTags size={size} disabled={Boolean(disabled)} inputRef={inputRef} />
        <ComboboxInput ref={mergeRefs(inputRef, ref)} id={id} placeholder={placeholder} className="min-w-24" />
      </ComboboxBox>
      {/*
        Texto oculto con las elegidas ("Ferretería El Clavo y Farmacia del Sol"):
        React Aria lo agrega a la descripción del input, así se oyen al enfocarlo
      */}
      <AriaComboBoxValue className="sr-only">
        {({ selectedText }) => selectedText}
      </AriaComboBoxValue>
      <ComboboxPopover size={size} labelledBy={labelledBy} ariaLabel={ariaLabel} emptyState={emptyState}>
        {children}
      </ComboboxPopover>
    </AriaComboBox>
  );
}

const tagSizes: Record<ControlSize, 'sm' | 'md'> = { sm: 'sm', md: 'sm', lg: 'md' };

/** Un `Tag` por opción elegida, con su botón para quitarla. */
function SelectedTags({
  size,
  disabled,
  inputRef,
}: {
  size: ControlSize;
  disabled: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const state = use(AriaComboBoxStateContext);
  const messages = useMessages();
  if (!state || state.selectedItems.length === 0) return null;

  return (
    // Con la lista abierta, React Aria oculta (aria-hidden) todo lo de afuera;
    // inert saca también los botones del foco, que si no quedarían ocultos y enfocables
    <span className="contents" inert={state.isOpen}>
      {state.selectedItems.map((item) => (
        <Tag
          key={item.key}
          size={tagSizes[size]}
          disabled={disabled}
          removeLabel={messages['tag.remove'](item.textValue)}
          onRemove={() => {
            const current = Array.isArray(state.value) ? (state.value as readonly Key[]) : [];
            state.setValue(current.filter((key) => key !== item.key));
            // El botón desaparece: el foco vuelve al input para seguir eligiendo
            inputRef.current?.focus();
          }}
          className="me-1"
        >
          {item.textValue}
        </Tag>
      ))}
    </span>
  );
}

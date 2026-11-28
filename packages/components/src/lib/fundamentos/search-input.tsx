import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { IconSearch, IconX } from '@my-ui/icons';
import { Input, type InputProps } from './input';
import { InlineIconButton } from '../internal/icon-button';
import { mergeRefs } from '../internal/merge-refs';
import { useMessages } from './locale-provider';

export interface SearchInputProps extends Omit<InputProps, 'type' | 'startIcon' | 'endAdornment'> {
  /** Se llama después de limpiar (botón o tecla Escape). */
  onClear?: () => void;
  /** Nombre accesible del botón de limpiar. Por defecto el del `LocaleProvider` ("Limpiar búsqueda"). */
  clearLabel?: string;
}

/** Asigna el valor como lo haría el usuario, para que React dispare onChange. */
function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Campo de búsqueda con botón para limpiar. Escape también limpia.
 * Limpiar dispara `onChange` con valor vacío (sirve igual controlado o no) y
 * devuelve el foco al campo.
 *
 * Necesita nombre accesible: úsalo dentro de un `Field` (puede ser con
 * `hideLabel`) o pásale `aria-label`.
 */
export function SearchInput({
  onClear,
  clearLabel,
  onChange,
  onKeyDown,
  ref,
  ...props
}: SearchInputProps) {
  const messages = useMessages();
  const innerRef = useRef<HTMLInputElement>(null);
  const isControlled = props.value !== undefined;
  const [uncontrolledHasValue, setUncontrolledHasValue] = useState(
    Boolean(props.defaultValue),
  );
  const hasValue = isControlled ? String(props.value).length > 0 : uncontrolledHasValue;
  const disabled = Boolean(props.disabled);
  const canClear = hasValue && !disabled && !props.readOnly;

  const clear = () => {
    const input = innerRef.current;
    if (!input) return;
    setNativeValue(input, '');
    input.focus();
    onClear?.();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledHasValue(event.target.value.length > 0);
    onChange?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.key === 'Escape' && canClear && !event.defaultPrevented) {
      // evita que el Escape cierre, p. ej., un diálogo que contiene el buscador
      event.preventDefault();
      event.stopPropagation();
      clear();
    }
  };

  return (
    <Input
      {...props}
      ref={mergeRefs(innerRef, ref)}
      type="search"
      enterKeyHint={props.enterKeyHint ?? 'search'}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      startIcon={<IconSearch size="sm" />}
      // oculta la "x" nativa de WebKit: usamos nuestro botón accesible
      inputClassName="[&::-webkit-search-cancel-button]:appearance-none"
      endAdornment={
        canClear ? (
          <InlineIconButton aria-label={clearLabel ?? messages['searchInput.clear']} onClick={clear} className="-me-1">
            <IconX size="sm" />
          </InlineIconButton>
        ) : undefined
      }
    />
  );
}

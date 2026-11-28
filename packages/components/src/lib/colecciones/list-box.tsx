import { createContext, use, useRef, type ReactNode, type Ref } from 'react';
import {
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  type Selection,
} from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';
import { IconCheck } from '@my-ui/icons';
import { useMessages } from '../fundamentos/locale-provider';
import type { ControlSize } from '../fundamentos/types';
import { mergeRefs } from '../internal/merge-refs';

/** Nombre obligatorio: no hay `<label>` que nombre un listbox. */
type ListBoxName =
  | { 'aria-label': string; 'aria-labelledby'?: undefined }
  | { 'aria-labelledby': string; 'aria-label'?: undefined };

type ListBoxSelection =
  | {
      /** Una opción (por defecto) o varias. */
      selectionMode?: 'single' | undefined;
      /** Opción elegida (controlado): el `value` de un `ListBoxItem`, o `null`. */
      value?: string | null | undefined;
      /** Opción elegida al inicio (no controlado). */
      defaultValue?: string | null | undefined;
      /** Se llama al elegir otra opción. */
      onChange?: ((value: string | null) => void) | undefined;
    }
  | {
      selectionMode: 'multiple';
      /** Opciones elegidas (controlado). */
      value?: readonly string[] | undefined;
      /** Opciones elegidas al inicio (no controlado). */
      defaultValue?: readonly string[] | undefined;
      /** Se llama con todas las opciones elegidas tras cada cambio. */
      onChange?: ((value: string[]) => void) | undefined;
    };

export type ListBoxProps = ListBoxName &
  ListBoxSelection & {
    /** `ListBoxItem` y `ListBoxSection`. */
    children: ReactNode;
    /** Alto de las opciones, igual que los controles de formulario. */
    size?: ControlSize | undefined;
    /** Qué mostrar si no hay opciones. Por defecto el de `useMessages()` ("Sin opciones"). */
    emptyState?: ReactNode | undefined;
    /** Lleva el foco a la lista al montarla. */
    autoFocus?: boolean | undefined;
    className?: string | undefined;
    /** Ref al elemento con `role="listbox"`. */
    ref?: Ref<HTMLDivElement> | undefined;
  };

/** Tamaño de las opciones. Interno: `Select` lo da a sus `ListBoxItem`. */
export const ListBoxSizeContext = createContext<ControlSize>('md');

/** Contenedor de la lista sin borde, para usarla dentro de un panel (`Select`). Interno. */
export const listBoxListClasses = 'flex flex-col gap-px overflow-auto p-ui-xs text-ui-fg outline-hidden';

function toKeys(value: string | null | readonly string[] | undefined): Iterable<string> | undefined {
  if (value === undefined) return undefined;
  if (value === null) return [];
  return typeof value === 'string' ? [value] : value;
}

/**
 * Lista de opciones para elegir una o varias. Es la base de `Select` y
 * `Combobox`; sola sirve cuando las opciones tienen que estar siempre a la
 * vista. Flechas para moverse, `Espacio` / `Enter` para elegir y escribir las
 * primeras letras para saltar a una opción.
 */
export function ListBox(props: ListBoxProps) {
  const { children, size = 'md', emptyState, autoFocus, className, ref } = props;
  const messages = useMessages();
  const innerRef = useRef<HTMLDivElement>(null);

  const handleChange = (keys: Selection) => {
    // `Ctrl+A` elige todo: React Aria lo informa como 'all'; lo pasamos a valores
    const values =
      keys === 'all'
        ? Array.from(
            innerRef.current?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? [],
            (option) => option.dataset['key'] ?? '',
          )
        : Array.from(keys, String);
    if (props.selectionMode === 'multiple') props.onChange?.(values);
    else props.onChange?.(values[0] ?? null);
  };

  const selectedKeys = toKeys(props.value);
  const defaultSelectedKeys = toKeys(props.defaultValue);

  return (
    <ListBoxSizeContext value={size}>
      <AriaListBox
        ref={mergeRefs(innerRef, ref)}
        {...(props['aria-label'] !== undefined
          ? { 'aria-label': props['aria-label'] }
          : { 'aria-labelledby': props['aria-labelledby'] })}
        selectionMode={props.selectionMode ?? 'single'}
        // En la elección simple, volver a elegir la opción marcada no la desmarca
        disallowEmptySelection={props.selectionMode !== 'multiple'}
        {...(selectedKeys && { selectedKeys })}
        {...(defaultSelectedKeys && { defaultSelectedKeys })}
        onSelectionChange={handleChange}
        {...(autoFocus && { autoFocus })}
        renderEmptyState={() => (
          <div className="px-ui-sm py-ui-sm text-ui-body-sm text-ui-fg-muted">
            {emptyState ?? messages['listBox.empty']}
          </div>
        )}
        className={cn(
          'flex max-h-full flex-col gap-px overflow-auto rounded-md border border-ui-border bg-ui-surface p-ui-xs text-ui-fg',
          focusRing,
          className,
        )}
      >
        {children}
      </AriaListBox>
    </ListBoxSizeContext>
  );
}

export interface ListBoxItemProps {
  /** Valor de la opción; es lo que recibe `onChange`. Único en la lista. */
  value: string;
  /** Texto de la opción. */
  children: ReactNode;
  /**
   * Texto para la búsqueda al escribir y para el lector de pantalla, si
   * `children` no es texto.
   */
  textValue?: string | undefined;
  /** Texto secundario bajo el principal. Forma parte del nombre de la opción. */
  description?: ReactNode | undefined;
  /** Ícono al inicio. Es decorativo. */
  icon?: ReactNode | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

const itemSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-ui-control-sm text-ui-body-sm',
  md: 'min-h-ui-control-md text-ui-body',
  lg: 'min-h-ui-control-lg text-ui-body',
};

/** Una opción de `ListBox` (y, más adelante, de `Select` y `Combobox`). */
export function ListBoxItem({ value, children, textValue, description, icon, disabled, className }: ListBoxItemProps) {
  const size = use(ListBoxSizeContext);
  const text = textValue ?? (typeof children === 'string' ? children : undefined);

  return (
    <AriaListBoxItem
      id={value}
      {...(text !== undefined && { textValue: text })}
      {...(disabled && { isDisabled: true })}
      className={cn(
        'flex cursor-default items-center gap-ui-sm rounded-sm px-ui-sm py-ui-xs',
        'data-focused:bg-ui-surface-muted data-selected:bg-ui-primary-soft',
        'data-disabled:cursor-not-allowed data-disabled:text-ui-fg-disabled',
        focusRing,
        itemSizeClasses[size],
        className,
      )}
    >
      {({ isSelected }) => (
        <>
          {icon && (
            <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-4">
              {icon}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            {/*
              Sin aria-labelledby/-describedby: el nombre es todo el texto
              visible, así incluye la descripción (WCAG 2.5.3, Label in Name).
              Son bloques para que el nombre separe los dos textos con un espacio.
            */}
            <div>{children}</div>
            {description != null && <div className="text-ui-body-sm text-ui-fg-muted">{description}</div>}
          </div>
          {/* Marca de elegida: el estado no depende solo del color de fondo */}
          <IconCheck className={cn('size-4 text-ui-primary', !isSelected && 'invisible')} />
        </>
      )}
    </AriaListBoxItem>
  );
}

export interface ListBoxSectionProps {
  /** Título visible del grupo; también lo nombra. */
  title: ReactNode;
  /** `ListBoxItem` del grupo. */
  children: ReactNode;
  className?: string | undefined;
}

/** Agrupa opciones bajo un título. */
export function ListBoxSection({ title, children, className }: ListBoxSectionProps) {
  return (
    <AriaListBoxSection className={cn('flex flex-col gap-px [&:not(:first-child)]:mt-ui-xs', className)}>
      <AriaHeader className="px-ui-sm pt-ui-xs pb-ui-xs text-ui-caption font-ui-semibold text-ui-fg-muted">
        {title}
      </AriaHeader>
      {children}
    </AriaListBoxSection>
  );
}

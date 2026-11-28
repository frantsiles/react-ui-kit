import { createContext, use, useRef, type ReactNode, type Ref } from 'react';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type Key,
} from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';

type Orientation = 'horizontal' | 'vertical';

export interface TabsProps {
  /** `TabList` y un `TabPanel` por pestaña. */
  children: ReactNode;
  /** Pestaña elegida (controlado): el `value` de un `Tab`. */
  value?: string | undefined;
  /** Pestaña elegida al inicio (no controlado). Por defecto, la primera habilitada. */
  defaultValue?: string | undefined;
  /** Se llama al cambiar de pestaña. */
  onChange?: ((value: string) => void) | undefined;
  /** Pestañas en fila (por defecto) o en columna, a un costado del contenido. */
  orientation?: Orientation | undefined;
  /**
   * `automatic` (por defecto): las flechas cambian de pestaña al moverse.
   * `manual`: las flechas solo mueven el foco y `Enter` / `Espacio` la elige;
   * úsalo si cargar un panel es lento.
   */
  activation?: 'automatic' | 'manual' | undefined;
  /** Deshabilita todas las pestañas. */
  disabled?: boolean | undefined;
  className?: string | undefined;
}

const OrientationContext = createContext<Orientation>('horizontal');

/**
 * Pestañas: muestran una sección de contenido a la vez, en la misma página.
 * Flechas para moverse entre pestañas, `Inicio` y `Fin` para ir a la primera
 * y la última; `Tab` entra al panel.
 */
export function Tabs({
  children,
  value,
  defaultValue,
  onChange,
  orientation = 'horizontal',
  activation = 'automatic',
  disabled,
  className,
}: TabsProps) {
  // React Aria avisa al montar cuál eligió por defecto: no es un cambio, no se informa
  const uncontrolled = useRef<string | null>(defaultValue ?? null);
  const handleChange = (key: Key) => {
    const next = String(key);
    const previous = value !== undefined ? value : uncontrolled.current;
    uncontrolled.current = next;
    if (previous === null || next === previous) return;
    onChange?.(next);
  };

  return (
    <OrientationContext value={orientation}>
      <AriaTabs
        {...(value !== undefined && { selectedKey: value })}
        {...(defaultValue !== undefined && { defaultSelectedKey: defaultValue })}
        onSelectionChange={handleChange}
        orientation={orientation}
        keyboardActivation={activation}
        {...(disabled && { isDisabled: true })}
        className={cn('flex', orientation === 'horizontal' ? 'flex-col' : 'flex-row gap-ui-lg', className)}
      >
        {children}
      </AriaTabs>
    </OrientationContext>
  );
}

/** Nombre obligatorio: dice de qué son las pestañas. */
type TabListName =
  | { 'aria-label': string; 'aria-labelledby'?: undefined }
  | { 'aria-labelledby': string; 'aria-label'?: undefined };

export type TabListProps = TabListName & {
  /** Los `Tab`. */
  children: ReactNode;
  className?: string | undefined;
};

/** La fila (o columna) de pestañas. */
export function TabList(props: TabListProps) {
  const { children, className } = props;
  const orientation = use(OrientationContext);
  return (
    <AriaTabList
      {...(props['aria-label'] !== undefined
        ? { 'aria-label': props['aria-label'] }
        : { 'aria-labelledby': props['aria-labelledby'] })}
      className={cn(
        'flex shrink-0',
        orientation === 'horizontal'
          ? // Si no entran, se desplazan en vez de pasar a otra línea
            'gap-ui-xs overflow-x-auto overflow-y-hidden border-b border-ui-border [scrollbar-width:thin]'
          : 'flex-col gap-px border-e border-ui-border',
        className,
      )}
    >
      {children}
    </AriaTabList>
  );
}

export interface TabProps {
  /** Valor de la pestaña: lo une con su `TabPanel` y es lo que recibe `onChange`. */
  value: string;
  /** Texto de la pestaña, corto ("Detalle", "Pagos"). */
  children: ReactNode;
  /** Ícono al inicio. Es decorativo. */
  icon?: ReactNode | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Una pestaña. */
export function Tab({ value, children, icon, disabled, className, ref }: TabProps) {
  const orientation = use(OrientationContext);
  return (
    <AriaTab
      id={value}
      ref={ref}
      {...(disabled && { isDisabled: true })}
      className={cn(
        // 40 px de alto: área táctil cómoda (WCAG 2.5.8 pide 24)
        'relative inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-ui-xs whitespace-nowrap px-ui-md text-ui-body-sm font-ui-medium text-ui-fg-muted',
        'transition-colors duration-(--ui-duration-fast) ease-ui-standard hover:text-ui-fg',
        // La elegida se marca con una barra y el color del texto, no solo con color
        'data-selected:text-ui-fg',
        'after:absolute after:rounded-full after:bg-transparent data-selected:after:bg-ui-primary',
        orientation === 'horizontal'
          ? 'after:inset-x-ui-xs after:bottom-0 after:h-0.5'
          : 'justify-start after:inset-y-ui-xs after:-end-px after:w-0.5',
        'data-disabled:cursor-not-allowed data-disabled:text-ui-fg-disabled',
        'rounded-sm',
        focusRing,
        className,
      )}
    >
      {icon && (
        <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-4">
          {icon}
        </span>
      )}
      {children}
    </AriaTab>
  );
}

export interface TabPanelProps {
  /** El `value` del `Tab` que lo muestra. */
  value: string;
  children: ReactNode;
  className?: string | undefined;
}

/**
 * Contenido de una pestaña. Si no tiene nada enfocable, el panel mismo
 * recibe el foco con `Tab`, para que el teclado llegue al contenido.
 */
export function TabPanel({ value, children, className }: TabPanelProps) {
  const orientation = use(OrientationContext);
  return (
    <AriaTabPanel
      id={value}
      className={cn('min-w-0 flex-1 rounded-sm', orientation === 'horizontal' && 'pt-ui-md', focusRing, className)}
    >
      {children}
    </AriaTabPanel>
  );
}

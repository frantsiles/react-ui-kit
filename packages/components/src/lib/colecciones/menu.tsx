import {
  Children,
  isValidElement,
  useRef,
  useState,
  type DOMAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuContext as AriaMenuContext,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  PopoverContext as AriaPopoverContext,
  Pressable,
  Separator as AriaSeparator,
  type Key,
} from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';
import { popoverSurfaceClasses, type PopoverPlacement } from '../overlays/popover';

export interface MenuTriggerProps {
  /** Primero el disparador (un `Button` o `IconButton` del kit), después el `Menu`. */
  children: ReactNode;
  /** Abierto (controlado). */
  open?: boolean | undefined;
  /** Abierto al montar (no controlado). */
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
}

/**
 * Conecta un botón con su `Menu`. El botón recibe `aria-haspopup` y
 * `aria-expanded`, y abre el menú con clic, `Enter`, `Espacio` o flechas.
 */
export function MenuTrigger({ children, open, defaultOpen, onOpenChange }: MenuTriggerProps) {
  const [trigger, ...rest] = Children.toArray(children);
  return (
    <AriaMenuTrigger
      {...(open !== undefined && { isOpen: open })}
      {...(defaultOpen !== undefined && { defaultOpen })}
      {...(onOpenChange && { onOpenChange })}
    >
      {/* Pressable le pasa al botón del kit los eventos y atributos del disparador */}
      {isValidElement(trigger) ? (
        <Pressable>{trigger as ReactElement<DOMAttributes<Element>, string>}</Pressable>
      ) : (
        trigger
      )}
      {rest}
    </AriaMenuTrigger>
  );
}

export interface MenuProps {
  /** `MenuItem`, `MenuSection` y `MenuSeparator`. */
  children: ReactNode;
  /** Se llama con el `value` del ítem elegido, después de cerrar el menú. */
  onAction?: ((value: string) => void) | undefined;
  /**
   * Nombre del menú. Por defecto lo nombra el botón que lo abre; úsalo si el
   * botón no lo describe bien (p. ej. un `IconButton` "Más opciones").
   */
  'aria-label'?: string | undefined;
  /** Por defecto debajo, alineado al inicio del botón. */
  placement?: PopoverPlacement | undefined;
  className?: string | undefined;
  /** Ref al elemento con `role="menu"`. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Lista de acciones que abre un botón ("Editar", "Duplicar", "Eliminar").
 * Va dentro de un `MenuTrigger`. Flechas para moverse, `Enter` para elegir y
 * `Escape` para cerrar; el foco vuelve al botón.
 */
export function Menu({ children, onAction, 'aria-label': ariaLabel, placement = 'bottom start', className, ref }: MenuProps) {
  return (
    <AriaPopover
      placement={placement}
      offset={4}
      className={cn(popoverSurfaceClasses, 'flex min-w-(--trigger-width) flex-col')}
    >
      <AriaMenu
        ref={ref}
        // Sin esto, React Aria lo nombra con el botón aunque haya aria-label
        {...(ariaLabel && { 'aria-label': ariaLabel, 'aria-labelledby': '' })}
        {...(onAction && { onAction: (key: Key) => onAction(String(key)) })}
        className={cn(
          'flex max-h-[inherit] min-w-40 flex-col gap-px overflow-auto p-ui-xs text-ui-body-sm text-ui-fg outline-hidden',
          className,
        )}
      >
        {children}
      </AriaMenu>
    </AriaPopover>
  );
}

export interface MenuItemProps {
  /** Valor de la acción; es lo que recibe `onAction` del `Menu`. Único en el menú. */
  value: string;
  /** Texto de la acción, en verbo ("Duplicar"). */
  children: ReactNode;
  /** Texto para buscar al escribir y para el lector de pantalla, si `children` no es texto. */
  textValue?: string | undefined;
  /** Texto secundario bajo el principal. Forma parte del nombre del ítem. */
  description?: ReactNode | undefined;
  /** Ícono al inicio. Es decorativo. */
  icon?: ReactNode | undefined;
  /** Atajo de teclado que hace lo mismo ("Ctrl+D"). Solo lo muestra: el atajo lo maneja la app. */
  shortcut?: string | undefined;
  /** `danger` para acciones destructivas ("Eliminar"). */
  tone?: 'neutral' | 'danger' | undefined;
  disabled?: boolean | undefined;
  /** Se llama al elegir este ítem, además del `onAction` del `Menu`. */
  onAction?: (() => void) | undefined;
  className?: string | undefined;
}

/** Una acción de `Menu`. */
export function MenuItem({
  value,
  children,
  textValue,
  description,
  icon,
  shortcut,
  tone = 'neutral',
  disabled,
  onAction,
  className,
}: MenuItemProps) {
  const text = textValue ?? (typeof children === 'string' ? children : undefined);

  return (
    <AriaMenuItem
      id={value}
      {...(text !== undefined && { textValue: text })}
      {...(disabled && { isDisabled: true })}
      {...(onAction && { onAction })}
      className={cn(
        // 32 px de alto: área táctil cómoda (WCAG 2.5.8 pide 24)
        'flex min-h-8 cursor-default items-center gap-ui-sm rounded-sm px-ui-sm py-ui-xs',
        'data-focused:bg-ui-surface-muted',
        tone === 'danger' && 'text-ui-danger data-focused:bg-ui-danger-soft',
        'data-disabled:cursor-not-allowed data-disabled:text-ui-fg-disabled',
        focusRing,
        className,
      )}
    >
      {icon && (
        <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-4">
          {icon}
        </span>
      )}
      {/*
        Sin slots de label/description: el nombre es todo el texto visible, así
        incluye la descripción y el atajo (WCAG 2.5.3, Label in Name), como en
        ListBoxItem. Son bloques para que el nombre los separe con un espacio.
      */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div>{children}</div>
        {description != null && <div className="text-ui-caption text-ui-fg-muted">{description}</div>}
      </div>
      {shortcut && <kbd className="ms-ui-md shrink-0 font-ui-sans text-ui-caption text-ui-fg-muted">{shortcut}</kbd>}
    </AriaMenuItem>
  );
}

export interface MenuSectionProps {
  /** Título visible del grupo; también lo nombra. */
  title: ReactNode;
  /** `MenuItem` del grupo. */
  children: ReactNode;
  className?: string | undefined;
}

/** Agrupa acciones bajo un título. */
export function MenuSection({ title, children, className }: MenuSectionProps) {
  return (
    <AriaMenuSection className={cn('flex flex-col gap-px [&:not(:first-child)]:mt-ui-xs', className)}>
      <AriaHeader className="px-ui-sm pt-ui-xs pb-ui-xs text-ui-caption font-ui-semibold text-ui-fg-muted">
        {title}
      </AriaHeader>
      {children}
    </AriaMenuSection>
  );
}

/** Línea que separa grupos de acciones. */
export function MenuSeparator({ className }: { className?: string | undefined }) {
  return <AriaSeparator className={cn('my-ui-xs border-t border-ui-border-subtle', className)} />;
}

export interface ContextMenuTriggerProps {
  /** Primero el área que tiene el menú (un elemento enfocable), después el `Menu`. */
  children: ReactNode;
  /** Nombre del menú, que no tiene botón que lo nombre ("Acciones de la factura 2041"). */
  label: string;
  /** Abierto (controlado). */
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** Desactiva el menú: el clic derecho muestra el menú del navegador. */
  disabled?: boolean | undefined;
}

/** Pulsación larga en pantallas táctiles (iOS no dispara `contextmenu`). */
const LONG_PRESS_MS = 500;
/** Moverse más que esto cancela la pulsación larga: es un desplazamiento. */
const LONG_PRESS_TOLERANCE = 10;

/**
 * Abre un `Menu` junto al puntero con clic derecho, con pulsación larga en
 * táctil o con `Shift+F10` / tecla Menú cuando el área tiene el foco. Es un
 * atajo: las mismas acciones tienen que estar también a la vista (un `Menu`
 * con botón, por ejemplo), porque el menú contextual no se descubre.
 */
export function ContextMenuTrigger({ children, label, open, onOpenChange, disabled = false }: ContextMenuTriggerProps) {
  const [area, ...rest] = Children.toArray(children);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = open ?? uncontrolledOpen;
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const anchorRef = useRef<HTMLSpanElement>(null);
  const longPress = useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number } | null>(null);

  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const openAt = (x: number, y: number) => {
    setPoint({ x, y });
    setOpen(true);
  };

  const cancelLongPress = () => {
    if (longPress.current) clearTimeout(longPress.current.timer);
    longPress.current = null;
  };

  const handleContextMenu = (event: ReactMouseEvent) => {
    if (disabled) return;
    event.preventDefault();
    cancelLongPress();
    // Con el teclado (Shift+F10, tecla Menú) algunos navegadores dan (0, 0): se abre bajo el elemento
    if (event.clientX === 0 && event.clientY === 0) {
      openBelow(event.target as Element);
    } else {
      openAt(event.clientX, event.clientY);
    }
  };

  const openBelow = (target: Element) => {
    const rect = target.getBoundingClientRect();
    openAt(rect.left, rect.bottom);
  };

  // Shift+F10 y la tecla Menú: se manejan aquí (y no se espera al contextmenu
  // del navegador) para que funcionen igual en todos y no abran dos veces
  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      openBelow(event.target as Element);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent) => {
    if (disabled || event.pointerType !== 'touch') return;
    const { clientX: x, clientY: y } = event;
    cancelLongPress();
    longPress.current = { timer: setTimeout(() => openAt(x, y), LONG_PRESS_MS), x, y };
  };

  const handlePointerMove = (event: ReactPointerEvent) => {
    const start = longPress.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > LONG_PRESS_TOLERANCE) {
      cancelLongPress();
    }
  };

  return (
    <>
      <div
        className="contents [-webkit-touch-callout:none]"
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={cancelLongPress}
        onPointerCancel={cancelLongPress}
      >
        {area}
      </div>
      {/* Punto invisible donde se abrió: el menú se posiciona contra él */}
      <span
        ref={anchorRef}
        aria-hidden="true"
        className="pointer-events-none fixed size-0"
        // Coordenadas físicas del puntero (clientX/Y): aquí left es correcto también en RTL
        style={{ left: point.x, top: point.y }}
      />
      <AriaPopoverContext
        // React Aria lo vuelve role="dialog": también necesita nombre
        value={{ isOpen, onOpenChange: setOpen, triggerRef: anchorRef, trigger: 'ContextMenu', 'aria-label': label }}
      >
        <AriaMenuContext value={{ 'aria-label': label, autoFocus: 'first', onClose: () => setOpen(false) }}>
          {rest}
        </AriaMenuContext>
      </AriaPopoverContext>
    </>
  );
}

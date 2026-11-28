import type { DOMAttributes, ReactElement, ReactNode, Ref } from 'react';
import {
  Focusable,
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components';
import { cn } from '@my-ui/core';

/** Lado del disparador. `start` y `end` son lógicos (se espejan en RTL); si no entra, se da vuelta. */
export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

export interface TooltipProps {
  /** Texto breve. Sin contenido interactivo: para eso, `Popover`. */
  content: ReactNode;
  /** El disparador: un elemento enfocable del kit (`Button`, `IconButton`, `Link`). */
  children: ReactElement;
  /** Por defecto arriba. */
  placement?: TooltipPlacement | undefined;
  /** Espera antes de mostrarse con el mouse, en ms. Con teclado se muestra al instante. */
  delay?: number | undefined;
  /** Espera antes de ocultarse al salir, en ms. */
  closeDelay?: number | undefined;
  /** Abierto (controlado). */
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** No muestra el tooltip (el disparador sigue funcionando). */
  disabled?: boolean | undefined;
  className?: string | undefined;
  /** Ref al globo del tooltip. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Texto breve que describe un control al pasar el mouse o al enfocarlo con
 * teclado. Se conecta con `aria-describedby`: es una descripción extra, no el
 * nombre del control.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 700,
  closeDelay = 300,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
  className,
  ref,
}: TooltipProps) {
  return (
    <AriaTooltipTrigger
      delay={delay}
      closeDelay={closeDelay}
      isDisabled={disabled}
      {...(open !== undefined && { isOpen: open })}
      {...(defaultOpen !== undefined && { defaultOpen })}
      {...(onOpenChange && { onOpenChange })}
    >
      {/* Focusable le pasa al elemento del kit los eventos de hover y foco, y aria-describedby */}
      <Focusable>{children as ReactElement<DOMAttributes<Element>, string>}</Focusable>
      <AriaTooltip
        ref={ref}
        placement={placement}
        offset={8}
        className={cn(
          'z-(--ui-z-tooltip) max-w-(--container-ui-xs) rounded-md border border-transparent bg-ui-fg px-ui-sm py-ui-xs text-ui-body-sm text-ui-surface shadow-ui-overlay',
          'transition-opacity duration-(--ui-duration-fast) ease-ui-enter data-entering:opacity-0 data-exiting:opacity-0 data-exiting:ease-ui-exit',
          className,
        )}
      >
        <OverlayArrow>
          {/* Flecha hacia el disparador; rota según el lado (físico) donde quedó el globo */}
          <svg
            width={8}
            height={8}
            viewBox="0 0 8 8"
            aria-hidden="true"
            className="block fill-ui-fg in-data-[placement=bottom]:rotate-180 in-data-[placement=left]:-rotate-90 in-data-[placement=right]:rotate-90"
          >
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        {content}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}

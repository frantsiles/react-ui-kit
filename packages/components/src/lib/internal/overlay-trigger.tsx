import { Children, isValidElement, type DOMAttributes, type ReactElement, type ReactNode } from 'react';
import { DialogTrigger as AriaDialogTrigger, Pressable } from 'react-aria-components';

export interface OverlayTriggerProps {
  /** Primero el disparador (un `Button` o `IconButton` del kit), después el overlay. */
  children: ReactNode;
  /** Abierto (controlado). */
  open?: boolean | undefined;
  /** Abierto al montar (no controlado). */
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
}

/**
 * Conecta un botón con un overlay de React Aria (Popover, Dialog). Base común
 * de `PopoverTrigger` y `DialogTrigger`.
 */
export function OverlayTrigger({ children, open, defaultOpen, onOpenChange }: OverlayTriggerProps) {
  const [trigger, ...rest] = Children.toArray(children);
  return (
    <AriaDialogTrigger
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
    </AriaDialogTrigger>
  );
}

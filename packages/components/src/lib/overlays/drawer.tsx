import { cn } from '@my-ui/core';
import { DialogFrame, type DialogLayout, type DialogProps } from './dialog';

export type DrawerPlacement = 'start' | 'end' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

// Omit que respeta la unión título | aria-label de DialogProps
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Nombre obligatorio: un título visible o `aria-label`, igual que `Dialog`. */
export type DrawerProps = DistributiveOmit<DialogProps, 'size'> & {
  /**
   * Borde de la pantalla del que sale. `end` (por defecto) y `start` son
   * lógicos: en RTL se invierten. `bottom` es la hoja inferior de los móviles.
   */
  placement?: DrawerPlacement | undefined;
  /**
   * Ancho de los paneles laterales: `sm` 20rem, `md` 24rem (por defecto),
   * `lg` 36rem. Nunca más que la pantalla. `bottom` ocupa todo el ancho.
   */
  size?: DrawerSize | undefined;
};

const sizeClasses: Record<DrawerSize, string> = {
  sm: 'max-w-(--container-ui-xs)',
  md: 'max-w-(--container-ui-sm)',
  lg: 'max-w-(--container-ui-md)',
};

// Entra desde su borde. ltr: y rtl: son excluyentes, así no compiten por orden.
const sideClasses = {
  end: cn(
    'border-s',
    'ltr:data-entering:translate-x-full ltr:data-exiting:translate-x-full',
    'rtl:data-entering:-translate-x-full rtl:data-exiting:-translate-x-full',
  ),
  start: cn(
    'border-e',
    'ltr:data-entering:-translate-x-full ltr:data-exiting:-translate-x-full',
    'rtl:data-entering:translate-x-full rtl:data-exiting:translate-x-full',
  ),
} as const;

function drawerLayout(placement: DrawerPlacement, size: DrawerSize): DialogLayout {
  if (placement === 'bottom') {
    return {
      overlay: 'items-end',
      panel: cn(
        // Siempre queda a la vista una franja de la página: se entiende que es una capa
        'max-h-[85dvh] w-full rounded-t-lg border-t',
        'transition-[translate] data-entering:translate-y-full data-exiting:translate-y-full',
      ),
      dialog: 'rounded-t-lg',
    };
  }
  return {
    // justify-start / justify-end ya siguen la dirección del texto
    overlay: placement === 'end' ? 'justify-end' : 'justify-start',
    panel: cn('h-full w-full transition-[translate]', sideClasses[placement], sizeClasses[size]),
    dialog: '',
  };
}

/**
 * Panel modal que entra desde un borde de la pantalla: filtros, detalle de un
 * elemento, un formulario corto sin perder de vista la página. Se comporta
 * como `Dialog` (foco atrapado, `Escape` cierra, el foco vuelve al disparador)
 * y usa las mismas partes: `DialogTrigger`, `DialogBody` y `DialogFooter`.
 */
export function Drawer({ placement = 'end', size = 'md', ...props }: DrawerProps) {
  return <DialogFrame {...props} layout={drawerLayout(placement, size)} />;
}

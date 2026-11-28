import { useId, type ReactNode, type Ref } from 'react';
import { Dialog as AriaDialog, Popover as AriaPopover } from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';
import { Heading, type HeadingLevel } from '../acciones/heading';
import { OverlayTrigger, type OverlayTriggerProps } from '../internal/overlay-trigger';

/**
 * Superficie común de los paneles flotantes (`Popover`, la lista de `Select`):
 * capa, borde, sombra y fundido de entrada y salida. Interna: no va al índice.
 */
export const popoverSurfaceClasses = cn(
  'z-(--ui-z-popover) rounded-lg border border-ui-border-subtle bg-ui-surface-raised text-ui-fg shadow-ui-overlay',
  // Entra y sale con un fundido corto (sin movimiento con reduced motion: la duración es casi 0)
  'origin-(--trigger-anchor-point) transition-[opacity,scale] duration-(--ui-duration-normal) ease-ui-enter',
  'data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0 data-exiting:ease-ui-exit',
);

/**
 * Lado del disparador donde se abre y alineación. `start` y `end` son lógicos:
 * se espejan en RTL. Si no entra, se da vuelta solo.
 */
export type PopoverPlacement =
  | 'top'
  | 'top start'
  | 'top end'
  | 'bottom'
  | 'bottom start'
  | 'bottom end'
  | 'start'
  | 'start top'
  | 'start bottom'
  | 'end'
  | 'end top'
  | 'end bottom';

/**
 * Primero el disparador (un `Button` o `IconButton`), después el `Popover`.
 * El disparador recibe `aria-expanded` y abre y cierra el popover.
 */
export type PopoverTriggerProps = OverlayTriggerProps;

/** Conecta un disparador con su `Popover`. */
export function PopoverTrigger(props: PopoverTriggerProps) {
  return <OverlayTrigger {...props} />;
}

interface PopoverBaseProps {
  /** Contenido. Como función recibe `close` para cerrar desde adentro. */
  children: ReactNode | ((options: { close: () => void }) => ReactNode);
  /** Por defecto debajo, alineado al inicio del disparador. */
  placement?: PopoverPlacement | undefined;
  /** Distancia al disparador, en px. */
  offset?: number | undefined;
  className?: string | undefined;
  /** Ref al diálogo (el contenedor que recibe el foco). */
  ref?: Ref<HTMLElement> | undefined;
}

/** Nombre obligatorio: un título visible o `aria-label`. */
export type PopoverProps = PopoverBaseProps &
  (
    | {
        /** Título visible; también nombra el diálogo. */
        title: ReactNode;
        /** Nivel del título. Por defecto `h2`. */
        headingLevel?: HeadingLevel | undefined;
        'aria-label'?: undefined;
      }
    | { 'aria-label': string; title?: undefined; headingLevel?: undefined }
  );

/**
 * Panel flotante junto a su disparador, para contenido interactivo breve
 * (filtros, opciones, un formulario corto). Se cierra con `Escape` o con un
 * clic afuera, y el foco vuelve al disparador.
 */
export function Popover({
  children,
  title,
  headingLevel = 2,
  placement = 'bottom start',
  offset = 8,
  className,
  ref,
  'aria-label': ariaLabel,
}: PopoverProps) {
  const titleId = useId();

  return (
    <AriaPopover
      placement={placement}
      offset={offset}
      className={cn(
        popoverSurfaceClasses,
        'w-max max-w-(--container-ui-xs)',
        className,
      )}
    >
      <AriaDialog
        ref={ref}
        {...(ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId })}
        className={cn('flex flex-col gap-ui-sm rounded-lg p-ui-md text-ui-body-sm', focusRing)}
      >
        {({ close }) => (
          <>
            {title != null && (
              <Heading level={headingLevel} size="sm" id={titleId}>
                {title}
              </Heading>
            )}
            {typeof children === 'function' ? children({ close }) : children}
          </>
        )}
      </AriaDialog>
    </AriaPopover>
  );
}

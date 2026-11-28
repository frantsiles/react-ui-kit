import { createContext, use, useId, type ComponentProps, type ReactNode, type Ref } from 'react';
import { Dialog as AriaDialog, Modal, ModalOverlay } from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';
import { IconX } from '@my-ui/icons';
import { Heading, type HeadingLevel } from '../acciones/heading';
import { IconButton } from '../acciones/icon-button';
import { useMessages } from '../fundamentos/locale-provider';
import { OverlayTrigger, type OverlayTriggerProps } from '../internal/overlay-trigger';
import { ScrollArea } from '../layout/scroll-area';

/**
 * Primero el disparador (un `Button` o `IconButton`), después el `Dialog`.
 * Al cerrar, el foco vuelve al disparador.
 */
export type DialogTriggerProps = OverlayTriggerProps;

/** Conecta un botón con su `Dialog`. */
export function DialogTrigger(props: DialogTriggerProps) {
  return <OverlayTrigger {...props} />;
}

export type DialogSize = 'sm' | 'md' | 'lg';

interface DialogBaseProps {
  /**
   * Contenido: normalmente `DialogBody` y `DialogFooter`. Como función recibe
   * `close` para cerrar desde un botón propio.
   */
  children: ReactNode | ((options: { close: () => void }) => ReactNode);
  /** Texto bajo el título; el lector de pantalla lo lee al abrir. */
  description?: ReactNode;
  /** Ancho máximo: `sm` 24rem, `md` 36rem (por defecto), `lg` 48rem. */
  size?: DialogSize | undefined;
  /**
   * Un clic afuera lo cierra. Por defecto sí; desactívalo si cerrar por error
   * haría perder datos (un formulario a medio llenar). `Escape` siempre cierra.
   */
  dismissable?: boolean | undefined;
  /** Botón de cerrar en el encabezado. Por defecto sí. */
  closeButton?: boolean | undefined;
  /** Nombre del botón de cerrar. Por defecto el de `useMessages()` ("Cerrar"). */
  closeLabel?: string | undefined;
  /** Abierto (controlado), para abrirlo sin `DialogTrigger`. */
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
  /** Ref al diálogo (el elemento con `role="dialog"`). */
  ref?: Ref<HTMLElement> | undefined;
}

/** Nombre obligatorio: un título visible o `aria-label`. */
export type DialogProps = DialogBaseProps &
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

/** Nombre del diálogo, para la zona con scroll de `DialogBody`. */
type DialogLabel = { 'aria-labelledby': string } | { 'aria-label': string };

const DialogLabelContext = createContext<DialogLabel | null>(null);

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-(--container-ui-sm)',
  md: 'max-w-(--container-ui-md)',
  lg: 'max-w-(--container-ui-lg)',
};

/** Clases de disposición de cada capa: la de `Dialog` o la de `Drawer`. */
export interface DialogLayout {
  /** El fondo que cubre la página. */
  overlay: string;
  /** El panel (`Modal`): posición, tamaño, bordes y transición. */
  panel: string;
  /** El elemento con el rol, sobre todo para la forma del anillo de foco. */
  dialog: string;
}

function centeredLayout(size: DialogSize): DialogLayout {
  return {
    overlay: 'items-center justify-center p-ui-md',
    panel: cn(
      'max-h-full w-full rounded-lg border',
      'transition-[opacity,scale] data-entering:scale-95 data-exiting:scale-95',
      sizeClasses[size],
    ),
    dialog: 'rounded-lg',
  };
}

/**
 * Opciones internas para otros diálogos del kit (`AlertDialog`, `Drawer`). No
 * se exportan desde el índice: la API pública es la de cada componente.
 */
export type DialogFrameProps = DialogProps & {
  role?: 'dialog' | 'alertdialog' | undefined;
  /** Id del texto que describe el diálogo, si no es `description`. */
  describedBy?: string | undefined;
  /** Disposición propia; si falta, centrado con el ancho de `size`. */
  layout?: DialogLayout | undefined;
};

/**
 * Ventana modal: bloquea la página de atrás hasta que se cierra. El foco queda
 * atrapado adentro, `Escape` la cierra y el foco vuelve a donde estaba.
 */
export function Dialog(props: DialogProps) {
  return <DialogFrame {...props} />;
}

/** Estructura común de `Dialog`, `AlertDialog` y `Drawer`. */
export function DialogFrame({
  children,
  title,
  headingLevel = 2,
  description,
  size = 'md',
  dismissable = true,
  closeButton = true,
  closeLabel,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ref,
  role = 'dialog',
  describedBy,
  layout = centeredLayout(size),
  'aria-label': ariaLabel,
}: DialogFrameProps) {
  const messages = useMessages();
  const titleId = useId();
  const descriptionId = useId();
  const label: DialogLabel = ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-labelledby': titleId };
  const descriptionRef = describedBy ?? (description != null ? descriptionId : undefined);

  return (
    <ModalOverlay
      isDismissable={dismissable}
      {...(open !== undefined && { isOpen: open })}
      {...(defaultOpen !== undefined && { defaultOpen })}
      {...(onOpenChange && { onOpenChange })}
      className={cn(
        // dvh: en móviles no queda tapado por la barra del navegador
        'fixed inset-0 z-(--ui-z-modal) flex h-dvh bg-ui-overlay',
        'transition-opacity duration-(--ui-duration-slow) ease-ui-enter data-entering:opacity-0 data-exiting:opacity-0 data-exiting:ease-ui-exit',
        layout.overlay,
      )}
    >
      <Modal
        className={cn(
          'flex border-ui-border-subtle bg-ui-surface-raised text-ui-fg shadow-ui-modal',
          'duration-(--ui-duration-slow) ease-ui-enter data-exiting:ease-ui-exit',
          layout.panel,
          className,
        )}
      >
        <AriaDialog
          ref={ref}
          role={role}
          {...label}
          {...(descriptionRef && { 'aria-describedby': descriptionRef })}
          className={cn('flex min-h-0 w-full flex-col', layout.dialog, focusRing)}
        >
          {({ close }) => (
            <DialogLabelContext value={label}>
              <div className="flex items-start gap-ui-md px-ui-lg pt-ui-lg pb-ui-md">
                <div className="flex min-w-0 flex-1 flex-col gap-ui-xs">
                  {title != null && (
                    <Heading level={headingLevel} size="md" id={titleId}>
                      {title}
                    </Heading>
                  )}
                  {description != null && (
                    <p id={descriptionId} className="m-0 text-ui-body-sm text-ui-fg-muted">
                      {description}
                    </p>
                  )}
                </div>
                {closeButton && (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    label={closeLabel ?? messages['dialog.close']}
                    onClick={close}
                    className="-me-ui-xs -mt-ui-xs"
                  >
                    <IconX />
                  </IconButton>
                )}
              </div>
              {typeof children === 'function' ? children({ close }) : children}
            </DialogLabelContext>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export type DialogBodyProps = Omit<ComponentProps<'div'>, 'ref' | 'aria-label' | 'aria-labelledby'>;

/**
 * Contenido del diálogo. Si no entra en la pantalla, solo esta parte se
 * desplaza (también con teclado); el título y el pie quedan fijos.
 */
export function DialogBody({ className, ...props }: DialogBodyProps) {
  const label = use(DialogLabelContext) ?? { 'aria-label': '' };
  return (
    <ScrollArea
      {...label}
      className={cn('min-h-0 flex-1 px-ui-lg pb-ui-lg text-ui-body', className)}
      {...props}
    />
  );
}

export interface DialogFooterProps extends ComponentProps<'div'> {
  /** Reparto de las acciones. Por defecto al final (a la derecha en LTR). */
  align?: 'start' | 'end' | 'between' | undefined;
}

const footerAlignClasses = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
} as const;

/** Acciones del diálogo. La principal va última. */
export function DialogFooter({ align = 'end', className, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-ui-sm border-t border-ui-border-subtle px-ui-lg py-ui-md',
        footerAlignClasses[align],
        className,
      )}
      {...props}
    />
  );
}

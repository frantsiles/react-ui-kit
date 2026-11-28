import { useId, useState, type ReactNode, type Ref } from 'react';
import { Button } from '../acciones/button';
import type { HeadingLevel } from '../acciones/heading';
import { useMessages } from '../fundamentos/locale-provider';
import { DialogBody, DialogFooter, DialogFrame } from './dialog';

export type AlertDialogTone = 'primary' | 'danger';

export interface AlertDialogProps {
  /** Pregunta o decisión, visible ("¿Eliminar la factura 2041?"). Nombra el diálogo. */
  title: ReactNode;
  /** Consecuencias de confirmar. El lector de pantalla lo lee al abrir. */
  children: ReactNode;
  /** Texto del botón que confirma: el verbo de la acción ("Eliminar"), no "Aceptar". */
  confirmLabel: string;
  /** Texto del botón que cancela. Por defecto el de `useMessages()` ("Cancelar"). */
  cancelLabel?: string | undefined;
  /** `danger` para acciones destructivas (por defecto), `primary` para las demás. */
  tone?: AlertDialogTone | undefined;
  /**
   * Se llama al confirmar. Si devuelve una promesa, el botón muestra que está
   * cargando y el diálogo se cierra cuando se resuelve; si se rechaza, queda
   * abierto (muestra el error en `children`).
   */
  onConfirm: () => void | Promise<void>;
  /** Nivel del título. Por defecto `h2`. */
  headingLevel?: HeadingLevel | undefined;
  /** Abierto (controlado), para abrirlo sin `DialogTrigger`. */
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
  /** Ref al diálogo (el elemento con `role="alertdialog"`). */
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Pide confirmar una acción importante o destructiva antes de hacerla. Va
 * dentro de un `DialogTrigger` (o controlado con `open`). Un clic afuera no lo
 * cierra; `Escape` y "Cancelar" sí, y el foco empieza en "Cancelar".
 */
export function AlertDialog({
  title,
  children,
  confirmLabel,
  cancelLabel,
  tone = 'danger',
  onConfirm,
  headingLevel,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ref,
}: AlertDialogProps) {
  const messages = useMessages();
  const messageId = useId();
  const [pending, setPending] = useState(false);

  return (
    <DialogFrame
      role="alertdialog"
      title={title}
      headingLevel={headingLevel}
      describedBy={messageId}
      size="sm"
      dismissable={false}
      closeButton={false}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={className}
      ref={ref}
    >
      {({ close }) => {
        const confirm = async () => {
          setPending(true);
          try {
            await onConfirm();
            close();
          } catch {
            // Queda abierto: quien llama muestra el error en el contenido
          } finally {
            setPending(false);
          }
        };

        return (
          <>
            <DialogBody>
              <div id={messageId}>{children}</div>
            </DialogBody>
            <DialogFooter>
              {/* El foco empieza en la opción menos destructiva (APG Alert Dialog) */}
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <Button variant="ghost" autoFocus onClick={close}>
                {cancelLabel ?? messages['alertDialog.cancel']}
              </Button>
              <Button tone={tone} loading={pending} onClick={() => void confirm()}>
                {confirmLabel}
              </Button>
            </DialogFooter>
          </>
        );
      }}
    </DialogFrame>
  );
}

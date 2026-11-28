import type { ReactNode } from 'react';
import {
  Text as AriaText,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';
import { IconCircleAlert, IconCircleCheck, IconInfo, IconTriangleAlert, IconX } from '@my-ui/icons';
import { Button } from '../acciones/button';
import { IconButton } from '../acciones/icon-button';
import { useMessages } from '../fundamentos/locale-provider';
import type { Tone } from '../fundamentos/types';
import { VisuallyHidden } from '../fundamentos/visually-hidden';

/*
 * El Toast de React Aria está en beta (UNSTABLE_*). Según el ADR 0005 queda
 * aislado en este archivo: afuera solo se ve la API del kit (`toast()` y
 * `ToastRegion`), así se puede cambiar la implementación sin romper a nadie.
 */

export type ToastTone = Tone;

export interface ToastOptions {
  /** Mensaje en una línea ("Factura enviada"). Nombra el toast. */
  title: ReactNode;
  /** Detalle opcional bajo el título. */
  description?: ReactNode;
  /**
   * Significado: `neutral` (por defecto), `primary` información, `success`,
   * `warning` o `danger`. Se transmite con ícono y un prefijo oculto, no solo color.
   */
  tone?: ToastTone | undefined;
  /** Una acción corta y opcional ("Deshacer"). Al usarla, el toast se cierra. */
  action?: { label: string; onAction: () => void } | undefined;
  /**
   * Milisegundos hasta que se cierra solo; `false` para que espere a que lo
   * cierren. Por defecto 5000, salvo con `action` o `tone="danger"`, que no se
   * cierran solos. Nunca menos de 5000. La cuenta se pausa con el mouse o el
   * foco encima.
   */
  timeout?: number | false | undefined;
  /** Se llama al cerrarse, por tiempo, con el botón o con `toast.dismiss`. */
  onClose?: (() => void) | undefined;
}

type QueuedContent = Omit<ToastOptions, 'timeout' | 'onClose'>;

const MIN_TIMEOUT = 5000;

const queue = new AriaToastQueue<QueuedContent>({ maxVisibleToasts: 5 });

function resolveTimeout({ timeout, action, tone }: ToastOptions): number | undefined {
  if (timeout === false) return undefined;
  if (timeout === undefined && (action || tone === 'danger')) return undefined;
  return Math.max(MIN_TIMEOUT, timeout ?? MIN_TIMEOUT);
}

/**
 * Muestra una notificación breve en la `ToastRegion` de la app. Devuelve su
 * id, para cerrarla con `toast.dismiss(id)`.
 */
export function toast(options: ToastOptions): string {
  const { timeout: _timeout, onClose, ...content } = options;
  const timeout = resolveTimeout(options);
  return queue.add(content, {
    ...(timeout !== undefined && { timeout }),
    ...(onClose && { onClose }),
  });
}

/** Cierra un toast por su id. */
toast.dismiss = (id: string) => queue.close(id);

/** Cierra todos los toasts. */
toast.dismissAll = () => queue.clear();

const toneIcons: Record<ToastTone, ReactNode> = {
  neutral: null,
  primary: <IconInfo />,
  success: <IconCircleCheck />,
  warning: <IconTriangleAlert />,
  danger: <IconCircleAlert />,
};

const toneIconClasses: Record<ToastTone, string> = {
  neutral: '',
  primary: 'text-ui-primary',
  success: 'text-ui-success',
  warning: 'text-ui-warning',
  danger: 'text-ui-danger',
};

export interface ToastRegionProps {
  /** Nombre de la región. Por defecto el de `useMessages()` ("Notificaciones"). */
  'aria-label'?: string | undefined;
  className?: string | undefined;
}

/**
 * Lugar donde aparecen los toasts. Va una sola vez, cerca de la raíz de la
 * app (dentro del `LocaleProvider`). Abajo, al final de la línea; en
 * pantallas angostas, a todo el ancho.
 */
export function ToastRegion({ 'aria-label': ariaLabel, className }: ToastRegionProps) {
  const messages = useMessages();

  return (
    <AriaToastRegion
      queue={queue}
      aria-label={ariaLabel ?? messages['toast.region']}
      className={cn(
        'fixed inset-x-ui-md bottom-ui-md z-(--ui-z-toast) flex flex-col-reverse gap-ui-sm',
        'ui-sm:start-auto ui-sm:w-(--container-ui-sm)',
        'rounded-lg',
        focusRing,
        className,
      )}
    >
      {({ toast: item }) => {
        const { title, description, tone = 'neutral', action } = item.content;
        const icon = toneIcons[tone];
        const close = () => queue.close(item.key);

        return (
          <AriaToast
            toast={item}
            className={cn(
              'flex items-start gap-ui-sm rounded-lg border border-ui-border-subtle bg-ui-surface-raised p-ui-md text-ui-fg shadow-ui-overlay',
              // Entra con un fundido corto; con "reducir movimiento" la duración es 0
              'transition-[opacity,translate] duration-(--ui-duration-slow) ease-ui-enter starting:translate-y-2 starting:opacity-0',
              focusRing,
            )}
          >
            {icon && (
              <span
                aria-hidden="true"
                className={cn('inline-flex h-[1lh] shrink-0 items-center text-ui-body-sm [&_svg]:size-5', toneIconClasses[tone])}
              >
                {icon}
              </span>
            )}
            <AriaToastContent className="flex min-w-0 flex-1 flex-col gap-ui-xs">
              <AriaText slot="title" className="text-ui-body-sm font-ui-semibold">
                {tone !== 'neutral' && (
                  <>
                    <VisuallyHidden>{messages['alert.tone'](tone)}:</VisuallyHidden>{' '}
                  </>
                )}
                {title}
              </AriaText>
              {description != null && (
                <AriaText slot="description" className="text-ui-body-sm text-ui-fg-muted">
                  {description}
                </AriaText>
              )}
              {action && (
                <div className="mt-ui-xs">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      action.onAction();
                      close();
                    }}
                  >
                    {action.label}
                  </Button>
                </div>
              )}
            </AriaToastContent>
            <IconButton
              size="sm"
              variant="ghost"
              label={messages['toast.close']}
              onClick={close}
              className="-me-ui-xs -mt-ui-xs"
            >
              <IconX />
            </IconButton>
          </AriaToast>
        );
      }}
    </AriaToastRegion>
  );
}

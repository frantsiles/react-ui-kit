import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@my-ui/core';
import {
  IconCircleAlert,
  IconCircleCheck,
  IconInfo,
  IconTriangleAlert,
  IconX,
} from '@my-ui/icons';
import { useMessages } from '../fundamentos/locale-provider';
import type { Tone } from '../fundamentos/types';
import { VisuallyHidden } from '../fundamentos/visually-hidden';
import { IconButton } from './icon-button';

export interface AlertProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Significado: `danger` error, `warning` advertencia, `success` éxito, `primary` información. */
  tone?: Tone | undefined;
  /** `inline` dentro del contenido; `banner` a lo ancho de una página o sección. */
  variant?: 'inline' | 'banner' | undefined;
  /** Resumen en una línea. */
  title?: ReactNode | undefined;
  /** Detalle. */
  children?: ReactNode | undefined;
  /** Acciones (p. ej. `Button` `size="sm"`), bajo el texto. */
  actions?: ReactNode | undefined;
  /** Ícono propio en vez del del tono. Es decorativo. */
  icon?: ReactNode | undefined;
  /** Si se pasa, muestra un botón para cerrar. Quien lo usa decide si lo quita. */
  onDismiss?: (() => void) | undefined;
  /** Nombre del botón de cerrar. Por defecto "Cerrar aviso". */
  dismissLabel?: string | undefined;
  /**
   * Prefijo oculto que dice el tipo de aviso ("Error:"), para que el lector de
   * pantalla no dependa del color ni del ícono. Por defecto según el tono.
   */
  toneLabel?: string | undefined;
}

/* Clases escritas completas para que Tailwind las encuentre. */
const toneClasses: Record<Tone, { box: string; icon: string }> = {
  neutral: { box: 'bg-ui-surface-muted border-ui-border-subtle', icon: 'text-ui-fg' },
  primary: { box: 'bg-ui-primary-soft border-ui-primary/40', icon: 'text-ui-primary' },
  success: { box: 'bg-ui-success-soft border-ui-success/40', icon: 'text-ui-success' },
  warning: { box: 'bg-ui-warning-soft border-ui-warning/40', icon: 'text-ui-warning' },
  danger: { box: 'bg-ui-danger-soft border-ui-danger/40', icon: 'text-ui-danger' },
};

const toneIcons: Record<Tone, ReactNode> = {
  neutral: <IconInfo />,
  primary: <IconInfo />,
  success: <IconCircleCheck />,
  warning: <IconTriangleAlert />,
  danger: <IconCircleAlert />,
};

const variantClasses = {
  inline: 'rounded-md border',
  banner: 'border-y',
} as const;

/**
 * Aviso en línea: un mensaje que se queda en la página (no es un Toast). El
 * tipo se transmite con color, ícono y un prefijo oculto ("Error:").
 *
 * No anuncia nada por sí solo: si aparece después de una acción, pásale
 * `role="alert"` (urgente) o `role="status"` (informativo). Ver la documentación.
 */
export function Alert({
  tone = 'primary',
  variant = 'inline',
  title,
  children,
  actions,
  icon,
  onDismiss,
  dismissLabel,
  toneLabel,
  className,
  ...props
}: AlertProps) {
  const messages = useMessages();
  const prefix = toneLabel ?? messages['alert.tone'](tone);

  return (
    <div
      data-tone={tone}
      className={cn(
        'flex items-start gap-3 px-4 py-3 text-ui-body-sm text-ui-fg',
        variantClasses[variant],
        toneClasses[tone].box,
        className,
      )}
      {...props}
    >
      {/* Alto de una línea para quedar centrado con la primera línea */}
      <span
        aria-hidden="true"
        className={cn('inline-flex h-[1lh] shrink-0 items-center [&_svg]:size-5', toneClasses[tone].icon)}
      >
        {icon ?? toneIcons[tone]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <p className="font-ui-semibold">
            <VisuallyHidden>{prefix}: </VisuallyHidden>
            {title}
          </p>
        ) : (
          <VisuallyHidden>{prefix}: </VisuallyHidden>
        )}
        {children && <div>{children}</div>}
        {actions && <div className="mt-2 flex flex-wrap gap-2">{actions}</div>}
      </div>
      {onDismiss && (
        <IconButton
          size="sm"
          label={dismissLabel ?? messages['alert.dismiss']}
          onClick={onDismiss}
          className="-my-1.5 -me-2"
        >
          <IconX />
        </IconButton>
      )}
    </div>
  );
}

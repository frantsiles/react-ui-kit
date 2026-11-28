import type { ComponentProps } from 'react';
import { cn, focusRing } from '@my-ui/core';
import { IconExternalLink } from '@my-ui/icons';
import { useMessages } from '../fundamentos/locale-provider';
import { VisuallyHidden } from '../fundamentos/visually-hidden';

export interface LinkProps extends ComponentProps<'a'> {
  /** Destino. Obligatorio: sin `href` no es un enlace (usa `Button`). */
  href: string;
  /** `primary` para enlaces sueltos o en texto; `neutral` cuando el color no debe llamar la atención. */
  tone?: 'primary' | 'neutral' | undefined;
  /**
   * Abre en una pestaña nueva (`target="_blank"`, `rel="noopener noreferrer"`),
   * con ícono y aviso para lectores de pantalla.
   */
  external?: boolean | undefined;
  /** Aviso de `external`. Por defecto "(se abre en una pestaña nueva)". */
  newTabLabel?: string | undefined;
}

const toneClasses = {
  primary: 'text-ui-primary hover:text-ui-primary-hover',
  neutral: 'text-ui-fg hover:text-ui-fg-hover',
} as const;

/**
 * Enlace sobre un `<a>` nativo: navega a otra página o a otra parte de la
 * misma. Para disparar una acción, usa `Button`.
 *
 * Siempre subrayado: el color solo no distingue un enlace del texto que lo
 * rodea (WCAG 1.4.1). Toma el tamaño de letra de su contenedor.
 */
export function Link({
  tone = 'primary',
  external = false,
  newTabLabel,
  className,
  children,
  target,
  rel,
  ...props
}: LinkProps) {
  const messages = useMessages();
  return (
    <a
      target={external ? '_blank' : target}
      rel={external ? ['noopener', 'noreferrer', rel].filter(Boolean).join(' ') : rel}
      className={cn(
        'cursor-pointer rounded-xs underline decoration-1 underline-offset-[0.2em]',
        'transition-colors duration-(--ui-duration-fast) ease-ui-standard hover:decoration-2',
        toneClasses[tone],
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
      {external && (
        <>
          {/* Ícono pegado a la última palabra para que no quede solo en otra línea */}
          <IconExternalLink className="ms-0.5 inline-block align-[-0.125em]" />{' '}
          <VisuallyHidden>{newTabLabel ?? messages['link.newTab']}</VisuallyHidden>
        </>
      )}
    </a>
  );
}

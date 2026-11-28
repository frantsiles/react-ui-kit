import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';
import { IconCircleAlert } from '@my-ui/icons';

export type ErrorMessageProps = ComponentProps<'p'>;

/**
 * Mensaje de error de un campo. Lleva ícono además del color rojo, para que el
 * error no dependa solo del color (WCAG 1.4.1). Dentro de un `Field` se conecta
 * con aria-describedby y marca el control con aria-invalid.
 *
 * Redáctalo diciendo cómo corregir: "Ingresa un correo como nombre@dominio.com",
 * no "Formato inválido".
 */
export function ErrorMessage({ className, children, ...props }: ErrorMessageProps) {
  return (
    <p
      className={cn('flex items-start gap-1.5 text-ui-body-sm text-ui-danger', className)}
      {...props}
    >
      <IconCircleAlert size="sm" className="mt-0.5" />
      <span>{children}</span>
    </p>
  );
}

import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';

export type HelpTextProps = ComponentProps<'p'>;

/**
 * Texto de ayuda de un campo (formato esperado, restricciones). Dentro de un
 * `Field` se conecta al control con aria-describedby automáticamente.
 */
export function HelpText({ className, ...props }: HelpTextProps) {
  return <p className={cn('text-sm text-ui-fg-muted', className)} {...props} />;
}

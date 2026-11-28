import { cn, fieldFocusRing } from '@my-ui/core';
import type { ControlSize } from './types';

/**
 * Texto en 16px en móvil (evita el zoom automático de iOS al enfocar) y en
 * 14px desde `sm` para los tamaños sm/md.
 */
export const controlSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-ui-control-sm gap-1.5 px-2.5 text-ui-body ui-sm:text-ui-body-sm',
  md: 'min-h-ui-control-md gap-2 px-3 text-ui-body ui-sm:text-ui-body-sm',
  lg: 'min-h-ui-control-lg gap-2 px-4 text-ui-body',
};

export function fieldBoxClasses({
  invalid,
  disabled,
  readOnly,
}: {
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
}) {
  return cn(
    'w-full rounded-md border bg-ui-surface text-ui-fg',
    'transition-colors duration-(--ui-duration-fast) ease-ui-standard',
    fieldFocusRing,
    invalid ? 'border-ui-danger' : 'border-ui-border hover:border-ui-border-hover',
    readOnly && 'bg-ui-surface-muted',
    disabled &&
      'cursor-not-allowed border-ui-border-subtle bg-ui-surface-disabled text-ui-fg-disabled hover:border-ui-border-subtle',
  );
}

import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';
import { useFieldControl } from './field';
import { fieldBoxClasses } from './field-styles';
import type { ControlSize } from './types';

export interface TextareaProps extends ComponentProps<'textarea'> {
  size?: ControlSize | undefined;
  invalid?: boolean | undefined;
}

const paddingClasses: Record<ControlSize, string> = {
  sm: 'px-2.5 py-1.5 text-ui-body ui-sm:text-ui-body-sm',
  md: 'px-3 py-2 text-ui-body ui-sm:text-ui-body-sm',
  lg: 'px-4 py-3 text-ui-body',
};

/** Texto de varias líneas. Redimensionable solo en vertical para no romper el layout. */
export function Textarea({ className, rows = 3, readOnly = false, ...props }: TextareaProps) {
  const { size, invalid, ...textareaProps } = useFieldControl(props);

  return (
    <textarea
      rows={rows}
      readOnly={readOnly}
      className={cn(
        'block resize-y outline-hidden placeholder:text-ui-fg-muted',
        fieldBoxClasses({ invalid, disabled: Boolean(textareaProps.disabled), readOnly }),
        // el anillo de foco va en el propio textarea (no hay contenedor)
        'focus-visible:outline-solid focus-visible:outline-[length:var(--ui-focus-ring-width)] focus-visible:outline-offset-[var(--ui-focus-ring-offset)] focus-visible:outline-ui-focus',
        paddingClasses[size],
        className,
      )}
      {...textareaProps}
    />
  );
}

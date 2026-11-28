import { useMemo, type ComponentProps } from 'react';
import { cn } from '@my-ui/core';
import type { ControlSize, Tone } from '../fundamentos/types';
import { ButtonGroupContext, type ButtonVariant } from './button';

export interface ButtonGroupProps extends ComponentProps<'div'> {
  /**
   * Botones pegados, como un control segmentado. Por defecto van separados.
   */
  attached?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Valores por defecto para los botones del grupo; la prop de cada botón gana. */
  size?: ControlSize | undefined;
  variant?: ButtonVariant | undefined;
  tone?: Tone | undefined;
  disabled?: boolean | undefined;
}

const attachedClasses = {
  horizontal:
    '[&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none',
  vertical:
    '[&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
};

/**
 * Agrupa botones relacionados (`role="group"`). Dale nombre con `aria-label`
 * si el grupo tiene sentido por sí mismo ("Formato de texto").
 *
 * Cada botón sigue siendo una parada de Tab. Para una barra de herramientas
 * con navegación por flechas (patrón APG Toolbar) usa Toolbar, cuando exista.
 */
export function ButtonGroup({
  attached = false,
  orientation = 'horizontal',
  size,
  variant,
  tone,
  disabled,
  className,
  ...props
}: ButtonGroupProps) {
  const defaults = useMemo(
    () => ({ size, variant, tone, disabled }),
    [size, variant, tone, disabled],
  );

  return (
    <ButtonGroupContext value={defaults}>
      <div
        role="group"
        data-orientation={orientation}
        className={cn(
          'inline-flex',
          orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row flex-wrap',
          // Al pegar los botones, el enfocado o con hover queda encima para que se vea su borde y su anillo
          attached
            ? cn(attachedClasses[orientation], '[&>*]:relative [&>*:focus-visible]:z-10 [&>*:hover]:z-10')
            : 'gap-2',
          className,
        )}
        {...props}
      />
    </ButtonGroupContext>
  );
}

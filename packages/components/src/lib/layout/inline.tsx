import type { ComponentProps, ElementType, Ref } from 'react';
import { cn } from '@my-ui/core';
import {
  alignClasses,
  gapClasses,
  justifyClasses,
  listRole,
  type FlexAlign,
  type FlexElement,
  type FlexGap,
  type FlexJustify,
} from './flex';

export interface InlineProps extends Omit<ComponentProps<'div'>, 'ref'> {
  /** Elemento HTML. `ul`/`ol` para listas (mantienen su rol), `nav`, `footer`… */
  as?: FlexElement | undefined;
  /** Espacio entre hijos, de la escala `--ui-space-*`. */
  gap?: FlexGap | undefined;
  /** Alineación vertical de los hijos. */
  align?: FlexAlign | undefined;
  /** Reparto horizontal. `between` separa a los extremos. */
  justify?: FlexJustify | undefined;
  /**
   * Pasa a la línea siguiente cuando no entra (por defecto). Sin wrap, el
   * contenido se desborda a 320 px o con zoom al 200 %: úsalo con cuidado.
   */
  wrap?: boolean | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Pone sus hijos en fila con un espacio constante y los pasa a la línea
 * siguiente cuando no entran. Para grupos de botones, etiquetas, metadatos.
 *
 * Sigue la dirección del texto: en RTL el primer hijo queda a la derecha.
 */
export function Inline({
  as: Element = 'div',
  gap = 'sm',
  align = 'center',
  justify,
  wrap = true,
  className,
  ref,
  ...props
}: InlineProps) {
  // ElementType: las props de un <div> valen para cualquiera de los elementos permitidos
  const Component = Element as ElementType;
  return (
    <Component
      ref={ref}
      role={listRole(Element)}
      className={cn(
        'm-0 flex flex-row p-0',
        wrap ? 'flex-wrap' : 'flex-nowrap',
        gapClasses[gap],
        alignClasses[align],
        justify && justifyClasses[justify],
        className,
      )}
      {...props}
    />
  );
}

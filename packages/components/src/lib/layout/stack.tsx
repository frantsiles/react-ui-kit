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

export interface StackProps extends Omit<ComponentProps<'div'>, 'ref'> {
  /** Elemento HTML. `ul`/`ol` para listas (mantienen su rol), `section`, `form`… */
  as?: FlexElement | undefined;
  /** Espacio entre hijos, de la escala `--ui-space-*`. */
  gap?: FlexGap | undefined;
  /** Alineación horizontal de los hijos. Por defecto ocupan todo el ancho. */
  align?: Exclude<FlexAlign, 'baseline'> | undefined;
  /** Reparto vertical (solo si el Stack es más alto que su contenido). */
  justify?: FlexJustify | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Apila sus hijos en vertical con un espacio constante. Reemplaza márgenes
 * sueltos entre bloques: el espacio lo decide el contenedor, no cada hijo.
 */
export function Stack({
  as: Element = 'div',
  gap = 'md',
  align = 'stretch',
  justify,
  className,
  ref,
  ...props
}: StackProps) {
  // ElementType: las props de un <div> valen para cualquiera de los elementos permitidos
  const Component = Element as ElementType;
  return (
    <Component
      ref={ref}
      role={listRole(Element)}
      className={cn(
        'm-0 flex flex-col p-0',
        gapClasses[gap],
        alignClasses[align],
        justify && justifyClasses[justify],
        className,
      )}
      {...props}
    />
  );
}

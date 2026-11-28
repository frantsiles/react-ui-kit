import { useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type Ref } from 'react';
import { cn, focusRing } from '@my-ui/core';
import { mergeRefs } from '../internal/merge-refs';

export type ScrollOrientation = 'vertical' | 'horizontal' | 'both';

interface ScrollAreaBaseProps extends Omit<ComponentProps<'div'>, 'ref' | 'aria-label' | 'aria-labelledby'> {
  /** Dirección del scroll. Por defecto vertical. */
  orientation?: ScrollOrientation | undefined;
  /** Alto máximo (cualquier longitud CSS, p. ej. `'20rem'`). También sirve `className`. */
  maxHeight?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** El nombre es obligatorio: la zona recibe el foco y el lector de pantalla la anuncia. */
export type ScrollAreaProps = ScrollAreaBaseProps &
  ({ 'aria-label': string; 'aria-labelledby'?: undefined } | { 'aria-labelledby': string; 'aria-label'?: undefined });

const orientationClasses: Record<ScrollOrientation, string> = {
  vertical: 'overflow-y-auto [scrollbar-gutter:stable]',
  horizontal: 'overflow-x-auto',
  both: 'overflow-auto',
};

/**
 * Zona con scroll propio que se puede recorrer con teclado: recibe el foco
 * (`Tab`) solo cuando su contenido desborda, y entonces las flechas, `Re Pág`
 * y `Av Pág` la desplazan.
 */
export function ScrollArea({
  orientation = 'vertical',
  maxHeight,
  className,
  style,
  ref,
  ...props
}: ScrollAreaProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  // Enfocable por defecto (render en servidor); se corrige al medir.
  const [overflowing, setOverflowing] = useState(true);

  useLayoutEffect(() => {
    const element = innerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const measure = () =>
      setOverflowing(
        element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth,
      );
    const resizeObserver = new ResizeObserver(measure);
    const observeChildren = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(element);
      for (const child of Array.from(element.children)) resizeObserver.observe(child);
    };
    // Contenido que entra o sale: medir de nuevo y observar a los hijos nuevos.
    const mutationObserver = new MutationObserver(() => {
      observeChildren();
      measure();
    });

    observeChildren();
    measure();
    mutationObserver.observe(element, { childList: true, subtree: true, characterData: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const mergedStyle: CSSProperties | undefined = maxHeight ? { maxHeight, ...style } : style;

  return (
    <div
      ref={mergeRefs(innerRef, ref)}
      role="region"
      tabIndex={overflowing ? 0 : undefined}
      style={mergedStyle}
      className={cn('min-w-0 overscroll-contain', orientationClasses[orientation], focusRing, className)}
      {...props}
    />
  );
}

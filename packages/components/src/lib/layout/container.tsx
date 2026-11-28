import type { ComponentProps, ElementType, Ref } from 'react';
import { cn } from '@my-ui/core';

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'prose' | 'full';

export interface ContainerProps extends Omit<ComponentProps<'div'>, 'ref'> {
  /** `main` para el contenido principal, `section`, `header`, `footer`… */
  as?: 'div' | 'main' | 'section' | 'article' | 'header' | 'footer' | undefined;
  /**
   * Ancho máximo. `prose` limita a unos 65 caracteres (textos largos);
   * `full` no limita.
   */
  width?: ContainerWidth | undefined;
  /** Márgenes laterales que crecen con la pantalla. Por defecto, sí. */
  gutter?: boolean | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/* Clases escritas completas para que Tailwind las encuentre. */
const widthClasses: Record<ContainerWidth, string> = {
  sm: 'max-w-(--container-ui-md)', // 36rem: formularios, diálogos de página
  md: 'max-w-(--container-ui-lg)', // 48rem
  lg: 'max-w-(--container-ui-xl)', // 64rem: por defecto
  xl: 'max-w-(--breakpoint-ui-xl)', // 80rem: tablas y paneles anchos
  prose: 'max-w-(--ui-measure)',
  full: 'max-w-none',
};

/**
 * Centra el contenido de una página con un ancho máximo y márgenes laterales.
 * También es un `@container`: los bloques de adentro (Grid, Card) pueden
 * adaptarse a su ancho con container queries.
 */
export function Container({
  as: Element = 'div',
  width = 'lg',
  gutter = true,
  className,
  ref,
  ...props
}: ContainerProps) {
  const Component = Element as ElementType;
  return (
    <Component
      ref={ref}
      className={cn(
        '@container mx-auto w-full',
        widthClasses[width],
        gutter && 'px-ui-md ui-md:px-ui-lg ui-lg:px-ui-xl',
        className,
      )}
      {...props}
    />
  );
}

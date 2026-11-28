import type { CSSProperties, ComponentProps, ElementType, Ref } from 'react';
import { cn, type containerSizes } from '@my-ui/core';
import { gapClasses, listRole, type FlexElement, type FlexGap } from './flex';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;
export type ContainerSize = keyof typeof containerSizes;

/** Columnas según el ancho del contenedor: `{ base: 1, sm: 2, lg: 3 }`. */
export type ResponsiveColumns = { base?: GridColumns } & Partial<Record<ContainerSize, GridColumns>>;

export interface GridProps extends Omit<ComponentProps<'div'>, 'ref'> {
  as?: FlexElement | undefined;
  /**
   * Ancho mínimo de cada columna: entran tantas como quepan y pasan a la fila
   * siguiente solas, sin breakpoints. Un tamaño de contenedor (`'xs'` = 20rem)
   * o una longitud CSS (`'14rem'`). Lo más simple para tarjetas y listas.
   */
  minItemWidth?: ContainerSize | string | undefined;
  /**
   * Columnas fijas, o por ancho del contenedor (`{ base: 1, md: 2, lg: 3 }`).
   * Con objeto, el Grid se envuelve en un `@container`.
   */
  columns?: GridColumns | ResponsiveColumns | undefined;
  /** Espacio entre filas y columnas, de la escala `--ui-space-*`. */
  gap?: FlexGap | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/* Clases escritas completas para que Tailwind las encuentre. */
const baseColumns: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const containerColumns: Record<ContainerSize, Record<GridColumns, string>> = {
  xs: {
    1: '@ui-xs:grid-cols-1',
    2: '@ui-xs:grid-cols-2',
    3: '@ui-xs:grid-cols-3',
    4: '@ui-xs:grid-cols-4',
    5: '@ui-xs:grid-cols-5',
    6: '@ui-xs:grid-cols-6',
  },
  sm: {
    1: '@ui-sm:grid-cols-1',
    2: '@ui-sm:grid-cols-2',
    3: '@ui-sm:grid-cols-3',
    4: '@ui-sm:grid-cols-4',
    5: '@ui-sm:grid-cols-5',
    6: '@ui-sm:grid-cols-6',
  },
  md: {
    1: '@ui-md:grid-cols-1',
    2: '@ui-md:grid-cols-2',
    3: '@ui-md:grid-cols-3',
    4: '@ui-md:grid-cols-4',
    5: '@ui-md:grid-cols-5',
    6: '@ui-md:grid-cols-6',
  },
  lg: {
    1: '@ui-lg:grid-cols-1',
    2: '@ui-lg:grid-cols-2',
    3: '@ui-lg:grid-cols-3',
    4: '@ui-lg:grid-cols-4',
    5: '@ui-lg:grid-cols-5',
    6: '@ui-lg:grid-cols-6',
  },
  xl: {
    1: '@ui-xl:grid-cols-1',
    2: '@ui-xl:grid-cols-2',
    3: '@ui-xl:grid-cols-3',
    4: '@ui-xl:grid-cols-4',
    5: '@ui-xl:grid-cols-5',
    6: '@ui-xl:grid-cols-6',
  },
};

const sizeOrder: ContainerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const isContainerSize = (value: string): value is ContainerSize =>
  (sizeOrder as string[]).includes(value);

function columnClasses(columns: GridColumns | ResponsiveColumns) {
  if (typeof columns === 'number') return baseColumns[columns];
  return cn(
    baseColumns[columns.base ?? 1],
    sizeOrder.map((size) => {
      const count = columns[size];
      return count ? containerColumns[size][count] : undefined;
    }),
  );
}

/**
 * Columnas que se reacomodan según el espacio **de su contenedor**, no de la
 * pantalla: el mismo Grid funciona en una barra lateral angosta y en el centro
 * de la página.
 *
 * - `minItemWidth`: tantas columnas como quepan (lo más simple).
 * - `columns`: columnas fijas o por tamaño de contenedor.
 *
 * Sin ninguno de los dos, una sola columna.
 */
export function Grid({
  as: Element = 'div',
  minItemWidth,
  columns,
  gap = 'md',
  className,
  style,
  ref,
  ...props
}: GridProps) {
  const Component = Element as ElementType;
  const minWidth =
    minItemWidth === undefined
      ? undefined
      : isContainerSize(minItemWidth)
        ? `var(--container-ui-${minItemWidth})`
        : minItemWidth;

  const grid = (
    <Component
      ref={ref}
      role={listRole(Element)}
      className={cn(
        'm-0 grid p-0',
        gapClasses[gap],
        minWidth
          ? // min(…, 100%): una columna nunca es más ancha que el contenedor (sin scroll a 320 px)
            'grid-cols-[repeat(auto-fill,minmax(min(var(--ui-grid-min),100%),1fr))]'
          : columnClasses(columns ?? 1),
        className,
      )}
      style={minWidth ? ({ '--ui-grid-min': minWidth, ...style } as CSSProperties) : style}
      {...props}
    />
  );

  // Las container queries miran a un ancestro: con columnas por tamaño, el Grid trae el suyo
  if (columns !== undefined && typeof columns === 'object' && !minWidth) {
    return <div className="@container">{grid}</div>;
  }
  return grid;
}

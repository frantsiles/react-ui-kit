import type { ComponentProps } from 'react';
import { cn } from '@my-ui/core';

export type SkeletonShape = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** `text`: líneas de texto; `rect`: bloques (imágenes, tarjetas); `circle`: avatares. */
  shape?: SkeletonShape | undefined;
  /** Solo con `shape="text"`: cantidad de líneas. La última es más corta. */
  lines?: number | undefined;
}

const base =
  // Borde transparente: en colores forzados el navegador lo pinta y la forma se sigue viendo
  'block border border-transparent bg-ui-surface-muted animate-pulse motion-reduce:animate-none';

const shapeClasses: Record<Exclude<SkeletonShape, 'text'>, string> = {
  rect: 'h-24 w-full rounded-md',
  circle: 'size-10 rounded-full',
};

/**
 * Lugar reservado para contenido que todavía carga. Mantiene el layout estable
 * (evita saltos) y es decorativo: se oculta a los lectores de pantalla. Quien
 * lo usa anuncia la carga (ver la documentación).
 *
 * Tamaño con `className` (`h-*`, `w-*`, `size-*`).
 */
export function Skeleton({ shape = 'text', lines = 1, className, ...props }: SkeletonProps) {
  if (shape !== 'text') {
    return (
      <span
        aria-hidden="true"
        data-slot="skeleton"
        className={cn(base, shapeClasses[shape], className)}
        {...props}
      />
    );
  }

  const count = Math.max(1, Math.floor(lines));
  return (
    <span
      aria-hidden="true"
      data-slot="skeleton"
      className={cn('flex w-full flex-col gap-2', className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            base,
            // Alto de una línea de texto del cuerpo
            'h-[1lh] rounded-sm text-ui-body',
            count > 1 && index === count - 1 ? 'w-3/5' : 'w-full',
          )}
        />
      ))}
    </span>
  );
}

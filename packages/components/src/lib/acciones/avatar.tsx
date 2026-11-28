import { useState, type ComponentProps } from 'react';
import { cn } from '@my-ui/core';
import { useLocale } from '../fundamentos/locale-provider';
import type { ControlSize } from '../fundamentos/types';

export interface AvatarProps extends Omit<ComponentProps<'span'>, 'children' | 'role'> {
  /** Nombre de la persona o entidad. Da el nombre accesible y las iniciales. */
  name: string;
  /** URL de la imagen. Si falta o no carga, se muestran las iniciales. */
  src?: string | undefined;
  size?: ControlSize | undefined;
  /**
   * Oculto para lectores de pantalla. Úsalo cuando el nombre ya está escrito
   * al lado: así no se lee dos veces.
   */
  decorative?: boolean | undefined;
}

const sizeClasses: Record<ControlSize, string> = {
  sm: 'size-6 text-ui-caption',
  md: 'size-8 text-ui-label',
  lg: 'size-10 text-ui-body',
};

/** Iniciales: primera letra de la primera y la última palabra ("Ana María Pérez" → "AP"). */
export function initialsOf(name: string, locale?: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0];
  const last = words.length > 1 ? words[words.length - 1] : undefined;
  // Array.from separa por caracteres, no por unidades UTF-16 (nombres con tildes o emojis)
  const letter = (word: string | undefined) => (word ? (Array.from(word)[0] ?? '') : '');
  return (letter(first) + letter(last)).toLocaleUpperCase(locale);
}

/**
 * Imagen o iniciales que representan a una persona o entidad. Las iniciales
 * quedan debajo de la imagen: se ven mientras carga y si falla.
 *
 * El nombre accesible es `name` (`role="img"`); la imagen interna es decorativa.
 */
export function Avatar({
  name,
  src,
  size = 'md',
  decorative = false,
  className,
  ...props
}: AvatarProps) {
  const { locale } = useLocale();
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = Boolean(src) && failedSrc !== src;
  const a11y = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img', 'aria-label': name };

  return (
    <span
      data-slot="avatar"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none',
        'border border-ui-border-subtle bg-ui-surface-muted font-ui-semibold text-ui-fg',
        sizeClasses[size],
        className,
      )}
      {...a11y}
      {...props}
    >
      <span aria-hidden="true">{initialsOf(name, locale)}</span>
      {showImage && (
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      )}
    </span>
  );
}

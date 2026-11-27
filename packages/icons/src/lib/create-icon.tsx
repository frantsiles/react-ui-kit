import { createElement, type Ref, type SVGProps } from 'react';

/** Tamaños en px alineados con la escala tipográfica del kit. */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof iconSizes;

/** Nodo de ícono: [etiqueta SVG, atributos]. */
export type IconNode = ReadonlyArray<
  readonly [tag: string, attrs: Readonly<Record<string, string>>]
>;

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'> {
  /**
   * Tamaño del ícono. Por defecto `1em`: escala con el tamaño de letra del
   * texto que lo rodea (y con el zoom del navegador).
   */
  size?: IconSize | number;
  /**
   * Nombre accesible. Úsalo SOLO si el ícono transmite información que no está
   * en el texto de al lado (p. ej. un ícono de estado sin texto).
   * Sin `label`, el ícono es decorativo y queda oculto a lectores de pantalla.
   */
  label?: string;
  /** Grosor del trazo. */
  strokeWidth?: number;
  ref?: Ref<SVGSVGElement>;
}

export interface CreateIconOptions {
  /** Espejar horizontalmente cuando el texto va de derecha a izquierda. */
  mirrorInRtl?: boolean;
}

export type IconComponent = ((props: IconProps) => React.JSX.Element) & {
  displayName: string;
};

export function createIcon(
  name: string,
  node: IconNode,
  { mirrorInRtl = false }: CreateIconOptions = {},
): IconComponent {
  const Icon = ({
    size,
    label,
    strokeWidth = 2,
    className,
    ref,
    ...rest
  }: IconProps) => {
    const dimension =
      size === undefined ? '1em' : typeof size === 'number' ? size : iconSizes[size];
    const isMeaningful = Boolean(label || rest['aria-labelledby']);

    const classes = ['shrink-0', mirrorInRtl && 'rtl:-scale-x-100', className]
      .filter(Boolean)
      .join(' ');

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={dimension}
        height={dimension}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        data-icon={name}
        className={classes}
        ref={ref}
        {...(isMeaningful
          ? { role: 'img', 'aria-label': label }
          : { 'aria-hidden': true })}
        {...rest}
      >
        {node.map(([tag, attrs], index) =>
          createElement(tag, { key: index, ...attrs }),
        )}
      </svg>
    );
  };

  Icon.displayName = `Icon${name}`;
  return Icon;
}

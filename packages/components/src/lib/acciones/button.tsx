import { createContext, use, type ComponentProps, type ReactNode } from 'react';
import { cn, focusRing } from '@my-ui/core';
import type { ControlSize, Tone } from '../fundamentos/types';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';

/** Valores por defecto que un `ButtonGroup` pasa a sus botones. */
export interface ButtonDefaults {
  size?: ControlSize | undefined;
  variant?: ButtonVariant | undefined;
  tone?: Tone | undefined;
  disabled?: boolean | undefined;
}

export const ButtonGroupContext = createContext<ButtonDefaults>({});

export interface ButtonProps extends ComponentProps<'button'> {
  /** Estilo visual, sin significado: `solid` para la acción principal, `outline` secundaria, `ghost` terciaria. */
  variant?: ButtonVariant | undefined;
  /** Significado: `danger` para acciones destructivas. */
  tone?: Tone | undefined;
  size?: ControlSize | undefined;
  /** Ícono decorativo antes del texto. */
  startIcon?: ReactNode;
  /** Ícono decorativo después del texto. */
  endIcon?: ReactNode;
}

/* Clases escritas completas para que Tailwind las encuentre. */
const solid: Record<Tone, string> = {
  neutral: 'bg-ui-fg enabled:hover:bg-ui-fg-hover',
  primary: 'bg-ui-primary enabled:hover:bg-ui-primary-hover',
  success: 'bg-ui-success enabled:hover:bg-ui-success-hover',
  warning: 'bg-ui-warning enabled:hover:bg-ui-warning-hover',
  danger: 'bg-ui-danger enabled:hover:bg-ui-danger-hover',
};

const outline: Record<Tone, string> = {
  neutral: 'border-ui-border text-ui-fg enabled:hover:bg-ui-surface-muted',
  primary: 'border-ui-primary text-ui-primary enabled:hover:bg-ui-primary-soft',
  success: 'border-ui-success text-ui-success enabled:hover:bg-ui-success-soft',
  warning: 'border-ui-warning text-ui-warning enabled:hover:bg-ui-warning-soft',
  danger: 'border-ui-danger text-ui-danger enabled:hover:bg-ui-danger-soft',
};

const ghost: Record<Tone, string> = {
  neutral: 'text-ui-fg enabled:hover:bg-ui-surface-muted',
  primary: 'text-ui-primary enabled:hover:bg-ui-primary-soft',
  success: 'text-ui-success enabled:hover:bg-ui-success-soft',
  warning: 'text-ui-warning enabled:hover:bg-ui-warning-soft',
  danger: 'text-ui-danger enabled:hover:bg-ui-danger-soft',
};

const variantClasses: Record<ButtonVariant, (tone: Tone) => string> = {
  // Borde transparente: en colores forzados el navegador lo pinta y el botón conserva su forma
  solid: (tone) => cn('border-transparent text-ui-surface', solid[tone]),
  outline: (tone) => cn('bg-transparent', outline[tone]),
  ghost: (tone) => cn('border-transparent bg-transparent', ghost[tone]),
};

const disabledClasses: Record<ButtonVariant, string> = {
  solid: 'disabled:bg-ui-surface-disabled disabled:text-ui-fg-disabled',
  outline: 'disabled:border-ui-border-subtle disabled:text-ui-fg-disabled',
  ghost: 'disabled:text-ui-fg-disabled',
};

export const buttonSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-ui-control-sm gap-1.5 px-3 text-ui-label',
  md: 'min-h-ui-control-md gap-2 px-4 text-ui-label',
  lg: 'min-h-ui-control-lg gap-2 px-5 text-ui-body font-ui-medium',
};

/** Clases de un botón; las comparten Button e IconButton. */
export function buttonClasses(variant: ButtonVariant, tone: Tone) {
  return cn(
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border select-none',
    'transition-colors duration-(--ui-duration-fast) ease-ui-standard',
    'disabled:cursor-not-allowed',
    variantClasses[variant](tone),
    disabledClasses[variant],
    focusRing,
  );
}

/**
 * Une las props del botón con los valores del `ButtonGroup`. Orden: prop del
 * botón, valor del grupo, valor por defecto del componente.
 */
export function useButtonDefaults(
  { size, variant, tone, disabled }: ButtonDefaults,
  fallback: { variant: ButtonVariant; tone: Tone } = { variant: 'solid', tone: 'primary' },
) {
  const group = use(ButtonGroupContext);
  return {
    size: size ?? group.size ?? 'md',
    variant: variant ?? group.variant ?? fallback.variant,
    tone: tone ?? group.tone ?? fallback.tone,
    disabled: disabled ?? group.disabled ?? false,
  };
}

/**
 * Botón sobre un `<button>` nativo: foco, Enter/Espacio, envío de formularios
 * y `disabled` funcionan como en HTML. Patrón ARIA APG: Button.
 *
 * - `type="button"` por defecto, para no enviar un formulario por accidente.
 *   Usa `type="submit"` en el botón que envía.
 * - Una acción principal por vista (`solid`); el resto, `outline` o `ghost`.
 * - Para navegar a otra página usa un enlace, no un botón.
 */
export function Button({
  variant: variantProp,
  tone: toneProp,
  size: sizeProp,
  disabled: disabledProp,
  startIcon,
  endIcon,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  const { size, variant, tone, disabled } = useButtonDefaults({
    size: sizeProp,
    variant: variantProp,
    tone: toneProp,
    disabled: disabledProp,
  });

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(buttonClasses(variant, tone), buttonSizeClasses[size], className)}
      {...props}
    >
      {startIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {endIcon}
        </span>
      )}
    </button>
  );
}

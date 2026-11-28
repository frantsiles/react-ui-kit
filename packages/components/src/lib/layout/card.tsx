import {
  createContext,
  use,
  useId,
  useLayoutEffect,
  useState,
  type ComponentProps,
  type ElementType,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '@my-ui/core';
import { Heading, type HeadingLevel } from '../acciones/heading';

export type CardVariant = 'outline' | 'raised' | 'subtle';
export type CardElement = 'div' | 'section' | 'article' | 'aside' | 'li';

export interface CardProps extends Omit<ComponentProps<'div'>, 'ref'> {
  /**
   * Elemento HTML. `section`, `article` y `aside` se nombran solos con el
   * título de `CardHeader`; `li` para tarjetas dentro de una lista.
   */
  as?: CardElement | undefined;
  /** `outline` (borde, por defecto), `raised` (sombra) o `subtle` (fondo atenuado, el "panel"). */
  variant?: CardVariant | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

interface CardContextValue {
  registerTitle: (id: string | undefined) => void;
}

const CardContext = createContext<CardContextValue | null>(null);

/* El borde transparente de `subtle` reaparece con colores forzados. */
const variantClasses: Record<CardVariant, string> = {
  outline: 'border-ui-border-subtle bg-ui-surface',
  raised: 'border-ui-border-subtle bg-ui-surface-raised shadow-ui-raised',
  subtle: 'border-transparent bg-ui-surface-muted',
};

const namedElements = new Set<CardElement>(['section', 'article', 'aside']);

/**
 * Bloque de contenido con borde o fondo propio. Es un `@container`: lo de
 * adentro se acomoda al ancho de la tarjeta, no al de la pantalla.
 */
export function Card({ as: Element = 'div', variant = 'outline', className, ref, ...props }: CardProps) {
  const [titleId, setTitleId] = useState<string>();
  const Component = Element as ElementType;
  const labelled =
    namedElements.has(Element) && props['aria-label'] == null && props['aria-labelledby'] == null;

  return (
    <CardContext value={{ registerTitle: setTitleId }}>
      <Component
        ref={ref}
        aria-labelledby={labelled ? titleId : undefined}
        className={cn(
          '@container m-0 flex min-w-0 flex-col gap-ui-md rounded-lg border p-ui-lg text-ui-fg',
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    </CardContext>
  );
}

export interface CardHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Título de la tarjeta. Se muestra como encabezado (`h3` por defecto). */
  title: ReactNode;
  /** Nivel del encabezado según la estructura de la página. */
  headingLevel?: HeadingLevel | undefined;
  /** Texto secundario debajo del título. */
  description?: ReactNode;
  /** Acciones al costado del título (o debajo, si la tarjeta es angosta). */
  actions?: ReactNode;
}

export function CardHeader({
  title,
  headingLevel = 3,
  description,
  actions,
  className,
  ...props
}: CardHeaderProps) {
  const titleId = useId();
  const context = use(CardContext);
  const registerTitle = context?.registerTitle;

  useLayoutEffect(() => {
    registerTitle?.(titleId);
    return () => registerTitle?.(undefined);
  }, [registerTitle, titleId]);

  return (
    <div
      className={cn(
        'flex flex-col gap-ui-sm @ui-xs:flex-row @ui-xs:items-start @ui-xs:justify-between',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-ui-xs">
        <Heading level={headingLevel} size="sm" id={titleId}>
          {title}
        </Heading>
        {description && <p className="m-0 text-ui-body-sm text-ui-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-ui-sm">{actions}</div>}
    </div>
  );
}

export type CardBodyProps = ComponentProps<'div'>;

export function CardBody({ className, ...props }: CardBodyProps) {
  return <div className={cn('min-w-0 text-ui-body', className)} {...props} />;
}

export type CardFooterAlign = 'start' | 'end' | 'between';

export interface CardFooterProps extends ComponentProps<'div'> {
  /** Reparto de las acciones. Por defecto al final (a la derecha en LTR). */
  align?: CardFooterAlign | undefined;
}

const footerAlignClasses: Record<CardFooterAlign, string> = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
};

export function CardFooter({ align = 'end', className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-ui-sm', footerAlignClasses[align], className)}
      {...props}
    />
  );
}

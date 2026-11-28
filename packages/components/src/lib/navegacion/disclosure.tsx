import type { ReactNode } from 'react';
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel as AriaDisclosurePanel,
  type Key,
} from 'react-aria-components';
import { cn, focusRing } from '@my-ui/core';
import { IconChevronDown } from '@my-ui/icons';
import type { HeadingLevel } from '../acciones/heading';

interface SectionProps {
  /** Texto del botón que abre y cierra la sección. */
  title: ReactNode;
  /** Contenido de la sección. */
  children: ReactNode;
  /**
   * Nivel del encabezado que envuelve el botón, según dónde esté en la página.
   * Por defecto `h3`.
   */
  headingLevel?: Exclude<HeadingLevel, 1> | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

/** Encabezado + botón + panel. Base de `Disclosure` y `AccordionItem`. */
function Section({ title, children, headingLevel = 3, className }: Omit<SectionProps, 'disabled'>) {
  const HeadingTag = `h${headingLevel}` as const;
  return (
    <>
      {/* El botón va dentro de un encabezado: se puede saltar de sección en sección con el lector */}
      <HeadingTag className="m-0 text-ui-body font-ui-semibold">
        <AriaButton
          slot="trigger"
          className={cn(
            'flex min-h-11 w-full cursor-pointer items-center justify-between gap-ui-sm rounded-sm py-ui-sm text-start text-ui-fg',
            'hover:text-ui-fg-hover data-disabled:cursor-not-allowed data-disabled:text-ui-fg-disabled',
            focusRing,
          )}
        >
          <span className="min-w-0 flex-1">{title}</span>
          {/* La flecha gira al abrir; el estado lo anuncia aria-expanded */}
          <IconChevronDown className="size-4 shrink-0 text-ui-fg-muted transition-transform duration-(--ui-duration-fast) ease-ui-standard group-data-expanded/section:rotate-180" />
        </AriaButton>
      </HeadingTag>
      <AriaDisclosurePanel className={cn('text-ui-body-sm text-ui-fg', className)}>
        <div className="pb-ui-md">{children}</div>
      </AriaDisclosurePanel>
    </>
  );
}

export interface DisclosureProps extends SectionProps {
  /** Abierta (controlado). */
  open?: boolean | undefined;
  /** Abierta al inicio (no controlado). */
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
}

/**
 * Una sección que se abre y se cierra con su botón: detalles opcionales,
 * "Ver más", preguntas frecuentes sueltas. Para varias secciones juntas, usa
 * `Accordion`.
 */
export function Disclosure({ open, defaultOpen, onOpenChange, disabled, className, ...section }: DisclosureProps) {
  return (
    <AriaDisclosure
      {...(open !== undefined && { isExpanded: open })}
      {...(defaultOpen !== undefined && { defaultExpanded: defaultOpen })}
      {...(onOpenChange && { onExpandedChange: onOpenChange })}
      {...(disabled && { isDisabled: true })}
      className={cn('group/section', className)}
    >
      <Section {...section} />
    </AriaDisclosure>
  );
}

export interface AccordionProps {
  /** Los `AccordionItem`. */
  children: ReactNode;
  /** Permite tener varias secciones abiertas a la vez. Por defecto, abrir una cierra la otra. */
  multiple?: boolean | undefined;
  /** Secciones abiertas (controlado): los `value` de los `AccordionItem`. */
  value?: readonly string[] | undefined;
  /** Secciones abiertas al inicio (no controlado). */
  defaultValue?: readonly string[] | undefined;
  /** Se llama con todas las secciones abiertas tras cada cambio. */
  onChange?: ((value: string[]) => void) | undefined;
  /** Deshabilita todas las secciones. */
  disabled?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Varias secciones apiladas que se abren y cierran (preguntas frecuentes,
 * ajustes por grupos). Cada sección es un `AccordionItem`.
 */
export function Accordion({ children, multiple = false, value, defaultValue, onChange, disabled, className }: AccordionProps) {
  return (
    <AriaDisclosureGroup
      allowsMultipleExpanded={multiple}
      {...(value !== undefined && { expandedKeys: value })}
      {...(defaultValue !== undefined && { defaultExpandedKeys: defaultValue })}
      {...(onChange && { onExpandedChange: (keys: Set<Key>) => onChange(Array.from(keys, String)) })}
      {...(disabled && { isDisabled: true })}
      className={cn('flex flex-col border-t border-ui-border', className)}
    >
      {children}
    </AriaDisclosureGroup>
  );
}

export interface AccordionItemProps extends SectionProps {
  /** Identifica la sección en `value` / `onChange` del `Accordion`. Único. */
  value: string;
}

/** Una sección de `Accordion`. */
export function AccordionItem({ value, disabled, className, ...section }: AccordionItemProps) {
  return (
    <AriaDisclosure
      id={value}
      {...(disabled && { isDisabled: true })}
      className={cn('group/section border-b border-ui-border', className)}
    >
      <Section {...section} />
    </AriaDisclosure>
  );
}

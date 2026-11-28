import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';
import { Field, Input } from '@my-ui/components';

/* Las clases van escritas completas para que Tailwind las encuentre. */
const textStyles = [
  { name: 'display', className: 'text-ui-display', use: 'Portadas, cifras destacadas' },
  { name: 'heading-xl', className: 'text-ui-heading-xl', use: 'Título de página' },
  { name: 'heading-lg', className: 'text-ui-heading-lg', use: 'Título de sección' },
  { name: 'heading-md', className: 'text-ui-heading-md', use: 'Título de Card, Dialog' },
  { name: 'heading-sm', className: 'text-ui-heading-sm', use: 'Subtítulo, grupo de campos' },
  { name: 'body-lg', className: 'text-ui-body-lg', use: 'Texto introductorio' },
  { name: 'body', className: 'text-ui-body', use: 'Texto por defecto' },
  { name: 'body-sm', className: 'text-ui-body-sm', use: 'Ayuda, errores, tablas' },
  { name: 'label', className: 'text-ui-label', use: 'Etiquetas de controles' },
  { name: 'caption', className: 'text-ui-caption', use: 'Tags, badges, notas' },
];

function Frame({ children }: { children: ReactNode }) {
  return (
    <Unstyled>
      <div className="my-4 rounded-lg border border-ui-border-subtle bg-ui-surface p-4 text-ui-fg">
        {children}
      </div>
    </Unstyled>
  );
}

function TypeRow({ name, className, use }: (typeof textStyles)[number]) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [metrics, setMetrics] = useState('');

  useLayoutEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    const px = (value: string) => `${Math.round(parseFloat(value))}px`;
    setMetrics(`${px(style.fontSize)} / ${px(style.lineHeight)} · ${style.fontWeight}`);
  }, []);

  return (
    <li className="flex flex-col gap-1 border-b border-ui-border-subtle py-3 last:border-b-0 ui-sm:flex-row ui-sm:items-baseline ui-sm:gap-4">
      <code className="w-28 shrink-0 font-ui-mono text-ui-caption text-ui-fg-muted">{name}</code>
      <p ref={ref} className={`m-0 min-w-0 flex-1 ${className}`}>
        {use}
      </p>
      <span className="shrink-0 font-ui-mono text-ui-caption text-ui-fg-muted">{metrics}</span>
    </li>
  );
}

/** Escala tipográfica con los valores reales calculados por el navegador. */
export function TypeScale() {
  return (
    <Frame>
      <ul className="m-0 list-none p-0">
        {textStyles.map((style) => (
          <TypeRow key={style.name} {...style} />
        ))}
      </ul>
    </Frame>
  );
}

const elevations = [
  { name: 'raised', className: 'shadow-ui-raised', use: 'Card, Panel' },
  { name: 'overlay', className: 'shadow-ui-overlay', use: 'Popover, Menu, Select' },
  { name: 'modal', className: 'shadow-ui-modal', use: 'Dialog, Drawer' },
];

const themes = [
  { theme: 'light', label: 'Claro' },
  { theme: 'dark', label: 'Oscuro' },
  { theme: 'high-contrast', label: 'Alto contraste' },
];

/** Los tres niveles de elevación en los tres temas. */
export function ElevationPreview() {
  return (
    <Unstyled>
      <div className="my-4 grid gap-3 ui-md:grid-cols-3">
        {themes.map(({ theme, label }) => (
          <div
            key={theme}
            data-theme={theme}
            className="flex flex-col gap-4 rounded-lg border border-ui-border-subtle bg-ui-surface p-4 text-ui-fg"
          >
            <p className="m-0 text-ui-heading-sm">{label}</p>
            {elevations.map((elevation) => (
              <div
                key={elevation.name}
                className={`rounded-md border border-ui-border-subtle bg-ui-surface-raised p-3 ${elevation.className}`}
              >
                <p className="m-0 font-ui-mono text-ui-label">{elevation.className}</p>
                <p className="m-0 text-ui-body-sm text-ui-fg-muted">{elevation.use}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Unstyled>
  );
}

const motions = [
  { name: 'fast', className: 'duration-(--ui-duration-fast)' },
  { name: 'normal', className: 'duration-(--ui-duration-normal)' },
  { name: 'slow', className: 'duration-(--ui-duration-slow)' },
];

/** Compara las duraciones. Con movimiento reducido, las tres son instantáneas. */
export function MotionPreview() {
  const [on, setOn] = useState(false);
  return (
    <Frame>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setOn((value) => !value)}
        className="mb-4 min-h-ui-control-md rounded-md border border-ui-border bg-ui-surface px-4 text-ui-label text-ui-fg hover:border-ui-border-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-focus"
      >
        {on ? 'Volver' : 'Mover'}
      </button>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {motions.map((motion) => (
          <li key={motion.name} className="flex items-center gap-3">
            <code className="w-16 shrink-0 font-ui-mono text-ui-caption text-ui-fg-muted">
              {motion.name}
            </code>
            <span className="@container relative h-6 flex-1 rounded-full bg-ui-surface-muted">
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-6 rounded-full bg-ui-primary transition-[translate] ease-ui-standard ${motion.className} ${on ? 'translate-x-[calc(100cqw-1.5rem)]' : ''}`}
              />
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** El mismo formulario en densidad cómoda y compacta. */
export function DensityPreview() {
  return (
    <Unstyled>
      <div className="my-4 grid gap-3 ui-md:grid-cols-2">
        {(['comfortable', 'compact'] as const).map((density) => (
          <div
            key={density}
            data-density={density}
            className="flex flex-col gap-3 rounded-lg border border-ui-border-subtle bg-ui-surface p-4 text-ui-fg"
          >
            <p className="m-0 font-ui-mono text-ui-label">data-density="{density}"</p>
            <Field label="Nombre" size="sm">
              <Input />
            </Field>
            <Field label="Correo electrónico">
              <Input type="email" />
            </Field>
          </div>
        ))}
      </div>
    </Unstyled>
  );
}

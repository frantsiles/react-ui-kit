import type { ReactNode } from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';
import { IconCheck, IconX } from '@my-ui/icons';

interface PanelProps {
  children: ReactNode;
  /** Explicación breve de por qué. */
  caption: ReactNode;
}

function Panel({
  kind,
  children,
  caption,
}: PanelProps & { kind: 'do' | 'dont' }) {
  const isDo = kind === 'do';
  return (
    <figure className="m-0 flex flex-col overflow-hidden rounded-lg border border-ui-border-subtle bg-ui-surface text-ui-fg">
      <div className="flex min-h-24 flex-1 items-center p-4">{children}</div>
      <figcaption
        className={`flex items-start gap-2 border-t-4 px-4 py-3 text-sm ${
          isDo
            ? 'border-ui-success bg-ui-success-soft'
            : 'border-ui-danger bg-ui-danger-soft'
        }`}
      >
        <span
          className={`inline-flex items-center gap-1 font-semibold ${isDo ? 'text-ui-success' : 'text-ui-danger'}`}
        >
          {isDo ? <IconCheck size="sm" /> : <IconX size="sm" />}
          {isDo ? 'Hacer' : 'Evitar'}
        </span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

/** Par "hacer / evitar" para las guías de uso. */
export function DoDont({
  doContent,
  doCaption,
  dontContent,
  dontCaption,
}: {
  doContent: ReactNode;
  doCaption: ReactNode;
  dontContent: ReactNode;
  dontCaption: ReactNode;
}) {
  return (
    // Unstyled: evita que los estilos tipográficos de la página de docs pisen los del kit
    <Unstyled>
      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <Panel kind="do" caption={doCaption}>
          {doContent}
        </Panel>
        <Panel kind="dont" caption={dontCaption}>
          {dontContent}
        </Panel>
      </div>
    </Unstyled>
  );
}

/** Muestra el mismo contenido en los tres temas a la vez (theming por contenedor). */
export function ThemeShowcase({ children }: { children: ReactNode }) {
  const themes = [
    ['light', 'Claro'],
    ['dark', 'Oscuro'],
    ['high-contrast', 'Alto contraste'],
  ] as const;
  return (
    <Unstyled>
      <div className="my-4 grid gap-3 md:grid-cols-3">
        {themes.map(([theme, label]) => (
          <section
            key={theme}
            data-theme={theme}
            aria-label={`Tema ${label}`}
            className="flex flex-col gap-3 rounded-lg border border-ui-border-subtle bg-ui-surface p-4 text-ui-fg"
          >
            <p className="m-0 text-sm font-semibold">{label}</p>
            {children}
          </section>
        ))}
      </div>
    </Unstyled>
  );
}

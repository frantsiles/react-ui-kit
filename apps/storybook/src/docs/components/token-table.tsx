import { useLayoutEffect, useRef, useState } from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';
import { contrastRatio, flatten, parseColor } from './contrast';

type Kind = 'text' | 'ui' | 'surface';

interface TokenSpec {
  name: string;
  role: string;
  kind: Kind;
  /** Fondo contra el que se mide (por defecto la superficie). */
  on?: string;
}

/** Tokens semánticos documentados. Fuente: packages/core/src/styles/tokens.css */
export const semanticTokens: TokenSpec[] = [
  {
    name: '--ui-color-surface',
    role: 'Fondo de controles y páginas',
    kind: 'surface',
  },
  {
    name: '--ui-color-surface-muted',
    role: 'Fondo secundario, solo lectura, tags neutros',
    kind: 'surface',
  },
  {
    name: '--ui-color-surface-disabled',
    role: 'Fondo de controles deshabilitados',
    kind: 'surface',
  },
  {
    name: '--ui-color-surface-raised',
    role: 'Fondo de bloques elevados (Card, Popover, Dialog)',
    kind: 'surface',
  },
  { name: '--ui-color-fg', role: 'Texto principal', kind: 'text' },
  {
    name: '--ui-color-fg-muted',
    role: 'Texto secundario, ayuda, placeholder',
    kind: 'text',
  },
  {
    name: '--ui-color-fg-disabled',
    role: 'Texto deshabilitado (WCAG no exige contraste)',
    kind: 'surface',
  },
  { name: '--ui-color-border', role: 'Borde de controles', kind: 'ui' },
  {
    name: '--ui-color-border-subtle',
    role: 'Bordes decorativos (no identifican un control)',
    kind: 'surface',
  },
  { name: '--ui-color-focus', role: 'Anillo de foco', kind: 'ui' },
  {
    name: '--ui-color-primary',
    role: 'Texto e íconos de acento',
    kind: 'text',
    on: '--ui-color-primary-soft',
  },
  { name: '--ui-color-danger', role: 'Errores', kind: 'text' },
  {
    name: '--ui-color-success',
    role: 'Estados correctos',
    kind: 'text',
    on: '--ui-color-success-soft',
  },
  {
    name: '--ui-color-warning',
    role: 'Advertencias',
    kind: 'text',
    on: '--ui-color-warning-soft',
  },
];

const required: Record<Kind, number | null> = {
  text: 4.5,
  ui: 3,
  surface: null,
};

/**
 * Lee un token como color. El valor puede venir en cualquier formato (#fff,
 * rgb(), con alfa…): se lo asignamos a un elemento de prueba y leemos el color
 * computado, que el navegador siempre normaliza a rgb()/rgba().
 */
function readColor(el: HTMLElement, name: string) {
  const probe = document.createElement('span');
  probe.style.color = `var(${name})`;
  probe.hidden = true;
  el.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return parseColor(value);
}

function ThemeColumn({ theme, label }: { theme: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const surface = readColor(el, '--ui-color-surface');
    if (!surface) return;
    const next: Record<string, number> = {};
    for (const token of semanticTokens) {
      const fg = readColor(el, token.name);
      const bgRaw = readColor(el, token.on ?? '--ui-color-surface');
      if (!fg || !bgRaw) continue;
      const bg = flatten(bgRaw, surface);
      next[token.name] = contrastRatio(flatten(fg, bg), bg);
    }
    setRatios(next);
  }, []);

  return (
    <div
      ref={ref}
      data-theme={theme}
      className="rounded-lg border border-ui-border-subtle bg-ui-surface p-3 text-ui-fg"
    >
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <ul className="flex flex-col gap-1.5">
        {semanticTokens.map((token) => {
          const ratio = ratios[token.name];
          const min = required[token.kind];
          const pass = min === null || (ratio !== undefined && ratio >= min);
          return (
            <li key={token.name} className="flex items-center gap-2 text-xs">
              <span
                aria-hidden="true"
                className="size-5 shrink-0 rounded border border-ui-border-subtle"
                style={{ background: `var(${token.name})` }}
              />
              <span className="min-w-0 flex-1 truncate font-mono">
                {token.name.replace('--ui-color-', '')}
              </span>
              {min !== null && ratio !== undefined && (
                <span
                  className={
                    pass ? 'text-ui-fg-muted' : 'font-semibold text-ui-danger'
                  }
                >
                  {ratio.toFixed(1)}:1 {pass ? '✓' : `✗ < ${min}`}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Muestra los tokens semánticos en los tres temas, lado a lado, y calcula en
 * vivo su contraste (texto ≥ 4.5:1, bordes y foco ≥ 3:1). Si alguien cambia un
 * token y rompe el contraste, se ve aquí en rojo.
 */
export function TokenTable() {
  return (
    <Unstyled>
      <div className="grid gap-3 md:grid-cols-3">
        <ThemeColumn theme="light" label="Claro" />
        <ThemeColumn theme="dark" label="Oscuro" />
        <ThemeColumn theme="high-contrast" label="Alto contraste" />
      </div>
    </Unstyled>
  );
}

/** Tabla de roles: qué token usar para qué. */
export function TokenRoles() {
  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Rol</th>
          <th>Contraste mínimo</th>
        </tr>
      </thead>
      <tbody>
        {semanticTokens.map((t) => (
          <tr key={t.name}>
            <td>
              <code>{t.name}</code>
            </td>
            <td>{t.role}</td>
            <td>{required[t.kind] === null ? '—' : `${required[t.kind]}:1`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

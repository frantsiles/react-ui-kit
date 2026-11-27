/// <reference types="vite/client" />
// ?raw (y no node:fs) para que el test corra también en el navegador
import tokensCss from '../styles/tokens.css?raw';
import themeCss from '../styles/theme.css?raw';
import { cn } from './utils.js';
import {
  breakpoints,
  containerSizes,
  densities,
  easings,
  elevations,
  fontWeights,
  layers,
  mediaQuery,
  textStyles,
} from './tokens.js';

describe('tokens', () => {
  it('cada estilo de texto tiene tamaño, interlineado y peso, y llega a Tailwind', () => {
    for (const style of textStyles) {
      for (const part of ['size', 'line-height', 'weight']) {
        expect(tokensCss).toContain(`--ui-text-${style}-${part}:`);
      }
      expect(themeCss).toContain(`--text-ui-${style}: var(--ui-text-${style}-size);`);
    }
  });

  it.each([
    ['font-weight-ui', '--ui-font-weight', fontWeights],
    ['shadow-ui', '--ui-shadow', elevations],
    ['ease-ui', '--ui-ease', easings],
  ] as const)('%s: los nombres de TS existen en el CSS', (tailwind, css, names) => {
    for (const name of names) {
      expect(tokensCss).toContain(`${css}-${name}:`);
      expect(themeCss).toContain(`--${tailwind}-${name}: var(${css}-${name});`);
    }
  });

  it('las capas existen y van en orden ascendente', () => {
    const values = layers.map((layer) => {
      const match = tokensCss.match(new RegExp(`--ui-z-${layer}: (\\d+);`));
      expect(match, layer).not.toBeNull();
      return Number(match?.[1]);
    });
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it('los breakpoints y contenedores de TS coinciden con theme.css', () => {
    for (const [name, value] of Object.entries(breakpoints)) {
      expect(themeCss).toContain(`--breakpoint-ui-${name}: ${value};`);
    }
    for (const [name, value] of Object.entries(containerSizes)) {
      expect(themeCss).toContain(`--container-ui-${name}: ${value};`);
    }
    expect(mediaQuery('md')).toBe('(min-width: 48rem)');
  });

  it('cada densidad redefine los tamaños de control', () => {
    for (const density of densities) {
      expect(tokensCss).toMatch(
        new RegExp(`\\[data-density="${density}"\\] \\{[^}]*--ui-control-height-md`),
      );
    }
  });

  it('el movimiento reducido acorta todas las duraciones', () => {
    const reduced = tokensCss.slice(tokensCss.indexOf('prefers-reduced-motion'));
    for (const speed of ['fast', 'normal', 'slow']) {
      expect(reduced).toContain(`--ui-duration-${speed}: 0.01ms;`);
    }
  });
});

describe('cn con tokens del kit', () => {
  it('no confunde tamaño de texto con color', () => {
    expect(cn('text-ui-body text-ui-fg')).toBe('text-ui-body text-ui-fg');
  });

  it('resuelve conflictos entre tokens del mismo tipo', () => {
    expect(cn('text-ui-body', 'text-ui-caption')).toBe('text-ui-caption');
    expect(cn('shadow-ui-raised', 'shadow-ui-modal')).toBe('shadow-ui-modal');
    expect(cn('text-ui-fg', 'text-ui-danger')).toBe('text-ui-danger');
  });

  it('distingue familia y peso de letra', () => {
    expect(cn('font-ui-mono font-ui-semibold')).toBe('font-ui-mono font-ui-semibold');
  });

  it('distingue sombra de color de sombra', () => {
    expect(cn('shadow-ui-overlay shadow-ui-danger')).toBe('shadow-ui-overlay shadow-ui-danger');
  });
});

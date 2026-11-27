import '@testing-library/jest-dom/vitest';
import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * `await expect(container).toHaveNoAxeViolations()` corre axe-core sobre el
 * elemento y falla listando cada regla WCAG incumplida.
 * En jsdom algunas reglas (p. ej. contraste de color) quedan "incomplete" porque
 * no hay motor de render; en el modo navegador de Vitest sí se evalúan.
 */
expect.extend({
  async toHaveNoAxeViolations(received: Element) {
    // jsdom no tiene motor de render: la regla de contraste no puede evaluarse
    // ahí (se corre en el modo navegador de Vitest y en Storybook).
    const isJsdom = navigator.userAgent.includes('jsdom');
    const { violations } = await axe.run(received, {
      resultTypes: ['violations'],
      rules: isJsdom ? { 'color-contrast': { enabled: false } } : {},
    });
    const pass = violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? 'Se esperaban violaciones de accesibilidad y no hubo ninguna'
          : `Violaciones de accesibilidad:\n${violations
              .map(
                (v) =>
                  `- [${v.id}] ${v.help}\n  ${v.nodes
                    .map((n) => n.html)
                    .join('\n  ')}`,
              )
              .join('\n')}`,
    };
  },
});

// Mock CSS imports
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver and IntersectionObserver in a way that works in both
// Node (jsdom) and browser environments
const globalAny = globalThis as typeof globalThis & {
  ResizeObserver?: unknown;
  IntersectionObserver?: unknown;
};

globalAny.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
globalAny.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

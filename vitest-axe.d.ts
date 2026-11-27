import '@testing-library/jest-dom/vitest';
import 'vitest';

interface AxeMatchers<R = unknown> {
  /** Corre axe-core y falla si hay violaciones de accesibilidad. */
  toHaveNoAxeViolations(): Promise<R>;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  interface Matchers<T = any> extends AxeMatchers<T> {}
}

/* eslint-disable no-var */
declare global {
  /** Tema con el que corren las historias como tests (lo fija vitest.setup.ts). */
  var __UI_TEST_THEME__: string | undefined;
}

declare module 'vitest' {
  export interface ProvidedContext {
    theme: string;
  }
}

export {};

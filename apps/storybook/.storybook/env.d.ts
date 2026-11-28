/* eslint-disable no-var */
declare global {
  /** Tema con el que corren las historias como tests (lo fija vitest.setup.ts). */
  var __UI_TEST_THEME__: string | undefined;
}

declare module 'vitest' {
  export interface ProvidedContext {
    /** Tema del proyecto de Vitest (vite.config.ts). */
    theme: string;
    /** Si se comparan capturas (regresión visual). Solo en el CI o con VISUAL=1. */
    visual: boolean;
  }
}

export {};
